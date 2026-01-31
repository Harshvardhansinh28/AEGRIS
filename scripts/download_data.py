import yfinance as yf
from pathlib import Path

# Project root (parent of scripts/)
PROJECT_ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = PROJECT_ROOT / "datasets" / "raw"
DATA_DIR.mkdir(parents=True, exist_ok=True)

ASSETS = [
    "AAPL", "MSFT", "GOOGL", "AMZN", "META",
    "BTC-USD", "ETH-USD", "BNB-USD", "SOL-USD", "ADA-USD"
]

def main():
    print("Downloading historical market data...")
    data = yf.download(ASSETS, start="2018-01-01", group_by="ticker", progress=False, auto_adjust=True)

    if len(ASSETS) == 1:
        data = {ASSETS[0]: data}
    else:
        data = {t: data[t].dropna(how="all") if t in data else None for t in ASSETS}
        data = {t: df for t, df in data.items() if df is not None and not df.empty}

    for asset, df in data.items():
        if df is None or df.empty:
            continue
        out_file = DATA_DIR / f"{asset.replace('-', '_')}.csv"
        df.to_csv(out_file)
        print(f"Saved {out_file}")
    print("Download complete.")

if __name__ == "__main__":
    main()
