"""Dropout prediction router."""
from fastapi import APIRouter, Depends

from ..core.security import require_service_key
from ..schemas.common import DropoutRequest
from ..services.dropout import predict

router = APIRouter(prefix="/api/v1/ai/dropout", tags=["dropout"], dependencies=[Depends(require_service_key)])


@router.post("/predict", summary="Predict student dropout risk")
def predict_endpoint(req: DropoutRequest):
    return predict(req)
