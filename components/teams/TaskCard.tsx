import { useTaskDetailsStore } from "@/store/taskDetailsStore";
import { Task, TaskPriority } from "@/types/Task";
import { GripVertical, Calendar } from "lucide-react";
import React from "react";
import { formatDeadline, getDeadlineClasses } from "@/utils/date";

interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDragStart }) => {
  const { openTaskDetails } = useTaskDetailsStore();
  const priorityColors: Record<TaskPriority, string> = {
    HIGH: "border-l-red-500",
    MEDIUM: "border-l-yellow-500",
    LOW: "border-l-green-500",
  };

  const priorityLabels: Record<TaskPriority, string> = {
    HIGH: "High",
    MEDIUM: "Medium",
    LOW: "Low",
  };

  return (
    <div
      draggable
      onDragStart={(e: React.DragEvent<HTMLDivElement>) => onDragStart(e, task)}
      className={`bg-zinc-700 rounded-lg p-4 mb-3 border-l-4 ${
        priorityColors[task.priority]
      } cursor-move hover:bg-zinc-600 transition-colors`}
      onClick={() => openTaskDetails(task)}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-white text-sm">{task.title}</h4>
        <GripVertical className="w-4 h-4 text-zinc-400" />
      </div>
      <p className="text-zinc-300 text-xs mb-3">{task.description}</p>

      {/* Deadline */}
      {task.deadline && (
        <div className="flex items-center gap-1 mb-3">
          <Calendar className="w-3 h-3 text-zinc-400" />
          <span className={`text-xs ${getDeadlineClasses(task.deadline).text}`}>
            {formatDeadline(task.deadline)}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-400">{task.assignee}</span>
        <span
          className={`px-2 py-1 rounded text-xs ${
            task.priority === "HIGH"
              ? "bg-red-900 text-red-200"
              : task.priority === "MEDIUM"
              ? "bg-yellow-900 text-yellow-200"
              : "bg-green-900 text-green-200"
          }`}
        >
          {priorityLabels[task.priority]}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;
