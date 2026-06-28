import time
def time_call(source, n=4):
    ts = []
    for _ in range(n):
        t0 = time.perf_counter()
        client.history(symbol='KOTAKBANK', exchange='NSE', interval='D',
                       start_date=START, end_date=END, source=source)
        ts.append(time.perf_counter() - t0)
    return np.array(ts)

db_t  = time_call('db')
api_t = time_call('api')
db_med, api_med = np.median(db_t), np.median(api_t)
speedup = api_med / db_med
print(f'source="db"  median {db_med*1000:7.1f} ms   (min {db_t.min()*1000:.1f} ms)')
print(f'source="api" median {api_med*1000:7.1f} ms   (min {api_t.min()*1000:.1f} ms)')
print(f'\n--> in this run, db is {speedup:.1f}x faster than api on a 10-year daily series')

tdf = pd.DataFrame({'source': ['db (cache)', 'api (broker)'],
                    'ms': [db_med*1000, api_med*1000]})
fig, ax = plt.subplots(figsize=(8, 3.2))
sns.barplot(data=tdf, x='ms', y='source', hue='source',
            palette=[C['blue'], C['amber']], legend=False, ax=ax)
ax.set_title(f'One 10-year daily read: db vs api  ({speedup:.1f}x)'); ax.set_xlabel('milliseconds (median of 4)')
ax.set_ylabel('')
for i, v in enumerate([db_med*1000, api_med*1000]):
    ax.text(v, i, f'  {v:.0f} ms', va='center', color=C['grey'])
plt.tight_layout(); plt.show()
