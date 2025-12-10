import numpy as np
import tensorflow as tf
from tensorflow.keras.layers import Input, GRU, Dense, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam


def build_gru_model(timesteps: int, features: int, n_classes: int) -> tf.keras.Model:
    """
    Build a simple GRU-based classifier for the HAR dataset.

    Input shape: (batch, timesteps, features)
    Output shape: (batch, n_classes)
    """
    inputs = Input(shape=(timesteps, features), name="input_layer")
    x = GRU(64, name="gru")(inputs)
    x = Dropout(0.3, name="dropout")(x)
    x = Dense(64, activation="relu", name="dense")(x)
    x = Dropout(0.3, name="dropout_1")(x)
    outputs = Dense(n_classes, activation="softmax", name="dense_1")(x)

    model = Model(inputs=inputs, outputs=outputs, name="har_gru_model")
    return model


def main():
    print("Loading processed data...")
    X_train = np.load("ml/data/processed/X_train.npy")
    X_test = np.load("ml/data/processed/X_test.npy")
    y_train = np.load("ml/data/processed/y_train.npy")
    y_test = np.load("ml/data/processed/y_test.npy")

    print("Data loaded:")
    print("X_train:", X_train.shape)
    print("X_test:", X_test.shape)

    # HAR: each sample is a 561-dim feature vector.
    # We treat it as a sequence of length 1 with 561 features.
    n_timesteps = 1
    n_features = X_train.shape[1]
    n_classes = len(np.unique(y_train))

    # Reshape to (samples, timesteps, features)
    X_train_seq = X_train.reshape((X_train.shape[0], n_timesteps, n_features))
    X_test_seq = X_test.reshape((X_test.shape[0], n_timesteps, n_features))

    print("Reshaped for GRU:")
    print("X_train:", X_train_seq.shape)
    print("X_test:", X_test_seq.shape)

    # Build model
    model = build_gru_model(n_timesteps, n_features, n_classes)
    model.compile(
        optimizer=Adam(learning_rate=1e-3),
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"],
    )
    model.summary()

    # Train
    history = model.fit(
        X_train_seq,
        y_train,
        validation_split=0.2,
        epochs=20,
        batch_size=32,
        verbose=1,
    )

    # Evaluate
    test_loss, test_acc = model.evaluate(X_test_seq, y_test, verbose=1)
    print(f"\nTest Accuracy: {test_acc}")

    # Save inference-only model (.keras) WITHOUT optimizer state
    model_path = "ml/models/har_gru_model.keras"
    model.save(model_path, include_optimizer=False)
    print(f"✔ Model saved as {model_path}")


if __name__ == "__main__":
    main()
