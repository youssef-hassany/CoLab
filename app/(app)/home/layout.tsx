import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../../globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/common/app-sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SidebarProvider>
          <AppSidebar />
          <main className="flex-1 min-h-screen">
            <header className="fixed top-4 left-4 z-50 md:hidden">
              <SidebarTrigger className="w-12 h-12 flex items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg hover:bg-emerald-600 transition" />
            </header>
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
