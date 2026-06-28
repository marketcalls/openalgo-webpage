# Edge decay on a REAL pair: rolling co-movement and rolling spread stability.
a, b = "HDFCBANK", "KOTAKBANK"
pa, pb = load(a)["close"], load(b)["close"]
df = pd.concat([np.log(pa), np.log(pb)], axis=1).dropna(); df.columns = [a, b]
train = df[df.index < df.index[0] + pd.Timedelta(days=730)]            # fix the hedge ratio on first 2 yrs
beta = np.polyfit(train[b], train[a], 1)[0]
spread = df[a] - beta * df[b]
z = (spread - spread.rolling(120).mean()) / spread.rolling(120).std()
roll_corr = df[a].diff().rolling(120).corr(df[b].diff())               # 120d rolling return correlation
roll_sd   = spread.rolling(120).std()                                  # spread instability

fig, axes = plt.subplots(2, 1, figsize=(11.5, 7), sharex=True)
axes[0].plot(roll_corr.index, roll_corr, color=C["blue"], lw=1.6, label="120d rolling return corr")
axes[0].axhline(0.5, color=C["red"], ls="--", lw=1.3, label="retire-watch threshold (0.5)")
axes[0].fill_between(roll_corr.index, 0, 1, where=(roll_corr < 0.5), color=C["red"], alpha=0.12)
axes[0].set_ylim(0, 1); axes[0].set_title(f"{a} vs {b}: co-movement is NOT constant - monitor it")
axes[0].set_ylabel("rolling corr"); axes[0].legend(loc="lower left", fontsize=8)
axes[1].plot(roll_sd.index, roll_sd, color=C["amber"], lw=1.6)
axes[1].set_title("Rolling spread volatility - a widening spread is an edge under stress")
axes[1].set_ylabel("rolling std of spread"); axes[1].set_xlabel("")
plt.tight_layout(); plt.show()

frac_weak = (roll_corr < 0.5).mean()
print(f"hedge ratio (fixed on first 2y): beta = {beta:.2f}")
print(f"share of history with 120d return-corr below 0.5: {frac_weak:.0%}")
print("When co-movement spends long stretches below your threshold and the spread keeps widening, the")
print("relationship that justified the pair is decaying. Retire it - a dead edge bleeds costs every trade.")
