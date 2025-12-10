import tensorflow as tf
from tensorflow.keras import layers, models

NUM_CLASSES = 6
INPUT_FEATURES = 561

def build_gru_model():
    model = models.Sequential([
        layers.Reshape((1, INPUT_FEATURES), input_shape=(INPUT_FEATURES,)),
        layers.GRU(64, return_sequences=False),
        layers.Dense(32, activation="relu"),
        layers.Dense(NUM_CLASSES, activation="softmax")
    ])

    model.compile(
        loss="sparse_categorical_crossentropy",
        optimizer="adam",
        metrics=["accuracy"]
    )

    return model
