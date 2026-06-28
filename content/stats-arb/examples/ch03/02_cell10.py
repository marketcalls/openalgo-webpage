vol = {}
for s in UNIVERSE:
    try:
        d = load(s); vol[s] = (d['close'] * d['volume']).last('365D').mean()
    except Exception as e:
        print('skip', s, e)
adv = (pd.Series(vol) / 1e7).sort_values(ascending=False)   # in Rs crore/day
fig, ax = plt.subplots(figsize=(11, 9))
sns.barplot(x=adv.values, y=adv.index, hue=adv.index, palette='flare', legend=False, ax=ax)
ax.set_title('Average daily traded value, last year (Rs crore)'); ax.set_xlabel('Rs crore / day'); ax.set_ylabel('')
plt.tight_layout(); plt.show()
print('thinnest 5 (handle with care):'); print(adv.tail(5).round(0))
