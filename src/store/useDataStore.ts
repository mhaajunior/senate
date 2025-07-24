import { fetchGroup, fetchOffice, fetchStatus } from "@/lib/api";
import {
  GroupSelectOption,
  SelectOption,
  StatusSelectOption,
} from "@/lib/options";
import { create } from "zustand";

interface DataStore {
  office: SelectOption[];
  group: GroupSelectOption[];
  status: StatusSelectOption[];
  requestStatus: StatusSelectOption[];
  parentVerifyStatus: StatusSelectOption[];
  fetchOffice: () => Promise<void>;
  fetchGroup: () => Promise<void>;
  fetchStatus: () => Promise<void>;
}

export const useDataStore = create<DataStore>((set) => ({
  office: [],
  group: [],
  status: [],
  requestStatus: [],
  parentVerifyStatus: [],
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
        (s: StatusSelectOption) => s.type === 1
      );
      set({ requestStatus });
      const parentVerifyStatus = status.filter(
        (s: StatusSelectOption) => s.type === 2 && !s.parentId
      );
      set({ parentVerifyStatus });
    }
  },
}));
