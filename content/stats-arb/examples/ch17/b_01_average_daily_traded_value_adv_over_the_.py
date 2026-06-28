# Average daily traded value (ADV) over the last ~year, in Rs crore/day.
adv = {}
for s in UNIVERSE:
    try:
        d = load(s)
        adv[s] = (d['close'] * d['volume']).last('365D').mean() / 1e7
    except Exception as e:
        print('skip', s, e)
adv = pd.Series(adv).sort_values(ascending=False)
show = pd.concat([adv.head(12), adv.tail(8)])
sd = show.reset_index(); sd.columns = ['symbol', 'adv']
sd['tier'] = np.where(sd['adv'] >= adv.median(), 'liquid (size-able)', 'thin (short leg breaks)')
fig, ax = plt.subplots(figsize=(11, 8))
sns.barplot(data=sd, x='adv', y='symbol', hue='tier',
            palette={'liquid (size-able)': C['green'], 'thin (short leg breaks)': C['red']},
            dodge=False, ax=ax)
ax.axvline(adv.median(), color=C['amber'], ls='--', lw=1.2)
ax.set_title('Average daily traded value, last ~year (Rs crore) - top 12 and thinnest 8')
ax.set_xlabel('Rs crore traded / day'); ax.set_ylabel(''); ax.legend(loc='lower right')
plt.tight_layout(); plt.show()
print(f'liquidity span in this window: richest {adv.index[0]} ~Rs {adv.iloc[0]:,.0f} cr/day  '
      f'vs thinnest {adv.index[-1]} ~Rs {adv.iloc[-1]:,.0f} cr/day  ->  '
      f'{adv.iloc[0]/adv.iloc[-1]:.0f}x apart')
print(f'median name trades ~Rs {adv.median():,.0f} cr/day; '
      f'{(adv < adv.median()/3).sum()} names trade under a third of the median.')
