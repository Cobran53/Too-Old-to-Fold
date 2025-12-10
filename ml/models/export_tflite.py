import tensorflow as tf
import numpy as np


def main():
    print("Loading Keras model (inference-only)...")
    model = tf.keras.models.load_model("ml/models/har_gru_model.keras", compile=False)
    model.summary()

    # Optional: sanity check with a dummy input
    dummy_input = np.zeros((1, 1, 561), dtype=np.float32)
    preds = model.predict(dummy_input)
    print("Dummy prediction shape:", preds.shape)

    print("Converting to TFLite...")
    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    # Optional optimization for mobile
    converter.optimizations = [tf.lite.Optimize.DEFAULT]

    tflite_model = converter.convert()

    out_path = "ml/models/har_gru_model.tflite"
    with open(out_path, "wb") as f:
        f.write(tflite_model)

    print(f"✔ TFLite model saved to {out_path}")


if __name__ == "__main__":
    main()
