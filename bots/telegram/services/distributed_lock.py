"""
Redis distributed lock with UUID ownership and Lua-script safe release.

WHY UUID + Lua?
---------------
Naive approach — ``finally: await redis.delete(key)`` — is dangerous:
  1. Job A acquires lock with TTL=300s
  2. Job A runs for 310s (MooGold is slow)
  3. Redis auto-expires the lock (TTL elapsed)
  4. Job B acquires a NEW lock
  5. Job A finishes, enters ``finally``, deletes Job B's lock!
  6. Job C enters without any lock → chaos

Correct approach: store a UUID as the lock value. In ``finally`` use a Lua
script that atomically checks whether the value still matches our UUID
before deleting. If it does not match, we silently skip — someone else
already owns the lock.
"""
import logging
import uuid
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from redis.asyncio import Redis

logger = logging.getLogger(__name__)

# Lua script: delete key only if its value matches the caller's UUID
_RELEASE_SCRIPT = """
if redis.call("get", KEYS[1]) == ARGV[1] then
    return redis.call("del", KEYS[1])
else
    return 0
end
"""


class DistributedLock:
    """
    Async context manager that acquires a Redis distributed lock on enter
    and safely releases it on exit.

    Usage::

        async with DistributedLock(redis, "zombie_recovery", ttl=300) as acquired:
            if acquired:
                await do_work()
    """

    def __init__(self, redis: Redis, key: str, ttl: int = 300) -> None:
        self._redis = redis
        self._key = f"lock:{key}"
        self._ttl = ttl
        self._token: str | None = None

    async def acquire(self) -> bool:
        """Try to acquire the lock. Returns True if successful."""
        token = str(uuid.uuid4())
        acquired = await self._redis.set(
            self._key, token, nx=True, ex=self._ttl
        )
        if acquired:
            self._token = token
            logger.debug("Lock acquired: %s (token=%s)", self._key, token)
            return True
        logger.debug("Lock not acquired (already held): %s", self._key)
        return False

    async def release(self) -> None:
        """Release the lock only if we still own it (Lua atomic check)."""
        if self._token is None:
            return
        result = await self._redis.eval(
            _RELEASE_SCRIPT, 1, self._key, self._token
        )
        if result == 1:
            logger.debug("Lock released: %s", self._key)
        else:
            logger.warning(
                "Lock %s was already expired or taken by another owner; "
                "skipping delete (token=%s)",
                self._key,
                self._token,
            )
        self._token = None

    async def __aenter__(self) -> bool:
        return await self.acquire()

    async def __aexit__(self, exc_type, exc_val, exc_tb) -> None:
        await self.release()
