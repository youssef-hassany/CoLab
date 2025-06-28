import { StatusConfig, Task, TaskStatus } from "@/types/Task";
import { Plus } from "lucide-react";
import React from "react";
import TaskCard from "./TaskCard";

interface KanbanColumnProps {
  status: TaskStatus;
  config: StatusConfig;
  tasks: Task[];
  onDrop: (e: React.DragEvent<HTMLDivElement>, newStatus: TaskStatus) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  config,
  tasks,
  onDrop,
  onDragOver,
}) => {
  return (
    <div className="flex-1 bg-zinc-900 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${config.color}`}></div>
          <h3 className="font-semibold text-white">{config.title}</h3>
          <span className="bg-zinc-700 text-zinc-300 px-2 py-1 rounded-full text-xs">
            {tasks.length}
          </span>
        </div>
        <button className="text-zinc-400 hover:text-white transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div
        className="min-h-[500px] space-y-2"
        onDrop={(e: React.DragEvent<HTMLDivElement>) => onDrop(e, status)}
        onDragOver={onDragOver}
      >
        {tasks.map((task: Task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDragStart={(e: React.DragEvent<HTMLDivElement>, task: Task) => {
              e.dataTransfer.setData("text/plain", JSON.stringify(task));
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;
