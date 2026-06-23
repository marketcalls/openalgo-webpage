# Turn the opening range into an actual breakout signal for the latest session.
import os
from datetime import datetime, timedelta

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=10)).strftime("%Y-%m-%d")
df = client.history(symbol="RELIANCE", exchange="NSE", interval="5m", start_date=start, end_date=end)

# Take the most recent session only.
last_date = df.index.normalize()[-1]
day = df[df.index.normalize() == last_date]

opening = day.between_time("09:15", "09:29")
or_high, or_low = opening["high"].max(), opening["low"].min()

# After the opening range, look for the first bar that breaks out.
after = day.between_time("09:30", "15:15")
longs = after[after["close"] > or_high]
shorts = after[after["close"] < or_low]

print(f"Session {last_date.date()}  range {or_low:.1f} - {or_high:.1f}")
if not longs.empty:
    t = longs.index[0]
    print(f"LONG breakout at {t.strftime('%H:%M')} close {longs['close'].iloc[0]:.1f}")
elif not shorts.empty:
    t = shorts.index[0]
    print(f"SHORT breakout at {t.strftime('%H:%M')} close {shorts['close'].iloc[0]:.1f}")
else:
    print("No breakout today -- price stayed inside the opening range (a quiet day).")
