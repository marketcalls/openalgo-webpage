log_full = np.log(px_all).dropna()
port_full = pd.Series(log_full.values @ v, index=log_full.index)   # full-window IS vector, applied everywhere
is_part  = port_full.loc[WIN0:WIN1]
oos_part = port_full.loc['2024-01-01':]
adf_is  = adfuller(is_part,  autolag='AIC')[1]
adf_oos = adfuller(oos_part, autolag='AIC')[1]

fig, ax = plt.subplots(figsize=(12, 5))
ax.plot(is_part.index,  is_part.values,  color=C['green'], lw=1.0, label=f'in-sample {WIN0[:4]}-{WIN1[:4]} (ADF p={adf_is:.3f})')
ax.plot(oos_part.index, oos_part.values, color=C['red'],   lw=1.0, label=f'out-of-sample 2024-26 (ADF p={adf_oos:.3f})')
ax.axhline(mu, color=C['grey'], ls='--', lw=1.1, label='in-sample mean')
for k, cc in [(1, C['amber']), (2, C['red'])]:
    ax.axhline(mu + k*sd, color=cc, ls=':', lw=0.9); ax.axhline(mu - k*sd, color=cc, ls=':', lw=0.9)
ax.axvline(pd.Timestamp('2024-01-01'), color=C['grey'], lw=1.0)
ax.set_title('Same fixed basket vector, in-sample (green) vs out-of-sample (red)')
ax.set_ylabel('basket (log)'); ax.legend(fontsize=8.5, loc='upper left')
plt.tight_layout(); plt.show()
print(f'ADF p  in-sample {adf_is:.4f}  ->  out-of-sample {adf_oos:.4f}')
print('the relationship that looked airtight in-sample need not survive a regime it was not fitted on')
