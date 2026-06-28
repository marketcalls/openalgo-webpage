# demonstration: ADF's low power against a near-unit-root (but truly STATIONARY) AR(1)
rngp = np.random.default_rng(20)
def adf_rejects(phi_, npts=1500, reps=300):
    hits = 0
    for _ in range(reps):
        e = rngp.standard_normal(npts); y = np.zeros(npts)
        for t in range(1, npts):
            y[t] = phi_*y[t-1] + e[t]           # stationary for |phi|<1, so TRUTH = stationary
        if adfuller(y, regression='c', autolag='AIC')[1] < 0.05:
            hits += 1
    return hits/reps

phis = [0.80, 0.90, 0.95, 0.98, 0.99]
power = {p: adf_rejects(p) for p in phis}
fig, ax = plt.subplots(figsize=(9.5, 4.6))
ax.bar([str(p) for p in phis], [power[p] for p in phis], color=C['purple'], edgecolor='white', zorder=3)
ax.axhline(1.0, color=C['green'], ls=':', lw=1.2, label='ideal: always reject (series IS stationary)')
for i, p in enumerate(phis):
    ax.text(i, power[p]+0.02, f'{power[p]:.0%}', ha='center', fontweight='bold')
ax.set_title('ADF power collapses as phi -> 1 (all series here are TRULY stationary)')
ax.set_xlabel('AR(1) coefficient phi (closer to 1 = slower mean reversion)')
ax.set_ylabel('fraction ADF correctly rejects @5%'); ax.set_ylim(0, 1.12); ax.legend(fontsize=9)
plt.tight_layout(); plt.show()
print("Every one of these AR(1) series is stationary by construction, yet power collapses as phi -> 1:")
print(f"at phi=0.99 ADF correctly rejects only ~{power[0.99]:.0%} of the time (vs ~{power[0.80]:.0%} at phi=0.80).")
print("'Failed to reject' often means 'too little data', not 'unit root' - the single most important")
print("caveat in applied cointegration work.")
