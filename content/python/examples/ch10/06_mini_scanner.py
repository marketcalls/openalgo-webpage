# A mini scanner UI: pick an RSI threshold, list symbols trading below it (oversold).
# Launch it with:  streamlit run 06_mini_scanner.py
import logging
import os
from datetime import datetime, timedelta

import streamlit as st
from openalgo import api, ta

logging.getLogger("streamlit.runtime.scriptrunner_utils.script_run_context").setLevel(logging.CRITICAL)
from streamlit.runtime.scriptrunner import get_script_run_ctx

LIVE = get_script_run_ctx() is not None

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)
UNIVERSE = ["RELIANCE", "TCS", "INFY", "HDFCBANK", "ICICIBANK", "SBIN"]


def scan(threshold):
    end = datetime.now().strftime("%Y-%m-%d")
    start = (datetime.now() - timedelta(days=120)).strftime("%Y-%m-%d")
    hits = []
    for sym in UNIVERSE:
        df = client.history(symbol=sym, exchange="NSE", interval="D", start_date=start, end_date=end)
        rsi = ta.rsi(df["close"], 14).iloc[-1]
        if rsi < threshold:
            hits.append({"Symbol": sym, "RSI": round(float(rsi), 1)})
    return hits


def app():
    st.title("RSI oversold scanner")
    threshold = st.slider("RSI below", min_value=20, max_value=60, value=45)
    hits = scan(threshold)
    st.write(f"{len(hits)} symbol(s) under RSI {threshold}")
    st.table(hits)


if LIVE:
    app()
else:
    print("This is a Streamlit app. Run it with:  streamlit run 06_mini_scanner.py")
    hits = scan(45)
    print(f"{len(hits)} symbol(s) under RSI 45:", [h["Symbol"] for h in hits])
