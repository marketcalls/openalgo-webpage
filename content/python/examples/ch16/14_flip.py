# flip: turn entry/exit signals into a continuous "are we in?" state.
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
df = client.history(symbol="RELIANCE", exchange="NSE", interval="D", start_date=start, end_date=end)

fast, slow = ta.ema(df["close"], 10), ta.ema(df["close"], 20)
buy = ta.crossover(fast, slow)
sell = ta.crossunder(fast, slow)

# flip turns ON at the first buy and stays ON until a sell flips it OFF.
# It converts two momentary signals into a holding state (1 = in position, 0 = flat).
in_position = ta.flip(buy, sell)
print("ta.flip returns a", type(in_position).__name__)

df["InPos"] = np.asarray(in_position).astype(int)
days_in = int(df["InPos"].sum())
print(f"\nBars held long: {days_in} out of {len(df)}")
print("Currently:", "HOLDING long" if df["InPos"].iloc[-1] else "FLAT")
print("\nLast 8 bars (1 = in position):")
print(df[["close", "InPos"]].tail(8).round(2))
