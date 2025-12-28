import { create } from 'zustand';

interface UIState {
  isEditMode: boolean;
  isSidebarOpen: boolean;
  activeSection: number | null;
  toggleEditMode: () => void;
  toggleSidebar: () => void;
  setActiveSection: (id: number | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isEditMode: false,
  isSidebarOpen: true,
  activeSection: null,
  toggleEditMode: () => set((state) => ({ isEditMode: !state.isEditMode })),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setActiveSection: (id) => set({ activeSection: id }),
}));
