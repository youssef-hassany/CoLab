"use client";

import RecentActivity from "@/components/home/RecentActivity";
import StatsSection from "@/components/home/StatsSection";
import UpcomingDeadlines from "@/components/home/UpcomingDeadlines";
import UserTeamsList from "@/components/home/UserTeamsList";
import { CreateTeamDialog } from "@/components/teams/CreateTeamDialog";
import { JoinTeamDialog } from "@/components/teams/JoinTeamDialog";
import { Button } from "@/components/ui/button";
import { useGetLoggedInUser } from "@/hooks/server/user/useGetLoggedInUser";
import { useTeamModalStore } from "@/store/teamModalsStore";
import { Users, Plus, Settings, Bell } from "lucide-react";

export default function Home() {
  const { data } = useGetLoggedInUser();
  const {
    isJoinModalOpen,
    isCreateModalOpen,
    toggleJoinModal,
    toggleCreateModal,
  } = useTeamModalStore();

  return (
    <main className="w-full min-h-screen bg-zinc-800 text-white">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-emerald-400">
                Hello, {data?.username || "User"}! 👋
              </h1>
              <p className="text-zinc-400 mt-2">
                Welcome back to CoLab. Here's what's happening with your teams.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-zinc-300" />
              </button>
              <button className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-zinc-300" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Teams */}
          <div className="lg:col-span-2 space-y-8">
            {/* Your Teams Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                  <Users className="w-6 h-6 text-emerald-400" />
                  Your Teams
                </h2>

                <div className="flex gap-2">
                  <Button variant="secondary" onClick={toggleCreateModal}>
                    <Plus className="w-4 h-4" />
                    Create Team
                  </Button>

                  <Button onClick={toggleJoinModal}>
                    <Plus className="w-4 h-4" />
                    Join Team
                  </Button>
                </div>
              </div>

              <UserTeamsList />
            </section>

            {/* Recent Activity Section */}
            <RecentActivity />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <StatsSection />

            {/* Upcoming Deadlines */}
            <UpcomingDeadlines />
          </div>
        </div>
      </div>

      <CreateTeamDialog
        open={isCreateModalOpen}
        onOpenChange={toggleCreateModal}
      />

      <JoinTeamDialog open={isJoinModalOpen} onOpenChange={toggleJoinModal} />
    </main>
  );
}
