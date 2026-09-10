import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const archivo = localFont({
  src: "../../node_modules/@fontsource-variable/archivo/files/archivo-latin-standard-normal.woff2",
  variable: "--font-archivo",
  display: "swap",
  weight: "100 900",
});

const geistMono = localFont({
  src: "../../node_modules/@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2",
  variable: "--font-geist-mono",
  display: "swap",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Bruno De Masi — Senior Software Engineer",
  description:
    "Senior software engineer from Belém, Brazil. MSc in Software Architecture, building with TypeScript, Rust, Web3, and cloud-native infrastructure.",
  metadataBase: new URL("https://demasi.dev"),
  openGraph: {
    title: "Bruno De Masi — Senior Software Engineer",
    description:
      "Senior software engineer from Belém, Brazil. MSc in Software Architecture, building with TypeScript, Rust, Web3, and cloud-native infrastructure.",
    url: "https://demasi.dev",
    siteName: "Bruno De Masi",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bruno De Masi — Senior Software Engineer",
    description:
      "Senior software engineer from Belém, Brazil. MSc in Software Architecture, building with TypeScript, Rust, Web3, and cloud-native infrastructure.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body
        className={`${archivo.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
