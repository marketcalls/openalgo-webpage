# Variance and Time Series Forecast: dispersion now, projected value next.
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

# Variance measures how spread out prices are (the square of standard deviation).
df["VAR"] = ta.variance(df["close"], lookback=20)
# TSF projects the regression line one step ahead - a simple forecast of next value.
df["TSF"] = ta.tsf(df["close"], 14)

print(df[["close", "VAR", "TSF"]].tail(5).round(2))
print(f"\nLatest variance(20): {df['VAR'].iloc[-1]:,.2f}  (higher = wilder swings)")
print(f"Forecast for next bar (TSF): {df['TSF'].iloc[-1]:,.2f}")
print(f"Last actual close          : {df['close'].iloc[-1]:,.2f}")
