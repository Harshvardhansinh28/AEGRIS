"""Chat API – investment Q&A and stock lookup."""
import re
from typing import Any

from fastapi import APIRouter, HTTPException

from services.market_service import get_market_summary, get_quote, get_quotes

router = APIRouter(prefix="/api/chat", tags=["chat"])


def extract_symbols(text: str) -> list[str]:
    """Extract likely ticker symbols (2–5 uppercase letters, or ^XXX, or XXX-USD)."""
    text = text.upper()
    # ^GSPC, ^IXIC style
    caps = re.findall(r"\^[A-Z]{2,5}", text)
    # AAPL, MSFT style (word boundaries)
    words = re.findall(r"\b[A-Z]{2,5}\b", text)
    # BTC-USD style
    crypto = re.findall(r"[A-Z]{2,5}-USD", text)
    seen = set()
    out = []
    for s in caps + words + crypto:
        if s not in seen and len(s) >= 2:
            seen.add(s)
            out.append(s)
    return out[:5]


def bot_response(user_message: str) -> dict[str, Any]:
    """Generate bot response using real market data."""
    msg = (user_message or "").strip().lower()
    if not msg:
        return {"reply": "Ask me about stock prices (e.g. 'What is AAPL?'), market summary, or where to look today.", "sources": []}

    # Stock price query
    symbols = extract_symbols(user_message)
    if symbols or "price" in msg or "quote" in msg or "stock" in msg or "how much" in msg:
        to_fetch = symbols if symbols else ["AAPL", "MSFT", "GOOGL"]
        quotes = get_quotes(to_fetch)
        if quotes:
            lines = []
            for q in quotes:
                sign = "+" if q["changePercent"] >= 0 else ""
                lines.append(
                    f"**{q['symbol']}** ({q['name']}): ${q['price']:.2f} ({sign}{q['changePercent']:.2f}%)"
                )
            return {
                "reply": "Here are the latest prices:\n\n" + "\n".join(lines),
                "sources": [q["symbol"] for q in quotes],
            }
        if symbols:
            return {"reply": f"Could not fetch quotes for {', '.join(symbols)}. Check symbols and try again.", "sources": []}

    # Where to invest / market today
    if "invest" in msg or "where to invest" in msg or "market today" in msg or "gainers" in msg or "losers" in msg:
        try:
            summary = get_market_summary()
            sp = summary.get("sp500")
            gainers = summary.get("gainers", [])[:5]
            losers = summary.get("losers", [])[:3]
            parts = []
            if sp:
                parts.append(f"**Market (S&P 500):** {sp['symbol']} at ${sp['price']:,.2f} ({sp['changePercent']:+.2f}%).")
            if gainers:
                parts.append("**Top movers (gainers):** " + ", ".join(f"{g['symbol']} ({g['changePercent']:+.1f}%)" for g in gainers))
            if losers:
                parts.append("**Notable decliners:** " + ", ".join(f"{l['symbol']} ({l['changePercent']:.1f}%)" for l in losers))
            parts.append("\n_This is not investment advice. Do your own research._")
            return {
                "reply": "\n\n".join(parts) if parts else "Market data is temporarily unavailable.",
                "sources": ["market_summary"],
            }
        except Exception as e:
            return {"reply": f"Market data is temporarily unavailable ({str(e)}).", "sources": []}

    # Greeting / help
    if any(w in msg for w in ["hello", "hi", "help", "what can you"]):
        return {
            "reply": "I can help with:\n• **Stock prices** – e.g. \"What is AAPL?\" or \"Price of MSFT\"\n• **Market overview** – \"Where to invest today?\" or \"Market today\"\n• **Top gainers/losers** – \"Show gainers\"\n\nAsk in plain language.",
            "sources": [],
        }

    # Default
    return {
        "reply": "I can look up stock prices (try \"AAPL price\" or \"What is MSFT?\") or give a market summary (\"Where to invest today?\"). What would you like?",
        "sources": [],
    }


@router.post("/message")
async def chat_message(body: dict[str, str]):
    """Send a message and get bot response with real market data."""
    message = body.get("message") or body.get("text") or ""
    try:
        result = bot_response(message)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
