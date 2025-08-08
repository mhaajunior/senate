import StatusSelection from "@/components/StatusSelection";
import VerifyInternDialog from "@/components/VerifyInternDialog";
import { updateInternStatus } from "@/lib/api";
import {
  InternDataType,
  StatusValidation,
  StatusValidationType,
  OnVerifyInternValidationType,
} from "@/lib/validation";
import { useDataStore } from "@/store/useDataStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const StatusColumn = ({ intern }: { intern: InternDataType }) => {
  const queryClient = useQueryClient();
  const { status, verifyStatus } = useDataStore();
  const filteredStatus = status.filter((s) => {
    if (intern.status.type === 3) {
      return [1, 2, 3].includes(s.type);
    }
    return s.type === intern.status.type || s.type === 3;
  });

  const [showDialog, setShowDialog] = useState(false);
  const [verifyStatusData, setVerifyStatusData] =
    useState<StatusValidationType | null>(null);

  const form = useForm<StatusValidationType>({
    resolver: zodResolver(StatusValidation),
    defaultValues: { statusId: String(intern.statusId) },
  });

  const mutation = useMutation({
    mutationKey: ["interns"],
    mutationFn: updateInternStatus,
    onSuccess: () => {
      toast.success("เปลี่ยนสถานะสำเร็จ");
      queryClient.invalidateQueries({
        queryKey: ["interns"],
      });
      queryClient.invalidateQueries({
        queryKey: ["internStatusCount"],
      });
    },
    onError: () => {
      toast.error("ไม่สามารถแก้ไขข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
    },
  });

  const onChangeStatus = async (statusData: StatusValidationType) => {
    if (statusData.statusId === "4") {
      setVerifyStatusData(statusData);
      setShowDialog(true);
      return;
    }
    mutateData(statusData);
  };

  const onSubmitVerifyIntern = (verifyData: OnVerifyInternValidationType) => {
    if (!verifyStatusData) return;
    mutateData(verifyStatusData, verifyData);
    setShowDialog(false);
    setVerifyStatusData(null);
  };

  const onCloseDialog = () => {
    setShowDialog(false);
    form.reset();
  };

  const mutateData = (
    statusData: StatusValidationType,
    verifyData?: OnVerifyInternValidationType
  ) => {
    const verifyStatusIds = verifyStatus.map((s) => s.id);
    const data = {
      id: intern.id,
      ...statusData,
      verifyIntern: verifyData,
      verifyStatusIds,
    };
    mutation.mutate(data);
  };

  return (
    <>
      {showDialog && (
        <VerifyInternDialog
          onSubmitData={onSubmitVerifyIntern}
          pending={mutation.isPending}
          openDialog
          onClose={onCloseDialog}
        />
      )}
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
    </>
  );
};

export default StatusColumn;
