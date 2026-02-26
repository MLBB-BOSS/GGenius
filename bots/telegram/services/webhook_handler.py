"""
Monobank webhook handler with atomic status transitions.

Critical invariants
-------------------
1. **Race-condition safety** — the status update uses
   ``UPDATE … WHERE payment_status = 'CREATED' RETURNING id``.
   If a Zombie Recovery job and a webhook fire simultaneously for the same
   order, only the first writer wins (``rowcount > 0``); the second gets an
   empty result and exits silently.  Diamonds are never delivered twice.

2. **payment_status is immutable once PAID** — if MooGold delivery fails
   after a successful payment, only ``delivery_status`` is updated.
   ``payment_status`` stays ``PAID`` forever, preserving financial integrity.
"""
import logging
from datetime import datetime, timezone

from sqlalchemy import update
from sqlalchemy.ext.asyncio import AsyncSession

from models.order import Order, PaymentStatus, DeliveryStatus

logger = logging.getLogger(__name__)


async def handle_successful_payment(
    db: AsyncSession,
    invoice_id: str,
    moogold_deliver_fn,  # async callable(order: Order) -> str (moogold_order_id)
) -> bool:
    """
    Process a confirmed Monobank payment for the given invoice_id.

    Steps
    -----
    1. Atomically flip ``payment_status`` from ``CREATED`` → ``PAID`` using
       ``UPDATE … WHERE payment_status = 'CREATED' RETURNING *``.  If the
       row is already ``PAID`` (duplicate webhook) or ``EXPIRED``, the update
       returns no rows and we exit immediately.
    2. Attempt MooGold diamond delivery.
    3. On delivery success — mark ``delivery_status = DELIVERED``.
    4. On delivery failure — mark ``delivery_status = DELIVERY_FAILED`` and
       record the error.  ``payment_status`` remains ``PAID``.

    Returns
    -------
    bool
        ``True`` if this call was the one that flipped the order to PAID,
        ``False`` if the order was already processed (idempotent).
    """
    now = datetime.now(tz=timezone.utc)

    # --- Step 1: Atomic optimistic lock ---
    stmt = (
        update(Order)
        .where(
            Order.invoice_id == invoice_id,
            Order.payment_status == PaymentStatus.CREATED,
        )
        .values(
            payment_status=PaymentStatus.PAID,
            paid_at=now,
            delivery_status=DeliveryStatus.PROCESSING,
        )
        .returning(Order)
    )
    result = await db.execute(stmt)
    order = result.scalars().first()

    if order is None:
        logger.info(
            "Webhook for invoice %s: order already processed or not found — skipping",
            invoice_id,
        )
        await db.rollback()
        return False

    await db.commit()
    logger.info(
        "Order %s marked PAID (invoice=%s)", order.id, invoice_id
    )

    # --- Step 2: Deliver diamonds via MooGold ---
    try:
        moogold_order_id = await moogold_deliver_fn(order)
        order.delivery_status = DeliveryStatus.DELIVERED
        order.moogold_order_id = moogold_order_id
        order.delivered_at = datetime.now(tz=timezone.utc)
        logger.info(
            "Diamonds delivered for order %s (moogold_id=%s)",
            order.id,
            moogold_order_id,
        )
    except Exception as exc:
        # CRITICAL: payment_status stays PAID — do NOT overwrite it.
        order.delivery_status = DeliveryStatus.DELIVERY_FAILED
        order.delivery_attempts = (order.delivery_attempts or 0) + 1
        order.last_delivery_error = str(exc)
        logger.error(
            "Delivery failed for order %s (invoice=%s): %s",
            order.id,
            invoice_id,
            exc,
        )

    await db.commit()
    return True
