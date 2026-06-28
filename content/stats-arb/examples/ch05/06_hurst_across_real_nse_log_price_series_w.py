# Hurst across real NSE log-price series, with synthetic anchors for reference
hnames = ['RELIANCE','TCS','HDFCBANK','ICICIBANK','SBIN','INFY','ITC','HINDUNILVR',
          'MARUTI','SUNPHARMA','TATASTEEL','LT','BHARTIARTL','TITAN']
hvals = {}
for s in hnames:
    try:
        hvals[s] = hurst_vr(np.log(load(s)['close'].dropna().values))
    except Exception as e:
        print('skip', s, e)
hvals['[NIFTY index]']      = hurst_vr(np.log(load('NIFTY', exchange='NSE_INDEX')['close'].dropna().values))
hvals['[synthetic RW]']     = hurst_vr(rw)
hvals['[synthetic AR(1)]']  = hurst_vr(ar)
hs = pd.Series(hvals).sort_values()

fig, ax = plt.subplots(figsize=(11, 6.5))
cols = [C['green'] if v < 0.5 else (C['red'] if v > 0.5 else C['grey']) for v in hs.values]
ax.barh(hs.index, hs.values, color=cols, edgecolor='white', zorder=3)
ax.axvline(0.5, color=C['amber'], lw=2, ls='--', zorder=2, label='H = 0.5  (random walk)')
for y, v in enumerate(hs.values):
    ax.text(v + 0.004, y, f'{v:.2f}', va='center', fontsize=9)
ax.set_title('Hurst exponent on log PRICES: NSE names cluster at ~0.5 (random-walk-like)')
ax.set_xlabel('Hurst exponent  (<0.5 mean-reverting | 0.5 random walk | >0.5 trending)')
ax.legend(loc='lower right'); ax.set_xlim(0, max(0.62, hs.max()+0.06))
plt.tight_layout(); plt.show()

real = hs.drop(['[synthetic RW]','[synthetic AR(1)]'])
print(f"In this window, real NSE log prices have Hurst in [{real.min():.2f}, {real.max():.2f}], "
      f"mean {real.mean():.2f} - i.e. essentially random walks.")
print("No single stock price is a mean-reverter (none sits convincingly below 0.5). That is")
print("exactly why stat-arb builds a SPREAD: the spread, not the price, is where H drops below 0.5.")
