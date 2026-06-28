# Partial fills and hedge-leg failure: the cost of NOT being neutral.
# If each leg independently fills with probability p, how often is the pair fully hedged,
# and how often are you left holding ONE naked directional leg?
p = np.linspace(0.80, 1.00, 200)
both_filled  = p * p                       # neutral pair
one_naked    = 2 * p * (1 - p)             # exactly one leg fills -> naked directional risk
none_filled  = (1 - p) ** 2                # no trade (the safe failure)

fig, ax = plt.subplots(figsize=(11, 4.6))
ax.plot(p*100, both_filled*100, color=C["green"], lw=2.2, label="both legs fill (neutral)")
ax.plot(p*100, one_naked*100,   color=C["red"],   lw=2.2, label="exactly one leg fills (NAKED)")
ax.plot(p*100, none_filled*100, color=C["grey"],  lw=1.8, ls="--", label="neither fills (safe)")
ax.axvline(95, color=C["amber"], ls=":", lw=1.4)
ax.set_title("Two-legged fill outcomes vs per-leg fill probability")
ax.set_xlabel("per-leg fill probability (%)"); ax.set_ylabel("outcome probability (%)"); ax.legend()
plt.tight_layout(); plt.show()

for pv in (0.95, 0.90):
    print(f"per-leg fill {pv:.0%}:  both-filled {pv*pv:.1%},  ONE-LEG-NAKED {2*pv*(1-pv):.1%}")
print("A 95%-reliable fill on each leg still leaves you naked ~1 trade in 10 - and naked is")
print("not a small directional bet, it is a full single-stock position the strategy never sized for.")
