import pandas as pd

# Two small tables about the same stocks.
prices = pd.DataFrame({"Symbol": ["RELIANCE", "TCS", "INFY"],
                       "Close": [1313.6, 2109.0, 1056.6]})
sectors = pd.DataFrame({"Symbol": ["RELIANCE", "TCS", "WIPRO"],
                        "Sector": ["Energy", "IT", "IT"]})

# concat: stack tables on top of each other (they share the same columns).
more = pd.DataFrame({"Symbol": ["HDFCBANK"], "Close": [1642.4]})
print("concat - stack the rows:")
print(pd.concat([prices, more], ignore_index=True))
print()

# merge: join two tables on a shared key column, like a database JOIN.
joined = prices.merge(sectors, on="Symbol", how="inner")   # inner = keep only matches
print("merge on Symbol (inner):")
print(joined)
