# ml/preprocess.py

import os
import pandas as pd
import numpy as np


RAW_BASE = "ml/data/raw/UCI HAR Dataset"
PROCESSED_DIR = "ml/data/processed"


def load_split(split: str):
    """
    Load X and y for given split ('train' or 'test') from the UCI HAR Dataset.
    Returns:
        X: numpy array of shape (samples, features)
        y: numpy array of shape (samples,) with labels 0–5
    """
    base = os.path.join(RAW_BASE, split)

    # Features
    X = pd.read_csv(
        os.path.join(base, f"X_{split}.txt"),
        header=None,
        sep=r"\s+",
    ).values

    # Labels (originally 1–6 in dataset)
    y = pd.read_csv(
        os.path.join(base, f"y_{split}.txt"),
        header=None,
        sep=r"\s+",
    ).values.squeeze()

    # Shift labels to 0–5 instead of 1–6 for convenience
    y = y - 1

    return X, y


def preprocess():
    os.makedirs(PROCESSED_DIR, exist_ok=True)

    # Load train & test
    X_train, y_train = load_split("train")
    X_test, y_test = load_split("test")

    # Optional: normalize features based on train statistics
    mean = X_train.mean(axis=0, keepdims=True)
    std = X_train.std(axis=0, keepdims=True) + 1e-8

    X_train_norm = (X_train - mean) / std
    X_test_norm = (X_test - mean) / std

    # Save as .npy for training script
    np.save(os.path.join(PROCESSED_DIR, "X_train.npy"), X_train_norm)
    np.save(os.path.join(PROCESSED_DIR, "X_test.npy"), X_test_norm)
    np.save(os.path.join(PROCESSED_DIR, "y_train.npy"), y_train)
    np.save(os.path.join(PROCESSED_DIR, "y_test.npy"), y_test)

    print("Preprocessing complete. Data saved in ml/data/processed")


if __name__ == "__main__":
    preprocess()
