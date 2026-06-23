# Overlay a 20-day SMA and a 20-day EMA on the candles to see trend.
import os
from datetime import datetime, timedelta
from pathlib import Path

import plotly.graph_objects as go
from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=150)).strftime("%Y-%m-%d")
df = client.history(symbol="INFY", exchange="NSE", interval="D", start_date=start, end_date=end)
cat = df.index.strftime("%d %b")

df["SMA20"] = ta.sma(df["close"], 20)
df["EMA20"] = ta.ema(df["close"], 20)

fig = go.Figure()
fig.add_trace(go.Candlestick(x=cat, open=df["open"], high=df["high"],
                             low=df["low"], close=df["close"], name="Price"))
fig.add_trace(go.Scatter(x=cat, y=df["SMA20"], name="SMA 20", line=dict(color="orange")))
fig.add_trace(go.Scatter(x=cat, y=df["EMA20"], name="EMA 20", line=dict(color="blue")))
fig.update_layout(title="INFY with SMA and EMA", xaxis_rangeslider_visible=False)
fig.update_xaxes(type="category", nticks=12, tickangle=-45)

out = Path(__file__).with_suffix(".png")
fig.write_image(str(out), width=900, height=500)
print(f"Saved {out.name}")
