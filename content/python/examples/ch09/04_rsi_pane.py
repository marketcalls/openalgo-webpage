# Price on top, a dedicated RSI pane below with 70/30 reference lines.
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
start = (datetime.now() - timedelta(days=150)).strftime("%Y-%m-%d")
df = client.history(symbol="TCS", exchange="NSE", interval="D", start_date=start, end_date=end)
df["RSI"] = ta.rsi(df["close"], 14)
cat = df.index.strftime("%d %b")

fig = make_subplots(rows=2, cols=1, shared_xaxes=True, row_heights=[0.7, 0.3],
                    vertical_spacing=0.04)
fig.add_trace(go.Candlestick(x=cat, open=df["open"], high=df["high"],
                             low=df["low"], close=df["close"], name="Price"), row=1, col=1)
fig.add_trace(go.Scatter(x=cat, y=df["RSI"], name="RSI 14", line=dict(color="purple")), row=2, col=1)
fig.add_hline(y=70, line_dash="dash", line_color="red", row=2, col=1)
fig.add_hline(y=30, line_dash="dash", line_color="green", row=2, col=1)
fig.update_layout(title="TCS price with RSI pane", xaxis_rangeslider_visible=False)
fig.update_xaxes(type="category", nticks=12, tickangle=-45)

out = Path(__file__).with_suffix(".png")
fig.write_image(str(out), width=900, height=600)
print(f"Saved {out.name}")
