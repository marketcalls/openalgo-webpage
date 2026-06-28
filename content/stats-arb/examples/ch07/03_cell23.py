fig, ax = plt.subplots(figsize=(11, 4.6))
sns.kdeplot(spread.values, fill=True, color=C['purple'], alpha=0.35, lw=2, ax=ax)
sns.rugplot(spread.values, color=C['purple'], alpha=0.25, height=0.04, ax=ax)
ax.axvline(mu, color=C['grey'], ls='--', lw=1.2, label='mean')
for k, c in [(1, C['amber']), (2, C['red'])]:
    ax.axvline(mu + k*sd, color=c, ls=':', lw=1.1)
    ax.axvline(mu - k*sd, color=c, ls=':', lw=1.1, label=f'+/- {k} sd')
from scipy import stats as _st
print(f'skew = {_st.skew(spread):+.2f}   excess kurtosis = {_st.kurtosis(spread):+.2f}  '
      f'(0/0 would be perfectly normal)')
ax.set_title('Spread distribution: thresholds are sd bands around the mean')
ax.set_xlabel('spread (log)'); ax.legend(fontsize=9)
plt.tight_layout(); plt.show()
