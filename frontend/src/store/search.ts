import { create } from 'zustand';

interface SearchState {
  dashboardQuery: string;
  setDashboardQuery: (query: string) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  dashboardQuery: '',
  setDashboardQuery: (query) => set({ dashboardQuery: query }),
})); 