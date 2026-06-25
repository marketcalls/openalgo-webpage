import pandas as pd

df = pd.read_csv("reliance_6mo.csv", index_col="Date", parse_dates=True)

# Derive new columns from the OHLC - all vectorised, no loops.
df["Range"] = df["High"] - df["Low"]            # how far it travelled
df["Body"] = df["Close"] - df["Open"]           # net move, open to close
df["Return%"] = df["Close"].pct_change() * 100  # day-on-day return

up = (df["Close"] >= df["Open"]).sum()
down = (df["Close"] < df["Open"]).sum()
print(f"Trading days : {len(df)}")
print(f"Up days      : {up}")
print(f"Down days    : {down}")
print(f"Average range: {df['Range'].mean():.2f}")
print(f"Widest range : {df['Range'].max():.2f}  on {df['Range'].idxmax().date()}")
print()
print("Last 3 days (range, body, return):")
print(df[["Range", "Body", "Return%"]].tail(3).round(2))
