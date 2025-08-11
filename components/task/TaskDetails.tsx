"use client";

import React from "react";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Calendar, User, Flag, FileText, Clock } from "lucide-react";
import { TaskPriority, TaskStatus, Task } from "@/types/Task";
import { formatDeadline, getDeadlineClasses } from "@/utils/date";
import TextFormatter from "../ui/TextFormatter";

interface TaskDetailsProps {
  task: Task;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ task }) => {
  const priorityColors: Record<
    TaskPriority,
    { bg: string; text: string; border: string }
  > = {
    HIGH: {
      bg: "bg-red-900/20",
      text: "text-red-200",
      border: "border-red-500",
    },
    MEDIUM: {
      bg: "bg-yellow-900/20",
      text: "text-yellow-200",
      border: "border-yellow-500",
    },
    LOW: {
      bg: "bg-green-900/20",
      text: "text-green-200",
      border: "border-green-500",
    },
  };

  const priorityLabels: Record<TaskPriority, string> = {
    HIGH: "High Priority",
    MEDIUM: "Medium Priority",
    LOW: "Low Priority",
  };

  const statusColors: Record<TaskStatus, { bg: string; text: string }> = {
    ISSUED: { bg: "bg-blue-900/20", text: "text-blue-200" },
    IN_PROGRESS: { bg: "bg-orange-900/20", text: "text-orange-200" },
    IN_REVIEW: { bg: "bg-purple-900/20", text: "text-purple-200" },
    DONE: { bg: "bg-green-900/20", text: "text-green-200" },
  };

  const statusLabels: Record<TaskStatus, string> = {
    ISSUED: "Issued",
    IN_PROGRESS: "In Progress",
    IN_REVIEW: "In Review",
    DONE: "Done",
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Task Title */}
      <div className="space-y-2">
        <h2 className="text-white text-lg font-medium leading-tight">
          {task.title}
        </h2>
        <div className="flex items-center gap-3">
          <Badge
            className={`${priorityColors[task.priority].bg} ${
              priorityColors[task.priority].text
            } border ${priorityColors[task.priority].border}`}
          >
            <Flag className="w-3 h-3 mr-1" />
            {priorityLabels[task.priority]}
          </Badge>
          <Badge
            className={`${statusColors[task.status].bg} ${
              statusColors[task.status].text
            }`}
          >
            {statusLabels[task.status]}
          </Badge>
        </div>
      </div>

      <Separator className="bg-zinc-700" />

      {/* Task Description */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-zinc-300">
          <FileText className="w-4 h-4" />
          <span className="font-medium">Description</span>
        </div>
        <p className="text-zinc-300 leading-relaxed bg-zinc-800/50 rounded-lg p-4 border border-zinc-700 select-text">
          <TextFormatter description={task.description} />
        </p>
      </div>

      <Separator className="bg-zinc-700" />

      {/* Task Attachment */}
      {task.attachedFile && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-zinc-300">
            <FileText className="w-4 h-4" />
            <span className="font-medium">Attachment</span>
          </div>
          <img src={task.attachedFile} alt={`${task.title} Attachment`} />
        </div>
      )}

      {task.attachedFile && <Separator className="bg-zinc-700" />}

      {/* Task Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Assignee */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-zinc-300">
            <User className="w-4 h-4" />
            <span className="font-medium">Assignee</span>
          </div>
          <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700">
            <p className="text-white font-medium">{task.assignee}</p>
          </div>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-zinc-300">
            <Clock className="w-4 h-4" />
            <span className="font-medium">Status</span>
          </div>
          <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700">
            <Badge
              className={`${statusColors[task.status].bg} ${
                statusColors[task.status].text
              } w-fit`}
            >
              {statusLabels[task.status]}
            </Badge>
          </div>
        </div>

        {/* Deadline */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-zinc-300">
            <Calendar className="w-4 h-4" />
            <span className="font-medium">Deadline</span>
          </div>
          <div
            className={`rounded-lg p-3 border border-zinc-700 ${
              getDeadlineClasses(task.deadline).bg
            }`}
          >
            <p
              className={`font-medium ${
                getDeadlineClasses(task.deadline).text
              }`}
            >
              {formatDeadline(task.deadline)}
            </p>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-zinc-300">
          <FileText className="w-4 h-4" />
          <span className="font-medium">Additional Information</span>
        </div>
        <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
          <p className="text-zinc-400 text-sm">Task ID: {task.id}</p>
          <p className="text-zinc-400 text-sm mt-1">
            Created: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
