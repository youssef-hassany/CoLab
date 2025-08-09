import type { Metadata } from "next";
import "../globals.css";
import { TopNavbar } from "@/components/ui/navbar";

export const metadata: Metadata = {
  title: "CoLab",
  description:
    "CoLab is a collaborative task management platform designed for teams to seamlessly organize, assign, and track tasks within customizable environments. With features like real-time status updates, role-based permissions, deadlines, and team communication tools, CoLab empowers teams to stay productive and aligned on every project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNavbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
