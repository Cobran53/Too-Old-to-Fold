import tensorflow as tf
import numpy as np
from pathlib import Path
import shutil

def build_inference_model():
    inputs = tf.keras.Input(shape=(1, 561), name="input")
    x = tf.keras.layers.GRU(64, name="gru")(inputs)
    x = tf.keras.layers.Dense(64, activation="relu", name="dense")(x)
    outputs = tf.keras.layers.Dense(6, activation="softmax", name="output")(x)
    return tf.keras.Model(inputs, outputs, name="har_gru_inference")

def main():
    base_dir = Path(__file__).parent
    trained_model_path = base_dir / "har_gru_model.keras"
    savedmodel_dir = base_dir / "har_gru_savedmodel"
    tflite_path = base_dir / "har_gru_model.tflite"

    print("Loading trained model...")
    trained_model = tf.keras.models.load_model(trained_model_path, compile=False)

    print("Building inference-only model...")
    model = build_inference_model()
    model.set_weights(trained_model.get_weights())
    model.summary()

    # Sanity check
    dummy_input = np.zeros((1, 1, 561), dtype=np.float32)
    _ = model.predict(dummy_input)

    # Recreate SavedModel dir
    if savedmodel_dir.exists():
        shutil.rmtree(savedmodel_dir)
    savedmodel_dir.mkdir(parents=True, exist_ok=True)

    print("Saving inference-only SavedModel...")

    # Export a proper TF2 SavedModel signature
    @tf.function(input_signature=[tf.TensorSpec(shape=[None, 1, 561], dtype=tf.float32, name="input")])
    def serving_fn(x):
        y = model(x, training=False)
        return {"output": y}

    tf.saved_model.save(
        model,
        str(savedmodel_dir),
        signatures={"serving_default": serving_fn}
    )

    print("Converting to TFLite...")

    # Convert using the modern converter (MLIR path)
    converter = tf.lite.TFLiteConverter.from_saved_model(str(savedmodel_dir))

    # GRU needs TF Select Ops
    converter.target_spec.supported_ops = [
        tf.lite.OpsSet.TFLITE_BUILTINS,
        tf.lite.OpsSet.SELECT_TF_OPS
    ]

    # Important for SavedModel + RNN resource variables
    converter.experimental_enable_resource_variables = True

    # Keep it stable
    converter.optimizations = []

    # DO NOT force legacy converter 
    # converter.experimental_new_converter = False  # <- remove/leave commented out

    tflite_model = converter.convert()

    with open(tflite_path, "wb") as f:
        f.write(tflite_model)

    print(f"✔ TFLite model saved to: {tflite_path}")

    # Verify load
    print("Verifying TFLite model...")
    interpreter = tf.lite.Interpreter(model_path=str(tflite_path))
    interpreter.allocate_tensors()

    print("Inputs:")
    for d in interpreter.get_input_details():
        print(d)

    print("Outputs:")
    for d in interpreter.get_output_details():
        print(d)

    print("✔ Verification successful")

if __name__ == "__main__":
    main()
