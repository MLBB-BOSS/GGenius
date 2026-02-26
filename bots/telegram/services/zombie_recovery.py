"""
Zombie Recovery job — runs on a scheduler every 120 s.

Two responsibilities:
  1. **Expire stale orders** — ``CREATED`` orders older than 15 min are
     atomically flipped to ``EXPIRED`` via ``UPDATE … WHERE payment_status =
     'CREATED'``.  This is safe even when a Monobank webhook fires at the same
     moment because only one of the two writers will see ``rowcount > 0``.

  2. **Retry failed deliveries** — orders with ``payment_status = PAID`` and
     ``delivery_status = DELIVERY_FAILED`` are re-queued for MooGold delivery
     (up to MAX_DELIVERY_ATTEMPTS retries).

A Redis ``DistributedLock`` prevents two overlapping scheduler ticks from
running the same job in parallel (e.g. when MooGold is slow).
"""
import logging
from datetime import datetime, timedelta, timezone

from redis.asyncio import Redis
from sqlalchemy import update, select
from sqlalchemy.ext.asyncio import AsyncSession

from models.order import Order, PaymentStatus, DeliveryStatus
from services.distributed_lock import DistributedLock

logger = logging.getLogger(__name__)

LOCK_KEY = "zombie_recovery"
LOCK_TTL = 300  # seconds — must be longer than the worst-case job duration
STALE_ORDER_THRESHOLD_MINUTES = 15
MAX_DELIVERY_ATTEMPTS = 5


async def run_zombie_recovery(
    db: AsyncSession,
    redis: Redis,
    moogold_deliver_fn,  # async callable(order: Order) -> str (moogold_order_id)
) -> None:
    """
    Entry point called by the scheduler.

    Parameters
    ----------
    db:
        An open async SQLAlchemy session.
    redis:
        Async Redis client used for the distributed lock.
    moogold_deliver_fn:
        Async callable that attempts diamond delivery via MooGold and returns
        the MooGold order ID on success.  Should raise on failure.
    """
    async with DistributedLock(redis, LOCK_KEY, ttl=LOCK_TTL) as acquired:
        if not acquired:
            logger.info("Zombie recovery skipped — another instance is running")
            return

        logger.info("Zombie recovery started")
        await _expire_stale_orders(db)
        await _retry_failed_deliveries(db, moogold_deliver_fn)
        logger.info("Zombie recovery finished")


async def _expire_stale_orders(db: AsyncSession) -> None:
    """Atomically expire CREATED orders older than STALE_ORDER_THRESHOLD_MINUTES."""
    cutoff = datetime.now(tz=timezone.utc) - timedelta(minutes=STALE_ORDER_THRESHOLD_MINUTES)

    stmt = (
        update(Order)
        .where(
            Order.payment_status == PaymentStatus.CREATED,
            Order.created_at < cutoff,
        )
        .values(payment_status=PaymentStatus.EXPIRED)
        .returning(Order.id)
    )
    result = await db.execute(stmt)
    expired_ids = result.fetchall()

    if expired_ids:
        logger.info("Expired %d stale order(s): %s", len(expired_ids), expired_ids)
    await db.commit()


async def _retry_failed_deliveries(
    db: AsyncSession,
    moogold_deliver_fn,
) -> None:
    """Retry MooGold delivery for PAID orders whose delivery previously failed."""
    stmt = select(Order).where(
        Order.payment_status == PaymentStatus.PAID,
        Order.delivery_status == DeliveryStatus.DELIVERY_FAILED,
        Order.delivery_attempts < MAX_DELIVERY_ATTEMPTS,
    )
    result = await db.execute(stmt)
    orders = result.scalars().all()

    for order in orders:
        logger.info(
            "Retrying delivery for order %s (attempt %d/%d)",
            order.id,
            order.delivery_attempts + 1,
            MAX_DELIVERY_ATTEMPTS,
        )
        order.delivery_status = DeliveryStatus.PROCESSING
        order.delivery_attempts += 1
        await db.commit()

        try:
            moogold_order_id = await moogold_deliver_fn(order)
            order.delivery_status = DeliveryStatus.DELIVERED
            order.moogold_order_id = moogold_order_id
            order.delivered_at = datetime.now(tz=timezone.utc)
            logger.info("Delivery succeeded for order %s", order.id)
        except Exception as exc:
            order.delivery_status = DeliveryStatus.DELIVERY_FAILED
            order.last_delivery_error = str(exc)
            logger.error("Delivery failed for order %s: %s", order.id, exc)

        await db.commit()
