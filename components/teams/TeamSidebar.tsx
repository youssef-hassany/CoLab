"use client";

import { useGetTeamById } from "@/hooks/server/teams/useGetTeamById";
import { useGetTaskCategories } from "@/hooks/server/task-categories/useGetTaskCategories";
import { StatusConfig, TaskStatus } from "@/types/Task";
import { getTasksByStatus } from "@/utils/getTasksByStatus";
import {
  Calendar,
  Crown,
  User,
  Users,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Plus,
} from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { TaskCategoriesSection } from "../task-categories";
import { TeamActionButtons } from "./TeamActionButtons";
import { CreateTaskModal } from "./CreateTaskModal";
import { Button } from "@/components/ui/button";
import { useGetTasks } from "@/hooks/server/tasks/useGetTasks";
import { useSelectedTaskCategoryStore } from "@/store/selectedTaskCategoryStore";

interface Props {
  statusConfig: Record<TaskStatus, StatusConfig>;
}

const TeamSidebar = ({ statusConfig }: Props) => {
  const { teamId } = useParams<{ teamId: string }>();
  const { data: team } = useGetTeamById(teamId as string);
  const { data: taskCategories } = useGetTaskCategories(teamId as string);
  const { selectedTaskCategoryId } = useSelectedTaskCategoryStore();
  const { data: tasks = [] } = useGetTasks(
    teamId as string,
    selectedTaskCategoryId
  );
  const [showMembers, setShowMembers] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Check if current user is the team owner
  const isOwner = team?.teamMembers?.some(
    (member) => member.isMe && member.teamRole === "OWNER"
  );

  const SidebarContent = () => (
    <div className="flex-1 overflow-y-auto p-6">
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

            {/* Create Task Button */}
            <div className="mt-4">
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className={`w-full bg-${team.theme}-600 hover:bg-${team.theme}-700 text-white`}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Task
              </Button>
            </div>
          </div>

          {/* Task Categories */}
          <TaskCategoriesSection
            taskCategories={taskCategories}
            teamId={teamId as string}
            selectedTaskCategoryId={selectedTaskCategoryId}
          />

          {/* Team Members */}
          <div className="mb-6">
            <button
              onClick={() => setShowMembers(!showMembers)}
              className="flex items-center justify-between w-full text-lg font-semibold mb-3 hover:text-zinc-300 transition-colors"
            >
              <span>Team Members</span>
              {showMembers ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
            {showMembers && (
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
            )}
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

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-zinc-800 rounded-lg text-white hover:bg-zinc-700 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-80 bg-zinc-900 border-r border-zinc-700 flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-zinc-700">
          <h2 className="text-lg font-semibold text-white">Team Info</h2>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <SidebarContent />
        {team && (
          <div className="p-4 border-t border-zinc-700">
            <TeamActionButtons
              teamId={teamId as string}
              teamName={team.teamName}
              teamTheme={team.theme}
              joinCode={team.joinCode}
              isOwner={isOwner || false}
            />
          </div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-80 bg-zinc-900 border-r border-zinc-700 flex-col h-full">
        <SidebarContent />
        {team && (
          <div className="p-6 border-t border-zinc-700">
            <TeamActionButtons
              teamId={teamId as string}
              teamName={team.teamName}
              teamTheme={team.theme}
              joinCode={team.joinCode}
              isOwner={isOwner || false}
            />
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        teamId={teamId as string}
      />
    </>
  );
};

export default TeamSidebar;
