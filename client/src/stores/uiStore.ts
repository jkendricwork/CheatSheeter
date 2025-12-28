import { create } from 'zustand';

interface UIState {
  isEditMode: boolean;
  isSidebarOpen: boolean;
  activeSection: number | null;
  collapsedSections: Set<number>;
  toggleEditMode: () => void;
  toggleSidebar: () => void;
  setActiveSection: (id: number | null) => void;
  toggleSectionCollapse: (sectionId: number) => void;
  expandSection: (sectionId: number) => void;
  collapseSection: (sectionId: number) => void;
  setAllSectionsCollapsed: (collapsed: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isEditMode: false,
  isSidebarOpen: true,
  activeSection: null,
  collapsedSections: new Set(),
  toggleEditMode: () => set((state) => ({ isEditMode: !state.isEditMode })),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setActiveSection: (id) => set({ activeSection: id }),
  toggleSectionCollapse: (sectionId) => set((state) => {
    const newCollapsed = new Set(state.collapsedSections);
    if (newCollapsed.has(sectionId)) {
      newCollapsed.delete(sectionId);
    } else {
      newCollapsed.add(sectionId);
    }
    return { collapsedSections: newCollapsed };
  }),
  expandSection: (sectionId) => set((state) => {
    const newCollapsed = new Set(state.collapsedSections);
    newCollapsed.delete(sectionId);
    return { collapsedSections: newCollapsed };
  }),
  collapseSection: (sectionId) => set((state) => {
    const newCollapsed = new Set(state.collapsedSections);
    newCollapsed.add(sectionId);
    return { collapsedSections: newCollapsed };
  }),
  setAllSectionsCollapsed: (collapsed) => set(() => ({
    collapsedSections: collapsed ? new Set() : new Set(),
  })),
}));
