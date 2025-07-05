import { Task, TaskStatus } from "@/types/Task";

export const getTasksByStatus = (tasks: Task[], status: TaskStatus): Task[] => {
  // Ensure tasks is an array before filtering
  if (!Array.isArray(tasks)) {
    return [];
  }

  return tasks.filter((task: Task) => task.status === status);
};
