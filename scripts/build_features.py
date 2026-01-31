import pandas as pd
from pathlib import Path
from ta.momentum import RSIIndicator

# Project root (parent of scripts/)
PROJECT_ROOT = Path(__file__).resolve().parents[1]
RAW_DIR = PROJECT_ROOT / "datasets" / "raw"
OUT_DIR = PROJECT_ROOT / "datasets" / "processed"
OUT_DIR.mkdir(parents=True, exist_ok=True)

MAX_ROWS = 30000   # limit rows for fast dev

def engineer_features(df):
    df.columns = [c.lower().strip() for c in df.columns]
    df = df.tail(MAX_ROWS).copy()   # limit size

    df["return"] = df["close"].pct_change()
    df["volatility"] = df["return"].rolling(20).std()
    df["rsi"] = RSIIndicator(df["close"]).rsi()

    return df.dropna()

def main():
    print("Starting feature pipeline...")
    csv_files = list(RAW_DIR.glob("*.csv"))
    print(f"Found {len(csv_files)} files in {RAW_DIR}")

    for csv_file in csv_files:
        print(f"Processing {csv_file.name}")
        df = pd.read_csv(csv_file)
        df = engineer_features(df)
        out_path = OUT_DIR / csv_file.name
        df.to_csv(out_path, index=False)
        print(f"Saved → {out_path}")

    print("Feature pipeline completed.")

if __name__ == "__main__":
    main()
