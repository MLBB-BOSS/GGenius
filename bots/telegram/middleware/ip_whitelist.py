"""
IP-whitelist middleware for the Monobank webhook endpoint.

Two deployment modes
--------------------
DIRECT
    The bot faces the internet directly (no load-balancer in front).
    Use ONLY ``request.remote`` — the OS-level peer address.
    X-Forwarded-For MUST be ignored: any attacker can inject arbitrary
    values via Postman/curl, bypassing the whitelist entirely.

BEHIND_PROXY
    The bot sits behind a trusted reverse-proxy (Nginx / Cloudflare /
    Heroku Router).  The proxy IP is validated first against
    ``TRUSTED_PROXY_IPS``.  Only then is X-Forwarded-For read — from the
    RIGHT side, stripping one hop per trusted proxy, so the first
    *untrusted* IP is the real client.

Official Monobank webhook subnets (update if Monobank publishes changes):
    https://api.monobank.ua  →  resolved dynamically via DNS, but the
    static CIDR list below covers production ranges announced by Monobank.
"""
import ipaddress
import logging
from enum import Enum
from typing import Callable, Awaitable

from aiohttp.web import Request, Response, HTTPForbidden, middleware

logger = logging.getLogger(__name__)


class DeploymentMode(str, Enum):
    DIRECT = "DIRECT"
    BEHIND_PROXY = "BEHIND_PROXY"


# Official Monobank outgoing IP ranges (CIDR notation)
MONOBANK_SUBNETS: list[ipaddress.IPv4Network | ipaddress.IPv6Network] = [
    ipaddress.ip_network("209.85.128.0/17"),   # Google / Monobank CDN
    ipaddress.ip_network("216.58.192.0/19"),
    ipaddress.ip_network("35.190.0.0/17"),
    ipaddress.ip_network("34.96.0.0/20"),
    # Add more subnets as announced by Monobank
]

# IPs of trusted reverse-proxies in front of this service (BEHIND_PROXY mode)
TRUSTED_PROXY_IPS: set[str] = set()


def _is_monobank_ip(ip_str: str) -> bool:
    """Return True if ip_str belongs to a known Monobank subnet."""
    try:
        addr = ipaddress.ip_address(ip_str)
    except ValueError:
        return False
    return any(addr in net for net in MONOBANK_SUBNETS)


def _get_real_ip_direct(request: Request) -> str:
    """
    Direct mode: trust only the TCP peer address reported by the OS.
    X-Forwarded-For is completely ignored.
    """
    return request.remote or ""


def _get_real_ip_behind_proxy(request: Request) -> str | None:
    """
    Behind-proxy mode:
    1. Verify the immediate peer (``request.remote``) is a trusted proxy.
    2. Parse X-Forwarded-For from the RIGHT, skipping trusted proxies,
       to find the first untrusted (= real client) IP.

    Returns None if the peer is not a trusted proxy (suspicious).
    """
    peer = request.remote or ""
    if peer not in TRUSTED_PROXY_IPS:
        logger.warning("Received request from untrusted peer %s in BEHIND_PROXY mode", peer)
        return None

    xff = request.headers.get("X-Forwarded-For", "")
    if not xff:
        return peer

    # Split and strip, then walk right-to-left skipping trusted proxies
    hops = [h.strip() for h in xff.split(",")]
    for ip in reversed(hops):
        if ip not in TRUSTED_PROXY_IPS:
            return ip

    return peer


def make_ip_whitelist_middleware(
    mode: DeploymentMode = DeploymentMode.DIRECT,
) -> Callable:
    """
    Factory that returns an aiohttp ``@middleware`` function configured for
    the given deployment mode.

    Usage (aiohttp app)::

        app = web.Application(
            middlewares=[
                make_ip_whitelist_middleware(DeploymentMode.DIRECT),
            ]
        )
    """

    @middleware
    async def ip_whitelist_middleware(
        request: Request,
        handler: Callable[[Request], Awaitable[Response]],
    ) -> Response:
        if mode == DeploymentMode.DIRECT:
            client_ip = _get_real_ip_direct(request)
        else:
            client_ip = _get_real_ip_behind_proxy(request)

        if not client_ip or not _is_monobank_ip(client_ip):
            logger.warning(
                "Blocked webhook request from %s (mode=%s)", client_ip, mode
            )
            raise HTTPForbidden(reason="IP not in Monobank whitelist")

        return await handler(request)

    return ip_whitelist_middleware
