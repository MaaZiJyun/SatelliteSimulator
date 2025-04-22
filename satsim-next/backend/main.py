from fastapi import FastAPI
from models import SolarSystemRequest

app = FastAPI()

@app.post("/compute")
def compute(request: SolarSystemRequest):
    system_data = request.data
    mode = request.mode
    return {"message": f"Received {len(system_data.planets)} planets in {mode} mode."}
