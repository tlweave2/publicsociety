import "./globals.css";

export const metadata = {
  title: "Public Society — A private club. Everyone's a member.",
  description:
    "Two rooms, one long bar, and a patio that stays open later than it probably should. Cocktails, beer, wine and zero proof. Open to the public.",
  openGraph: {
    title: "Public Society",
    description: "A private club. Everyone's a member.",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#14110E",
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
