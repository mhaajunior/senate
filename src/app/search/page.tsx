"use client";

import Title from "@/components/Title";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchInterns } from "@/lib/api";
import { Loader } from "@/components/Loader";
import { PaginationControlled } from "@/components/PaginationControlled";

const page = () => {
  const [page, setPage] = useState(1);
  const pageSize = 100;

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["interns", page],
    queryFn: () => fetchInterns({ page, pageSize }),
  });

  useEffect(() => {
    if (isError) {
      toast.error("โหลดข้อมูลไม่สำเร็จ");
    }
  }, [isError]);

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

  return (
    <>
      <Title>ค้นหาเด็กฝึกงาน</Title>
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
          <CardAction>Card Action</CardAction>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>

      {isLoading || isFetching ? (
        <div className="flex justify-center">
          <Loader />
        </div>
      ) : (
        <>
          <DataTable columns={columns} data={data?.data || []} />
          {totalPages > 1 && (
            <PaginationControlled
              totalPages={totalPages}
              currentPage={page}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </>
  );
};

export default page;
