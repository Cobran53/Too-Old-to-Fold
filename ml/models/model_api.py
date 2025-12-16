import numpy as np
from typing import Dict

# Public API 

def predict(features: np.ndarray) -> Dict:
    """
    Main prediction API used by the UI.
    Input: (1, 1, 561) float32 numpy array
    Output: dict with label, confidence, probabilities
    """
    _validate_input(features)

    # Switch implementation here
    return _mock_predict(features)


# Internal helpers

LABELS = [
    "Walking",
    "Walking Upstairs",
    "Walking Downstairs",
    "Sitting",
    "Standing",
    "Laying",
]

def _validate_input(x: np.ndarray):
    if not isinstance(x, np.ndarray):
        raise TypeError("Input must be numpy array")
    if x.shape != (1, 1, 561):
        raise ValueError(f"Expected shape (1, 1, 561), got {x.shape}")
    if x.dtype != np.float32:
        raise ValueError("Expected dtype float32")

def _mock_predict(x: np.ndarray) -> Dict:
    probs = np.random.rand(6).astype(np.float32)
    probs = probs / probs.sum()

    idx = int(np.argmax(probs))
    return {
        "label": LABELS[idx],
        "confidence": float(probs[idx]),
        "probabilities": dict(zip(LABELS, probs.tolist()))
    }
