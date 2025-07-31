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
  verifyStatus: StatusSelectOption[];
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
  verifyStatus: [],
  parentVerifyStatus: [],
  internStatusCount: {},
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
      const { status, requestStatus, verifyStatus } = res.results;
      set({ status });
      set({ requestStatus });
      set({ verifyStatus });

      const parentVerifyStatus = verifyStatus.filter(
        (s: StatusSelectOption) => !s.parentId
      );
      set({ parentVerifyStatus });
    }
  },
}));
