import { create } from "zustand";

interface TeamModalState {
  isJoinModalOpen: boolean;
  isCreateModalOpen: boolean;
  openJoinModal: () => void;
  closeJoinModal: () => void;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  closeAllModals: () => void;
  toggleJoinModal: () => void;
  toggleCreateModal: () => void;
}

export const useTeamModalStore = create<TeamModalState>((set) => ({
  isJoinModalOpen: false,
  isCreateModalOpen: false,

  openJoinModal: () =>
    set((state) => ({
      isJoinModalOpen: true,
      isCreateModalOpen: false, // Ensure only one modal is open at a time
    })),

  closeJoinModal: () => set({ isJoinModalOpen: false }),

  openCreateModal: () =>
    set((state) => ({
      isCreateModalOpen: true,
      isJoinModalOpen: false, // Ensure only one modal is open at a time
    })),

  closeCreateModal: () => set({ isCreateModalOpen: false }),

  closeAllModals: () =>
    set({
      isJoinModalOpen: false,
      isCreateModalOpen: false,
    }),

  toggleJoinModal: () =>
    set((state) => ({
      isJoinModalOpen: !state.isJoinModalOpen,
      isCreateModalOpen: false, // Close create modal when toggling join
    })),

  toggleCreateModal: () =>
    set((state) => ({
      isCreateModalOpen: !state.isCreateModalOpen,
      isJoinModalOpen: false, // Close join modal when toggling create
    })),
}));

// Usage example:
// const {
//   isJoinModalOpen,
//   isCreateModalOpen,
//   openJoinModal,
//   closeJoinModal,
//   openCreateModal,
//   closeCreateModal,
//   toggleJoinModal,
//   toggleCreateModal,
//   closeAllModals
// } = useTeamModalStore()
