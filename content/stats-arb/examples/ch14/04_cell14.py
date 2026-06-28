from scipy.optimize import minimize
CAP = 0.35

def _opt(obj, n, cap=CAP):
    cons = [{'type':'eq', 'fun': lambda w: w.sum() - 1}]
    res = minimize(obj, np.ones(n)/n, method='SLSQP', bounds=[(0, cap)]*n,
                   constraints=cons, options={'maxiter':800, 'ftol':1e-12})
    return res.x

def w_minvar(S): return _opt(lambda w: w @ S @ w, len(S))
def w_erc(S):
    n = len(S)
    def obj(w):
        rc = w * (S @ w); rc = rc / rc.sum()
        return np.sum((rc - 1.0/n)**2)
    return _opt(obj, n)
def risk_contrib(w, S):
    w = np.asarray(w); Sw = S @ w; return (w * Sw) / (w @ Sw)

w_eq = np.ones(6)/6
w_mv = w_minvar(S_lw)
w_rp = w_erc(S_lw)
Wdf  = pd.DataFrame({'equal': w_eq, 'min-variance': w_mv, 'risk-parity (ERC)': w_rp}, index=BOOK)

fig, ax = plt.subplots(figsize=(12, 4.8))
Wdf.plot(kind='bar', ax=ax, color=[C['grey'], C['blue'], C['green']], width=0.78)
ax.axhline(CAP, color=C['red'], ls='--', lw=1.2, label=f'concentration cap {CAP:.0%}')
ax.set_title('Book weights: equal vs minimum-variance vs risk-parity (Ledoit-Wolf covariance)')
ax.set_ylabel('weight'); ax.set_xticklabels(BOOK, rotation=25, ha='right', fontsize=9); ax.legend(fontsize=9)
plt.tight_layout(); plt.show()

dvol = lambda w: np.sqrt(w @ S_lw @ w) * np.sqrt(ANN)
print(f'book vol @ weights (annualized):  equal {dvol(w_eq)*100:.2f}%   min-var {dvol(w_mv)*100:.2f}%   ERC {dvol(w_rp)*100:.2f}%')
print('min-variance gives the lowest vol by construction; ERC trades a touch of vol for balanced risk.')
