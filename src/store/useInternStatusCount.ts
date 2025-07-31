import { useQuery } from "@tanstack/react-query";
import { useDataStore } from "./useDataStore";
import { fetchInternStatusCount } from "@/lib/api";
import { useEffect } from "react";

export const useInternStatusCount = () => {
  const set = useDataStore((state) => state.set);

  const query = useQuery({
    queryKey: ["internStatusCount"],
    queryFn: () => fetchInternStatusCount(),
  });

  useEffect(() => {
    if (query.isSuccess && query.data?.success) {
      set({ internStatusCount: query.data.results.internCounts });
    }
  }, [query.isSuccess, query.data]);

  return query;
};
