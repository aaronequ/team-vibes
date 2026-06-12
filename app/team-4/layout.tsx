import type { Metadata } from "next";
import { RoomReleaseHeader } from "./RoomReleaseHeader";

export const metadata: Metadata = {
  title: "Room Release Demo | robot-vibes",
  description:
    "Visual demo of the Room Release Slack notification for Meeting Room 2.",
};

export default function RoomReleaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col bg-stone-2">
      <RoomReleaseHeader />
      {children}
    </div>
  );
}
