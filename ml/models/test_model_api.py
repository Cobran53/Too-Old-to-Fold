import subprocess
import json
import numpy as np

def test_predict():
    # Create dummy input with correct shape and dtype
    x = np.zeros((1, 1, 561), dtype=np.float32).tolist()  # Convert to list for JSON serialization

    # Call the JavaScript predict function via Node.js
    try:
        result = subprocess.run(
            ["node", "test_model_api.js"],  # JavaScript test script
            input=json.dumps({"features": x}),
            text=True,
            capture_output=True,
            check=True
        )
    except subprocess.CalledProcessError as e:
        print("Error calling Node.js script:", e.stderr)
        raise

    # Parse the JSON output from the Node.js script
    output = json.loads(result.stdout)

    # Basic sanity checks
    assert "label" in output, "Missing 'label' in prediction result"
    assert "confidence" in output, "Missing 'confidence' in prediction result"
    assert "probabilities" in output, "Missing 'probabilities' in prediction result"
    assert len(output["probabilities"]) == 6, "Probabilities should have 6 classes"

    print("Test passed successfully with output:", output)

if __name__ == "__main__":
    test_predict()
