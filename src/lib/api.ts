import { Intern } from "@/app/search/columns";
import axios from "axios";

export const uploadInternData = async (rows: string[][]) => {
  const res = await axios.post("/api/intern", { rows });
  return res.data;
};

export const fetchInterns = async ({
  page,
  pageSize,
  options,
}: {
  page: number;
  pageSize: number;
  options: FilterOptions;
}): Promise<InternsResponse> => {
  const res = await axios.get("/api/intern", {
    params: { page, pageSize, ...options },
  });
  return res.data;
};

interface FilterOptions {
  firstName?: string;
  latsName?: string;
  academy?: string;
  startDate?: Date;
  endDate?: Date;
}

interface InternsResponse extends BaseResponse {
  data: Intern[];
  total: number;
}

interface BaseResponse {
  success?: boolean;
  error?: string;
}
