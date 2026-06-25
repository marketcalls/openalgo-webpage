import pandas as pd

df = pd.read_csv("reliance_6mo.csv", index_col="Date", parse_dates=True)
close = df["Close"]

ret = close.pct_change()
print("Daily return, last 3 days (%):")
print((ret.tail(3) * 100).round(2))
print()

# Cumulative growth of 1 rupee held for the whole period (buy-and-hold).
growth = (1 + ret).cumprod()
total = (growth.iloc[-1] - 1) * 100
print(f"Buy-and-hold return : {total:+.2f}%")
print(f"Best day            : {ret.max() * 100:+.2f}%")
print(f"Worst day           : {ret.min() * 100:+.2f}%")
