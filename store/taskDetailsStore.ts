import { Task } from "@/types/Task";
import { create } from "zustand";

interface TaskDetailsStore {
  selectedTask: Task | null;
  isOpen: boolean;
  openTaskDetails: (task: Task) => void;
  closeTaskDetails: () => void;
}

export const useTaskDetailsStore = create<TaskDetailsStore>((set) => ({
  selectedTask: null,
  isOpen: false,
  openTaskDetails: (task: Task) => set({ selectedTask: task, isOpen: true }),
  closeTaskDetails: () => set({ selectedTask: null, isOpen: false }),
}));
