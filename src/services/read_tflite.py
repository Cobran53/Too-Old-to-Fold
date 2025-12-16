import * as tf from '@tensorflow/tfjs';

/**
 * Load and inspect a TensorFlow.js model.
 * @param {string} modelPath - Path to the TFLite model converted to TensorFlow.js format.
 */
export async function loadModel(modelPath) {
  try {
    console.log('Loading model...');
    const model = await tf.loadLayersModel(modelPath);

    console.log('Model loaded successfully.');

    // Inspect model inputs and outputs
    console.log('\nInputs:');
    model.inputs.forEach(input => {
      console.log({
        name: input.name,
        shape: input.shape,
        dtype: input.dtype,
      });
    });

    console.log('\nOutputs:');
    model.outputs.forEach(output => {
      console.log({
        name: output.name,
        shape: output.shape,
        dtype: output.dtype,
      });
    });

    return model;
  } catch (error) {
    console.error('Error loading model:', error);
    throw error;
  }
}

/**
 * Perform inference on the model with dummy data.
 * @param {tf.LayersModel} model - Loaded TensorFlow.js model.
 */
export async function testModelInference(model) {
  try {
    console.log('Running inference with dummy data...');
    const dummyInput = tf.zeros([1, 1, 561]); // Adjust shape as needed
    const output = model.predict(dummyInput);

    console.log('Inference output:', output.arraySync());
  } catch (error) {
    console.error('Error during inference:', error);
  }
}