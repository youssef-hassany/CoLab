import { create } from "zustand";

interface SelectedTaskCategoryState {
  selectedTaskCategoryId: string | undefined;
  setSelectedTaskCategoryId: (id: string | undefined) => void;
}

export const useSelectedTaskCategoryStore = create<SelectedTaskCategoryState>(
  (set) => ({
    selectedTaskCategoryId: undefined,
    setSelectedTaskCategoryId: (id) => set({ selectedTaskCategoryId: id }),
  })
);
