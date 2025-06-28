"use client";

import { useGetTeamById } from "@/hooks/server/teams/useGetTeamById";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { StatusConfig, Task, TaskStatus } from "@/types/Task";
import KanbanColumn from "@/components/teams/KanbanColumn";
import TeamPageSkeleton from "@/components/teams/TeamPageSkeleton";
import { getTasksByStatus } from "@/utils/getTasksByStatus";
import TeamSidebar from "@/components/teams/TeamSidebar";

// Mock task data - replace with your actual data source
const initialTasks: Task[] = [
  {
    id: "1",
    title: "Design user interface",
    description: "Create mockups for the new dashboard",
    assignee: "John Doe",
    priority: "high",
    status: "issued",
  },
  {
    id: "2",
    title: "Set up database",
    description: "Configure PostgreSQL database",
    assignee: "Jane Smith",
    priority: "medium",
    status: "in-progress",
  },
  {
    id: "3",
    title: "Code review",
    description: "Review authentication module",
    assignee: "Mike Johnson",
    priority: "low",
    status: "in-review",
  },
  {
    id: "4",
    title: "Deploy to staging",
    description: "Deploy latest version to staging environment",
    assignee: "Sarah Wilson",
    priority: "high",
    status: "done",
  },
  {
    id: "5",
    title: "Write documentation",
    description: "Update API documentation",
    assignee: "Tom Brown",
    priority: "medium",
    status: "issued",
  },
];

const statusConfig: Record<TaskStatus, StatusConfig> = {
  issued: { title: "Issued", color: "bg-red-500", count: 0 },
  "in-progress": { title: "In Progress", color: "bg-yellow-500", count: 0 },
  "in-review": { title: "In Review", color: "bg-blue-500", count: 0 },
  done: { title: "Done", color: "bg-green-500", count: 0 },
};

const TeamPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const { data: team, isPending } = useGetTeamById(teamId as string);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    newStatus: TaskStatus
  ): void => {
    e.preventDefault();
    const taskData: Task = JSON.parse(e.dataTransfer.getData("text/plain"));

    setTasks((prevTasks: Task[]) =>
      prevTasks.map((task: Task) =>
        task.id === taskData.id ? { ...task, status: newStatus } : task
      )
    );
  };

  if (isPending) {
    return <TeamPageSkeleton />;
  }

  return (
    <main className="w-full min-h-screen bg-zinc-800 text-white flex">
      {/* Sidebar */}
      <TeamSidebar tasks={tasks} statusConfig={statusConfig} />

      {/* Main Content - Kanban Board */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Project Board</h2>
          <p className="text-zinc-400">
            Drag and drop tasks to update their status
          </p>
        </div>

        <div className="flex gap-6">
          {Object.entries(statusConfig).map(([status, config]) => (
            <KanbanColumn
              key={status}
              status={status as TaskStatus}
              config={config}
              tasks={getTasksByStatus(tasks, status as TaskStatus)}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default TeamPage;
