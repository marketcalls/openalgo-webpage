# Calendar days are not trading days -- weekends and holidays drop out.
import os
from datetime import datetime, timedelta

from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

today = datetime.now()
for days in [7, 30, 90]:
    start = (today - timedelta(days=days)).strftime("%Y-%m-%d")
    df = client.history(symbol="INFY", exchange="NSE", interval="D",
                        start_date=start, end_date=today.strftime("%Y-%m-%d"))
    print(f"Last {days:>3} calendar days -> {len(df)} trading sessions")
