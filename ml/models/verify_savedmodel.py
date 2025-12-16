import tensorflow as tf

# Load the SavedModel (generic TF SavedModel)
loaded = tf.saved_model.load("har_gru_savedmodel")

print("Available signatures:", loaded.signatures.keys())

# Get serving function
infer = loaded.signatures["serving_default"]

# Run dummy inference
output = infer(input=tf.zeros((1, 1, 561)))

print("Inference output:", output)
print(" SavedModel verified successfully")
