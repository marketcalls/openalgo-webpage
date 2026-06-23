# MACD in its own pane: line, signal, and a coloured histogram. ta.macd returns a tuple.
import os
from datetime import datetime, timedelta
from pathlib import Path

import plotly.graph_objects as go
from openalgo import api, ta
from plotly.subplots import make_subplots

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=200)).strftime("%Y-%m-%d")
df = client.history(symbol="HDFCBANK", exchange="NSE", interval="D", start_date=start, end_date=end)
cat = df.index.strftime("%d %b")

macd_line, signal_line, hist = ta.macd(df["close"], fast_period=12, slow_period=26, signal_period=9)
colors = ["green" if v >= 0 else "red" for v in hist]

fig = make_subplots(rows=2, cols=1, shared_xaxes=True, row_heights=[0.65, 0.35],
                    vertical_spacing=0.04)
fig.add_trace(go.Scatter(x=cat, y=df["close"], name="Close"), row=1, col=1)
fig.add_trace(go.Bar(x=cat, y=hist, name="Histogram", marker_color=colors), row=2, col=1)
fig.add_trace(go.Scatter(x=cat, y=macd_line, name="MACD", line=dict(color="blue")), row=2, col=1)
fig.add_trace(go.Scatter(x=cat, y=signal_line, name="Signal", line=dict(color="orange")), row=2, col=1)
fig.update_layout(title="HDFCBANK with MACD pane")
fig.update_xaxes(type="category", nticks=12, tickangle=-45)

out = Path(__file__).with_suffix(".png")
fig.write_image(str(out), width=900, height=600)
print(f"Saved {out.name}")
