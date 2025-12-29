import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import { Ubuntu } from 'next/font/google'

const ubuntu = Ubuntu({
  variable: "--font-ubuntu",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trading Note AI - Your Personal Trading Journal",
  description: "Elevate your trading with AI-powered journaling. Analyze, learn, and improve your strategies effortlessly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className={`${ubuntu.variable}`}>
        <head>
           <link rel="preconnect" href="https://fonts.cdnfonts.com" />
            <link
              rel="stylesheet"
              href="https://fonts.cdnfonts.com/css/ubuntu?styles=400,700"
              precedence="high"
            />
        </head>

        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
