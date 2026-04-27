import sys
sys.path.insert(0, r"C:\SWOS")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from shared.db.session import init_db
from api.routes import listings, bids

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(
    title   = "SWOS — Module 5: Recycling Marketplace",
    version = "1.0.0",
    lifespan= lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins    = ["*"],
    allow_credentials= False,
    allow_methods    = ["*"],
    allow_headers    = ["*"],
)

app.include_router(listings.router)
app.include_router(bids.router)

@app.get("/")
def root():
    return {"service": "SWOS Marketplace API", "docs": "/docs"}

@app.get("/health")
def health():
    return {"status": "ok", "module": "module5_marketplace"}