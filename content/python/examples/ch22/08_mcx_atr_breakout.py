# The same volatility toolkit on a commodity: an ATR breakout on MCX gold.
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=300)).strftime("%Y-%m-%d")
# GOLDM = the mini gold future on MCX, a popular commodity for volatility strategies.
df = client.history(symbol="GOLDM03JUL26FUT", exchange="MCX", interval="D", start_date=start, end_date=end)

df["atr"] = ta.atr(df["high"], df["low"], df["close"], period=14)
df["trigger"] = df["close"].shift(1) + 1.5 * df["atr"].shift(1)
df["breakout"] = df["close"] > df["trigger"]

last = df.iloc[-1]
print(f"GOLDM close {last['close']:.0f}   ATR {last['atr']:.0f}   ({last['atr'] / last['close'] * 100:.2f}% of price)")
print("Breakout days in window:", int(df["breakout"].sum()))
print(df[df["breakout"]][["close", "trigger"]].dropna().tail(4).round(0))
print("\nCommodities like gold and crude carry their own volatility -- ATR adapts automatically.")
