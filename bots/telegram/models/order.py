"""
Order model with fintech approach: payment_status and delivery_status are independent.
Money received? payment_status = PAID. Period. Even if MooGold is down.
"""
import uuid
from datetime import datetime
from enum import Enum

from sqlalchemy import (
    Column, String, Integer, BigInteger, DateTime, Text, Index,
    Enum as SQLEnum, func
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from database.base import Base


class PaymentStatus(str, Enum):
    """Money status. Only facts: received or not."""
    CREATED = "CREATED"
    PAID = "PAID"
    FAILED = "FAILED"
    EXPIRED = "EXPIRED"


class DeliveryStatus(str, Enum):
    """Delivery status. Independent from money."""
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    DELIVERED = "DELIVERED"
    DELIVERY_FAILED = "DELIVERY_FAILED"
    RETRY_SCHEDULED = "RETRY_SCHEDULED"


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    telegram_id: Mapped[int] = mapped_column(BigInteger, nullable=False, index=True)
    product_name: Mapped[str] = mapped_column(String(255), nullable=False)
    amount: Mapped[int] = mapped_column(Integer, nullable=False, comment="Amount in kopiykas (UAH * 100)")
    diamonds_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    invoice_id: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    invoice_url: Mapped[str | None] = mapped_column(Text, nullable=True)

    # === TWO INDEPENDENT STATUSES ===
    payment_status: Mapped[PaymentStatus] = mapped_column(
        SQLEnum(PaymentStatus, name="payment_status_enum"),
        default=PaymentStatus.CREATED, nullable=False, index=True
    )
    delivery_status: Mapped[DeliveryStatus] = mapped_column(
        SQLEnum(DeliveryStatus, name="delivery_status_enum"),
        default=DeliveryStatus.PENDING, nullable=False, index=True
    )

    delivery_attempts: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    last_delivery_error: Mapped[str | None] = mapped_column(Text, nullable=True)
    moogold_order_id: Mapped[str | None] = mapped_column(String(255), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    paid_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    delivered_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    __table_args__ = (
        Index("ix_orders_zombie_lookup", "payment_status", "delivery_status", "created_at"),
    )
