from math import comb
import itertools

# Load the price panel once from the cached DuckDB.
px = closes(UNIVERSE, start="2016-01-01", end="2026-06-26")
print("panel:", px.shape, "|", px.index.min().date(), "->", px.index.max().date())

# Stage 1: candidate pairs come ONLY from within a sector (the economic prior).
CAND = []
for sec, names in SECTORS.items():
    names = [s for s in names if s in px.columns]
    for a, b in itertools.combinations(names, 2):
        CAND.append((a, b))

per_sector = pd.Series({sec: comb(len([s for s in names if s in px.columns]), 2)
                        for sec, names in SECTORS.items()})
per_sector = per_sector[per_sector > 0].sort_values(ascending=False)

full_universe = comb(px.shape[1], 2)
print(f"Blind scan would test C({px.shape[1]},2) = {full_universe} pairs.")
print(f"Same-sector prior tests only {len(CAND)} pairs "
      f"({100*len(CAND)/full_universe:.1f}% of the blind universe).")
print(f"At p<0.05, expected pure-chance 'winners':  blind ~ {0.05*full_universe:.0f},  "
      f"prior ~ {0.05*len(CAND):.0f}.")

fig, ax = plt.subplots(figsize=(11, 4.8))
sns.barplot(x=per_sector.values, y=per_sector.index, hue=per_sector.index,
            palette="crest", legend=False, ax=ax)
for i, v in enumerate(per_sector.values):
    ax.text(v + 0.1, i, str(int(v)), va="center", fontsize=9)
ax.set_title(f"Same-sector candidate pairs per sector  (total = {len(CAND)})")
ax.set_xlabel("number of within-sector pairs"); ax.set_ylabel("")
plt.tight_layout(); plt.show()
