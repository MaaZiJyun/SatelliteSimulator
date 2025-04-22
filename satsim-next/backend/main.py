from utils.process_heliocentric_system import process_heliocentric_system
from fastapi import FastAPI
from models import SolarSystemRequest

app = FastAPI()

@app.post("/compute")
def compute(request: SolarSystemRequest):
    result = process_heliocentric_system(request)
    return result
