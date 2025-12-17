import path from 'path';
import { fileURLToPath } from 'url';
import { setModelPath, predict } from '../../src/services/model_api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function test() {
  console.log("Starting model API test...");

  const modelPath = path.resolve(
    __dirname,
    'har_gru_tfjs/model.json'
  );

  setModelPath(modelPath);

  // dummy input
  const dummy = Array(561).fill(0);

  const result = await predict(dummy);

  console.log("Prediction result:");
  console.log(result);

  console.log("✔ API test passed successfully");
}

test().catch(err => {
  console.error("❌ Test failed:", err);
});
