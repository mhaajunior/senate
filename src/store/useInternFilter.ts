import { create } from "zustand";
import {
  InternStatusValidationType,
  SearchFormValidationType,
} from "@/lib/validation";

export type FilterOptions = InternStatusValidationType &
  SearchFormValidationType;

interface InternFilterState {
  page: number;
  pageSize: number;
  status: number;
  options: FilterOptions;

  setPage: (p: number) => void;
  setPageSize: (size: number) => void;
  setStatus: (status: number) => void;
  setOptions: (
    options: FilterOptions | ((prev: FilterOptions) => FilterOptions)
  ) => void;
}

export const useInternFilter = create<InternFilterState>((set) => ({
  page: 1,
  pageSize: 100,
  status: 1,
  options: { internStatus: "1" },

  setPage: (p) => set({ page: p }),
  setPageSize: (size) => set({ pageSize: size }),
  setStatus: (status) => set({ status }),
  setOptions: (updater) =>
    set((state) => ({
      options: typeof updater === "function" ? updater(state.options) : updater,
    })),
}));
