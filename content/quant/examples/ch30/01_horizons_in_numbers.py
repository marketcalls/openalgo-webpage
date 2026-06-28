# Horizons in numbers: typical move size and signal frequency at minute vs day scale.
import os
from datetime import datetime, timedelta

import numpy as np
from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
SYM, EXCH = "NIFTY", "NSE_INDEX"


def horizon(interval, start):
    df = client.history(symbol=SYM, exchange=EXCH, interval=interval,
                        start_date=start, end_date=end)
    c = df["close"]
    r = np.log(c / c.shift(1)).dropna()
    move_bps = r.abs().median() * 1e4                          # typical move per bar (bps)
    rng_bps = ((df["high"] - df["low"]) / c).median() * 1e4    # typical bar range (bps)
    sig = np.sign(ta.ema(c, 9) - ta.ema(c, 21))                # a simple trend signal
    sig = sig[~np.isnan(sig)]
    flips = int((np.diff(sig) != 0).sum())                     # crossover signals fired
    n_days = df.index.normalize().nunique()
    bars_per_day = len(df) / n_days
    sig_per_day = flips / n_days
    hold_bars = len(df) / flips                                # avg bars held per trade
    return dict(move_bps=move_bps, rng_bps=rng_bps, std=r.std(),
                bars_per_day=bars_per_day, sig_per_day=sig_per_day, hold_bars=hold_bars)


m = horizon("1m", (datetime.now() - timedelta(days=20)).strftime("%Y-%m-%d"))
d = horizon("D", "2021-01-01")

print(f"NIFTY horizons in numbers\n{'-' * 58}")
print(f"{'':12}{'minute bar':>14}{'daily bar':>14}")
print(f"{'typ move':12}{m['move_bps']:>11.1f} bps{d['move_bps'] / 100:>11.2f} %")
print(f"{'typ range':12}{m['rng_bps']:>11.1f} bps{d['rng_bps'] / 100:>11.2f} %")
print(f"{'bars/day':12}{m['bars_per_day']:>14.0f}{d['bars_per_day']:>14.0f}")
print(f"{'signals/day':12}{m['sig_per_day']:>14.2f}{d['sig_per_day']:>14.3f}")
print(f"{'~hold/trade':12}{m['hold_bars']:>9.0f} min{d['hold_bars']:>10.0f} days")

ratio = d["std"] / m["std"]
print(f"{'-' * 58}\nDaily vol is {ratio:.0f}x minute vol (sqrt(375) rule says {np.sqrt(375):.0f}x).")
print(f"Minute scale: tiny ~{m['move_bps']:.1f} bps moves, ~{m['bars_per_day']:.0f} a day - "
      f"the high-frequency end (HFT goes finer still, sub-second).")
print(f"Day scale: a fat ~{d['move_bps'] / 100:.2f} % move once a day, signal flips every "
      f"~{d['hold_bars']:.0f} days - the systematic end.")
