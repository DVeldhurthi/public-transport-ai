import pickle

# FORCE these imports so pickle knows the classes
from sklearn.ensemble import RandomForestRegressor
from sklearn.tree import DecisionTreeRegressor

import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), "delay_model (1).pkl")

with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)

def predict_route(features):
    return model.predict(features)
