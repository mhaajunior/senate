import { useQuery } from "@tanstack/react-query";
import { fetchInterns } from "@/lib/api";
import { FilterOptions } from "@/store/useInternFilter";

export function useInterns({
  page,
  pageSize,
  status,
  options,
}: {
  page: number;
  pageSize: number;
  status: number;
  options: FilterOptions;
}) {
  return useQuery({
    queryKey: ["interns", page, pageSize, options, status],
    queryFn: () => fetchInterns({ page, pageSize, status, options }),
  });
}
