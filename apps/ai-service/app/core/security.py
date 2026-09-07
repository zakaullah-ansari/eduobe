"""Shared API security: optional X-AI-Service-Key verification."""
from fastapi import Header, HTTPException, status

from .config import get_settings


async def require_service_key(
    x_ai_service_key: str | None = Header(default=None, alias="X-AI-Service-Key"),
) -> None:
    """Verify the internal service key when one is configured."""
    expected = get_settings().service_api_key
    if not expected:
        return
    if x_ai_service_key != expected:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid AI service key",
        )
