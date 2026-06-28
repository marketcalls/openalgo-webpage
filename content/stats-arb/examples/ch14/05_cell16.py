rc_eq = risk_contrib(w_eq, S_lw) * 100
rc_rp = risk_contrib(w_rp, S_lw) * 100
rcdf  = pd.DataFrame({'equal-weight': rc_eq, 'risk-parity (ERC)': rc_rp}, index=BOOK)

fig, ax = plt.subplots(figsize=(12, 4.8))
rcdf.plot(kind='bar', ax=ax, color=[C['grey'], C['green']], width=0.78)
ax.axhline(100/6, color=C['amber'], ls='--', lw=1.4, label='equal share (1/6 = 16.7%)')
ax.set_title('Risk contribution to book volatility: equal capital is NOT equal risk')
ax.set_ylabel('% of book risk'); ax.set_xticklabels(BOOK, rotation=25, ha='right', fontsize=9); ax.legend(fontsize=9)
plt.tight_layout(); plt.show()

print('equal-weight risk contributions (%):', np.round(rc_eq, 1))
print('risk-parity  risk contributions (%):', np.round(rc_rp, 1), ' <- equalized by construction')
