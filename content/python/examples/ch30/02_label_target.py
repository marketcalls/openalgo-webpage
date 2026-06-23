# The LABEL: what we want the model to predict -- did the NEXT bar close up?
import os
from datetime import datetime, timedelta

import pandas as pd
from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=900)).strftime("%Y-%m-%d")
df = client.history(symbol="RELIANCE", exchange="NSE", interval="D", start_date=start, end_date=end)
c = df["close"]

data = pd.DataFrame(index=df.index)
data["rsi"] = ta.rsi(c, 14)
data["ret1"] = c.pct_change()
# Label = 1 if TOMORROW closes higher than today, else 0. shift(-1) looks one bar ahead.
data["target"] = (c.shift(-1) > c).astype(int)
data = data.dropna()

up = int(data["target"].sum())
print(f"Rows: {len(data)}   up days: {up}   down days: {len(data) - up}")
print(f"Base rate (share of up days): {up / len(data):.1%}")
print("\nThat base rate is the score to beat -- always guessing 'up' would hit it.")
print("A model is only useful if it beats this naive baseline out-of-sample.")
