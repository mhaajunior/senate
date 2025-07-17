"use client";

import { Button } from "@/components/ui/button";
import { formatThaiDateTime, isNull } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

export type Intern = {
  id: number;
  iden: string;
  prefix: string;
  firstName: string;
  lastName: string;
  academy: string;
  faculty: string;
  branch: string;
  phone: string;
  email: string;
  startDate: string;
  endDate: string;
  preferredJob: string;
  sendDate: string;
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<Intern>[] = [
  {
    accessorKey: "id",
    header: "รหัส",
    size: 50,
  },
  {
    accessorKey: "sendDate",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          className="font-bold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          วันที่ส่งคำขอ
          {isSorted === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : isSorted === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      );
    },
    accessorFn: (row) => formatThaiDateTime(row.sendDate, true),
  },
  {
    accessorKey: "iden",
    header: "หมายเลขประจำตัวประชาชน",
    accessorFn: (row) => isNull(row.iden),
  },
  {
    accessorKey: "prefix",
    header: "คำนำหน้า",
    accessorFn: (row) => isNull(row.prefix),
  },
  {
    accessorKey: "firstName",
    header: "ชื่อ",
    accessorFn: (row) => isNull(row.firstName),
    size: 150,
  },
  {
    accessorKey: "lastName",
    header: "นามสกุล",
    accessorFn: (row) => isNull(row.lastName),
    size: 150,
  },
  {
    accessorKey: "academy",
    header: "สถานศึกษา",
    accessorFn: (row) => isNull(row.academy),
    size: 200,
  },
  {
    accessorKey: "faculty",
    header: "คณะ",
    accessorFn: (row) => isNull(row.faculty),
    size: 200,
  },
  {
    accessorKey: "branch",
    header: "สาขา",
    accessorFn: (row) => isNull(row.branch),
    size: 200,
  },
  {
    accessorKey: "phone",
    header: "หมายเลขโทรศัพท์",
    accessorFn: (row) => isNull(row.phone),
  },
  {
    accessorKey: "email",
    header: "อีเมล",
    accessorFn: (row) => isNull(row.email),
    size: 200,
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          className="font-bold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          วันที่เริ่มฝึกงาน
          {isSorted === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : isSorted === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      );
    },
    accessorFn: (row) => formatThaiDateTime(row.startDate),
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          className="font-bold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          วันที่สิ้นสุดฝึกงาน
          {isSorted === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : isSorted === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      );
    },
    accessorFn: (row) => formatThaiDateTime(row.endDate),
  },
  {
    accessorKey: "preferredJob",
    header: "สำนัก/กลุ่มงาน/ลักษณะงาน ที่สนใจฝึกงาน",
    accessorFn: (row) => isNull(row.preferredJob),
  },
];
