import sys
sys.path.insert(0, r"C:\SWOS\module4_prediction")
sys.path.insert(0, r"C:\SWOS")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes.prediction import router

app = FastAPI(
    title  = "SWOS — Module 4: Waste Prediction Engine",
    version= "1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins    = ["*"],
    allow_credentials= False,
    allow_methods    = ["*"],
    allow_headers    = ["*"],
)

app.include_router(router)

@app.get("/")
def root():
    return {"service": "SWOS Prediction API", "docs": "/docs"}