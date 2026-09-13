from fastapi import APIRouter
from pydantic import BaseModel

from app.services.gemini_service import ask_gemini

router = APIRouter(prefix="/assistant", tags=["Assistant"])


class Question(BaseModel):
    question: str


@router.post("/ask")
def ask(data: Question):
    answer = ask_gemini(data.question)

    return {
        "answer": answer
    }