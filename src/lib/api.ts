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
      statusId: String(status),
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

export const updateInternStatus = async ({
  statusId,
  id,
}: {
  statusId: string;
  id: number;
}): Promise<BaseResponse> => {
  const res = await axios.patch("/api/intern", {
    id,
    statusId,
  });
  return res.data;
};

export const fetchStatus = async (): Promise<BaseResponse> => {
  const res = await axios.get("/api/status");
  return res.data;
};

export const fetchOffice = async (): Promise<BaseResponse> => {
  const res = await axios.get("/api/office");
  return res.data;
};

export const fetchGroup = async (): Promise<BaseResponse> => {
  const res = await axios.get("/api/group");
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
