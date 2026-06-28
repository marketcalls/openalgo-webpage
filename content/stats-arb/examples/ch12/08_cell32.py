def mean_pair_angle(V):
    M = np.clip(V @ V.T, -1, 1); iu = np.triu_indices(len(V), 1)
    return np.degrees(np.arccos(np.abs(M[iu]))).mean()

ks, angles = [], []
for k in range(2, len(names) + 1):
    Vk = block_boot(logpx.iloc[:, :k], B=250, block=20)
    ks.append(k); angles.append(mean_pair_angle(Vk))

fig, (axb, axa) = plt.subplots(1, 2, figsize=(13, 4.8))
order = boot.melt(var_name='leg', value_name='weight')
sns.boxplot(data=order, x='leg', y='weight', palette='flare', ax=axb, showfliers=False)
axb.axhline(0, color=C['grey'], lw=1.0)
axb.set_title('5-leg vector: bootstrap spread of each weight'); axb.set_xlabel(''); axb.set_ylabel('weight (unit-norm)')

sns.barplot(x=ks, y=angles, palette='crest', ax=axa)
for i, a in enumerate(angles):
    axa.text(i, a + 0.5, f'{a:.0f} deg', ha='center', fontsize=10, fontweight='bold')
axa.set_title('Vector direction wobble vs number of legs'); axa.set_xlabel('legs in basket')
axa.set_ylabel('mean pairwise angle (deg)')
plt.tight_layout(); plt.show()
print('boxes that straddle zero = legs whose sign is in doubt; the angle climbs as legs are added.')
