# fit the three lines first so we can draw them on the joint scatter
ols_ab = sm.OLS(A, sm.add_constant(B)).fit()                 # A = a + b.B
ols_ba = sm.OLS(B, sm.add_constant(A)).fit()                 # B = c + d.A
b_ab   = ols_ab.params[B_name]
b_ba   = ols_ba.params[A_name]
b_ba_inv = 1.0 / b_ba                                        # express B~A back in A-on-B terms

def _tls_beta(x, y):
    """Total-least-squares slope via orthogonal distance regression (scipy.odr)."""
    f = odr.Model(lambda B_, x_: B_[0] * x_ + B_[1])
    out = odr.ODR(odr.RealData(x.values, y.values), f, beta0=[b_ab, 0.0]).run()
    return out.beta[0], out.beta[1]
b_tls, a_tls = _tls_beta(B, A)

g = sns.jointplot(x=B.values, y=A.values, kind='scatter', height=6.2,
                  s=10, alpha=0.35, color=C['grey'], marginal_kws=dict(bins=40))
xs = np.linspace(B.min(), B.max(), 100)
g.ax_joint.plot(xs, ols_ab.params['const'] + b_ab*xs, color=C['amber'], lw=2.2, label=f'OLS A~B  (b={b_ab:.3f})')
g.ax_joint.plot(xs, (-ols_ba.params['const']/b_ba) + b_ba_inv*xs, color=C['blue'], lw=2.2, label=f'OLS B~A flipped  (b={b_ba_inv:.3f})')
g.ax_joint.plot(xs, a_tls + b_tls*xs, color=C['green'], lw=2.2, ls='--', label=f'TLS orthogonal  (b={b_tls:.3f})')
g.ax_joint.set_xlabel(f'log {B_name}'); g.ax_joint.set_ylabel(f'log {A_name}')
g.ax_joint.legend(fontsize=9, loc='upper left')
g.figure.suptitle(f'{A_name} vs {B_name}: three honest hedge ratios', y=1.02, fontweight='bold')
plt.show()
