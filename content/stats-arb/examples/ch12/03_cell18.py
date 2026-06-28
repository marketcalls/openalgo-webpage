fig, ax = plt.subplots(figsize=(11, 4.6))
cols = [C['green'] if w > 0 else C['red'] for w in weights.values]
sns.barplot(x=weights.index, y=weights.values, palette=cols, ax=ax)
ax.axhline(0, color=C['grey'], lw=1.0)
for i, w in enumerate(weights.values):
    ax.text(i, w + (0.03 if w >= 0 else -0.03), f'{w:+.3f}', ha='center',
            va='bottom' if w >= 0 else 'top', fontsize=10, fontweight='bold')
ax.set_title('The cointegrating vector = basket weights (long green / short red, HDFCBANK pinned to +1)')
ax.set_ylabel('weight on log-price'); ax.set_xlabel('')
plt.tight_layout(); plt.show()
