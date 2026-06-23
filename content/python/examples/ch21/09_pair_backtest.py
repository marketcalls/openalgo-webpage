# Backtest the z-score pair trade on the ICICIBANK leg with VectorBT.
import os
import time
from datetime import datetime, timedelta

import pandas as pd

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=400)).strftime("%Y-%m-%d")


def closes(symbol):
    for _ in range(3):
        df = client.history(symbol=symbol, exchange="NSE", interval="D",
                            start_date=start, end_date=end)
        if isinstance(df, pd.DataFrame) and "close" in df:
            return df["close"]
        time.sleep(1)
    raise RuntimeError(f"Could not fetch history for {symbol}: {df}")


pair = pd.DataFrame({"ICICIBANK": closes("ICICIBANK"), "HDFCBANK": closes("HDFCBANK")}).dropna()
pair["ratio"] = pair["ICICIBANK"] / pair["HDFCBANK"]
pair["z"] = (pair["ratio"] - pair["ratio"].rolling(30).mean()) / pair["ratio"].rolling(30).std()

# We trade only the ICICIBANK leg here to keep the demo simple; a real pair trade also
# shorts HDFCBANK, but the z-score signal is identical. z<-2: cheap -> long, exit near 0.
# z>+2: rich -> short, cover near 0.
long_entries = pair["z"] < -2
long_exits = pair["z"] > -0.5
short_entries = pair["z"] > 2
short_exits = pair["z"] < 0.5

import vectorbt as vbt

pf = vbt.Portfolio.from_signals(pair["ICICIBANK"], entries=long_entries, exits=long_exits,
                                short_entries=short_entries, short_exits=short_exits,
                                init_cash=200000, fees=0.001, freq="1D")
print("Z-score reversion on ICICIBANK leg (entry |z|>2, exit near 0)")
print("Trades       :", int(pf.trades.count()))
print("Total return :", round(float(pf.total_return()) * 100, 2), "%")
print("\nMarket-neutral: the matching HDFCBANK short leg would cancel most market risk,")
print("so you profit from the SPREAD closing -- not from the market's direction.")
