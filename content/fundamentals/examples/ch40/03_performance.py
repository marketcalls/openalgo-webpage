import pandas as pd

df = pd.read_csv("reliance_6mo.csv", index_col="Date", parse_dates=True)
close = df["Close"]
ret = close.pct_change().dropna()

# Win rate: how often the stock closed up, and by how much on average.
wins = (ret > 0).sum()
print(f"Up days     : {wins} of {len(ret)}  ({wins / len(ret) * 100:.1f}% win rate)")
print(f"Avg up day  : {ret[ret > 0].mean() * 100:+.2f}%")
print(f"Avg down day: {ret[ret < 0].mean() * 100:+.2f}%")
print()

# Maximum drawdown: the worst peak-to-trough fall along the way.
growth = (1 + ret).cumprod()
drawdown = (growth / growth.cummax() - 1) * 100
print(f"Maximum drawdown: {drawdown.min():.2f}%")
