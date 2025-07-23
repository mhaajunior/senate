import axios from "axios";
import { InternDataType, InternValidationType } from "./validation";

export const uploadInternData = async (
  rows: string[][]
): Promise<BaseResponse> => {
  const res = await axios.post("/api/intern", { rows });
  return res.data;
};

export const fetchInterns = async ({
  page,
  pageSize,
  options,
  status,
}: {
  page: number;
  pageSize: number;
  status: number;
  options: FilterOptions;
}): Promise<InternsResponse> => {
  const res = await axios.get("/api/intern", {
    params: {
      page: String(page),
      pageSize: String(pageSize),
      status: String(status),
      ...options,
    },
  });
  return res.data;
};

export const editIntern = async (
  intern: InternValidationType
): Promise<BaseResponse> => {
  const res = await axios.put("/api/intern", {
    intern,
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
  results: {
    data: InternDataType[];
    total: number;
    statusCounts: Record<string, number>;
  };
}

interface BaseResponse {
  success?: boolean;
  error?: string;
  results?: any;
}
