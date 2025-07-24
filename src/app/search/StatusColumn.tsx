import StatusSelection from "@/components/StatusSelection";
import { updateInternStatus } from "@/lib/api";
import {
  InternDataType,
  StatusValidation,
  StatusValidationType,
} from "@/lib/validation";
import { useDataStore } from "@/store/useDataStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const StatusColumn = ({ intern }: { intern: InternDataType }) => {
  const queryClient = useQueryClient();
  const { status } = useDataStore();
  const filteredStatus = status.filter((s) => s.type === intern.status.type);

  const form = useForm<StatusValidationType>({
    resolver: zodResolver(StatusValidation),
    defaultValues: { statusId: intern.statusId },
  });

  const mutation = useMutation({
    mutationKey: ["interns"],
    mutationFn: updateInternStatus,
    onSuccess: () => {
      toast.success("เปลี่ยนสถานะสำเร็จ");
      queryClient.invalidateQueries({
        queryKey: ["interns"],
      });
    },
    onError: () => {
      toast.error("ไม่สามารถแก้ไขข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
    },
  });

  const onChangeStatus = async (value: StatusValidationType) => {
    mutation.mutate({ ...value, id: intern.id });
  };

  return (
    <StatusSelection
      form={form}
      statusOptions={filteredStatus}
      loading={mutation.isPending}
      fieldName="statusId"
      width="w-[180px]"
      submitFnc={(val, form) => {
        form.setValue("statusId", val);
        form.handleSubmit(onChangeStatus)();
      }}
    />
  );
};

export default StatusColumn;
