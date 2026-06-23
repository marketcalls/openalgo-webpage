# Stochastic RSI: an oscillator OF an oscillator - extra sensitive timing.
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=150)).strftime("%Y-%m-%d")
df = client.history(symbol="ICICIBANK", exchange="NSE", interval="D", start_date=start, end_date=end)

# StochRSI returns a TUPLE (%K, %D), both bounded 0..100. It applies the Stochastic
# formula to RSI values, so it moves faster and hits extremes more often than RSI alone.
k, d = ta.stochrsi(df["close"])
df["StochRSI_K"] = k
df["StochRSI_D"] = d

kv, dv = df["StochRSI_K"].iloc[-1], df["StochRSI_D"].iloc[-1]
print(df[["close", "StochRSI_K", "StochRSI_D"]].tail(5).round(1))
print(f"\nLatest %K: {kv:.1f}   %D: {dv:.1f}")
print("Zone:", "overbought (>80)" if kv > 80 else "oversold (<20)" if kv < 20 else "neutral")
print("Short-term:", "%K above %D (bullish)" if kv > dv else "%K below %D (bearish)")
