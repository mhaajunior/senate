"use client";

import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { toast } from "sonner";
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
import { useDataStore } from "@/store/useDataStore";
import { cn } from "@/lib/utils";
import { useInternStatusCount } from "@/hooks/useInternStatusCount";
import { useQueryClient } from "@tanstack/react-query";

const page = () => {
  const queryClient = useQueryClient();
  const { requestStatus, parentVerifyStatus, internStatusCount } =
    useDataStore();
  const { page, setPage, pageSize, status, setStatus, options, setOptions } =
    useInternFilter();
  const { isLoading: isCountLoading, refetch: refetchCount } =
    useInternStatusCount(options);

  const [selection, setSelection] = useState<StatusSelectOption[]>([]);
  const [tableHeight, setTableHeight] = useState(200);
  const tableRef = useRef<HTMLDivElement>(null);

  const form = useForm<InternStatusValidationType>({
    resolver: zodResolver(InternStatusValidation),
    defaultValues: {
      internStatus: options.internStatus,
    },
  });

  const internStatus = form.watch("internStatus");

  const { data, isLoading, isError, isFetching, refetch } = useInterns({
    page,
    pageSize,
    status,
    options,
  });

  useEffect(() => {
    if (internStatus === "1") {
      setSelection(requestStatus);
    } else {
      setSelection(parentVerifyStatus);
    }
  }, [requestStatus, parentVerifyStatus]);

  useEffect(() => {
    if (isError) {
      toast.error("โหลดข้อมูลไม่สำเร็จ");
    }
  }, [isError]);

  useEffect(() => {
    if (!isLoading && tableRef.current) {
      setTableHeight(tableRef.current.offsetHeight || 200);
    }
  }, [isLoading, data]);

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
    refetchCount();
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
      setStatus(requestStatus[0].id);
    } else {
      setSelection(parentVerifyStatus);
      setStatus(parentVerifyStatus[0].id);
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
              count={internStatusCount[item.id] || 0}
              loading={isCountLoading}
            />
          ))}
        </div>
        {isLoading || isFetching ? (
          <div
            className={cn(
              "flex justify-center items-center transition-all duration-300 bg-muted",
              isFetching ? " blur-sm opacity-60" : ""
            )}
            style={{ height: `${tableHeight}px` }}
          >
            <Loader />
          </div>
        ) : (
          <div ref={tableRef}>
            <DataTable
              columns={columns}
              data={data?.results.data || []}
              internStatus={internStatus}
            />
          </div>
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
