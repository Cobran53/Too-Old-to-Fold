import numpy as np
import tensorflow as tf
import matplotlib.pyplot as plt
from sklearn.metrics import confusion_matrix
import seaborn as sns

# Load trained model
model = tf.keras.models.load_model("ml/models/har_gru_model.keras")

# Load test data
X_test = np.load("ml/data/processed/X_test.npy")
y_test = np.load("ml/data/processed/y_test.npy")

print(f"Loaded test data: {X_test.shape}, labels: {y_test.shape}")

# Reshape for GRU (sequence length = 1)
X_test = X_test.reshape(X_test.shape[0], 1, X_test.shape[1])

# Pick 100 random samples
idx = np.random.choice(len(X_test), size=100, replace=False)
X_rand = X_test[idx]
y_rand_true = y_test[idx]

# Predict
y_pred = model.predict(X_rand)
y_pred_labels = np.argmax(y_pred, axis=1)

print("\n RANDOM SAMPLE RESULTS")
for i, j in enumerate(idx):
    print(f"Sample {j}: Predicted={y_pred_labels[i]} | Actual={y_rand_true[i]}")

# Compute mini accuracy
correct = np.sum(y_pred_labels == y_rand_true)
print(f"\n Mini accuracy preview: {correct}/100 correct = {(correct/100)*100:.1f}%")

# ================================================================
# 1️⃣ Confusion Matrix for 100 Random Predictions
# ================================================================
class_names = [
    "WALKING",
    "WALKING_UPSTAIRS",
    "WALKING_DOWNSTAIRS",
    "SITTING",
    "STANDING",
    "LAYING"
]

# Get predictions for all test data
y_pred_full = model.predict(X_test)
y_pred_full_labels = np.argmax(y_pred_full, axis=1)

# Compute confusion matrix
cm = confusion_matrix(y_test, y_pred_full_labels)

plt.figure(figsize=(8, 6))
sns.set(font_scale=1.2)
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues",
            xticklabels=class_names,
            yticklabels=class_names)

plt.xlabel("Predicted Class", fontsize=14)
plt.ylabel("True Class", fontsize=14)
plt.title("Confusion Matrix for HAR GRU Model", fontsize=16)
plt.tight_layout()
plt.show()

# ================================================================
# 2️⃣ Class Distribution of Predictions
# ================================================================
plt.figure(figsize=(6,4))
plt.hist(y_pred_labels, bins=np.arange(8)-0.5, rwidth=0.7)
plt.xticks(range(6))
plt.title("Distribution of Predicted Classes (100 Random Samples)")
plt.xlabel("Class")
plt.ylabel("Count")
plt.tight_layout()
plt.show()



# ================================================================
# 4️⃣ Full Test Accuracy
# ================================================================
test_loss, test_acc = model.evaluate(X_test, y_test, verbose=1)
print(f"\nFull test accuracy = {test_acc:.4f}")
