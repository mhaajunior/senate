import { z } from "zod";

export const SearchFormValidation = z.object({
  internStatus: z.enum(["1", "2"]),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  academy: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  office: z.string().optional(),
  group: z.string().optional(),
});
