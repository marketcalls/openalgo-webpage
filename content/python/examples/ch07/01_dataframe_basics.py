# A DataFrame is a table; a Series is one of its columns. Meet both.
import os
from datetime import datetime, timedelta

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=40)).strftime("%Y-%m-%d")

df = client.history(symbol="RELIANCE", exchange="NSE", interval="D", start_date=start, end_date=end)

print("Type      :", type(df).__name__)        # DataFrame -- the whole table
print("Shape     :", df.shape)                  # (rows, columns)
print("Columns   :", df.columns.tolist())       # the column labels
print("Index name:", df.index.name)             # the timestamp index
print("\nFirst 3 rows:")
print(df.head(3))
