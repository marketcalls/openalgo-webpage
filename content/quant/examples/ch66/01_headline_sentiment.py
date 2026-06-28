# Score illustrative Indian-market headlines with a tiny lexicon, then join to the real same-day NIFTY return.
import os
from datetime import datetime

import numpy as np
import pandas as pd
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

# A minimal sentiment lexicon (the core of any bag-of-words NLP signal).
POS = {"surge", "beat", "rally", "gains", "strong", "cheer", "climb", "lifts",
       "upgrade", "inflows", "tops", "steady", "record", "buying", "optimism"}
NEG = {"plunge", "selloff", "weak", "slump", "hits", "cut", "fall", "miss",
       "downgrade", "fear", "outflows", "crash", "loss", "concern", "deepens"}

# Illustrative headlines, each tagged with a real trading date (the text is constructed for teaching).
HEADLINES = [
    ("2026-02-02", "RBI holds rates steady, signals strong growth; markets cheer"),
    ("2026-03-17", "FII inflows surge as rupee firms, banks rally on buying"),
    ("2026-04-07", "Earnings beat lifts IT majors, broad buying returns"),
    ("2026-05-12", "Global selloff deepens, weak monsoon fear hits sentiment, markets plunge"),
    ("2026-06-02", "Auto sales miss, profit booking caps gains, indices slump"),
    ("2026-06-24", "GDP tops estimates, demand outlook strong, indices climb"),
]


def score(text):
    tokens = "".join(ch.lower() if ch.isalnum() else " " for ch in text).split()
    pos = sum(t in POS for t in tokens)
    neg = sum(t in NEG for t in tokens)
    return (pos - neg) / max(pos + neg, 1)  # normalised to roughly [-1, +1]


# Real same-day NIFTY returns to provide price context for each dated headline.
end = datetime.now().strftime("%Y-%m-%d")
close = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                       start_date="2026-01-01", end_date=end)["close"]
ret = close.pct_change() * 100
ret.index = ret.index.strftime("%Y-%m-%d")

rows = []
print(f"{'date':<12}{'sentiment':>10}  {'NIFTY %':>8}  headline")
for date, text in HEADLINES:
    s = score(text)
    rmove = ret.get(date, np.nan)
    rows.append((s, rmove))
    print(f"{date:<12}{s:>+10.2f}  {rmove:>+8.2f}  {text[:54]}")

df = pd.DataFrame(rows, columns=["sent", "ret"]).dropna()
corr = df["sent"].corr(df["ret"])
print(f"\nToy sentiment-vs-same-day-return correlation over {len(df)} headlines: {corr:+.2f} "
      f"(real signals need thousands of dated items, not six).")
