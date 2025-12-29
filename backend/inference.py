import numpy as np
from model.load_model import predict_route

def run_inference(start, destination, preference, departure_time):
    # This depends on how you trained your model
    # Example feature encoding (mock)
    features = np.array([[
        len(start),
        len(destination),
        1 if preference == "Fastest" else 0,
        1 if preference == "Safest" else 0,
        1 if preference == "Cheapest" else 0
    ]])

    prediction = predict_route(features)

    return {
        "duration": int(prediction[0]),
        "transfers": int(prediction[1]),
        "reliability": prediction[2]
    }
