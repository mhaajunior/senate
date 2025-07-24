import { z } from "zod";
import { StatusSelectOption } from "./options";

const thaiPhoneRegex = /^(06|08|09)\d{8}$/;

export const InternStatusValidation = z.object({
  internStatus: z.string(),
});

export type InternStatusValidationType = z.infer<typeof InternStatusValidation>;

export const StatusValidation = z.object({
  statusId: z.string(),
});

export type StatusValidationType = z.infer<typeof StatusValidation>;

export const SearchFormValidation = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  academy: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  office: z.string().optional(),
  group: z.string().optional(),
});

export type SearchFormValidationType = z.infer<typeof SearchFormValidation>;

export const InternValidation = z.object({
  id: z.number(),
  iden: z
    .string({ message: "ข้อมูลไม่ถูกต้อง" })
    .min(1, { message: "กรุณากรอกข้อมูล" })
    .length(13, { message: "ข้อมูลไม่ถูกต้อง" }),
  prefix: z
    .string({ message: "ข้อมูลไม่ถูกต้อง" })
    .min(1, { message: "กรุณากรอกข้อมูล" }),
  firstName: z
    .string({ message: "ข้อมูลไม่ถูกต้อง" })
    .min(1, { message: "กรุณากรอกข้อมูล" }),
  lastName: z
    .string({ message: "ข้อมูลไม่ถูกต้อง" })
    .min(1, { message: "กรุณากรอกข้อมูล" }),
  academy: z
    .string({ message: "ข้อมูลไม่ถูกต้อง" })
    .min(1, { message: "กรุณากรอกข้อมูล" }),
  faculty: z
    .string({ message: "ข้อมูลไม่ถูกต้อง" })
    .min(1, { message: "กรุณากรอกข้อมูล" }),
  branch: z
    .string({ message: "ข้อมูลไม่ถูกต้อง" })
    .min(1, { message: "กรุณากรอกข้อมูล" }),
  phone: z
    .string({ message: "ข้อมูลไม่ถูกต้อง" })
    .min(1, { message: "กรุณากรอกข้อมูล" })
    .regex(thaiPhoneRegex, {
      message: "ข้อมูลไม่ถูกต้อง",
    }),
  email: z
    .email({ message: "ข้อมูลไม่ถูกต้อง" })
    .min(1, { message: "กรุณากรอกข้อมูล" }),
  startDate: z
    .date({ message: "ข้อมูลไม่ถูกต้อง" })
    .min(1, { message: "กรุณากรอกข้อมูล" }),
  endDate: z
    .date({ message: "ข้อมูลไม่ถูกต้อง" })
    .min(1, { message: "กรุณากรอกข้อมูล" }),
  preferredJob: z
    .string({ message: "ข้อมูลไม่ถูกต้อง" })
    .min(1, { message: "กรุณากรอกข้อมูล" }),
  statusId: z.string(),
});

export type InternValidationType = z.infer<typeof InternValidation>;

export type InternDataType = InternValidationType & {
  status: StatusSelectOption;
  sendDate: Date;
  updatedAt: Date;
  createdAt: Date;
};
