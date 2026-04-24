from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
from vrp_solver.solver import solve_vrp

router = APIRouter(prefix="/api/v3", tags=["routing"])

class BinInput(BaseModel):
    id        : str
    lat       : float
    lng       : float
    fill_level: float
    waste_type: Optional[str] = "unknown"
    zone      : Optional[str] = "Unknown"

class RouteRequest(BaseModel):
    bins      : List[BinInput]
    num_trucks: Optional[int] = 2
    depot_lat : Optional[float] = 31.5204
    depot_lng : Optional[float] = 74.3587

@router.post("/route/optimize")
async def optimize_route(req: RouteRequest):
    bins_data = [b.dict() for b in req.bins]
    result    = solve_vrp(
        bins_data,
        num_trucks = req.num_trucks,
        depot_lat  = req.depot_lat,
        depot_lng  = req.depot_lng,
    )
    return JSONResponse(result)

@router.post("/route/optimize/demo")
async def optimize_demo():
    """Demo with Lahore bins — no input needed."""
    demo_bins = [
        {"id":"BIN-001","lat":31.5204,"lng":74.3587,"fill_level":0.92,"waste_type":"plastic","zone":"Gulberg III"},
        {"id":"BIN-002","lat":31.5134,"lng":74.3290,"fill_level":0.45,"waste_type":"organic","zone":"DHA Phase 1"},
        {"id":"BIN-003","lat":31.5320,"lng":74.3450,"fill_level":0.78,"waste_type":"metal",  "zone":"Model Town"},
        {"id":"BIN-004","lat":31.5410,"lng":74.3600,"fill_level":0.21,"waste_type":"glass",  "zone":"Johar Town"},
        {"id":"BIN-005","lat":31.5250,"lng":74.3700,"fill_level":0.88,"waste_type":"hazardous","zone":"Gulberg III"},
        {"id":"BIN-006","lat":31.5180,"lng":74.3400,"fill_level":0.60,"waste_type":"plastic","zone":"Garden Town"},
        {"id":"BIN-007","lat":31.5380,"lng":74.3520,"fill_level":0.15,"waste_type":"organic","zone":"Bahria Town"},
        {"id":"BIN-008","lat":31.5090,"lng":74.3650,"fill_level":0.95,"waste_type":"hazardous","zone":"DHA Phase 5"},
    ]
    result = solve_vrp(demo_bins, num_trucks=2)
    return JSONResponse(result)

@router.get("/health")
async def health():
    return {"status": "ok", "module": "module3_routing"}