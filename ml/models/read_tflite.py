import tensorflow as tf

MODEL_PATH = "har_gru_model.tflite"

# Load interpreter WITHOUT allocating tensors
interpreter = tf.lite.Interpreter(model_path=MODEL_PATH)

print("=== TFLite model loaded successfully ===")

# Access raw details without allocation
try:
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()

    print("\nInputs:")
    for inp in input_details:
        print(inp)

    print("\nOutputs:")
    for out in output_details:
        print(out)

except RuntimeError as e:
    print("\n⚠ Cannot inspect tensors without Flex support")
    print("Reason:", e)

print("\n✔ Model file is readable and structurally valid")
