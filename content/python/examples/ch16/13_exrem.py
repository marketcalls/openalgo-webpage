# exrem: remove repeated signals so you act only on the FIRST one.
import os
from datetime import datetime, timedelta

import numpy as np
from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=250)).strftime("%Y-%m-%d")
df = client.history(symbol="SBIN", exchange="NSE", interval="D", start_date=start, end_date=end)

rsi = ta.rsi(df["close"], 14)
# Raw conditions fire on EVERY bar the rule is true - lots of duplicates.
raw_buy = ta.crossover(rsi, np.full(len(rsi), 30.0))   # RSI crossing up through 30
raw_sell = ta.crossunder(rsi, np.full(len(rsi), 70.0))  # RSI crossing down through 70

# exrem keeps the first buy, ignores further buys until a sell has occurred (and vice versa).
clean_buy = ta.exrem(raw_buy, raw_sell)
clean_sell = ta.exrem(raw_sell, raw_buy)

print(f"Raw buy signals   : {int(np.sum(raw_buy))}")
print(f"Cleaned buy signals: {int(np.sum(clean_buy))}  (duplicates removed)")
print(f"Raw sell signals   : {int(np.sum(raw_sell))}")
print(f"Cleaned sell signals: {int(np.sum(clean_sell))}")
print("\nexrem stops you from buying again while you are already 'in'.")
