import sys
sys.path.insert(0, r"C:\SWOS")

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from shared.db.session import get_db
from shared.db.models import MarketplaceListing, User
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
import uuid

router = APIRouter(prefix="/api/v5", tags=["listings"])

MATERIAL_PRICES = {
    "plastic"  : {"min": 15, "max": 45,  "unit": "PKR/kg"},
    "organic"  : {"min": 5,  "max": 20,  "unit": "PKR/kg"},
    "metal"    : {"min": 80, "max": 200, "unit": "PKR/kg"},
    "glass"    : {"min": 10, "max": 35,  "unit": "PKR/kg"},
    "hazardous": {"min": 50, "max": 150, "unit": "PKR/kg"},
}

class ListingCreate(BaseModel):
    seller_phone: str
    waste_type  : str
    quantity_kg : float
    base_price  : float
    title       : str
    description : Optional[str] = ""
    location    : Optional[str] = "Lahore"
    days_active : Optional[int] = 7

@router.post("/listings/create")
async def create_listing(req: ListingCreate, db: Session = Depends(get_db)):
    # Get or create seller
    seller = db.query(User).filter(User.phone == req.seller_phone).first()
    if not seller:
        seller = User(
            id   = uuid.uuid4(),
            name = f"Collector_{req.seller_phone[-4:]}",
            phone= req.seller_phone,
            role = "collector",
            reward_points = 0,
        )
        db.add(seller)
        db.commit()
        db.refresh(seller)

    listing = MarketplaceListing(
        id           = uuid.uuid4(),
        seller_id    = seller.id,
        waste_type   = req.waste_type,
        quantity_kg  = req.quantity_kg,
        base_price   = req.base_price,
        current_price= req.base_price,
        status       = "active",
        title        = req.title,
        description  = req.description,
        location     = req.location,
        expires_at   = datetime.utcnow() + timedelta(days=req.days_active),
    )
    db.add(listing)
    db.commit()
    db.refresh(listing)

    return JSONResponse({
        "success"   : True,
        "listing_id": str(listing.id),
        "message"   : f"✅ Listing created — {req.quantity_kg}kg of {req.waste_type}",
    })

@router.get("/listings")
async def get_listings(
    waste_type: Optional[str] = None,
    status    : Optional[str] = "active",
    db        : Session = Depends(get_db)
):
    query = db.query(MarketplaceListing)
    if waste_type:
        query = query.filter(MarketplaceListing.waste_type == waste_type)
    if status:
        query = query.filter(MarketplaceListing.status == status)

    listings = query.order_by(MarketplaceListing.created_at.desc()).all()

    return JSONResponse({
        "total"   : len(listings),
        "listings": [
            {
                "id"           : str(l.id),
                "title"        : l.title,
                "waste_type"   : l.waste_type,
                "quantity_kg"  : float(l.quantity_kg),
                "base_price"   : float(l.base_price),
                "current_price": float(l.current_price or l.base_price),
                "status"       : l.status,
                "location"     : l.location,
                "expires_at"   : str(l.expires_at)[:10] if l.expires_at else None,
                "created_at"   : str(l.created_at)[:10],
                "total_value"  : round(float(l.quantity_kg) * float(l.current_price or l.base_price), 2),
            }
            for l in listings
        ]
    })

@router.get("/listings/price-guide")
async def price_guide():
    return JSONResponse({"materials": MATERIAL_PRICES})

@router.get("/listings/{listing_id}")
async def get_listing(listing_id: str, db: Session = Depends(get_db)):
    listing = db.query(MarketplaceListing).filter(
        MarketplaceListing.id == listing_id
    ).first()

    if not listing:
        return JSONResponse({"error": "Listing not found"}, status_code=404)

    bids = [
        {
            "id"        : str(b.id),
            "amount"    : float(b.bid_amount),
            "status"    : b.status,
            "created_at": str(b.created_at)[:16],
        }
        for b in listing.bids
    ]

    return JSONResponse({
        "id"           : str(listing.id),
        "title"        : listing.title,
        "waste_type"   : listing.waste_type,
        "quantity_kg"  : float(listing.quantity_kg),
        "base_price"   : float(listing.base_price),
        "current_price": float(listing.current_price or listing.base_price),
        "status"       : listing.status,
        "location"     : listing.location,
        "description"  : listing.description,
        "expires_at"   : str(listing.expires_at)[:10] if listing.expires_at else None,
        "total_bids"   : len(bids),
        "bids"         : bids,
    })