import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Background from "../components/background";
import { ThemeToggle } from "../components/theme-toggle";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t)}else if(window.matchMedia("(prefers-color-scheme:light)").matches){document.documentElement.setAttribute("data-theme","light")}}catch(e){}})()`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <Background />
        <div className="relative" style={{ zIndex: 1 }}>
          {children}
        </div>
        <ThemeToggle />
      </body>
    </html>
  );
}
