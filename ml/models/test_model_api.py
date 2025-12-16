import numpy as np
from model_api import predict

def main():
    # Create dummy input with correct shape and dtype
    x = np.zeros((1, 1, 561), dtype=np.float32)

    result = predict(x)

    print("Prediction result:")
    print(result)

    # Basic sanity checks
    assert "label" in result
    assert "confidence" in result
    assert "probabilities" in result
    assert len(result["probabilities"]) == 6

    print("\n API test passed successfully")

if __name__ == "__main__":
    main()
