idx = px.index
def make_folds(test_len=126, min_train=504):
    folds, start = [], min_train
    while start + test_len <= len(idx):
        folds.append((start, min(start + test_len, len(idx)))); start += test_len
    return folds
FOLDS = make_folds()

def wf_fold_sharpes(mode, lookback=504):
    out = []
    for ts, te in FOLDS:
        tr = slice(idx[0], idx[ts-1]) if mode == 'anchored' else slice(idx[max(0, ts-lookback)], idx[ts-1])
        bb = fit_beta(tr)
        net = daily_net(bb)
        out.append(dict(fold_start=idx[ts].date(), sharpe=sharpe(net.loc[idx[ts]:idx[te-1]])))
    return pd.DataFrame(out)

wfa = wf_fold_sharpes('anchored'); wfr = wf_fold_sharpes('rolling')
tidy = pd.concat([wfa.assign(scheme='anchored'), wfr.assign(scheme='rolling')], ignore_index=True).dropna(subset=['sharpe'])

fig, (axL, axR) = plt.subplots(1, 2, figsize=(13, 5.0), gridspec_kw=dict(width_ratios=[2, 3]))
sns.boxplot(data=tidy, x='scheme', y='sharpe', hue='scheme', palette=[C['blue'], C['teal']], width=0.5, ax=axL, legend=False)
sns.stripplot(data=tidy, x='scheme', y='sharpe', color='white', edgecolor=C['grey'], linewidth=0.6, size=6, ax=axL)
axL.axhline(0, color=C['red'], ls='--', lw=1.2)
axL.axhline(sharpe(r_is), color=C['green'], ls=':', lw=1.4)
axL.text(1.5, sharpe(r_is), ' in-sample', color=C['green'], fontsize=9, va='center')
axL.set_title('Distribution of OOS fold Sharpe'); axL.set_ylabel('annualised Sharpe (per fold)'); axL.set_xlabel('')

axR.axhline(0, color=C['red'], ls='--', lw=1.1)
axR.plot(wfa['fold_start'], wfa['sharpe'], 'o-', color=C['blue'], lw=1.4, ms=5, label='anchored')
axR.plot(wfr['fold_start'], wfr['sharpe'], 's-', color=C['teal'], lw=1.4, ms=5, label='rolling')
axR.axvspan(pd.Timestamp(OO0), pd.Timestamp(OO1), color=C['amber'], alpha=0.08, label='2024+ (true recent OOS)')
axR.set_title('OOS Sharpe per walk-forward fold, through time'); axR.set_ylabel('fold Sharpe'); axR.set_xlabel('')
axR.legend(fontsize=9, loc='upper right'); axR.tick_params(axis='x', rotation=30)
plt.tight_layout(); plt.show()

for nm, df in [('anchored', wfa.dropna()), ('rolling', wfr.dropna())]:
    s = df['sharpe']
    print(f'{nm:8s}: folds {len(s):2d}   median {s.median():+.2f}   IQR [{s.quantile(.25):+.2f}, {s.quantile(.75):+.2f}]   '
          f'frac>0 {(s>0).mean():.0%}   worst {s.min():+.2f}   best {s.max():+.2f}')
wf_anchored_med = wfa['sharpe'].median(); wf_rolling_med = wfr['sharpe'].median()
wf_frac_pos = (tidy['sharpe'] > 0).mean()
print(f'the in-sample {sharpe(r_is):.2f} sits ABOVE almost every fold: a single backtest reports the best case, not the typical one.')
