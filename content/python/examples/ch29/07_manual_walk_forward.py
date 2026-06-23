# Walk-forward without VectorBT: plain pandas returns, so you see every moving part.
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)


def strat_return(c, f, s):
    # Hold long while fast EMA is above slow; earn the bar's return when in.
    pos = (ta.ema(c, f) > ta.ema(c, s)).astype(int).shift(1).fillna(0)
    daily = c.pct_change().fillna(0)
    equity = (1 + pos * daily).prod()                 # gross growth multiple
    return (equity - 1) * 100


end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=900)).strftime("%Y-%m-%d")
close = client.history(symbol="RELIANCE", exchange="NSE", interval="D",
                       start_date=start, end_date=end)["close"]

combos = [(f, s) for f in (10, 20) for s in (40, 50, 60) if f < s]
train_len, test_len, i, oos_total = 250, 100, 0, []
while i + train_len + test_len <= len(close):
    tr = close.iloc[i:i + train_len]
    te = close.iloc[i + train_len:i + train_len + test_len]
    best = max(combos, key=lambda cb: strat_return(tr, *cb))     # tune on train
    oos_total.append(strat_return(te, *best))                    # score on test
    print(f"window {i // test_len + 1}: tuned EMA {best[0]}/{best[1]} -> OOS {oos_total[-1]:6.2f} %")
    i += test_len

print(f"\nAverage out-of-sample return per window: {sum(oos_total) / len(oos_total):.2f} %")
print("This stitched out-of-sample record is the honest expectation -- not the in-sample dream.")
