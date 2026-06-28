order = cov.sort_values('rows').index.tolist()
fig, ax = plt.subplots(figsize=(11, 12))
sns.barplot(data=cov.reset_index(), y='symbol', x='rows', hue='sector',
            order=order, dodge=False, palette='tab20', ax=ax)
ax.axvline(med, color=C['grey'], ls='--', lw=1)
ax.text(med, len(order)-1, f'  median {med}', color=C['grey'], va='top', fontsize=9)
ax.set_title('Daily bars cached per symbol (source="db")'); ax.set_xlabel('rows'); ax.set_ylabel('')
ax.legend(title='sector', bbox_to_anchor=(1.01, 1), loc='upper left', fontsize=7, ncol=1)
plt.tight_layout(); plt.show()
