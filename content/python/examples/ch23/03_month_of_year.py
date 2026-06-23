# Month-of-year seasonality: roll daily returns up into a return for each month.
import os
from datetime import datetime, timedelta

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=900)).strftime("%Y-%m-%d")
df = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D", start_date=start, end_date=end)

# Resample to month-end and compute each calendar month's total return (%).
monthly = df["close"].resample("ME").last().pct_change() * 100
# Group those monthly returns by their month number (1..12) and average.
names = {1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun",
         7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec"}
by_month = monthly.groupby(monthly.index.month).mean()
by_month.index = by_month.index.map(names)

print("Average NIFTY return by calendar month (%):")
print(by_month.round(2))
print("\nHistorically strongest month:", by_month.idxmax())
print("Historically weakest month:  ", by_month.idxmin())
