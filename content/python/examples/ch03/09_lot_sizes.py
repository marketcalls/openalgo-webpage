# Lot size decides how many units one F&O contract controls -- key for sizing.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)


def contract_value(symbol, exchange):
    info = client.symbol(symbol=symbol, exchange=exchange)["data"]
    ltp = client.quotes(symbol=symbol, exchange=exchange)["data"]["ltp"]
    return info["lotsize"], ltp, info["lotsize"] * ltp


for sym, exch in [("NIFTY30JUN26FUT", "NFO"), ("GOLDM03JUL26FUT", "MCX")]:
    lot, ltp, value = contract_value(sym, exch)
    print(f"{sym:18s} lot {lot:>4} x {ltp:>10.2f} = {value:>14,.0f}")
