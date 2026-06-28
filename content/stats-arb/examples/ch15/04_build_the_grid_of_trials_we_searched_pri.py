# ---- build the grid of trials we "searched", price the best one honestly ----
entries = [1.5, 2.0, 2.5, 3.0]; exits = [-0.5, 0.0, 0.5, 1.0]; wins = [20, 40, 60, 90]
trial_cfgs = [(e, x, w) for e in entries for x in exits for w in wins]
trial_ret  = {c: daily_net(beta0, entry=c[0], ex=c[1], w=c[2]).values for c in trial_cfgs}
Rmat   = np.column_stack([trial_ret[c] for c in trial_cfgs])           # T x N matrix of daily net returns
Rmat   = np.nan_to_num(Rmat)
srd    = Rmat.mean(0) / np.where(Rmat.std(0) > 0, Rmat.std(0), np.nan)  # daily Sharpe per trial
N_TRIALS = len(trial_cfgs)
varSR  = np.nanvar(srd, ddof=1)
best   = int(np.nanargmax(srd)); r_best = Rmat[:, best]; T = len(r_best)
sr_obs = srd[best]                                                     # daily Sharpe of the selected best
sk, ku = float(skew(r_best)), float(kurtosis(r_best, fisher=False))
EG = 0.5772156649

def expected_max_sr(v, nt):
    sd = np.sqrt(v)
    return sd * ((1-EG)*norm.ppf(1 - 1.0/nt) + EG*norm.ppf(1 - 1.0/(nt*np.e)))
def psr(sr, sr_star, n, s3, k4):
    return float(norm.cdf((sr - sr_star)*np.sqrt(n-1) / np.sqrt(1 - s3*sr + (k4-1)/4*sr**2)))

sr_star   = expected_max_sr(varSR, N_TRIALS)
dsr_value = psr(sr_obs, sr_star, T, sk, ku)
psr0      = psr(sr_obs, 0.0, T, sk, ku)
sr_obs_a, sr_star_a = sr_obs*np.sqrt(ANN), sr_star*np.sqrt(ANN)

fig, (a1, a2) = plt.subplots(1, 2, figsize=(13, 4.9), gridspec_kw=dict(width_ratios=[2, 3]))
bars = a1.bar(['observed\n(best of %d)' % N_TRIALS, 'expected max\nfrom luck (SR*)', 'deflated\nexcess'],
              [sr_obs_a, sr_star_a, sr_obs_a - sr_star_a], color=[C['green'], C['amber'], C['blue']])
for bbar, v in zip(bars, [sr_obs_a, sr_star_a, sr_obs_a - sr_star_a]):
    a1.text(bbar.get_x()+bbar.get_width()/2, v+0.02, f'{v:.2f}', ha='center', fontweight='bold')
a1.axhline(0, color=C['grey'], lw=1.0); a1.set_ylabel('annualised Sharpe')
a1.set_title('Naive Sharpe vs the luck benchmark')

Ns = np.unique(np.round(np.logspace(0, 3.3, 60)).astype(int)); Ns = Ns[Ns >= 1]
dsr_curve = [psr(sr_obs, expected_max_sr(varSR, max(nt, 2)), T, sk, ku) for nt in Ns]
a2.plot(Ns, dsr_curve, color=C['purple'], lw=2.2)
a2.axhline(0.95, color=C['red'], ls='--', lw=1.2, label='0.95 credibility line')
a2.axvline(N_TRIALS, color=C['green'], ls=':', lw=1.6, label=f'N tried here = {N_TRIALS}  (DSR={dsr_value:.2f})')
a2.axvline(1, color=C['grey'], ls=':', lw=1.0)
a2.text(1.1, 0.5, f'PSR vs 0\n= {psr0:.3f}', color=C['grey'], fontsize=9, va='center')
a2.set_xscale('log'); a2.set_xlabel('number of trials N (log)'); a2.set_ylabel('Deflated Sharpe (prob true SR>0)')
a2.set_ylim(0, 1.02); a2.set_title('Significance deflates as you try more configs'); a2.legend(fontsize=9, loc='lower left')
plt.tight_layout(); plt.show()

print(f'best of {N_TRIALS} trials: daily SR {sr_obs:.3f} (ann {sr_obs_a:.2f}), skew {sk:+.2f}, kurtosis {ku:.1f}, T={T}')
print(f'against ZERO the result looks rock-solid: PSR = {psr0:.3f}.')
print(f'but the expected-max Sharpe from {N_TRIALS} lucky trials is {sr_star_a:.2f} (ann); deflating against THAT,')
print(f'the Deflated Sharpe drops to {dsr_value:.3f}. Try a few hundred configs and it falls through 0.95 entirely.')
