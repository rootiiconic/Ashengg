# app/api/routes.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.agents.run_agent import run_agent_flow, reset_chat

router = APIRouter()

# Define input model
class Message(BaseModel):
    content: str

# Define output model
class ChatResponse(BaseModel):
    response: str

# Chat endpoint
@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(message: Message):
    if not message.content.strip():
        raise HTTPException(status_code=400, detail="Message content cannot be empty")
    
    try:
        response = await run_agent_flow(message.content)
        return ChatResponse(response=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Reset chat history endpoint
@router.post("/chat/reset")
async def reset_chat_endpoint():
    try:
        await reset_chat()
        return {"message": "Chat history reset successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
