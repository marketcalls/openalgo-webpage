# Two data sources: live from the broker ("api") or from stored history ("db").
import os
from datetime import datetime, timedelta

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")

df_api = client.history(symbol="SBIN", exchange="NSE", interval="D",
                        start_date=start, end_date=end, source="api")
print("From broker API:", len(df_api), "rows")

try:
    df_db = client.history(symbol="SBIN", exchange="NSE", interval="D",
                           start_date=start, end_date=end, source="db")
    print("From local DB  :", len(df_db), "rows")
except Exception as exc:
    print("Local DB source:", exc)
