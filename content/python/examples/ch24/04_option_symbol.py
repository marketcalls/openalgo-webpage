# Resolve exact tradable symbols by offset: ATM / ITM / OTM, CE and PE.
import os
from datetime import datetime

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

dates = client.expiry(symbol="NIFTY", exchange="NFO", instrumenttype="options")["data"]
today = datetime.now().date()
nearest = sorted(d for d in (datetime.strptime(x, "%d-%b-%y").date() for x in dates) if d > today)[0]
expiry = nearest.strftime("%d%b%y").upper()


def resolve(offset, option_type):
    r = client.optionsymbol(underlying="NIFTY", exchange="NSE_INDEX",
                            expiry_date=expiry, offset=offset, option_type=option_type)
    return r["symbol"], r["lotsize"]


print("Expiry:", expiry)
for offset in ["ITM2", "ATM", "OTM2"]:
    ce_sym, lot = resolve(offset, "CE")
    pe_sym, _ = resolve(offset, "PE")
    print(f"{offset:>5}:  CE {ce_sym:<22} PE {pe_sym:<22} (lot {lot})")
