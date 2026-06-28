ratio = (A - B).rename('log price ratio')        # log(P_A / P_B): the implicit beta=1 'spread'
adf_ratio  = adfuller(ratio.dropna(),  autolag='AIC')
adf_spread = adfuller(spread.dropna(), autolag='AIC')
print(f'ADF  log price ratio   (beta=1 implied) : stat = {adf_ratio[0]:+.3f}   p = {adf_ratio[1]:.4f}')
print(f'ADF  cointegrating spread (beta={beta:.3f}) : stat = {adf_spread[0]:+.3f}   p = {adf_spread[1]:.4f}')
print(f"-> {'the estimated spread reverts at least as cleanly' if adf_spread[1] <= adf_ratio[1] else 'similar here (beta is near 1)'} "
      f"(lower p = stronger reversion)")

fig, ax = plt.subplots(2, 1, figsize=(12, 6), sharex=True)
z_r = (ratio - ratio.mean()) / ratio.std()
z_s = (spread - spread.mean()) / spread.std()
sns.lineplot(x=z_r.index, y=z_r.values, color=C['grey'], lw=1.0, ax=ax[0]); ax[0].axhline(0, color=C['amber'], ls='--', lw=1)
ax[0].set_title(f'Log price ratio  log({A_name}/{B_name})  (assumes beta=1)   --   ADF p = {adf_ratio[1]:.3f}')
ax[0].set_ylabel('standardised')
sns.lineplot(x=z_s.index, y=z_s.values, color=C['purple'], lw=1.0, ax=ax[1]); ax[1].axhline(0, color=C['amber'], ls='--', lw=1)
ax[1].set_title(f'Cointegrating spread  A - {beta:.3f}*B  (estimated beta)   --   ADF p = {adf_spread[1]:.3f}')
ax[1].set_ylabel('standardised')
plt.tight_layout(); plt.show()
