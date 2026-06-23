# Historical Volatility: annualised std-dev of returns -- the "how wild" number in %.
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=250)).strftime("%Y-%m-%d")

df = client.history(symbol="INFY", exchange="NSE", interval="D", start_date=start, end_date=end)

df["HV20"] = ta.hv(df["close"], length=20)
df["HV60"] = ta.hv(df["close"], length=60)

hv20 = df["HV20"].iloc[-1]
hv60 = df["HV60"].iloc[-1]
print("INFY close:", round(df["close"].iloc[-1], 2))
print(f"HV(20) = {hv20:5.1f}%  (recent, annualised)")
print(f"HV(60) = {hv60:5.1f}%  (longer-run baseline)")

# Rising short-term HV vs the baseline = the market is getting jumpier.
print("Regime:", "volatility EXPANDING (HV20 > HV60)" if hv20 > hv60 else "volatility CALMING (HV20 < HV60)")
