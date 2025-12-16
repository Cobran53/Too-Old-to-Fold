import tensorflow as tf
import numpy as np

MODEL_PATH = "har_gru_model.tflite"

# Load with Flex delegate
interpreter = tf.lite.Interpreter(
    model_path=MODEL_PATH,
    experimental_delegates=[tf.lite.experimental.load_delegate("libtensorflowlite_flex.so")]
)

interpreter.allocate_tensors()

print("Inputs:")
print(interpreter.get_input_details())

print("Outputs:")
print(interpreter.get_output_details())

dummy_input = np.zeros((1, 1, 561), dtype=np.float32)
interpreter.set_tensor(interpreter.get_input_details()[0]["index"], dummy_input)
interpreter.invoke()

output = interpreter.get_tensor(interpreter.get_output_details()[0]["index"])
print("Output:", output)
