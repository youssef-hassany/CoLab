import { StatusConfig, Task, TaskStatus } from "@/types/Task";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import TaskCard from "./TaskCard";
import { CreateTaskModal } from "./CreateTaskModal";
import { getTasksByStatus } from "@/utils/getTasksByStatus";
import { useGetTasks } from "@/hooks/server/tasks/useGetTasks";
import { useSelectedTaskCategoryStore } from "@/store/selectedTaskCategoryStore";

interface KanbanColumnProps {
  status: TaskStatus;
  config: StatusConfig;
  onDrop: (e: React.DragEvent<HTMLDivElement>, newStatus: TaskStatus) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  teamId: string;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  config,
  onDrop,
  onDragOver,
  teamId,
}) => {
  const { selectedTaskCategoryId } = useSelectedTaskCategoryStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data: tasksData = [] } = useGetTasks(
    teamId as string,
    selectedTaskCategoryId
  );

  const tasks = getTasksByStatus(tasksData, status);

  return (
    <>
      <div className="flex-1 bg-zinc-900 rounded-lg p-3 lg:p-4 lg:max-w-60">
        <div className="flex items-center justify-between mb-3 lg:mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${config.color}`}></div>
            <h3 className="font-semibold text-white text-sm lg:text-base">
              {config.title}
            </h3>
            <span className="bg-zinc-700 text-zinc-300 px-2 py-1 rounded-full text-xs">
              {tasks.length}
            </span>
          </div>
          <button
            className="text-zinc-400 hover:text-white transition-colors"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div
          className="min-h-[300px] lg:min-h-[500px] space-y-2"
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

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        teamId={teamId}
        defaultStatus={status}
      />
    </>
  );
};

export default KanbanColumn;
