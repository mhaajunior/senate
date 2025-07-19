"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchInterns } from "@/lib/api";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "@/components/Loader";
import { PaginationControlled } from "@/components/PaginationControlled";
import Title from "@/components/Title";
import SearchForm from "@/components/SearchForm";
import { SearchFormValidation } from "@/lib/validation";

const page = () => {
  const [page, setPage] = useState(1);
  const [options, setOptions] = useState({});
  const pageSize = 100;

  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ["interns", page, options],
    queryFn: () => fetchInterns({ page, pageSize, options }),
  });

  useEffect(() => {
    if (isError) {
      toast.error("โหลดข้อมูลไม่สำเร็จ");
    }
  }, [isError]);

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

  const onSubmitData = (values: z.infer<typeof SearchFormValidation>) => {
    const cleanedValues = Object.fromEntries(
      Object.entries(values).filter(([_, v]) => v !== "")
    );
    setOptions(cleanedValues);
    refetch();
  };

  return (
    <>
      <Title>ค้นหาเด็กฝึกงาน</Title>
      <Card>
        <CardHeader>
          <CardTitle>ตัวกรอง</CardTitle>
        </CardHeader>
        <CardContent>
          <SearchForm
            onSubmitData={onSubmitData}
            isLoading={isLoading || isFetching}
          />
        </CardContent>
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
