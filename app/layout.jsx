import "./globals.css";

const title = "Public Society Bar & Lounge — Ceres, California";
const description =
  "Ceres' premier cocktail lounge. Craft cocktails, live music, DJ sets and VIP tables. 805 4th Street, Ceres, CA.";

export const metadata = {
  title,
  description,
  openGraph: {
    title: "Public Society Bar & Lounge",
    description: "Cocktails. Music. Late Nights. — Ceres, California",
    type: "website",
    locale: "en_US",
  },
};

export const viewport = {
  themeColor: "#080808",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body>{children}</body>
    </html>
  );
}
