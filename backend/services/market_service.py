import os
import requests
from typing import Any
from datetime import datetime, timedelta

FINNHUB_API_KEY = os.getenv("FINNHUB_API_KEY")
BASE_URL = "https://finnhub.io/api/v1"

INDICES = ["^GSPC", "^IXIC", "^DJI"]
WATCHLIST = ["AAPL", "MSFT", "GOOGL", "AMZN", "META", "NVDA", "TSLA", "JPM"]

# -----------------------------
# 🔥 Simple in-memory cache
# -----------------------------
_CACHE_DATA: dict[str, Any] | None = None
_CACHE_TIME: datetime | None = None
CACHE_TTL = 60  # seconds


def _map_symbol(symbol: str) -> str:
    return (
        symbol.replace("^GSPC", "SPY")
              .replace("^IXIC", "QQQ")
              .replace("^DJI", "DIA")
    )


def _fetch_quote(symbol: str) -> dict[str, Any] | None:
    try:
        if not FINNHUB_API_KEY:
            print("FINNHUB API KEY NOT LOADED")
            return None

        url = f"{BASE_URL}/quote"
        params = {
            "symbol": _map_symbol(symbol),
            "token": FINNHUB_API_KEY
        }

        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()

        data = response.json()

        if not data or data.get("c") is None:
            return None

        return {
            "symbol": symbol,
            "name": symbol,
            "price": round(data.get("c", 0), 2),
            "change": round(data.get("d", 0), 2),
            "changePercent": round(data.get("dp", 0), 2),
            "high": round(data.get("h", 0), 2),
            "low": round(data.get("l", 0), 2),
            "volume": 0,
        }

    except Exception as e:
        print(f"FINNHUB ERROR: {symbol}", e)
        return None


def get_quotes(symbols: list[str]) -> list[dict[str, Any]]:
    results = []
    for symbol in symbols:
        quote = _fetch_quote(symbol)
        if quote:
            results.append(quote)
    return results


def get_market_summary() -> dict[str, Any]:
    global _CACHE_DATA, _CACHE_TIME

    # ✅ Return cached data if still valid
    if _CACHE_DATA and _CACHE_TIME:
        if datetime.utcnow() - _CACHE_TIME < timedelta(seconds=CACHE_TTL):
            return _CACHE_DATA

    symbols = list(dict.fromkeys(INDICES + WATCHLIST))
    quotes = get_quotes(symbols)

    indices = [q for q in quotes if q["symbol"] in INDICES]
    watchlist = [q for q in quotes if q["symbol"] in WATCHLIST]

    sorted_quotes = sorted(quotes, key=lambda x: x["changePercent"], reverse=True)
    gainers = sorted_quotes[:5]
    losers = sorted_quotes[-5:][::-1]

    sp500 = next((q for q in quotes if q["symbol"] == "^GSPC"), None)

    summary = {
        "indices": indices,
        "watchlist": watchlist,
        "gainers": gainers,
        "losers": losers,
        "sp500": sp500,
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }

    # ✅ Save to cache
    _CACHE_DATA = summary
    _CACHE_TIME = datetime.utcnow()

    return summary


def get_quote(symbol: str) -> dict[str, Any] | None:
    return _fetch_quote(symbol)


def search_symbols(query: str) -> list[str]:
    q = query.upper().strip()
    if not q:
        return []

    universe = set(INDICES + WATCHLIST + ["SPY", "QQQ", "DIA", "BTCUSDT"])
    return [s for s in universe if q in s][:15]
