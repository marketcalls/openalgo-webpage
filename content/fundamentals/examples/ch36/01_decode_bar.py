import pandas as pd

df = pd.read_csv("reliance_6mo.csv", index_col="Date", parse_dates=True)
bar = df.iloc[-1]                          # the most recent day's bar

print("Date  :", df.index[-1].date())
print("Open  :", bar["Open"])
print("High  :", bar["High"])
print("Low   :", bar["Low"])
print("Close :", bar["Close"])
print("Volume:", f"{int(bar['Volume']):,}")
print()
print("Range  (high - low)  :", round(bar["High"] - bar["Low"], 2))
print("Body   (close - open):", round(bar["Close"] - bar["Open"], 2))
print("Day    :", "UP" if bar["Close"] >= bar["Open"] else "DOWN")
