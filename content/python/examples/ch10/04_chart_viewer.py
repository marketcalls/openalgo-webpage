# Embed a chart: st.line_chart draws the closing-price history of any symbol.
# Launch it with:  streamlit run 04_chart_viewer.py
import logging
import os
from datetime import datetime, timedelta

import streamlit as st
from openalgo import api

logging.getLogger("streamlit.runtime.scriptrunner_utils.script_run_context").setLevel(logging.CRITICAL)
from streamlit.runtime.scriptrunner import get_script_run_ctx

LIVE = get_script_run_ctx() is not None

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)


def load(symbol, exchange):
    end = datetime.now().strftime("%Y-%m-%d")
    start = (datetime.now() - timedelta(days=90)).strftime("%Y-%m-%d")
    return client.history(symbol=symbol, exchange=exchange, interval="D",
                          start_date=start, end_date=end)


def app():
    st.title("Chart viewer")
    symbol = st.text_input("Symbol", "SBIN")
    df = load(symbol, "NSE")
    st.line_chart(df["close"])  # Streamlit draws an interactive line chart from a Series.


if LIVE:
    app()
else:
    print("This is a Streamlit app. Run it with:  streamlit run 04_chart_viewer.py")
    df = load("SBIN", "NSE")
    print(f"Loaded {len(df)} closes for SBIN; latest close = {df['close'].iloc[-1]:.2f}")
