# instruments() returns the full master contract list as a pandas DataFrame.
import os

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

df = client.instruments(exchange="NSE")
print("Total NSE instruments:", len(df))
print("Columns:", df.columns.tolist())
print(df[["symbol", "name", "lotsize"]].head())
