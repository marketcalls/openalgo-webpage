# Your first Streamlit app: a title, some text, and a metric tile.
# Launch it with:  streamlit run 01_hello_dashboard.py
import logging

import streamlit as st

# Silence the harmless "missing ScriptRunContext" notice when run with plain python.
logging.getLogger("streamlit.runtime.scriptrunner_utils.script_run_context").setLevel(logging.CRITICAL)
from streamlit.runtime.scriptrunner import get_script_run_ctx

LIVE = get_script_run_ctx() is not None  # True only under `streamlit run`


def app():
    st.title("My Trading Desk")
    st.write("Welcome. This dashboard is built with Streamlit and OpenAlgo.")
    st.metric(label="Watchlist size", value=4)
    st.caption("Quote of the day: plan the trade, trade the plan.")


if LIVE:
    app()
else:
    print("This is a Streamlit app. Run it with:  streamlit run 01_hello_dashboard.py")
    print("Dashboard defined: title 'My Trading Desk' with one metric tile.")
