# Download an MCX commodity and save it to a CSV file for later use.
import os
from datetime import datetime, timedelta
from pathlib import Path

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=10)).strftime("%Y-%m-%d")

df = client.history(symbol="GOLDM03JUL26FUT", exchange="MCX", interval="15m", start_date=start, end_date=end)
print("Gold 15m candles:", len(df))

out = Path(__file__).with_name("goldm_15m.csv")
df.to_csv(out)
print("Saved to", out.name)
