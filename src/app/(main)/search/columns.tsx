"use client";

import { EditDialog } from "@/components/EditDialog";
import { Button } from "@/components/ui/button";
import { formatThaiDateTime, isNull } from "@/lib/utils";
import { InternDataType } from "@/lib/validation";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import StatusColumn from "@/components/StatusColumn";

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
    accessorKey: "approveDate",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          className="font-bold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          วันที่ตอบรับ
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
    accessorFn: (row) => formatThaiDateTime(row.createdAt, true),
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
    accessorKey: "office",
    header: "สำนัก",
    accessorFn: (row) => isNull(row.office?.name),
  },
  {
    accessorKey: "group",
    header: "กลุ่มงาน",
    accessorFn: (row) => isNull(row.group?.name),
  },
  {
    id: "actions",
    header: "ดู/แก้ไข",
    cell: ({ row }) => {
      const intern = row.original;

      return <EditDialog intern={intern} />;
    },
  },
  {
    accessorKey: "status",
    header: "สถานะ",
    cell: ({ row }) => {
      const intern = row.original;

      return <StatusColumn intern={intern} />;
    },
  },
];
