import type { Metadata } from "next";
import { Inter, Heebo, Just_Me_Again_Down_Here } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["latin"],
});

const justMeAgainDownHere = Just_Me_Again_Down_Here({
  variable: "--font-handwritten",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "robot-vibes",
  description: "An equ AI App building session.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${heebo.variable} ${justMeAgainDownHere.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
