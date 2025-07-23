import StatusSelection from "@/components/StatusSelection";
import { useInterns } from "@/hooks/useInterns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";

const StatusColumn = ({ defaultVal }: { defaultVal: number }) => {
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, refetch } = useInterns({
    page,
    pageSize,
    status,
    options,
  });
  const form = useForm<InternStatusValidationType>({
    resolver: zodResolver(InternStatusValidation),
    defaultValues: defaultVal,
  });

  return (
    <StatusSelection
      form={form}
      statusOptions={internStatusOptions}
      loading={isLoading || isFetching}
      fieldName="statusId"
      label="สถานะ"
      submitFnc={(val, form) => {
        form.setValue("statusId", val);
        form.handleSubmit(onChangeStatus)();
      }}
    />
  );
};

export default StatusColumn;
