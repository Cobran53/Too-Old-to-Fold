import * as tf from '@tensorflow/tfjs';
import { predict } from '../../src/services/model_api.js';

(async () => {
  try {
    // Read input from stdin
    const input = await new Promise((resolve, reject) => {
      let data = '';
      process.stdin.on('data', chunk => data += chunk);
      process.stdin.on('end', () => resolve(JSON.parse(data)));
      process.stdin.on('error', reject);
    });

    // Convert input features to TensorFlow.js tensor
    const features = tf.tensor(input.features, [1, 1, 561], 'float32');

    // Call the predict function
    const result = await predict(features);

    // Output the result as JSON
    console.log(JSON.stringify(result));
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
})();