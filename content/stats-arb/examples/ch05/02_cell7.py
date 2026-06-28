rng2 = np.random.default_rng(11)
P, m = 400, 400                       # P paths of length m
E = rng2.standard_normal((P, m))
RW = np.cumsum(E, axis=1)
AR = np.zeros((P, m))
for t in range(1, m):
    AR[:, t] = phi * AR[:, t-1] + E[:, t]

fig, ax = plt.subplots(1, 2, figsize=(13, 4.8), sharey=False)
for i in range(60):
    ax[0].plot(RW[i], color=C['red'],   lw=0.5, alpha=0.35)
    ax[1].plot(AR[i], color=C['green'], lw=0.5, alpha=0.35)
ax[0].set_title('60 random walks: the cloud fans out (no anchor)')
ax[1].set_title(f'60 AR(1) paths, phi={phi}: bounded around 0')
for a in ax: a.axhline(0, color=C['grey'], lw=1, ls='--')
plt.tight_layout(); plt.show()

# cross-sectional variance at each t
var_rw = RW.var(axis=0); var_ar = AR.var(axis=0)
t = np.arange(m)
fig, ax = plt.subplots(figsize=(11, 4.4))
ax.plot(t, var_rw, color=C['red'],   lw=2, label='random walk: Var grows ~ linearly with t')
ax.plot(t, t,      color=C['grey'],  lw=1.2, ls='--', label='theory: Var = t * sigma^2')
ax.plot(t, var_ar, color=C['green'], lw=2, label='AR(1): Var converges to a constant')
ax.axhline(1/(1-phi**2), color=C['amber'], lw=1.2, ls=':', label=f'theory: sigma^2/(1-phi^2) = {1/(1-phi**2):.2f}')
ax.set_title('Variance over time is the fingerprint of (non-)stationarity')
ax.set_xlabel('time step t'); ax.set_ylabel('cross-sectional variance'); ax.legend(fontsize=9)
plt.tight_layout(); plt.show()
print(f"random-walk variance at t={m-1}: {var_rw[-1]:.1f}  (and still climbing)")
print(f"AR(1) variance settles near: {var_ar[-200:].mean():.2f}  vs theory {1/(1-phi**2):.2f}")
