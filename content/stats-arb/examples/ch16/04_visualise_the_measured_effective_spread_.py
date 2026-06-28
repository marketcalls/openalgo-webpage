# Visualise the measured effective spread, and how crude the daily-range fallback is.
fig, axes = plt.subplots(1, 2, figsize=(12, 4.6))
sp = spreads.reset_index()
sns.barplot(data=sp, y="symbol", x="CS_spread_5m_bps", color=C["blue"], ax=axes[0])
axes[0].axvline(cs_repr, color=C["amber"], ls="--", lw=1.4)
axes[0].set_title(f"Effective spread from 5m bars (Corwin-Schultz), median {cs_repr:.1f} bps")
axes[0].set_xlabel("bps"); axes[0].set_ylabel("")
m = sp.melt(id_vars="symbol", value_vars=["CS_spread_5m_bps","daily_HL_range_bps"],
            var_name="measure", value_name="bps")
sns.barplot(data=m, y="symbol", x="bps", hue="measure",
            palette={"CS_spread_5m_bps": C["green"], "daily_HL_range_bps": C["red"]}, ax=axes[1])
axes[1].set_title("Effective spread vs RAW daily high-low range")
axes[1].set_xlabel("bps (log scale)"); axes[1].set_ylabel(""); axes[1].set_xscale("log")
axes[1].legend(title="", loc="lower right", fontsize=8)
plt.tight_layout(); plt.show()
print("The daily high-low range is a usable LAST-RESORT proxy when intraday is missing, but it bundles")
print("the whole day's volatility into 'spread' and is wrong by an order of magnitude. Prefer real bars.")
