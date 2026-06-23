# Export a fully interactive chart to a standalone .html file you can open in any browser.
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
df = client.history(symbol="ICICIBANK", exchange="NSE", interval="D", start_date=start, end_date=end)
cat = df.index.strftime("%d %b")

fig = go.Figure(go.Candlestick(x=cat, open=df["open"], high=df["high"],
                               low=df["low"], close=df["close"]))
fig.update_layout(title="ICICIBANK interactive export", xaxis_rangeslider_visible=False)
fig.update_xaxes(type="category", nticks=12, tickangle=-45)

# write_html makes a self-contained file: zoom, pan and hover all work offline.
html_out = Path(__file__).with_name("icicibank_chart.html")
fig.write_html(str(html_out))
print(f"Saved {html_out.name} ({html_out.stat().st_size // 1024} KB)")

# Also save a PNG so the portal can embed a preview.
png_out = Path(__file__).with_suffix(".png")
fig.write_image(str(png_out), width=900, height=500)
print(f"Saved {png_out.name}")
