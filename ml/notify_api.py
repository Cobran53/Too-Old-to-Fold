from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, Dict, List, Optional

app = FastAPI()

# Tillåt att din Ionic-app (localhost:8100) får anropa API:t (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8100",
        "http://127.0.0.1:8100",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class NotifyPayload(BaseModel):
    event: Optional[str] = None
    timestamp: Optional[str] = None
    day_of_week: Optional[str] = None
    metrics: Optional[Dict[str, Any]] = None
    location: Optional[Dict[str, Any]] = None

@app.post("/notify")
def notify(payload: NotifyPayload):
    # Enkel demo-logik: skapa notis om steps är lågt
    steps = 0
    if payload.metrics and payload.metrics.get("steps_delta") is not None:
        try:
            steps = int(payload.metrics.get("steps_delta"))
        except:
            steps = 0

    notifications: List[Dict[str, Any]] = []

    if steps < 50:
        notifications.append({
            "title": "Time to move",
            "body": "You’ve been inactive recently. Take a short walk 😊",
        })
    else:
        notifications.append({
            "title": "Nice!",
            "body": "Good job staying active today 💪",
        })

    return {"notifications": notifications}
