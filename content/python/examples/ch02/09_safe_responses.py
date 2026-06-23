# Real code must handle errors. Check status and guard with try / except.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)


def safe_ltp(symbol, exchange="NSE"):
    try:
        resp = client.quotes(symbol=symbol, exchange=exchange)
        if resp.get("status") == "success":
            return resp["data"]["ltp"]
        return f"error: {resp.get('message', 'unknown')}"
    except Exception as exc:  # network or parsing problem
        return f"exception: {exc}"


print("Valid symbol  :", safe_ltp("RELIANCE"))
print("Unknown symbol:", safe_ltp("NOTASYMBOL"))
