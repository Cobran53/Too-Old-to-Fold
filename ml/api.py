import numpy as np
import tensorflow as tf
from fastapi import FastAPI
from pydantic import BaseModel

LABELS = [
    "Walking",
    "Walking Upstairs",
    "Walking Downstairs",
    "Sitting",
    "Standing",
    "Laying"
]

MODEL_PATH = "ml/models/har_gru_savedmodel"

app = FastAPI()

print("Loading model...")
model = tf.saved_model.load(MODEL_PATH)
infer = model.signatures["serving_default"]
print("Model loaded")

class PredictRequest(BaseModel):
    features: list  # length 561

@app.post("/predict")
def predict(req: PredictRequest):
    x = np.array(req.features, dtype=np.float32).reshape(1, 1, 561)
    outputs = infer(input=tf.constant(x))
    probs = outputs["output"].numpy()[0]

    idx = int(np.argmax(probs))

    return {
        "label": LABELS[idx],
        "confidence": float(probs[idx]),
        "probabilities": {
            LABELS[i]: float(probs[i]) for i in range(len(LABELS))
        }
    }
