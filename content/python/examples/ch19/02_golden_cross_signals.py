# Turn the golden/death cross into dated entry and exit signals.
import os
from datetime import datetime, timedelta

import pandas as pd
from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=600)).strftime("%Y-%m-%d")
df = client.history(symbol="HDFCBANK", exchange="NSE", interval="D", start_date=start, end_date=end)

close = df["close"]
sma50, sma200 = ta.sma(close, 50), ta.sma(close, 200)

golden = pd.Series(ta.crossover(sma50, sma200), index=df.index)   # 50 crosses above 200 -> buy
death = pd.Series(ta.crossunder(sma50, sma200), index=df.index)   # 50 crosses below 200 -> exit

print("Golden crosses:", int(golden.sum()), "| Death crosses:", int(death.sum()))
events = pd.DataFrame({"close": close, "golden": golden, "death": death})
print(events[golden | death].tail(6))
