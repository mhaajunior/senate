import { cn, formatThaiDateTime, isNull } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { DataTable } from "@/app/(main)/search/data-table";

export const columns: ColumnDef<any>[] = [
  {
    id: "rowNumber",
    header: "ลำดับ",
    cell: ({ row }) => row.index + 1,
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
    accessorKey: "status",
    header: "สถานะ",
    accessorFn: (row) => isNull(row.status),
  },
  {
    accessorKey: "upcomingDate",
    header: "วันที่ถึงกำหนด",
    accessorFn: (row) => formatThaiDateTime(row.upcomingDate),
  },
];

const UpcomingTable = () => {
  const isLoading = false;
  const isFetching = false;

  return (
    <Card>
      <CardHeader>
        <CardTitle>กิจกรรมใกล้ถึงกำหนด</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          {isLoading || isFetching ? (
            <div className="flex flex-col gap-2">
              <Skeleton className={cn("h-4 w-full")} />
              <Skeleton className={cn("h-36 w-full")} />
            </div>
          ) : (
            <div>
              <DataTable columns={columns} data={[]} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingTable;
