# Ultimate Oscillator: blends three timeframes to cut down on false divergences.
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=150)).strftime("%Y-%m-%d")
df = client.history(symbol="SILVERM30JUN26FUT", exchange="MCX", interval="D", start_date=start, end_date=end)

# UO weights short (7), medium (14) and long (28) periods - bounded 0..100.
df["UO"] = ta.ultimate_oscillator(df["high"], df["low"], df["close"])

uo = df["UO"].iloc[-1]
print(df[["close", "UO"]].tail(5).round(2))
print(f"\nLatest Ultimate Oscillator: {uo:.1f}")
print("Zone:", "overbought (>70)" if uo > 70 else "oversold (<30)" if uo < 30 else "neutral (30-70)")
