import axios from "axios";

export const uploadInternData = async (rows: string[][]) => {
  const res = await axios.post("/api/intern", { rows });
  return res.data;
};
