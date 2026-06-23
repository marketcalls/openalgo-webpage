# One helper to describe any instrument across NSE, NFO and MCX.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)


def describe(symbol, exchange):
    d = client.symbol(symbol=symbol, exchange=exchange)["data"]
    return f"{d['symbol']:22s} {exchange:4s} lot={d['lotsize']:<5} tick={d['tick_size']}"


print(describe("SBIN", "NSE"))
print(describe("BANKNIFTY30JUN26FUT", "NFO"))
print(describe("CRUDEOIL20JUL26FUT", "MCX"))
