# ACF and PACF: the diagnostic that reveals how little structure returns carry.
import os
from datetime import datetime
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns
from openalgo import api
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
r = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                   start_date="2021-01-01", end_date=end)["close"].pct_change().dropna()

sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(1, 2, figsize=(10, 4))
plot_acf(r, lags=20, ax=ax[0], color="#7c83ff", vlines_kwargs={"colors": "#7c83ff"})
ax[0].set_title("ACF of returns - bars inside the band = no memory")
plot_pacf(r, lags=20, ax=ax[1], method="ywm", color="#16a34a", vlines_kwargs={"colors": "#16a34a"})
ax[1].set_title("PACF of returns - almost no usable structure")

fig.tight_layout()
out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
inside = (abs(r.autocorr(1)) < 2 / len(r) ** 0.5)
print(f"Lag-1 autocorrelation {r.autocorr(1):.3f} (inside 95% band: {inside}). Returns are near white noise. Saved {out.name}")
