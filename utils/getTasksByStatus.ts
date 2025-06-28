import { Task, TaskStatus } from "@/types/Task";

export const getTasksByStatus = (tasks: Task[], status: TaskStatus): Task[] => {
  return tasks.filter((task: Task) => task.status === status);
};
