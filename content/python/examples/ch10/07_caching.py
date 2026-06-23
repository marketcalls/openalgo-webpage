# st.cache_data remembers a function's result so repeat calls skip the network.
# Launch it with:  streamlit run 07_caching.py
import logging
import os
import time
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


@st.cache_data(ttl=60)  # cache the result for 60 seconds; identical calls reuse it.
def load_history(symbol, exchange):
    end = datetime.now().strftime("%Y-%m-%d")
    start = (datetime.now() - timedelta(days=60)).strftime("%Y-%m-%d")
    return client.history(symbol=symbol, exchange=exchange, interval="D",
                          start_date=start, end_date=end)


def app():
    st.title("Cached history loader")
    symbol = st.text_input("Symbol", "RELIANCE")
    df = load_history(symbol, "NSE")
    st.write(f"Loaded {len(df)} rows (re-runs are instant thanks to st.cache_data).")
    st.line_chart(df["close"])


if LIVE:
    app()
else:
    print("This is a Streamlit app. Run it with:  streamlit run 07_caching.py")
    t0 = time.time()
    load_history("RELIANCE", "NSE")
    first = time.time() - t0
    t0 = time.time()
    load_history("RELIANCE", "NSE")  # second call hits the cache
    second = time.time() - t0
    print(f"First call: {first:.3f}s | second (cached): {second:.3f}s")
