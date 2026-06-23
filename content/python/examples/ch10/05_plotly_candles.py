# Embed a Plotly candlestick chart inside Streamlit with st.plotly_chart.
# Launch it with:  streamlit run 05_plotly_candles.py
import logging
import os
from datetime import datetime, timedelta

import plotly.graph_objects as go
import streamlit as st
from openalgo import api

logging.getLogger("streamlit.runtime.scriptrunner_utils.script_run_context").setLevel(logging.CRITICAL)
from streamlit.runtime.scriptrunner import get_script_run_ctx

LIVE = get_script_run_ctx() is not None

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)


def build_fig(symbol, exchange):
    end = datetime.now().strftime("%Y-%m-%d")
    start = (datetime.now() - timedelta(days=90)).strftime("%Y-%m-%d")
    df = client.history(symbol=symbol, exchange=exchange, interval="D",
                        start_date=start, end_date=end)
    fig = go.Figure(go.Candlestick(x=df.index, open=df["open"], high=df["high"],
                                   low=df["low"], close=df["close"]))
    fig.update_layout(title=f"{symbol} daily", xaxis_rangeslider_visible=False)
    return fig, len(df)


def app():
    st.title("Plotly candles in Streamlit")
    symbol = st.text_input("NFO future", "NIFTY30JUN26FUT")
    fig, _ = build_fig(symbol, "NFO")
    st.plotly_chart(fig, use_container_width=True)


if LIVE:
    app()
else:
    print("This is a Streamlit app. Run it with:  streamlit run 05_plotly_candles.py")
    _, n = build_fig("NIFTY30JUN26FUT", "NFO")
    print(f"Built a Plotly candlestick figure with {n} candles for NIFTY30JUN26FUT")
