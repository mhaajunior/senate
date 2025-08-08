import { useQuery } from "@tanstack/react-query";
import { useDataStore } from "../store/useDataStore";
import { fetchInternStatusCount } from "@/lib/api";
import { useEffect } from "react";
import { FilterOptions } from "../store/useInternFilter";

export const useInternStatusCount = (options?: FilterOptions) => {
  const set = useDataStore((state) => state.set);

  const query = useQuery({
    queryKey: ["internStatusCount", options],
    queryFn: () => fetchInternStatusCount({ options }),
  });

  useEffect(() => {
    if (query.isSuccess && query.data?.success) {
      set({ internStatusCount: query.data.results.internCounts });
      set({ overallStatusCount: query.data.results.overallCounts });
    }
  }, [query.isSuccess, query.data]);

  return query;
};
