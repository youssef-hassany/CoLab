import { Task } from "@/types/Task";
import { GripVertical } from "lucide-react";
import React from "react";

interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDragStart }) => {
  const priorityColors: Record<Task["priority"], string> = {
    high: "border-l-red-500",
    medium: "border-l-yellow-500",
    low: "border-l-green-500",
  };

  return (
    <div
      draggable
      onDragStart={(e: React.DragEvent<HTMLDivElement>) => onDragStart(e, task)}
      className={`bg-zinc-700 rounded-lg p-4 mb-3 border-l-4 ${
        priorityColors[task.priority]
      } cursor-move hover:bg-zinc-600 transition-colors`}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-white text-sm">{task.title}</h4>
        <GripVertical className="w-4 h-4 text-zinc-400" />
      </div>
      <p className="text-zinc-300 text-xs mb-3">{task.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-400">{task.assignee}</span>
        <span
          className={`px-2 py-1 rounded text-xs ${
            task.priority === "high"
              ? "bg-red-900 text-red-200"
              : task.priority === "medium"
              ? "bg-yellow-900 text-yellow-200"
              : "bg-green-900 text-green-200"
          }`}
        >
          {task.priority}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;
