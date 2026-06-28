rng = np.random.default_rng(2)        # seeded: fully reproducible
n = 1500
eps = rng.standard_normal(n)          # white noise, the shocks
rw  = np.cumsum(eps)                  # random walk  x_t = x_{t-1} + e_t   -> I(1)
phi = 0.85
ar  = np.zeros(n)                     # stationary AR(1)  y_t = phi y_{t-1} + e_t -> I(0)
for t in range(1, n):
    ar[t] = phi * ar[t-1] + eps[t]

fig, ax = plt.subplots(2, 2, figsize=(13, 7.5))
ax[0,0].plot(rw, color=C['red'], lw=1.1)
ax[0,0].set_title('Random walk  x_t = x_(t-1) + e_t   [I(1), non-stationary]')
ax[0,0].axhline(0, color=C['grey'], lw=1, ls='--')
ax[0,1].plot(ar, color=C['green'], lw=1.1)
ax[0,1].axhline(0, color=C['grey'], lw=1, ls='--')
ax[0,1].set_title(f'Stationary AR(1), phi={phi}   [I(0), mean-reverting]')
ax[1,0].plot(np.diff(rw), color=C['amber'], lw=0.8)
ax[1,0].axhline(0, color=C['grey'], lw=1, ls='--')
ax[1,0].set_title('Increments of the random walk = white noise   [I(0)]')
sns.histplot(ar, bins=40, color=C['green'], stat='density', ax=ax[1,1], label='AR(1) levels')
sns.histplot(rw, bins=40, color=C['red'], stat='density', alpha=0.45, ax=ax[1,1], label='random-walk levels')
ax[1,1].set_title('Distribution of LEVELS: AR(1) is tight, random walk is sprawled')
ax[1,1].legend(fontsize=9)
plt.tight_layout(); plt.show()

print(f"random walk : mean={rw.mean():+.2f}  std={rw.std():.2f}  (level moments are meaningless - they depend on the window)")
print(f"AR(1) phi={phi}: mean={ar.mean():+.2f}  std={ar.std():.2f}  (a real, stable centre of gravity at 0)")
