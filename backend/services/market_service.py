"""Real-time market data via yfinance."""
from __future__ import annotations

import re
from typing import Any

import yfinance as yf


# Default symbols for dashboard
INDICES = ["^GSPC", "^IXIC", "^DJI", "^RUT"]  # S&P 500, NASDAQ, Dow, Russell 2000
WATCHLIST = ["AAPL", "MSFT", "GOOGL", "AMZN", "META", "NVDA", "TSLA", "JPM"]
TOP_SYMBOLS = INDICES + WATCHLIST


def get_quote(symbol: str) -> dict[str, Any] | None:
    """Fetch current quote for one symbol."""
    try:
        t = yf.Ticker(symbol)
        info = t.info
        hist = t.history(period="5d")
        if hist.empty:
            return _quote_from_info(symbol, info)
        last = hist.iloc[-1]
        prev = hist.iloc[-2] if len(hist) > 1 else last
        change = float(last["Close"]) - float(prev["Close"])
        change_pct = (change / float(prev["Close"]) * 100) if prev["Close"] else 0
        return {
            "symbol": symbol,
            "name": info.get("shortName") or symbol,
            "price": round(float(last["Close"]), 2),
            "change": round(change, 2),
            "changePercent": round(change_pct, 2),
            "volume": int(last.get("Volume", 0)),
            "high": round(float(last.get("High", last["Close"])), 2),
            "low": round(float(last.get("Low", last["Close"])), 2),
        }
    except Exception:
        return None


def _quote_from_info(symbol: str, info: dict) -> dict[str, Any]:
    price = info.get("regularMarketPrice") or info.get("previousClose") or 0
    prev = info.get("previousClose") or price
    change = float(price) - float(prev) if prev else 0
    change_pct = (change / float(prev) * 100) if prev else 0
    return {
        "symbol": symbol,
        "name": info.get("shortName") or symbol,
        "price": round(float(price), 2),
        "change": round(change, 2),
        "changePercent": round(change_pct, 2),
        "volume": int(info.get("volume", 0)),
        "high": round(float(info.get("dayHigh", price)), 2),
        "low": round(float(info.get("dayLow", price)), 2),
    }


def get_quotes(symbols: list[str]) -> list[dict[str, Any]]:
    """Fetch quotes for multiple symbols."""
    out = []
    for s in symbols:
        q = get_quote(s)
        if q:
            out.append(q)
    return out


def get_market_summary() -> dict[str, Any]:
    """Summary for dashboard: indices + watchlist quotes, gainers/losers."""
    symbols = list(dict.fromkeys(INDICES + WATCHLIST))
    quotes = get_quotes(symbols)
    indices = [q for q in quotes if q["symbol"] in INDICES]
    watchlist = [q for q in quotes if q["symbol"] in WATCHLIST]
    # Top gainers/losers from watchlist
    sorted_q = sorted(quotes, key=lambda x: x["changePercent"], reverse=True)
    gainers = sorted_q[:5]
    losers = sorted_q[-5:][::-1]
    # S&P 500 as main "market" level
    sp = next((q for q in quotes if q["symbol"] == "^GSPC"), None)
    return {
        "indices": indices,
        "watchlist": watchlist,
        "gainers": gainers,
        "losers": losers,
        "sp500": sp,
        "timestamp": __import__("datetime").datetime.utcnow().isoformat() + "Z",
    }


def search_symbols(query: str) -> list[str]:
    """Simple symbol search: return matching known symbols."""
    q = query.upper().strip()
    if not q:
        return []
    all_s = set(INDICES + WATCHLIST + ["GLD", "TLT", "QQQ", "SPY", "VOO", "BTC-USD", "ETH-USD"])
    return [s for s in all_s if q in s][:15]
