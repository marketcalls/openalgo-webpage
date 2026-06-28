# VWAP and TWAP - the execution benchmarks every trading desk is measured against.
import os
from datetime import datetime, timedelta

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=6)).strftime("%Y-%m-%d")
df = client.history(symbol="RELIANCE", exchange="NSE", interval="5m",
                    start_date=start, end_date=end)
df = df[df.index.date == df.index[-1].date()]          # keep just the last trading day

df["typical"] = (df["high"] + df["low"] + df["close"]) / 3
vwap = (df["typical"] * df["volume"]).sum() / df["volume"].sum()
twap = df["close"].mean()

print(f"RELIANCE intraday, {len(df)} five-minute bars on {df.index[-1].date()}\n")
print(f"VWAP  : {vwap:.2f}   volume-weighted - more trades at a price, more weight (the benchmark)")
print(f"TWAP  : {twap:.2f}   time-weighted  - every bar counts equally")
print(f"Open  : {df['close'].iloc[0]:.2f}    Close: {df['close'].iloc[-1]:.2f}")
print("\nBeat VWAP and your execution desk earned its keep; lag it and you leaked money to the market.")
