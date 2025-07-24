import StatusSelection from "@/components/StatusSelection";
import { useInterns } from "@/hooks/useInterns";
import { fetchStatus } from "@/lib/api";
import { StatusSelectOption } from "@/lib/options";
import {
  InternDataType,
  StatusValidation,
  StatusValidationType,
} from "@/lib/validation";
import { useInternFilter } from "@/store/useInternFilter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const StatusColumn = ({ intern }: { intern: InternDataType }) => {
  const [statusOptions, setStatusOptions] = useState<StatusSelectOption[]>([]);
  const { page, pageSize, status, options } = useInternFilter();

  // const { data, isLoading, isFetching, refetch } = useInterns({
  //   page,
  //   pageSize,
  //   status,
  //   options,
  // });

  // const { data: statusResponse, isSuccess } = useQuery({
  //   queryKey: ["status"],
  //   queryFn: () => fetchStatus(),
  // });

  const form = useForm<StatusValidationType>({
    resolver: zodResolver(StatusValidation),
    defaultValues: { statusId: intern.statusId },
  });

  // useEffect(() => {
  //   if (isSuccess && statusResponse?.results?.status) {
  //     const { status } = statusResponse.results;
  //     const filteredStatus = status.filter(
  //       (s: StatusSelectOption) => s.type === intern.status.type
  //     );
  //     setStatusOptions(filteredStatus);
  //   }
  // }, [isSuccess, statusResponse]);

  const onChangeStatus = async (values: StatusValidationType) => {};

  return (
    <StatusSelection
      form={form}
      statusOptions={statusOptions}
      loading={false}
      fieldName="statusId"
      width="w-[200px]"
      submitFnc={(val, form) => {
        form.setValue("statusId", val);
        form.handleSubmit(onChangeStatus)();
      }}
    />
  );
};

export default StatusColumn;
