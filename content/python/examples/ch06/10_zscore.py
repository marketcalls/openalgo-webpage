# Z-score: how many standard deviations is today's price from its recent average?
import os
from datetime import datetime, timedelta

import numpy as np
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
start = (datetime.now() - timedelta(days=90)).strftime("%Y-%m-%d")
df = client.history(symbol="GOLDM03JUL26FUT", exchange="MCX", interval="D", start_date=start, end_date=end)

prices = df["close"].to_numpy()
mean, sd = prices.mean(), prices.std()

z = (prices - mean) / sd                # whole-array z-score in one vectorised line
print("Mean price:", round(mean, 2), " Std:", round(sd, 2))
print("Latest price:", round(prices[-1], 2), " z-score:", round(z[-1], 2))
print("Highest z (most stretched up)  :", round(z.max(), 2))
print("Lowest  z (most stretched down):", round(z.min(), 2))
# A |z| above ~2 means an unusually stretched price -- the seed of a mean-reversion idea.
print("Days with |z| > 2:", int((np.abs(z) > 2).sum()))
