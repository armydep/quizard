from fastapi import FastAPI, Request
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer('paraphrase-MiniLM-L6-v2')  # Light and fast

app = FastAPI()

class AnswerInput(BaseModel):
    expected: str
    userAnswer: str

@app.post("/evaluate")
def evaluate(input: AnswerInput):
    embeddings = model.encode([input.expected, input.userAnswer])
    score = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
    return {
        "similarity": round(float(score), 3),
        "isCorrect": bool(score >= 0.75)  # threshold (adjustable)
    }
