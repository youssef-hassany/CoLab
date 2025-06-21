"use client";

import { useGetMyTeams } from "@/hooks/server/teams/useGetMyTeams";
import { CheckCircle, UserPlus, Users } from "lucide-react";
import React, { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { CreateTeamDialog } from "../teams/CreateTeamDialog";
import { JoinTeamDialog } from "../teams/JoinTeamDialog";

const UserTeamsList = () => {
  const { data: userTeams, isPending } = useGetMyTeams();
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  if (isPending) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="w-full h-36 rounded-xl" />
        <Skeleton className="w-full h-36 rounded-xl" />
        <Skeleton className="w-full h-36 rounded-xl" />
        <Skeleton className="w-full h-36 rounded-xl" />
      </div>
    );
  }

  if (userTeams?.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="bg-zinc-800 rounded-full p-6 mb-6">
            <UserPlus className="w-12 h-12 text-zinc-400" />
          </div>
          <h3 className="text-xl font-semibold text-zinc-200 mb-2">
            No teams yet
          </h3>
          <p className="text-zinc-400 text-center max-w-md mb-6">
            You haven't joined any teams yet. Create your first team or ask to
            be invited to get started with collaborative work.
          </p>
          <div className="flex gap-3">
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              Create Team
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsJoinDialogOpen(true)}
            >
              Join Team
            </Button>
          </div>
        </div>

        <CreateTeamDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        />

        <JoinTeamDialog
          open={isJoinDialogOpen}
          onOpenChange={setIsJoinDialogOpen}
        />
      </>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {userTeams?.map((team) => (
        <div
          key={team.id}
          className="bg-zinc-800 hover:bg-zinc-750 rounded-xl p-6 border border-zinc-700 hover:border-emerald-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-4 h-4 rounded-full bg-${team.theme}-600`}
              ></div>
              <h3 className="font-semibold text-lg group-hover:text-emerald-400 transition-colors">
                {team.teamName}
              </h3>
            </div>
            <span className="text-xs px-2 py-1 bg-zinc-700 text-zinc-300 rounded-full">
              {team.userRole}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm text-zinc-400">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {team.memberCount} members
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              {team.createdAt.toString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserTeamsList;
