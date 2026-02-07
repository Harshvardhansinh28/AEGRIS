"""Market data API – real-time quotes and summary."""
from fastapi import APIRouter, HTTPException, Query

from services.market_service import (
    get_market_summary,
    get_quote,
    get_quotes,
    search_symbols,
)

router = APIRouter(prefix="/api/market", tags=["market"])


@router.get("/summary")
async def market_summary():
    """Dashboard summary: indices, watchlist, gainers, losers."""
    try:
        return get_market_summary()
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))


@router.get("/quote/{symbol}")
async def quote(symbol: str):
    """Current quote for one symbol (e.g. AAPL, ^GSPC)."""
    s = symbol.upper().strip()
    if not s:
        raise HTTPException(status_code=400, detail="Symbol required")
    data = get_quote(s)
    if not data:
        raise HTTPException(status_code=404, detail=f"Quote not found for {symbol}")
    return data


@router.get("/quotes")
async def quotes(symbols: str = Query(..., description="Comma-separated symbols")):
    """Quotes for multiple symbols."""
    sym_list = [x.strip().upper() for x in symbols.split(",") if x.strip()]
    if not sym_list:
        raise HTTPException(status_code=400, detail="At least one symbol required")
    return get_quotes(sym_list[:30])


@router.get("/search")
async def search(q: str = Query(..., min_length=1)):
    """Search symbols by prefix."""
    return {"symbols": search_symbols(q)}
