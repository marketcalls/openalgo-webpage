def johansen_vec(df):
    j = coint_johansen(df.values, det_order=0, k_ar_diff=1)
    vv = j.evec[:, 0]; vv = vv / vv[0]      # normalise HDFCBANK = +1
    return pd.Series(vv, index=df.columns)

mid = logpx.index[len(logpx)//2]
vec_full = weights
vec_A = johansen_vec(logpx.loc[:mid])
vec_B = johansen_vec(logpx.loc[mid:])
comp = pd.DataFrame({'full window': vec_full, f'1st half': vec_A, f'2nd half': vec_B})
print(f'split at {mid.date()}')
print(comp.round(3).to_string())

longm = comp.reset_index().melt(id_vars='index', var_name='window', value_name='weight')
fig, ax = plt.subplots(figsize=(12, 4.8))
sns.barplot(data=longm, x='index', y='weight', hue='window',
            palette=[C['blue'], C['amber'], C['green']], ax=ax)
ax.axhline(0, color=C['grey'], lw=1.0)
ax.set_title('The "constant" cointegrating vector is not constant: same basket, two halves, different weights')
ax.set_ylabel('weight (HDFCBANK pinned to +1)'); ax.set_xlabel(''); ax.legend(title='', fontsize=9)
plt.tight_layout(); plt.show()
flip = ((np.sign(vec_A) != np.sign(vec_B)) & (vec_A.index != 'HDFCBANK')).sum()
print(f'legs whose SIGN flips between the two halves: {flip} of {len(names)-1} free legs  '
      f'-- a sign flip means long becomes short: catastrophic for a live book')
