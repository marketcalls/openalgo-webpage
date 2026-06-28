# The researcher's job: turn raw NIFTY prices into one tested signal and report its edge honestly.
import os
from datetime import datetime

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
df = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                    start_date="2015-01-01", end_date=end)

close = df["close"]
fast = ta.sma(close, 20)
slow = ta.sma(close, 100)

# Signal is known at today's close; the return it earns is tomorrow's. No look-ahead.
long_today = fast > slow
fwd = close.pct_change().shift(-1)
mask = fast.notna() & slow.notna() & fwd.notna()

fwd_m = fwd[mask]
long_rets = fwd_m[long_today[mask]]

hit, avg = (long_rets > 0).mean(), long_rets.mean()
base_hit, base_avg = (fwd_m > 0).mean(), fwd_m.mean()

print(f"NIFTY daily, {int(mask.sum())} test days {df.index[mask][0].date()} to {df.index[mask][-1].date()}")
print(f"Signal: 20/100 SMA cross, long when fast > slow ({len(long_rets)} days in market)")
print(f"  Next-day hit rate when long  : {hit:6.2%}   (baseline, all days {base_hit:.2%})")
print(f"  Avg next-day return when long: {avg:+.4%}   (baseline, all days {base_avg:+.4%})")
print(f"  Research edge: hit rate       {(hit - base_hit) * 100:+.2f} pp, "
      f"return {(avg - base_avg) * 1e4:+.1f} bps/day")
