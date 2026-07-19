import MissionClient from "./MissionClient";

const OG_IMAGE = "https://openalgo.in/assets/images/og-image.png";

const DESC =
  "Why Open Varsity exists. An open source learning portal for markets, trading, investing and quantitative finance: a modern, transparent and regularly updated alternative to traditional market education, with no ads, no gatekeeping and no hype.";

export const metadata = {
  title: { absolute: "Our Mission - Open Varsity | OpenAlgo" },
  description: DESC,
  alternates: { canonical: "/learn/mission" },
  openGraph: {
    type: "website",
    url: "https://openalgo.in/learn/mission",
    title: "Our Mission - Open Varsity",
    description: DESC,
    siteName: "OpenAlgo",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Open Varsity by OpenAlgo", type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Mission - Open Varsity",
    description: DESC,
    images: [OG_IMAGE],
    creator: "@openalgoHQ",
    site: "@openalgoHQ",
  },
};

export default function MissionPage() {
  return <MissionClient />;
}
