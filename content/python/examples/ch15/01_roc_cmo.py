# ROC vs CMO: an UNBOUNDED oscillator next to a BOUNDED one.
import os
from datetime import datetime, timedelta

import numpy as np
from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=120)).strftime("%Y-%m-%d")
df = client.history(symbol="RELIANCE", exchange="NSE", interval="D", start_date=start, end_date=end)

# ROC (Rate of Change) returns a NUMPY ARRAY - it has no fixed ceiling.
roc = ta.roc(df["close"], 12)
print("ta.roc returns a", type(roc).__name__)

# CMO (Chande Momentum Oscillator) returns a SERIES bounded between -100 and +100.
df["CMO"] = ta.cmo(df["close"], 14)
print("ta.cmo returns a", type(df["CMO"]).__name__)

print(f"\nLatest ROC(12): {float(np.asarray(roc)[-1]):+.2f}%   (unbounded - just a % change)")
print(f"Latest CMO(14): {df['CMO'].iloc[-1]:+.2f}     (bounded -100..+100)")
print("CMO zone:", "overbought (>50)" if df["CMO"].iloc[-1] > 50
      else "oversold (<-50)" if df["CMO"].iloc[-1] < -50 else "neutral")
