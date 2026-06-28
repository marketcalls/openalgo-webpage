# Expectation is the long-run average outcome. Let's measure a simple rule's expectancy.
import os
from datetime import datetime, timedelta

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=730)).strftime("%Y-%m-%d")
r = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                   start_date=start, end_date=end)["close"].pct_change().dropna() * 100

wins, losses = r[r > 0], r[r < 0]
win_rate = len(wins) / len(r)
avg_win, avg_loss = wins.mean(), losses.mean()
expectancy = win_rate * avg_win + (1 - win_rate) * avg_loss

print(f"Win rate    : {win_rate * 100:.1f}%")
print(f"Average win : +{avg_win:.2f}%")
print(f"Average loss: {avg_loss:.2f}%")
print(f"\nExpectancy  : {expectancy:+.3f}% per day  (probability-weighted average outcome)")
print(f"Actual mean : {r.mean():+.3f}% per day  (matches - expectancy IS the expected value)")
