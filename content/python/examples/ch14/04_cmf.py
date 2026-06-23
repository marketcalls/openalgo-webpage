# Chaikin Money Flow (CMF): are buyers or sellers winning over the period?
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=120)).strftime("%Y-%m-%d")
df = client.history(symbol="GOLDM03JUL26FUT", exchange="MCX", interval="D", start_date=start, end_date=end)

# CMF sums money-flow volume over 20 days. Positive = accumulation, negative = distribution.
df["CMF"] = ta.cmf(df["high"], df["low"], df["close"], df["volume"], period=20)

cmf = df["CMF"].iloc[-1]
print(df[["close", "CMF"]].tail(5).round(4))
print(f"\nLatest CMF: {cmf:+.4f}")
print("Pressure:", "buying / accumulation" if cmf > 0 else "selling / distribution")
print("Strong reading:", "yes" if abs(cmf) > 0.2 else "no (|CMF| under 0.20 is mild)")
