from statsmodels.graphics.tsaplots import plot_acf
fig, ax = plt.subplots(1, 2, figsize=(13, 4.6))
plot_acf(logp.values, lags=40, ax=ax[0], color=C['blue'], vlines_kwargs={'colors': C['blue']})
ax[0].set_title(f'{STOCK} log PRICE: ACF decays painfully slowly (unit root)')
plot_acf(ret.values, lags=40, ax=ax[1], color=C['amber'], vlines_kwargs={'colors': C['amber']})
ax[1].set_title(f'{STOCK} log RETURNS: ACF dies at lag 1 (no memory = stationary)')
for a in ax: a.set_xlabel('lag (days)')
plt.tight_layout(); plt.show()
print(f"lag-1 autocorrelation  -> log price: {pd.Series(logp.values).autocorr(1):.3f}   "
      f"log returns: {pd.Series(ret.values).autocorr(1):+.3f}")
