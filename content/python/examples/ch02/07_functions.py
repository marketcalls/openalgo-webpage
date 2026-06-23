# Wrap repeated work in a function you can reuse anywhere.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)


def last_price(symbol, exchange="NSE"):
    """Return the last traded price for any symbol on any exchange."""
    return client.quotes(symbol=symbol, exchange=exchange)["data"]["ltp"]


print("RELIANCE (NSE):", last_price("RELIANCE"))
print("GOLDM    (MCX):", last_price("GOLDM03JUL26FUT", "MCX"))
