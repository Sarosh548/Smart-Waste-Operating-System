import sys
sys.path.insert(0, r"C:\SWOS\module4_prediction")

from fastapi import APIRouter
from fastapi.responses import JSONResponse
import pandas as pd
import pickle
from pathlib import Path

router = APIRouter(prefix="/api/v4", tags=["prediction"])

MODELS_PATH   = Path(r"C:\SWOS\module4_prediction\models\prophet_models.pkl")
FORECAST_PATH = Path(r"C:\SWOS\module4_prediction\data\forecasts.csv")

# Load models once
_models   = None
_forecast = None

def get_models():
    global _models
    if _models is None:
        with open(MODELS_PATH, "rb") as f:
            _models = pickle.load(f)
        print(f"✅ Loaded {len(_models)} Prophet models")
    return _models

def get_forecast():
    global _forecast
    if _forecast is None:
        _forecast = pd.read_csv(FORECAST_PATH)
        _forecast['date'] = pd.to_datetime(_forecast['date'])
    return _forecast

@router.get("/forecast/zones")
async def get_all_zones_forecast():
    """Get 30-day forecast for all zones."""
    df      = get_forecast()
    today   = pd.Timestamp.today().normalize()
    next_30 = today + pd.Timedelta(days=30)

    mask   = (df['date'] >= today) & (df['date'] <= next_30)
    result = df[mask].copy()

    if len(result) == 0:
        result = df.tail(30 * 8).copy()

    summary = []
    for zone in result['zone'].unique():
        zone_data = result[result['zone'] == zone]
        summary.append({
            "zone"           : zone,
            "avg_daily_kg"   : round(zone_data['predicted_kg'].mean(), 1),
            "total_30d_kg"   : round(zone_data['predicted_kg'].sum(), 1),
            "peak_day"       : str(zone_data.loc[
                                zone_data['predicted_kg'].idxmax(), 'date'
                               ])[:10],
            "peak_kg"        : round(zone_data['predicted_kg'].max(), 1),
        })

    return JSONResponse({
        "forecast_period": f"{str(today)[:10]} → {str(next_30)[:10]}",
        "zones"          : summary,
    })

@router.get("/forecast/zone/{zone_name}")
async def get_zone_forecast(zone_name: str, days: int = 30):
    """Get detailed forecast for a specific zone."""
    df    = get_forecast()
    today = pd.Timestamp.today().normalize()
    end   = today + pd.Timedelta(days=days)

    zone_df = df[df['zone'] == zone_name].copy()

    if len(zone_df) == 0:
        return JSONResponse({"error": f"Zone '{zone_name}' not found"}, status_code=404)

    mask      = (zone_df['date'] >= today) & (zone_df['date'] <= end)
    result    = zone_df[mask]

    if len(result) == 0:
        result = zone_df.tail(days)

    return JSONResponse({
        "zone"   : zone_name,
        "days"   : days,
        "forecast": [
            {
                "date"        : str(row['date'])[:10],
                "predicted_kg": round(row['predicted_kg'], 1),
                "lower_kg"    : round(row['lower_bound'], 1),
                "upper_kg"    : round(row['upper_bound'], 1),
            }
            for _, row in result.iterrows()
        ],
    })

@router.get("/forecast/peaks")
async def get_peak_days():
    """Identify upcoming peak waste generation days."""
    df      = get_forecast()
    today   = pd.Timestamp.today().normalize()
    next_30 = today + pd.Timedelta(days=30)

    mask   = (df['date'] >= today) & (df['date'] <= next_30)
    result = df[mask] if len(df[mask]) > 0 else df.tail(30 * 8)

    threshold = result['predicted_kg'].quantile(0.80)
    peaks     = result[result['predicted_kg'] >= threshold].copy()

    return JSONResponse({
        "peaks": [
            {
                "date"        : str(row['date'])[:10],
                "zone"        : row['zone'],
                "predicted_kg": round(row['predicted_kg'], 1),
                "severity"    : "high" if row['predicted_kg'] >= result['predicted_kg'].quantile(0.95) else "medium",
            }
            for _, row in peaks.iterrows()
        ]
    })

@router.get("/health")
async def health():
    return {"status": "ok", "module": "module4_prediction"}