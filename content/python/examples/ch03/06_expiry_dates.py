# expiry() lists the available expiry dates for futures and options.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

fut = client.expiry(symbol="NIFTY", exchange="NFO", instrumenttype="futures")
opt = client.expiry(symbol="NIFTY", exchange="NFO", instrumenttype="options")
print("Future expiries:", fut["data"][:5])
print("Option expiries:", opt["data"][:5])
