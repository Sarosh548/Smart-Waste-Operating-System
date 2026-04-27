import sys
sys.path.insert(0, r"C:\SWOS")

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from shared.db.session import get_db
from shared.db.models import MarketplaceListing, MarketplaceBid, MarketplaceTransaction, User
from pydantic import BaseModel
from typing import Optional
import uuid

router = APIRouter(prefix="/api/v5", tags=["bids"])

class BidCreate(BaseModel):
    listing_id  : str
    bidder_phone: str
    bid_amount  : float
    note        : Optional[str] = ""

class AcceptBid(BaseModel):
    bid_id: str

@router.post("/bids/place")
async def place_bid(req: BidCreate, db: Session = Depends(get_db)):
    listing = db.query(MarketplaceListing).filter(
        MarketplaceListing.id == req.listing_id
    ).first()

    if not listing:
        return JSONResponse({"error": "Listing not found"}, status_code=404)
    if listing.status != "active":
        return JSONResponse({"error": "Listing is not active"}, status_code=400)
    if req.bid_amount <= float(listing.base_price):
        return JSONResponse({
            "error": f"Bid must be above base price of {listing.base_price}"
        }, status_code=400)

    # Get or create bidder
    bidder = db.query(User).filter(User.phone == req.bidder_phone).first()
    if not bidder:
        bidder = User(
            id   = uuid.uuid4(),
            name = f"Recycler_{req.bidder_phone[-4:]}",
            phone= req.bidder_phone,
            role = "recycler",
            reward_points = 0,
        )
        db.add(bidder)
        db.commit()
        db.refresh(bidder)

    bid = MarketplaceBid(
        id        = uuid.uuid4(),
        listing_id= listing.id,
        bidder_id = bidder.id,
        bid_amount= req.bid_amount,
        status    = "pending",
        note      = req.note,
    )
    db.add(bid)

    # Update current price if higher
    if req.bid_amount > float(listing.current_price or listing.base_price):
        listing.current_price = req.bid_amount

    db.commit()

    return JSONResponse({
        "success": True,
        "bid_id" : str(bid.id),
        "message": f"✅ Bid of PKR {req.bid_amount}/kg placed successfully",
    })

@router.post("/bids/accept")
async def accept_bid(req: AcceptBid, db: Session = Depends(get_db)):
    bid = db.query(MarketplaceBid).filter(
        MarketplaceBid.id == req.bid_id
    ).first()

    if not bid:
        return JSONResponse({"error": "Bid not found"}, status_code=404)

    listing = bid.listing

    # Accept this bid
    bid.status     = "accepted"
    listing.status = "sold"

    # Reject all other bids
    other_bids = db.query(MarketplaceBid).filter(
        MarketplaceBid.listing_id == listing.id,
        MarketplaceBid.id         != bid.id
    ).all()
    for b in other_bids:
        b.status = "rejected"

    # Create transaction
    transaction = MarketplaceTransaction(
        id          = uuid.uuid4(),
        listing_id  = listing.id,
        seller_id   = listing.seller_id,
        buyer_id    = bid.bidder_id,
        final_price = bid.bid_amount,
        quantity_kg = listing.quantity_kg,
        status      = "completed",
    )
    db.add(transaction)
    db.commit()

    total_value = float(bid.bid_amount) * float(listing.quantity_kg)

    return JSONResponse({
        "success"       : True,
        "transaction_id": str(transaction.id),
        "final_price"   : float(bid.bid_amount),
        "quantity_kg"   : float(listing.quantity_kg),
        "total_value_pkr": round(total_value, 2),
        "message"       : f"✅ Deal closed — PKR {total_value:,.0f} total",
    })

@router.get("/transactions")
async def get_transactions(db: Session = Depends(get_db)):
    txns = db.query(MarketplaceTransaction)\
             .order_by(MarketplaceTransaction.created_at.desc())\
             .limit(50).all()

    return JSONResponse({
        "total": len(txns),
        "transactions": [
            {
                "id"            : str(t.id),
                "final_price"   : float(t.final_price),
                "quantity_kg"   : float(t.quantity_kg),
                "total_value"   : round(float(t.final_price) * float(t.quantity_kg), 2),
                "status"        : t.status,
                "created_at"    : str(t.created_at)[:16],
            }
            for t in txns
        ]
    })