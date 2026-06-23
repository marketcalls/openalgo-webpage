# True Strength Index (TSI): double-smoothed momentum with a signal line.
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=200)).strftime("%Y-%m-%d")
df = client.history(symbol="RELIANCE", exchange="NSE", interval="D", start_date=start, end_date=end)

# TSI returns a TUPLE (tsi_line, signal_line). Double smoothing makes it cleaner than raw momentum.
tsi_line, signal_line = ta.tsi(df["close"])
df["TSI"] = tsi_line
df["TSI_Signal"] = signal_line

t, s = df["TSI"].iloc[-1], df["TSI_Signal"].iloc[-1]
print(df[["close", "TSI", "TSI_Signal"]].tail(5).round(2))
print(f"\nLatest TSI: {t:+.2f}   Signal: {s:+.2f}")
print("Bias:", "bullish (TSI above zero)" if t > 0 else "bearish (TSI below zero)")
print("Trigger:", "TSI above signal (long)" if t > s else "TSI below signal (short)")
