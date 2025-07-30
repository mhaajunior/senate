import { fetchGroup, fetchOffice, fetchStatus } from "@/lib/api";
import {
  GroupSelectOption,
  SelectOption,
  StatusSelectOption,
} from "@/lib/options";
import { create } from "zustand";

interface DataStore {
  set: (data: Partial<DataStore>) => void;
  office: SelectOption[];
  group: GroupSelectOption[];
  status: StatusSelectOption[];
  requestStatus: StatusSelectOption[];
  parentVerifyStatus: StatusSelectOption[];
  internStatusCount: Record<string, number>;
  fetchOffice: () => Promise<void>;
  fetchGroup: () => Promise<void>;
  fetchStatus: () => Promise<void>;
}

export const useDataStore = create<DataStore>((set) => ({
  set: (data) => set(data),
  office: [],
  group: [],
  status: [],
  requestStatus: [],
  parentVerifyStatus: [],
  internStatusCount: {},
  verifyStatusCount: {},
  fetchOffice: async () => {
    const res = await fetchOffice();
    if (res.success) {
      set({ office: res.results.office });
    }
  },
  fetchGroup: async () => {
    const res = await fetchGroup();
    if (res.success) {
      set({ group: res.results.group });
    }
  },
  fetchStatus: async () => {
    const res = await fetchStatus();
    if (res.success) {
      const { status } = res.results;
      set({ status });
      const requestStatus = status.filter(
        (s: StatusSelectOption) => s.type === 1 || s.type === 3
      );
      set({ requestStatus });
      const parentVerifyStatus = status.filter(
        (s: StatusSelectOption) => (s.type === 2 || s.type === 3) && !s.parentId
      );
      set({ parentVerifyStatus });
    }
  },
}));
