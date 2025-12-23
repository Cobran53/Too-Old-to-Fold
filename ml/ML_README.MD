# README — Machine Learning Models (ml folder)

This directory contains all machine learning related components developed for the Too Old to Fold project. The work focuses on Human Activity Recognition (HAR) using a GRU-based neural network, along with preprocessing, inference, and deployment experiments.

## Folder Structure
```text
ml/
├── data/                       Dataset and related files (in .gitignore)
├── models/
│   ├── gru_har_model.py        GRU architecture definition
│   ├── har_gru_model.keras     Trained Keras model
│   ├── export_tflite.py        TFLite export attempt
│   ├── verify_tflite.py        TFLite inspection script
│   ├── verify_tflite_docker.py Docker-based TFLite verification
│   ├── verify_savedmodel.py    TensorFlow SavedModel verification
│   ├── test_model_api.js       Experimental TensorFlow.js test (not used)
│   └── other test scripts
├── preprocess.py               Feature extraction pipeline
├── demo_predict.py             Example inference script
└── train_har_gru.py            Model training script
```

## Core Model and Training

**gru_har_model.py**  
Defines the GRU-based neural network architecture used for human activity recognition.

**train_har_gru.py**  
Training pipeline for the GRU model. Trains the network on preprocessed sensor features and saves the resulting model as har_gru_model.keras.

## Inference and Verification

**demo_predict.py**  
Demonstrates how to perform inference using the trained model with dummy or sample inputs.

**verify_savedmodel.py**  
Loads the TensorFlow SavedModel export and performs a forward pass to verify that the model executes correctly and produces valid predictions.

## Deployment and Conversion Experiments

**export_tflite.py**  
Attempts to convert the trained Keras model into TensorFlow Lite format. Conversion is technically successful, but execution requires TensorFlow Select (Flex) ops due to GRU dynamic operations.

**verify_tflite.py and verify_tflite_docker.py**  
Scripts used to inspect and test the TFLite model. These highlight compatibility limitations when running recurrent models in TFLite without full delegate support.

**test_model_api.js**  
An experimental TensorFlow.js test script intended to run the model in a JavaScript environment. This approach was explored but not used in the final prototype due to incompatibilities with dynamic graph operations in GRU models.

## Preprocessing

**preprocess.py**  
Implements feature extraction and preprocessing to generate the 561-dimensional input vectors required by the GRU model. These features are derived from raw sensor signals, or in our case the dataset.

## Backend Integration

**api.py**

The trained model is used through a backend API (FastAPI) that loads the TensorFlow SavedModel and exposes a /predict endpoint. This allows structured feature vectors to be sent from the application and activity predictions to be returned in a consistent format.

## Notes on Usage

The GRU model, preprocessing pipeline, SavedModel verification, and backend inference are fully functional.

TensorFlow Lite and TensorFlow.js conversions are included as exploratory work and learning outcomes but are not part of the final working prototype.