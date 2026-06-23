# A range slider lets you drag-zoom a date window, great for a NIFTY futures contract.
import os
from datetime import datetime, timedelta
from pathlib import Path

import plotly.graph_objects as go
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=90)).strftime("%Y-%m-%d")
df = client.history(symbol="NIFTY30JUN26FUT", exchange="NFO", interval="D", start_date=start, end_date=end)
cat = df.index.strftime("%d %b")

fig = go.Figure(go.Candlestick(x=cat, open=df["open"], high=df["high"],
                               low=df["low"], close=df["close"]))
# Turn the range slider ON (it is off in earlier examples).
fig.update_layout(title="NIFTY future with range slider", xaxis_rangeslider_visible=True)
fig.update_xaxes(type="category", nticks=12, tickangle=-45)

out = Path(__file__).with_suffix(".png")
fig.write_image(str(out), width=900, height=550)
print(f"Saved {out.name}")
