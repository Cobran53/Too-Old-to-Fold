import tensorflow as tf

def build_gru_model(input_shape, num_classes):
    model = tf.keras.Sequential([
        tf.keras.layers.GRU(64, return_sequences=True, input_shape=input_shape),
        tf.keras.layers.GRU(32),
        tf.keras.layers.Dense(32, activation='relu'),
        tf.keras.layers.Dropout(0.3),
        tf.keras.layers.Dense(num_classes, activation='softmax')
    ])

    model.compile(
        optimizer='adam',
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model
