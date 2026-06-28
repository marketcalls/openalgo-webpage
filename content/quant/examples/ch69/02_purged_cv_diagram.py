# Purged k-fold CV over a real NIFTY timeline: train, purge, embargo and test blocks.
import os
from datetime import datetime
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.patches as mpatches
import matplotlib.pyplot as plt
import seaborn as sns
from openalgo import api

client = api(
    api_key=os.getenv("OPENALGO_API_KEY", "your_api_key_here"),
    host=os.getenv("OPENALGO_HOST", "http://127.0.0.1:5000"),
)

end = datetime.now().strftime("%Y-%m-%d")
idx = client.history(symbol="NIFTY", exchange="NSE_INDEX", interval="D",
                     start_date="2018-01-01", end_date=end).index
n = len(idx)                       # real number of trading bars on the time axis
k = 5                              # folds
purge = max(3, n // 60)            # bars dropped each side of test (label overlap)
embargo = max(2, n // 90)          # extra bars frozen right after the test block
size = n // k

cols = {"train": "#16a34a", "purge": "#e0852b", "embargo": "#9a9a9a", "test": "#7c83ff"}
sns.set_theme(style="whitegrid")
fig, ax = plt.subplots(figsize=(8.5, 4.6))

for f in range(k):
    y, ts, te = f, f * size, (f + 1) * size if f < k - 1 else n
    spans = {c: [] for c in cols}
    pl, pr = max(0, ts - purge), min(n, te + purge)        # purge bands hug the test block
    emb = min(n, pr + embargo)                              # embargo follows the right purge
    spans["test"].append((ts, te - ts))
    if ts > pl: spans["purge"].append((pl, ts - pl))
    if pr > te: spans["purge"].append((te, pr - te))
    if emb > pr: spans["embargo"].append((pr, emb - pr))
    if pl > 0: spans["train"].append((0, pl))              # remaining history is train
    if n > emb: spans["train"].append((emb, n - emb))
    for c in ("train", "purge", "embargo", "test"):
        ax.broken_barh(spans[c], (y - 0.4, 0.8), facecolors=cols[c], edgecolor="white", lw=0.4)

ax.set_yticks(range(k)); ax.set_yticklabels([f"fold {i + 1}" for i in range(k)])
ax.set_xlabel(f"trading bar index ({idx[0].date()} to {idx[-1].date()})")
ax.set_title("Purged k-fold cross-validation: test slides, purge and embargo seal the leak")
ax.invert_yaxis()
ax.legend(handles=[mpatches.Patch(color=v, label=lab) for lab, v in
                   [("train", cols["train"]), ("purge", cols["purge"]),
                    ("embargo", cols["embargo"]), ("test", cols["test"])]],
          loc="upper center", bbox_to_anchor=(0.5, -0.16), ncol=4, frameon=False)

out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"Purged {k}-fold over {n} NIFTY bars: test {size}, purge {purge}/side, embargo {embargo}. Saved {out.name}")
