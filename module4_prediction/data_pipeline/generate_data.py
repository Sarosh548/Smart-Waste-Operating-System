import pandas as pd
import numpy as np
from pathlib import Path
from datetime import datetime, timedelta
import random

random.seed(42)
np.random.seed(42)

ZONES = [
    "Gulberg III", "DHA Phase 1", "Model Town",
    "Johar Town", "Garden Town", "Bahria Town",
    "DHA Phase 5", "Cavalry Ground"
]

WASTE_TYPES = ["plastic", "organic", "metal", "glass", "hazardous"]

def generate_waste_data(days=365, output_path=None):
    """
    Generate realistic synthetic waste data for Lahore zones.
    Includes daily patterns, weekly cycles, seasonal trends, events.
    """
    records = []
    start_date = datetime(2024, 1, 1)

    for zone in ZONES:
        # Each zone has different base volume
        base_volume = random.uniform(800, 2500)

        for day_offset in range(days):
            date = start_date + timedelta(days=day_offset)
            day_of_week = date.weekday()
            month = date.month

            # Weekly pattern — more waste on weekends
            weekly_factor = 1.3 if day_of_week >= 5 else 1.0

            # Seasonal pattern — more in summer (May-Aug)
            if month in [5, 6, 7, 8]:
                seasonal_factor = 1.25
            elif month in [11, 12, 1, 2]:
                seasonal_factor = 0.85
            else:
                seasonal_factor = 1.0

            # Ramadan effect (approx month 3-4)
            ramadan_factor = 1.4 if month in [3, 4] else 1.0

            # Random events (Eid, cricket matches, etc)
            event_factor = 1.8 if random.random() < 0.02 else 1.0

            # Noise
            noise = np.random.normal(1.0, 0.08)

            total_volume = (
                base_volume
                * weekly_factor
                * seasonal_factor
                * ramadan_factor
                * event_factor
                * noise
            )

            # Split into waste types
            type_splits = {
                "plastic"  : 0.35,
                "organic"  : 0.30,
                "metal"    : 0.15,
                "glass"    : 0.12,
                "hazardous": 0.08,
            }

            for waste_type, split in type_splits.items():
                type_noise = np.random.normal(1.0, 0.05)
                volume_kg  = round(total_volume * split * type_noise, 2)

                records.append({
                    "date"      : date.strftime("%Y-%m-%d"),
                    "zone"      : zone,
                    "waste_type": waste_type,
                    "volume_kg" : volume_kg,
                    "day_of_week": day_of_week,
                    "month"     : month,
                    "is_weekend": day_of_week >= 5,
                    "is_ramadan": month in [3, 4],
                })

    df = pd.DataFrame(records)

    if output_path:
        Path(output_path).parent.mkdir(parents=True, exist_ok=True)
        df.to_csv(output_path, index=False)
        print(f"✅ Generated {len(df)} records → {output_path}")

    return df


def generate_bin_telemetry(bins, days=30, output_path=None):
    """
    Generate hourly bin fill-level data.
    """
    records = []
    start_date = datetime(2024, 12, 1)

    for bin_info in bins:
        fill_level = 0.1  # start empty

        for day_offset in range(days):
            date = start_date + timedelta(days=day_offset)

            for hour in range(24):
                dt = date + timedelta(hours=hour)

                # Fill rate varies by time of day
                if 7 <= hour <= 10:
                    fill_rate = random.uniform(0.04, 0.08)
                elif 12 <= hour <= 14:
                    fill_rate = random.uniform(0.03, 0.06)
                elif 18 <= hour <= 21:
                    fill_rate = random.uniform(0.03, 0.07)
                else:
                    fill_rate = random.uniform(0.001, 0.01)

                fill_level = min(1.0, fill_level + fill_rate)

                # Collection empties bin
                if fill_level >= 0.90:
                    fill_level = random.uniform(0.05, 0.15)

                records.append({
                    "timestamp" : dt.strftime("%Y-%m-%d %H:%M:%S"),
                    "bin_id"    : bin_info["id"],
                    "zone"      : bin_info["zone"],
                    "fill_level": round(fill_level, 3),
                    "waste_type": bin_info["waste_type"],
                })

    df = pd.DataFrame(records)

    if output_path:
        Path(output_path).parent.mkdir(parents=True, exist_ok=True)
        df.to_csv(output_path, index=False)
        print(f"✅ Generated {len(df)} bin telemetry records → {output_path}")

    return df


if __name__ == "__main__":
    # Generate main waste dataset
    df = generate_waste_data(
        days=730,  # 2 years of data
        output_path=r"C:\SWOS\module4_prediction\data\waste_history.csv"
    )
    print(f"\nDataset summary:")
    print(df.groupby("zone")["volume_kg"].sum().round(0))

    # Generate bin telemetry
    bins = [
        {"id":"BIN-001","zone":"Gulberg III","waste_type":"plastic"},
        {"id":"BIN-002","zone":"DHA Phase 1","waste_type":"organic"},
        {"id":"BIN-003","zone":"Model Town", "waste_type":"metal"},
        {"id":"BIN-004","zone":"Johar Town", "waste_type":"glass"},
        {"id":"BIN-005","zone":"Gulberg III","waste_type":"hazardous"},
        {"id":"BIN-006","zone":"Garden Town","waste_type":"plastic"},
        {"id":"BIN-007","zone":"Bahria Town","waste_type":"organic"},
        {"id":"BIN-008","zone":"DHA Phase 5","waste_type":"hazardous"},
    ]
    generate_bin_telemetry(
        bins,
        days=60,
        output_path=r"C:\SWOS\module4_prediction\data\bin_telemetry.csv"
    )