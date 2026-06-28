# heatmap of ADF p-values: low (green) = stationary, high (red) = unit root
hm = res[['adf_price','adf_return']].rename(columns={'adf_price':'ADF p\n(log price)',
                                                     'adf_return':'ADF p\n(log return)'})
fig, ax = plt.subplots(figsize=(7, 9))
sns.heatmap(hm, annot=True, fmt='.3f', cmap='RdYlGn_r', vmin=0, vmax=1,
            linewidths=0.5, linecolor='#0d1117', cbar_kws={'label': 'ADF p-value'}, ax=ax)
ax.set_title('ADF p-values across NSE names\nprices = red (unit root) | returns = green (stationary)')
ax.set_ylabel(''); ax.set_xlabel('')
plt.tight_layout(); plt.show()
