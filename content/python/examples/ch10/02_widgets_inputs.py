# Widgets: a text box for the symbol and a dropdown for the exchange.
# Launch it with:  streamlit run 02_widgets_inputs.py
import logging

import streamlit as st

logging.getLogger("streamlit.runtime.scriptrunner_utils.script_run_context").setLevel(logging.CRITICAL)
from streamlit.runtime.scriptrunner import get_script_run_ctx

LIVE = get_script_run_ctx() is not None


def app():
    st.title("Pick an instrument")
    # text_input returns whatever the user types; the second value is the default.
    symbol = st.text_input("Symbol", value="RELIANCE")
    # selectbox returns the chosen option from the list.
    exchange = st.selectbox("Exchange", ["NSE", "NFO", "MCX"])
    st.write(f"You selected **{symbol}** on **{exchange}**.")


if LIVE:
    app()
else:
    print("This is a Streamlit app. Run it with:  streamlit run 02_widgets_inputs.py")
    print("Widgets defined: text_input(Symbol) and selectbox(Exchange).")
    print("Default selection -> RELIANCE on NSE")
