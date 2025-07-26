import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PublicStore {
  answeredIds: number[];
  selectedSubjectIds: number[];
  addAnsweredId: (id: number) => void;
  setSelectedSubjectIds: (ids: number[]) => void;
  reset: () => void;
}

export const usePublicStore = create<PublicStore>()(
  persist(
    (set, get) => ({
      answeredIds: [],
      selectedSubjectIds: [],
      addAnsweredId: (id: number) => {
        const current = get().answeredIds;
        if (!current.includes(id)) {
          set({ answeredIds: [...current, id] });
        }
      },
      setSelectedSubjectIds: (ids) => set({ selectedSubjectIds: ids }),
      reset: () => set({ answeredIds: [], selectedSubjectIds: [] }),
    }),
    {
      name: "public-question-store",
      partialize: (state) => ({
        answeredIds: state.answeredIds,
        selectedSubjectIds: state.selectedSubjectIds,
      }),
    }
  )
);
