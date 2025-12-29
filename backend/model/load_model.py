import pickle

MODEL_PATH = "model/delay_model (1).pkl"

with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)

def predict_route(features):
    return model.predict(features)
