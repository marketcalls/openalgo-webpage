# Expiry-week behaviour: discover the weekly expiry weekday, then test its returns.
import os
from datetime import datetime, timedelta

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

# Discover the weekday weekly options expire on -- never hard-code it.
expiries = client.expiry(symbol="NIFTY", exchange="NFO", instrumenttype="options")["data"]
near = [datetime.strptime(d, "%d-%b-%y") for d in expiries[:4]]
expiry_dow = max({d.weekday() for d in near}, key=[d.weekday() for d in near].count)
dow_name = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][expiry_dow]
print("Weekly NIFTY options expire on:", dow_name, f"(weekday {expiry_dow})")

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=900)).strftime("%Y-%m-%d")
df = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D", start_date=start, end_date=end)
df["ret"] = df["close"].pct_change() * 100

on_expiry = df.index.dayofweek == expiry_dow
print(f"\nAvg return on expiry day ({dow_name}) %:", round(df.loc[on_expiry, "ret"].mean(), 3))
print("Avg return on all other days       %:", round(df.loc[~on_expiry, "ret"].mean(), 3))
print("Expiry-day win rate                %:", round((df.loc[on_expiry, "ret"] > 0).mean() * 100, 1))
