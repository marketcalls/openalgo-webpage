# A basic interactive candlestick chart with Plotly, saved as a PNG.
# A CATEGORY x-axis spaces candles evenly, so weekends/holidays leave no gaps.
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
df = client.history(symbol="RELIANCE", exchange="NSE", interval="D", start_date=start, end_date=end)
cat = df.index.strftime("%d %b")  # use dates as categories, not a time axis

fig = go.Figure(go.Candlestick(x=cat, open=df["open"], high=df["high"],
                               low=df["low"], close=df["close"]))
fig.update_layout(title="RELIANCE daily candles", xaxis_rangeslider_visible=False)
fig.update_xaxes(type="category", nticks=12, tickangle=-45)

out = Path(__file__).with_suffix(".png")
fig.write_image(str(out), width=900, height=500)
print(f"Plotted {len(df)} candles")
print(f"Saved {out.name}")
