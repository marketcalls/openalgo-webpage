# Money Flow Index (MFI): a volume-weighted RSI for overbought/oversold reads.
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=120)).strftime("%Y-%m-%d")
df = client.history(symbol="INFY", exchange="NSE", interval="D", start_date=start, end_date=end)

# MFI runs 0-100 like RSI, but weights each move by its volume.
df["MFI"] = ta.mfi(df["high"], df["low"], df["close"], df["volume"], period=14)

mfi = df["MFI"].iloc[-1]
zone = "OVERBOUGHT (>80)" if mfi > 80 else "OVERSOLD (<20)" if mfi < 20 else "neutral (20-80)"
print(df[["close", "volume", "MFI"]].tail(5).round(2))
print(f"\nLatest MFI: {mfi:.1f} -> {zone}")
print("Days overbought in window:", int((df["MFI"] > 80).sum()))
print("Days oversold in window  :", int((df["MFI"] < 20).sum()))
