# PPO: MACD expressed as a PERCENTAGE, so you can compare across symbols.
import os
from datetime import datetime, timedelta

from openalgo import api, ta

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=150)).strftime("%Y-%m-%d")
df = client.history(symbol="BANKNIFTY30JUN26FUT", exchange="NFO", interval="D", start_date=start, end_date=end)

# PPO returns a TUPLE: (ppo_line, signal_line, histogram). Values are percentages.
ppo_line, signal_line, histogram = ta.ppo(df["close"])
df["PPO"] = ppo_line
df["PPO_Signal"] = signal_line
df["PPO_Hist"] = histogram

print(df[["close", "PPO", "PPO_Signal", "PPO_Hist"]].tail(5).round(3))
print(f"\nLatest PPO: {df['PPO'].iloc[-1]:+.3f}%   Signal: {df['PPO_Signal'].iloc[-1]:+.3f}%")
print("Momentum:", "bullish (PPO above signal)" if df["PPO"].iloc[-1] > df["PPO_Signal"].iloc[-1]
      else "bearish (PPO below signal)")
