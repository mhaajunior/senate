"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Form } from "./ui/form";
import CustomFormField, { FormFieldType } from "./CustomFormField";
import { useDataStore } from "@/store/useDataStore";
import { SelectItem } from "./ui/select";
import { SelectOption } from "@/lib/options";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SubmitButton from "./SubmitButton";
import {
  OnVerifyInternValidation,
  OnVerifyInternValidationType,
} from "@/lib/validation";

const VerifyInternDialog = ({
  onSubmitData,
  pending,
  openDialog,
  onClose,
}: {
  onSubmitData: (value: OnVerifyInternValidationType) => void;
  pending: boolean;
  openDialog: boolean;
  onClose: () => void;
}) => {
  const { office, group } = useDataStore();
  const [filteredGroup, setFilteredGroup] = useState<SelectOption[]>([]);
  const [open, setOpen] = useState(openDialog);

  const form = useForm<OnVerifyInternValidationType>({
    resolver: zodResolver(OnVerifyInternValidation),
    defaultValues: {
      officeId: "",
      groupId: "",
    },
  });

  const officeField = form.watch("officeId");

  const onSubmit = async (value: OnVerifyInternValidationType) => {
    onSubmitData(value);
  };

  useEffect(() => {
    const filter = group.filter((g) => g.officeId === Number(officeField));
    form.setValue("groupId", "");
    setFilteredGroup(filter);
  }, [officeField]);

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          onClose();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ตอบรับเด็กฝึกงาน</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[50vh]">
          <Form {...form}>
            <form
              id="verify-intern-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-wrap gap-6"
            >
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="officeId"
                label="สำนักงาน"
                placeholder="เลือกสำนักงาน"
                width="w-[240px]"
                showClearBtn
              >
                {office.map((o) => (
                  <SelectItem key={o.id} value={String(o.id)}>
                    <div className="flex cursor-pointer items-center gap-2">
                      <p>{o.name}</p>
                    </div>
                  </SelectItem>
                ))}
              </CustomFormField>
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="groupId"
                label="กลุ่มงาน"
                placeholder="เลือกกลุ่มงาน"
                width="w-[240px]"
                disabled={filteredGroup.length === 0}
                showClearBtn
              >
                {filteredGroup.map((group) => (
                  <SelectItem key={group.id} value={String(group.id)}>
                    <div className="flex cursor-pointer items-center gap-2">
                      <p>{group.name}</p>
                    </div>
                  </SelectItem>
                ))}
              </CustomFormField>
            </form>
          </Form>
        </ScrollArea>
        <DialogFooter>
          <SubmitButton isLoading={pending} form="verify-intern-form">
            บันทึก
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VerifyInternDialog;
