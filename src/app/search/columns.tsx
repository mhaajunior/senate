"use client";

import { EditDialog } from "@/components/EditDialog";
import { Button } from "@/components/ui/button";
import { formatThaiDateTime, isNull } from "@/lib/utils";
import { InternDataType } from "@/lib/validation";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<InternDataType>[] = [
  {
    id: "rowNumber",
    header: "ลำดับ",
    cell: ({ row }) => row.index + 1,
    enableSorting: false,
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
    header: "ID Card",
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
  },
  {
    accessorKey: "lastName",
    header: "นามสกุล",
    accessorFn: (row) => isNull(row.lastName),
  },
  {
    accessorKey: "academy",
    header: "สถานศึกษา",
    accessorFn: (row) => isNull(row.academy),
  },
  {
    accessorKey: "faculty",
    header: "คณะ",
    accessorFn: (row) => isNull(row.faculty),
  },
  {
    accessorKey: "branch",
    header: "สาขา",
    accessorFn: (row) => isNull(row.branch),
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
          เริ่มฝึกงาน
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
          สิ้นสุดฝึกงาน
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
  {
    accessorKey: "updatedAt",
    header: "แก้ไขล่าสุด",
    accessorFn: (row) => formatThaiDateTime(row.updatedAt, true),
  },
  {
    id: "actions",
    header: "แก้ไข",
    cell: ({ row }) => {
      const intern = row.original;

      return <EditDialog intern={intern} />;
    },
  },
  {
    accessorKey: "status",
    header: "สำนัก/กลุ่มงาน/ลักษณะงาน ที่สนใจฝึกงาน",
    accessorFn: (row) => isNull(row.preferredJob),
  },
];
