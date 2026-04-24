import sys
sys.path.insert(0, r"C:\SWOS\module3_routing")
sys.path.insert(0, r"C:\SWOS")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes.routing import router

app = FastAPI(
    title  = "SWOS — Module 3: Smart Collection Routing",
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
    return {"service": "SWOS Routing API", "docs": "/docs"}