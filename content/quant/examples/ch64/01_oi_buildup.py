# Open-interest build-up: classify each day as longs building vs shorts building.
import os
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

LOT = 500  # RELIANCE lot size, so OI reads in lots
df = client.history(symbol="RELIANCE28JUL26FUT", exchange="NFO", interval="D",
                    start_date="2026-05-01", end_date="2026-06-28")
df["dprice"] = df["close"].diff()
df["doi"] = df["oi"].diff()


def classify(r):
    if r.dprice > 0 and r.doi > 0:
        return "Long build-up"
    if r.dprice < 0 and r.doi > 0:
        return "Short build-up"
    if r.dprice > 0 and r.doi < 0:
        return "Short covering"
    if r.dprice < 0 and r.doi < 0:
        return "Long unwinding"
    return "flat"


df["signal"] = df.apply(classify, axis=1)
recent = df.dropna().tail(12)

print(f"{'DATE':12s}{'CLOSE':>9s}{'dPRICE':>9s}{'OI(lots)':>11s}{'dOI%':>8s}  SIGNAL")
for ts, r in recent.iterrows():
    print(f"{ts.date()!s:12s}{r.close:>9.1f}{r.dprice:>9.1f}"
          f"{r.oi / LOT:>11,.0f}{r.doi / (r.oi - r.doi) * 100:>7.1f}%  {r.signal}")

counts = df["signal"].value_counts()
longs = int(counts.get("Long build-up", 0))
shorts = int(counts.get("Short build-up", 0))
print(f"\nOver {len(df.dropna())} sessions: {longs} long build-up days (price up, OI up) "
      f"vs {shorts} short build-up days (price down, OI up). Latest: {df['signal'].iloc[-1]}.")
