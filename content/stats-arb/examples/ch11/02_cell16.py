LOOKBACK, ENTRY, EXITZ = 60, 2.0, 0.5      # z-score window and trade thresholds (shared by both models)

def zscore(s, w=LOOKBACK):
    '''Trailing rolling z-score, no look-ahead (uses only the past w observations).'''
    return (s - s.rolling(w).mean()) / s.rolling(w).std()

spread_kal = kf['spread'].copy(); spread_kal.iloc[:60] = np.nan   # burn-in: drop unconverged start
z_kal      = zscore(spread_kal)
sqrtS      = np.sqrt(kf['S']);  sqrtS.iloc[:60] = np.nan

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 7.4), sharex=True)
ax1.plot(spread_kal.index, spread_kal.values, color=C['purple'], lw=1.0, label='Kalman dynamic spread  e_t')
ax1.fill_between(sqrtS.index, -sqrtS.values, sqrtS.values, color=C['teal'], alpha=0.12,
                 label='+/- sqrt(S): filter uncertainty')
ax1.axhline(0, color=C['grey'], lw=0.9, ls='--')
ax1.axvspan(pd.Timestamp(OOS0), pd.Timestamp(OOS1), color=C['blue'], alpha=0.06)
ax1.set_title(f'Kalman dynamic spread and its z-score   ({A_name} - beta_t.{B_name})')
ax1.set_ylabel('forecast error (log)'); ax1.legend(fontsize=8.5, loc='upper left', ncol=2)

ax2.plot(z_kal.index, z_kal.values, color=C['blue'], lw=0.9)
for k, c, lbl in [(ENTRY, C['red'], f'+/- {ENTRY} entry'), (-ENTRY, C['red'], None),
                  (EXITZ, C['green'], f'+/- {EXITZ} exit'), (-EXITZ, C['green'], None)]:
    ax2.axhline(k, color=c, lw=1.1, ls=':' , label=lbl)
ax2.axhline(0, color=C['grey'], lw=0.8, ls='--')
ax2.fill_between(z_kal.index, ENTRY, z_kal.values, where=(z_kal.values>ENTRY), color=C['red'], alpha=0.25)
ax2.fill_between(z_kal.index, -ENTRY, z_kal.values, where=(z_kal.values<-ENTRY), color=C['red'], alpha=0.25)
ax2.axvspan(pd.Timestamp(OOS0), pd.Timestamp(OOS1), color=C['blue'], alpha=0.06)
ax2.set_ylabel(f'rolling z ({LOOKBACK}d)'); ax2.legend(fontsize=8.5, loc='upper left', ncol=3)
plt.tight_layout(); plt.show()
