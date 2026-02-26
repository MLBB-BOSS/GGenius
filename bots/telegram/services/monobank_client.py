"""
Singleton aiohttp ClientSession for Monobank API.

A single global session is created on startup with connection pooling,
DNS caching and proper timeouts. Reuse it for all requests and close
on shutdown to avoid socket exhaustion under load.
"""
import asyncio
import logging

import aiohttp

logger = logging.getLogger(__name__)

_session: aiohttp.ClientSession | None = None
_lock = asyncio.Lock()

MONOBANK_API_BASE = "https://api.monobank.ua"

# Connection pool limits
_CONNECTOR_LIMIT = 100
_CONNECTOR_LIMIT_PER_HOST = 20

# Request timeout (seconds)
_TOTAL_TIMEOUT = 30
_CONNECT_TIMEOUT = 10


async def get_session() -> aiohttp.ClientSession:
    """Return the global aiohttp session, creating it on first call."""
    global _session
    if _session is None or _session.closed:
        async with _lock:
            if _session is None or _session.closed:
                connector = aiohttp.TCPConnector(
                    limit=_CONNECTOR_LIMIT,
                    limit_per_host=_CONNECTOR_LIMIT_PER_HOST,
                    ttl_dns_cache=300,
                    use_dns_cache=True,
                )
                timeout = aiohttp.ClientTimeout(
                    total=_TOTAL_TIMEOUT,
                    connect=_CONNECT_TIMEOUT,
                )
                _session = aiohttp.ClientSession(
                    base_url=MONOBANK_API_BASE,
                    connector=connector,
                    timeout=timeout,
                )
                logger.info("Global aiohttp session created")
    return _session


async def close_session() -> None:
    """Close the global aiohttp session. Call on application shutdown."""
    global _session
    if _session is not None and not _session.closed:
        await _session.close()
        _session = None
        logger.info("Global aiohttp session closed")
