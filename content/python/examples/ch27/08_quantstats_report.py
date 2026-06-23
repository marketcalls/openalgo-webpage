# A full QuantStats metrics report - strategy vs NIFTY - saved to a text file.
import datetime
import os
import sys
from pathlib import Path

try:
    sys.stdout.reconfigure(encoding="utf-8")   # report uses a few unicode symbols
except Exception:
    pass

import quantstats as qs
import vectorbt as vbt
from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.date.today()
start = end - datetime.timedelta(days=400)
df = client.history(symbol="ICICIBANK", exchange="NSE", interval="D",
                    start_date=str(start), end_date=str(end))
close = df["close"].astype(float)
fast, slow = ta.ema(close, 10), ta.ema(close, 30)
entries = (fast > slow) & (fast.shift(1) <= slow.shift(1))
exits = (fast < slow) & (fast.shift(1) >= slow.shift(1))
pf = vbt.Portfolio.from_signals(close, entries, exits,
                                init_cash=100000, fees=0.001, slippage=0.0005, freq="1D")
rets = pf.returns()
nifty = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                       start_date=str(start), end_date=str(end))
bench = nifty["close"].astype(float).pct_change().fillna(0).reindex(rets.index).fillna(0)

# display=False returns a tidy DataFrame (Strategy vs Benchmark) we can print/save.
report = qs.reports.metrics(rets, benchmark=bench, mode="basic", display=False)
report.index = [str(i).replace("﹪", "%") for i in report.index]   # tidy labels

# Print a curated set of headline rows (Strategy column) for a quick read.
for row in ["Cumulative Return", "CAGR%", "Sharpe", "Sortino",
            "Max Drawdown", "Win Rate", "Profit Factor"]:
    if row in report.index:
        print(f"{row:18s}: {report.loc[row, 'Strategy']}")

# Save the FULL strategy-vs-benchmark table to a UTF-8 text file.
out = Path(__file__).with_name("metrics_report.txt")
out.write_text(report.to_string(), encoding="utf-8")
print(f"\nFull strategy-vs-NIFTY report saved to {out.name}")
