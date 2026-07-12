import { create } from 'zustand'

interface NavigationState {
  selectedWeek: number | null
  knowledgeTab: 'weeks' | 'categories'
  setSelectedWeek: (week: number | null) => void
  setKnowledgeTab: (tab: 'weeks' | 'categories') => void
}

export const useNavigationStore = create<NavigationState>((set) => ({
  selectedWeek: null,
  knowledgeTab: 'categories',
  setSelectedWeek: (week) => set({ selectedWeek: week }),
  setKnowledgeTab: (tab) => set({ knowledgeTab: tab }),
}))
