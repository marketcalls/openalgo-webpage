# DMI directional lines + Williams Fractals turning points.
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

# DMI returns a TUPLE (+DI, -DI) - the directional half of the ADX system.
di_plus, di_minus = ta.dmi(df["high"], df["low"], df["close"], period=14)
df["DI+"], df["DI-"] = di_plus, di_minus

# Fractals return a TUPLE of two BOOLEAN Series marking local tops and bottoms.
frac_up, frac_down = ta.fractals(df["high"], df["low"], periods=2)
df["FracUp"], df["FracDown"] = frac_up, frac_down

print(df[["close", "DI+", "DI-"]].tail(3).round(1))
print("Direction:", "bullish (+DI > -DI)" if df["DI+"].iloc[-1] > df["DI-"].iloc[-1] else "bearish (-DI > +DI)")
print(f"\nUp-fractals (swing highs) found: {int(df['FracUp'].sum())}")
print(f"Down-fractals (swing lows) found: {int(df['FracDown'].sum())}")
print("Last swing-high price:", round(df.loc[df["FracUp"], "high"].iloc[-1], 2))
