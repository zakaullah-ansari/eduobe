"""Chatbot router."""
from fastapi import APIRouter, Depends

from ..core.security import require_service_key
from ..schemas.common import ChatRequest, ChatResponse
from ..services.chatbot import chat

router = APIRouter(prefix="/api/v1/ai/chatbot", tags=["chatbot"], dependencies=[Depends(require_service_key)])


@router.post("/chat", response_model=ChatResponse, summary="Chat with the EduOBE assistant")
def chat_endpoint(req: ChatRequest) -> ChatResponse:
    return chat(req)
