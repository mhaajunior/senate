import axios from "axios";
import {
  InternDataType,
  InternValidationType,
  LoginValidationType,
} from "./validation";
import { signIn, SignInResponse } from "next-auth/react";

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

export const editIntern = async ({
  intern,
  verifyStatusIds,
}: {
  intern: InternValidationType;
  verifyStatusIds: number[];
}): Promise<BaseResponse> => {
  const res = await axios.put("/api/intern", {
    intern,
    verifyStatusIds,
  });
  return res.data;
};

export const updateInternStatus = async ({
  statusId,
  id,
  verifyIntern,
  verifyStatusIds,
}: {
  statusId: string;
  id: number;
  verifyIntern?: { officeId: string; groupId: string };
  verifyStatusIds: number[];
}): Promise<BaseResponse> => {
  const res = await axios.patch("/api/intern", {
    id,
    statusId,
    verifyIntern,
    verifyStatusIds,
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

export const fetchInternStatusCount = async (): Promise<InternCounts> => {
  const res = await axios.get("/api/internStatusCount");
  return res.data;
};

export const loginUser = async ({
  username,
  password,
}: LoginValidationType): Promise<SignInResponse> => {
  const res = await signIn("credentials", {
    redirect: false,
    username,
    password,
  });

  if (!res || res.error) {
    throw new Error(res?.error || "Unknown error");
  }

  return res;
};

interface FilterOptions {
  firstName?: string;
  latsName?: string;
  academy?: string;
  startDate?: Date;
  endDate?: Date;
  office?: string;
  group?: string;
}

interface InternsResponse extends BaseResponse {
  results: {
    data: InternDataType[];
    total: number;
  };
}

interface InternCounts extends BaseResponse {
  results: {
    internCounts: Record<string, number>;
  };
}

interface BaseResponse {
  success?: boolean;
  error?: string;
  results?: any;
}
