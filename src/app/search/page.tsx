"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchInterns } from "@/lib/api";
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
import {
  internStatusOptions,
  requestStatusOptions,
  verifyStatusOptions,
} from "@/lib/options";
import TableSelection from "@/components/TableSelection";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { SelectItem } from "@/components/ui/select";

type FilterOptions = InternStatusValidationType & SearchFormValidationType;

const page = () => {
  const [page, setPage] = useState(1);
  const [selection, setSelection] = useState(requestStatusOptions);
  const [options, setOptions] = useState<FilterOptions>({ internStatus: "1" });
  const [status, setStatus] = useState(1);
  const pageSize = 100;
  const parentVerifyStatusOptions = verifyStatusOptions.filter(
    (item) => !item.parentId
  );

  const form = useForm<InternStatusValidationType>({
    resolver: zodResolver(InternStatusValidation),
    defaultValues: {
      internStatus: "1",
    },
  });

  const internStatus = form.watch("internStatus");

  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ["interns", page, options, status],
    queryFn: () => fetchInterns({ page, pageSize, status, options }),
  });

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
    setOptions((prev: SearchFormValidationType) => {
      const { office, group, ...rest } = prev;
      const cleanedOptions = values.internStatus === "1" ? rest : prev;
      return {
        ...cleanedOptions,
        internStatus: values.internStatus,
      };
    });
    if (values.internStatus === "1") {
      setSelection(requestStatusOptions);
    } else {
      setSelection(parentVerifyStatusOptions);
    }
    refetch();
  };

  return (
    <>
      <Title>ค้นหาเด็กฝึกงาน</Title>

      <Form {...form}>
        <form className="flex flex-col gap-6">
          <div className="flex gap-6 flex-wrap">
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="internStatus"
              label="สถานะหลัก"
              placeholder="เลือกสถานะ"
              width="w-[240px]"
              loading={isLoading || isFetching}
              submitBtn
              submitFnc={(val) => {
                form.setValue("internStatus", val);
                form.handleSubmit(onChangeInternStatus)();
              }}
            >
              {internStatusOptions.map((status) => (
                <SelectItem key={status.id} value={String(status.id)}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <p>{status.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>
          </div>
        </form>
      </Form>

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
