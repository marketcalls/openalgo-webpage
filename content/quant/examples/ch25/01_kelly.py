# The Kelly criterion: the bet size that maximises long-run growth - and the cliff beyond it.
import os
from datetime import datetime

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
r = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                   start_date="2021-01-01", end_date=end)["close"].pct_change().dropna()

# For a return stream, the growth-optimal (Kelly) leverage is roughly mean / variance.
kelly_lev = r.mean() / r.var()
print(f"Nifty daily edge: mean {r.mean() * 100:.3f}%, vol {r.std() * 100:.2f}%")
print(f"Growth-optimal (full Kelly) leverage: {kelly_lev:.1f}x\n")

print(f"{'BET SIZE':>16s}{'FINAL WEALTH (x)':>18s}")
for mult in [0.25, 0.5, 1.0, 1.5, 2.0, 3.0]:
    final = (1 + kelly_lev * mult * r).prod()
    label = {0.5: " (half Kelly)", 1.0: " (full Kelly)"}.get(mult, "")
    print(f"{str(round(mult, 2)) + 'x Kelly' + label:>16s}{final:>18.2f}")

print("\nGrowth peaks near FULL Kelly, then collapses - over-betting destroys wealth even with an edge.")
