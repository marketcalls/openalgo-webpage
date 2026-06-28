# Detect candidate bulk/block activity: days when traded volume dwarfs the local median.
import os
from datetime import datetime, timedelta

import pandas as pd
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

SYMBOL, EXCHANGE = "SBIN", "NSE"
end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=730)).strftime("%Y-%m-%d")
df = client.history(symbol=SYMBOL, exchange=EXCHANGE, interval="D",
                    start_date=start, end_date=end)

vol = df["volume"]
ret = df["close"].pct_change() * 100
med = vol.rolling(60, min_periods=30).median()      # a slow, participant-neutral baseline
mult = vol / med
flag = mult > 3.0                                    # a print 3x the usual = someone large showed up

flagged = pd.DataFrame({"volume_mn": (vol[flag] / 1e6).round(1),
                        "x_median": mult[flag].round(1),
                        "day_ret_pct": ret[flag].round(2)})

print(f"{SYMBOL} {EXCHANGE}: {len(df)} sessions, {int(flag.sum())} candidate bulk/block days "
      f"(volume > 3x 60-day median)\n")
print(flagged.tail(8).to_string())
top = mult[flag].idxmax()
print(f"\nHeaviest print: {top.date()} at {vol[top]/1e6:.1f}mn shares "
      f"({mult[top]:.1f}x median) on a {ret[top]:+.2f}% day")
