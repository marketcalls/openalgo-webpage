# Decision tree: classify a retail algo as white-box or black-box from yes/no facts.
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns
from matplotlib.patches import FancyBboxPatch

sns.set_theme(style="whitegrid")

# --- the algo we are classifying, described by a few yes/no facts ---
algo = {
    "name": "9/21 EMA crossover bot",
    "logic_disclosed": True,    # the user can read the full rule set
    "output_replicable": True,  # same inputs -> same orders, every time
}

def classify(a):
    if not a["logic_disclosed"]:
        return "BLACK BOX", "logic not disclosed to the user"
    if not a["output_replicable"]:
        return "BLACK BOX", "output not replicable from the logic"
    return "WHITE BOX", "logic disclosed and replicable"

label, reason = classify(algo)
disclosed, replicable = algo["logic_disclosed"], algo["output_replicable"]

GREEN, RED, PURPLE, GREY = "#16a34a", "#dc2626", "#7c83ff", "#b8b8b8"

def box(ax, xy, w, h, text, edge, face="#ffffff", lw=1.7, fs=10):
    ax.add_patch(FancyBboxPatch((xy[0] - w / 2, xy[1] - h / 2), w, h,
                 boxstyle="round,pad=0.01,rounding_size=0.04",
                 fc=face, ec=edge, lw=lw))
    ax.text(xy[0], xy[1], text, ha="center", va="center", fontsize=fs, color="#1a1a1a")

def arrow(ax, src, dst, text, active):
    col = GREEN if active else GREY
    ax.annotate("", xy=dst, xytext=src,
                arrowprops=dict(arrowstyle="-|>", color=col, lw=2.6 if active else 1.2))
    mx, my = (src[0] + dst[0]) / 2, (src[1] + dst[1]) / 2
    ax.text(mx, my, text, ha="center", va="center", fontsize=9, color=col,
            fontweight="bold", bbox=dict(boxstyle="round", fc="white", ec="none"))

fig, ax = plt.subplots(figsize=(9, 5.6))
ax.set_xlim(0, 1); ax.set_ylim(0, 1); ax.axis("off"); ax.grid(False)

q1, q2 = (0.5, 0.85), (0.5, 0.52)
bb, wb = (0.22, 0.17), (0.78, 0.17)
box(ax, q1, 0.46, 0.14, "Is the strategy logic\nfully DISCLOSED to you?", PURPLE)
box(ax, q2, 0.46, 0.14, "Same inputs -> same orders?\n(output REPLICABLE?)", PURPLE)
box(ax, bb, 0.30, 0.16, "BLACK BOX\nbroker registers it,\nstrategy documented",
    RED, face="#fdecec" if label == "BLACK BOX" else "#ffffff",
    lw=2.4 if label == "BLACK BOX" else 1.4)
box(ax, wb, 0.30, 0.16, "WHITE BOX\nstandard unique\nalgo ID", GREEN,
    face="#eafaf0" if label == "WHITE BOX" else "#ffffff",
    lw=2.4 if label == "WHITE BOX" else 1.4)

arrow(ax, (0.34, 0.81), (0.27, 0.25), "no", not disclosed)
arrow(ax, q1, q2, "yes", disclosed)
arrow(ax, (0.40, 0.46), (0.27, 0.25), "no", disclosed and not replicable)
arrow(ax, (0.62, 0.47), (0.73, 0.25), "yes", disclosed and replicable)

ax.set_title(f"White-box vs black-box: '{algo['name']}' -> {label}", fontsize=13)
fig.tight_layout()
out = Path(__file__).with_suffix(".png")
plt.savefig(out, dpi=110, bbox_inches="tight")
print(f"Classified '{algo['name']}' as {label} ({reason}). Saved {out.name}")
