"""Smart search router."""
from fastapi import APIRouter, Depends

from ..core.security import require_service_key
from ..schemas.common import SearchRequest
from ..services.search import search

router = APIRouter(prefix="/api/v1/ai/smart-search", tags=["smart-search"], dependencies=[Depends(require_service_key)])


@router.post("/query", summary="Run smart search over indexed documents")
def search_endpoint(req: SearchRequest):
    return search(req)
