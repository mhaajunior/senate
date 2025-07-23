import { useQuery } from "@tanstack/react-query";
import { fetchInterns } from "@/lib/api";

export function useInterns({
  page,
  pageSize,
  status,
  options,
}: {
  page: number;
  pageSize: number;
  status: number;
  options?: any;
}) {
  return useQuery({
    queryKey: ["interns", page, options, status],
    queryFn: () => fetchInterns({ page, pageSize, status, options }),
  });
}
