# Split history into IN-SAMPLE (train) and OUT-OF-SAMPLE (test) -- never shuffle time.
import os
from datetime import datetime, timedelta

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=900)).strftime("%Y-%m-%d")
close = client.history(symbol="RELIANCE", exchange="NSE", interval="D",
                       start_date=start, end_date=end)["close"]

# Cut the timeline once. The FIRST chunk is for tuning; the LAST is held back,
# untouched, to judge the result. Order matters -- the future must stay future.
cut = int(len(close) * 0.7)
in_sample = close.iloc[:cut]
out_sample = close.iloc[cut:]

print(f"Total daily bars : {len(close)}")
print(f"In-sample (train): {len(in_sample)} bars  {in_sample.index[0].date()} -> {in_sample.index[-1].date()}")
print(f"Out-of-sample    : {len(out_sample)} bars  {out_sample.index[0].date()} -> {out_sample.index[-1].date()}")
print("\nWe tune ONLY on the in-sample. The out-of-sample is a sealed exam paper.")
