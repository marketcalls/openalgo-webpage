# A live quote board: one multiquotes() call fills a table of LTPs.
# Launch it with:  streamlit run 03_quote_board.py
import logging
import os

import streamlit as st
from openalgo import api

logging.getLogger("streamlit.runtime.scriptrunner_utils.script_run_context").setLevel(logging.CRITICAL)
from streamlit.runtime.scriptrunner import get_script_run_ctx

LIVE = get_script_run_ctx() is not None

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)
WATCHLIST = [{"symbol": s, "exchange": "NSE"} for s in ["RELIANCE", "TCS", "INFY", "HDFCBANK"]]


def fetch_board():
    results = client.multiquotes(symbols=WATCHLIST)["results"]
    return [{"Symbol": r["symbol"], "LTP": r["data"]["ltp"]} for r in results]


def app():
    st.title("Live quote board")
    st.table(fetch_board())


if LIVE:
    app()
else:
    print("This is a Streamlit app. Run it with:  streamlit run 03_quote_board.py")
    for row in fetch_board():
        print(f"{row['Symbol']:10s} {row['LTP']:>10.2f}")
