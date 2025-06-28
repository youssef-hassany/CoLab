"use client";

import { useGetTeamById } from "@/hooks/server/teams/useGetTeamById";
import { StatusConfig, Task, TaskStatus } from "@/types/Task";
import { getTasksByStatus } from "@/utils/getTasksByStatus";
import { Calendar, Crown, User, Users } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";

interface Props {
  tasks: Task[];
  statusConfig: Record<TaskStatus, StatusConfig>;
}

const TeamSidebar = ({ tasks, statusConfig }: Props) => {
  const { teamId } = useParams<{ teamId: string }>();
  const { data: team } = useGetTeamById(teamId as string);

  return (
    <div className="w-80 bg-zinc-900 border-r border-zinc-700 p-6">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          {team?.teamLogo ? (
            <img
              src={team.teamLogo}
              alt={team.teamName}
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-zinc-700 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-zinc-400" />
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-white">
              {team?.teamName || "Loading..."}
            </h1>
            <p className="text-zinc-400 text-sm">Team Dashboard</p>
          </div>
        </div>
      </div>

      {team && (
        <>
          {/* Team Stats */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Team Overview</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-zinc-300">
                <Users className="w-4 h-4" />
                <span className="text-sm">
                  {team.teamMembers?.length || 0} members
                </span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Theme: {team.theme}</span>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Team Members</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {team.teamMembers?.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-2 rounded-lg bg-zinc-800"
                >
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-zinc-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-zinc-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white truncate">
                        {member.username}
                      </p>
                      {member.teamRole === "OWNER" && (
                        <Crown className="w-3 h-3 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 truncate">
                      {member.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Task Summary */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Task Summary</h2>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(statusConfig).map(([status, config]) => (
                <div key={status} className="bg-zinc-800 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className={`w-2 h-2 rounded-full ${config.color}`}
                    ></div>
                    <span className="text-xs text-zinc-400">
                      {config.title}
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-white">
                    {getTasksByStatus(tasks, status as TaskStatus).length}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TeamSidebar;
