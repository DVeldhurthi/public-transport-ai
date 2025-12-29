from fastapi import FastAPI
from pydantic import BaseModel
from inference import run_inference

app = FastAPI()

class RouteRequest(BaseModel):
    startLocation: str
    destination: str
    preference: str
    departureTime: str | None = None

@app.post("/predict-route")
def predict_route(data: RouteRequest):
    result = run_inference(
        data.startLocation,
        data.destination,
        data.preference,
        data.departureTime
    )

    return {
        "duration": f"{result['duration']} min",
        "transfers": result["transfers"],
        "agencies": ["BART", "Muni"],  # optional hybrid logic
        "reliability": result["reliability"]
    }
