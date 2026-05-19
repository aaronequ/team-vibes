import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "SnapChef",
  description: "Your Smart Fridge Recipe Assistant",
};

export const viewport: Viewport = {
  themeColor: "#F8FAFC",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function Team1Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col bg-bg-main text-text-main selection:bg-primary/20 selection:text-secondary">
      {children}
    </div>
  );
}
