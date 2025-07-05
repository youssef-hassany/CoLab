"use client";

import { useGetTeamById } from "@/hooks/server/teams/useGetTeamById";
import { useGetTasks } from "@/hooks/server/tasks/useGetTasks";
import { useChangeTaskStatus } from "@/hooks/server/tasks/useChangeTaskStatus";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { StatusConfig, Task, TaskStatus } from "@/types/Task";
import KanbanColumn from "@/components/teams/KanbanColumn";
import TeamPageSkeleton from "@/components/teams/TeamPageSkeleton";
import { getTasksByStatus } from "@/utils/getTasksByStatus";
import TeamSidebar from "@/components/teams/TeamSidebar";
import { toast } from "sonner";

const statusConfig: Record<TaskStatus, StatusConfig> = {
  ISSUED: { title: "Issued", color: "bg-red-500", count: 0 },
  IN_PROGRESS: { title: "In Progress", color: "bg-yellow-500", count: 0 },
  IN_REVIEW: { title: "In Review", color: "bg-blue-500", count: 0 },
  DONE: { title: "Done", color: "bg-green-500", count: 0 },
};

const TeamPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const { data: team, isPending: isTeamPending } = useGetTeamById(
    teamId as string
  );
  const { data: tasks = [], isPending: isTasksPending } = useGetTasks(
    teamId as string
  );
  const changeStatusMutation = useChangeTaskStatus();

  // Ensure tasks is always an array
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  // Optimistic state for drag and drop
  const [optimisticTasks, setOptimisticTasks] = useState<Task[] | null>(null);

  // Use optimistic tasks if available, otherwise use real tasks
  const currentTasks = optimisticTasks || safeTasks;

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
  };

  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    newStatus: TaskStatus
  ): Promise<void> => {
    e.preventDefault();
    const taskData: Task = JSON.parse(e.dataTransfer.getData("text/plain"));

    // Don't update if status is the same
    if (taskData.status === newStatus) {
      return;
    }

    const oldStatus = taskData.status;
    const updatedTask = { ...taskData, status: newStatus };

    // Optimistic update
    setOptimisticTasks(
      safeTasks.map((task) => (task.id === taskData.id ? updatedTask : task))
    );

    try {
      // Call the external server to update the status
      await changeStatusMutation.mutateAsync({
        taskId: taskData.id,
        teamId: teamId as string,
        status: newStatus,
      });

      // Clear optimistic state on success
      setOptimisticTasks(null);
    } catch (error) {
      // Revert optimistic update on error
      setOptimisticTasks(
        safeTasks.map((task) =>
          task.id === taskData.id ? { ...task, status: oldStatus } : task
        )
      );

      toast.error("Failed to update task status. Please try again.");
    }
  };

  if (isTeamPending || isTasksPending) {
    return <TeamPageSkeleton />;
  }

  return (
    <main className="w-full min-h-screen bg-zinc-800 text-white flex flex-col lg:flex-row">
      {/* Sidebar */}
      <TeamSidebar tasks={currentTasks} statusConfig={statusConfig} />

      {/* Main Content - Kanban Board */}
      <div className="flex-1 p-4 lg:p-6 w-full pt-16 lg:pt-6">
        <div className="mb-6">
          <h2 className="text-xl lg:text-2xl font-bold text-white mb-2">
            Project Board
          </h2>
          <p className="text-zinc-400 text-sm lg:text-base">
            Drag and drop tasks to update their status
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {Object.entries(statusConfig).map(([status, config]) => (
            <KanbanColumn
              key={status}
              status={status as TaskStatus}
              config={config}
              tasks={getTasksByStatus(currentTasks, status as TaskStatus)}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              teamId={teamId as string}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default TeamPage;
