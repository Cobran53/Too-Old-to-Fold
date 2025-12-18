import * as tf from '@tensorflow/tfjs-node';

const LABELS = [
  "Walking",
  "Walking Upstairs",
  "Walking Downstairs",
  "Sitting",
  "Standing",
  "Laying"
];

let model = null;
let MODEL_PATH = null;

export function setModelPath(path) {
  MODEL_PATH = path;
}

export async function loadModel() {
  if (!model) {
    if (!MODEL_PATH) {
      throw new Error("Model path not set");
    }

    console.log("Loading model from filesystem:", MODEL_PATH);
    model = await tf.loadGraphModel(tf.io.fileSystem(MODEL_PATH));
    console.log("Model loaded");
    console.log("Model outputs:", model.outputs.map(o => o.name));
  }
  return model;
}

export async function predict(features) {
  const m = await loadModel();

  const inputTensor = tf.tensor(features, [1, 1, 561], 'float32');
  const output = await m.executeAsync({
    [model.inputs[0].name]: inputTensor
  });

  const outTensor = Array.isArray(output) ? output[0] : output;
  const probs = Array.from(await outTensor.data());
  const maxIdx = probs.indexOf(Math.max(...probs));

  return {
    label: LABELS[maxIdx],
    confidence: probs[maxIdx],
    probabilities: Object.fromEntries(
      LABELS.map((l, i) => [l, probs[i]])
    )
  };
}
