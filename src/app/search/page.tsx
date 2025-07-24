"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchStatus } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "@/components/Loader";
import { PaginationControlled } from "@/components/PaginationControlled";
import Title from "@/components/Title";
import SearchForm from "@/components/SearchForm";
import {
  InternStatusValidation,
  InternStatusValidationType,
  SearchFormValidationType,
} from "@/lib/validation";
import { internStatusOptions, StatusSelectOption } from "@/lib/options";
import TableSelection from "@/components/TableSelection";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import StatusSelection from "@/components/StatusSelection";
import { useInterns } from "@/hooks/useInterns";
import { useInternFilter } from "@/store/useInternFilter";

const page = () => {
  const { page, setPage, pageSize, status, setStatus, options, setOptions } =
    useInternFilter();

  const [requestStatus, setRequestStatus] = useState<StatusSelectOption[]>([]);
  const [verifyStatus, setVerifyStatus] = useState<StatusSelectOption[]>([]);
  const [selection, setSelection] = useState<StatusSelectOption[]>([]);

  const form = useForm<InternStatusValidationType>({
    resolver: zodResolver(InternStatusValidation),
    defaultValues: {
      internStatus: "1",
    },
  });

  const internStatus = form.watch("internStatus");

  const { data, isLoading, isError, isFetching, refetch } = useInterns({
    page,
    pageSize,
    status,
    options,
  });

  const { data: statusResponse, isSuccess } = useQuery({
    queryKey: ["status"],
    queryFn: () => fetchStatus(),
  });

  useEffect(() => {
    if (isSuccess && statusResponse?.results?.status) {
      const { status } = statusResponse?.results;
      const requestStatusOptions = status.filter(
        (s: StatusSelectOption) => s.type === 1
      );
      setRequestStatus(requestStatusOptions);
      const parentVerifyStatusOptions = status.filter(
        (s: StatusSelectOption) => s.type === 2 && !s.parentId
      );
      setVerifyStatus(parentVerifyStatusOptions);
      setSelection(requestStatusOptions);
    }
  }, [isSuccess, statusResponse]);

  useEffect(() => {
    if (isError) {
      toast.error("โหลดข้อมูลไม่สำเร็จ");
    }
  }, [isError]);

  const totalPages = data?.success
    ? Math.ceil(data.results.total / pageSize)
    : 0;

  const onSubmitData = (values: SearchFormValidationType) => {
    const cleanedValues = Object.fromEntries(
      Object.entries(values).filter(([_, v]) => v !== "")
    );
    setOptions((prev) => ({
      ...cleanedValues,
      internStatus: prev.internStatus,
    }));
    refetch();
  };

  const onChangeStatus = (status: number) => {
    setStatus(status);
    setPage(1);
    refetch();
  };

  const onChangeInternStatus = async (values: InternStatusValidationType) => {
    setOptions((prev) => {
      const { office, group, ...rest } = prev;
      const cleanedOptions = values.internStatus === "1" ? rest : prev;
      return {
        ...cleanedOptions,
        internStatus: values.internStatus,
      };
    });
    if (values.internStatus === "1") {
      setSelection(requestStatus);
    } else {
      setSelection(verifyStatus);
    }
    refetch();
  };

  return (
    <>
      <Title>ค้นหาเด็กฝึกงาน</Title>

      <StatusSelection
        form={form}
        statusOptions={internStatusOptions}
        loading={isLoading || isFetching}
        fieldName="internStatus"
        label="สถานะหลัก"
        width="w-[240px]"
        submitFnc={(val, form) => {
          form.setValue("internStatus", val);
          form.handleSubmit(onChangeInternStatus)();
        }}
      />

      <Card>
        <CardHeader>
          <CardTitle>ตัวกรอง</CardTitle>
        </CardHeader>
        <CardContent>
          <SearchForm
            onSubmitData={onSubmitData}
            isLoading={isLoading || isFetching}
            internStatus={internStatus}
          />
        </CardContent>
      </Card>

      <div>
        <div className="flex flex-wrap">
          {selection.map((item) => (
            <TableSelection
              key={item.id}
              label={item.name}
              onClick={() => onChangeStatus(item.id)}
              active={item.id === status}
              count={data?.results.statusCounts[item.id] || 0}
              loading={isLoading || isFetching}
            />
          ))}
        </div>
        {isLoading || isFetching ? (
          <div className="flex justify-center items-center h-[60px]">
            <Loader />
          </div>
        ) : (
          <DataTable columns={columns} data={data?.results.data || []} />
        )}
      </div>
      {!isLoading && !isFetching && totalPages > 1 && (
        <PaginationControlled
          totalPages={totalPages}
          currentPage={page}
          onPageChange={setPage}
        />
      )}
    </>
  );
};

export default page;
