"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  InternDataType,
  InternValidation,
  InternValidationType,
  VerifyInternValidation,
} from "@/lib/validation";
import { Form } from "./ui/form";
import SubmitButton from "./SubmitButton";
import CustomFormField, { FormFieldType } from "./CustomFormField";
import { ScrollArea } from "./ui/scroll-area";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editIntern } from "@/lib/api";
import { toast } from "sonner";
import { RefreshCcw } from "lucide-react";
import { SelectItem } from "./ui/select";
import { useDataStore } from "@/store/useDataStore";
import { formatThaiDateTime } from "@/lib/utils";
import z from "zod";
import { SelectOption } from "@/lib/options";

export function EditDialog({ intern }: { intern: InternDataType }) {
  const queryClient = useQueryClient();
  const { status, office, group, verifyStatus } = useDataStore();
  const isVerify = intern.office && intern.group;

  const [open, setOpen] = useState(false);
  const [firstFetch, setFirstFetch] = useState(true);
  const [filteredGroup, setFilteredGroup] = useState<SelectOption[]>([]);
  const filteredStatus = status.filter((s) => {
    if (intern.status.type === 3) {
      return [1, 2, 3].includes(s.type);
    }
    return s.type === intern.status.type || s.type === 3;
  });

  const schema = isVerify ? VerifyInternValidation : InternValidation;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...intern,
      startDate: new Date(intern.startDate),
      endDate: new Date(intern.endDate),
      statusId: String(intern.statusId),
      officeId: intern.officeId ? String(intern.officeId) : "",
      groupId: intern.groupId ? String(intern.groupId) : "",
    },
  });

  const officeField = form.watch("officeId");
  const statusField = form.watch("statusId");

  const mutation = useMutation({
    mutationKey: ["interns"],
    mutationFn: editIntern,
    onSuccess: () => {
      toast.success("แก้ไขข้อมูลสำเร็จ");
      queryClient.invalidateQueries({
        queryKey: ["interns"],
      });
      queryClient.invalidateQueries({
        queryKey: ["internStatusCount"],
      });
      setOpen(false);
    },
    onError: () => {
      toast.error("ไม่สามารถแก้ไขข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
    },
  });

  useEffect(() => {
    const filter = group.filter((g) => g.officeId === Number(officeField));
    if (!firstFetch) {
      form.setValue("groupId", "");
    }
    setFilteredGroup(filter);
    setFirstFetch(false);
  }, [officeField]);

  const onSubmit = async (value: InternValidationType) => {
    const verifyStatusIds = verifyStatus.map((s) => s.id);
    mutation.mutate({ intern: value, verifyStatusIds });
  };

  const onResetForm = () => {
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">ดูข้อมูล</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex gap-2 items-center">
            ข้อมูลเด็กฝึกงาน
            <RefreshCcw
              className="cursor-pointer"
              color="blue"
              size={18}
              onClick={onResetForm}
            />
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[50vh]">
          <Form {...form}>
            <form
              id="edit-intern-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-wrap gap-6"
            >
              <div className="flex flex-wrap gap-6">
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="statusId"
                  label="สถานะ"
                  placeholder="เลือกสถานะ"
                  width="w-[240px]"
                >
                  {filteredStatus.map((status) => (
                    <SelectItem key={status.id} value={String(status.id)}>
                      <div className="flex cursor-pointer items-center gap-2">
                        <p>{status.name}</p>
                      </div>
                    </SelectItem>
                  ))}
                </CustomFormField>
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="iden"
                  label="หมายเลขประจำตัวประชาชน"
                  placeholder="กรอกหมายเลขประจำตัวประชาชน"
                  width="w-[240px]"
                />
              </div>
              <div className="flex flex-wrap gap-6">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="prefix"
                  label="คำนำหน้า"
                  placeholder="กรอกคำนำหน้า"
                  width="w-[80px]"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="firstName"
                  label="ชื่อ"
                  placeholder="กรอกชื่อ"
                  width="w-[240px]"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="lastName"
                  label="นามสกุล"
                  placeholder="กรอกนามสกุล"
                  width="w-[240px]"
                />
              </div>
              <div className="flex flex-wrap gap-6">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="academy"
                  label="สถานศึกษา"
                  placeholder="กรอกสถานศึกษา"
                  width="w-[240px]"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="faculty"
                  label="คณะ"
                  placeholder="กรอกคณะ"
                  width="w-[240px]"
                />
              </div>
              <div className="flex flex-wrap gap-6">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="branch"
                  label="สาขา"
                  placeholder="กรอกสาขา"
                  width="w-[240px]"
                />
              </div>
              <div className="flex flex-wrap gap-6">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="phone"
                  label="หมายเลขโทรศัพท์"
                  placeholder="กรอกหมายเลขโทรศัพท์"
                  width="w-[240px]"
                />
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="email"
                  label="อีเมล"
                  placeholder="กรอกอีเมล"
                  width="w-[240px]"
                />
              </div>
              <div className="flex flex-wrap gap-6">
                <CustomFormField
                  fieldType={FormFieldType.DATE_PICKER}
                  control={form.control}
                  name="startDate"
                  label="วันที่เริ่มฝึกงาน"
                  placeholder="เลือกวันที่เริ่มฝึกงาน"
                  width="w-[240px]"
                />
                <CustomFormField
                  fieldType={FormFieldType.DATE_PICKER}
                  control={form.control}
                  name="endDate"
                  label="วันที่สิ้นสุดฝึกงาน"
                  placeholder="กรอกวันที่สิ้นสุดฝึกงาน"
                  width="w-[240px]"
                />
              </div>
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="preferredJob"
                label="สำนัก/กลุ่มงาน/ลักษณะงาน ที่สนใจฝึกงาน"
                placeholder="กรอกสำนัก/กลุ่มงาน/ลักษณะงาน ที่สนใจฝึกงาน"
                width="w-[240px] md:w-[500px]"
              />
              {(isVerify || statusField === "4") && (
                <div className="flex flex-wrap gap-6">
                  <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    control={form.control}
                    name="officeId"
                    label="สำนัก"
                    placeholder="เลือกสำนัก"
                    width="w-[240px]"
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
                  >
                    {filteredGroup.map((g) => (
                      <SelectItem key={g.id} value={String(g.id)}>
                        <div className="flex cursor-pointer items-center gap-2">
                          <p>{g.name}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </CustomFormField>
                </div>
              )}
            </form>
          </Form>
        </ScrollArea>
        <DialogFooter className="flex sm:justify-between items-center w-full">
          <div className="text-xs text-muted-foreground">
            {intern.isEdited && (
              <div className="flex flex-col gap-1">
                <span>
                  แก้ไขเมื่อ: {formatThaiDateTime(intern.updatedAt, true)}
                </span>
                <span>แก้ไขโดย: {intern.updatedBy.username}</span>
              </div>
            )}
          </div>
          <SubmitButton isLoading={mutation.isPending} form="edit-intern-form">
            บันทึก
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
