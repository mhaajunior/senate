"use client";

import * as React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InternValidation, InternValidationType } from "@/lib/validation";
import { Form } from "./ui/form";
import SubmitButton from "./SubmitButton";
import CustomFormField, { FormFieldType } from "./CustomFormField";
import { ScrollArea } from "./ui/scroll-area";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showError } from "@/lib/swal";
import { editIntern } from "@/lib/api";
import { toast } from "sonner";
import { RefreshCcw } from "lucide-react";
import { SelectItem } from "./ui/select";
import { requestStatusOptions } from "@/lib/options";

export function EditDialog({ intern }: { intern: InternValidationType }) {
  const queryClient = useQueryClient();

  const [open, setOpen] = React.useState(false);

  const form = useForm<InternValidationType>({
    resolver: zodResolver(InternValidation),
    defaultValues: {
      ...intern,
      startDate: new Date(intern.startDate),
      endDate: new Date(intern.endDate),
    },
  });

  const mutation = useMutation({
    mutationKey: ["interns"],
    mutationFn: editIntern,
    onSuccess: () => {
      toast.success("แก้ไขข้อมูลสำเร็จ");
      queryClient.invalidateQueries({
        queryKey: ["interns"],
      });
    },
    onError: () => {
      showError("ไม่สามารถแก้ไขข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
    },
  });

  const onSubmit = async (value: InternValidationType) => {
    mutation.mutate(value);
    if (mutation.isSuccess) {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="warning">แก้ไข</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex gap-4 items-center">
            แก้ไขข้อมูล
            <RefreshCcw
              className="cursor-pointer"
              color="blue"
              size={18}
              onClick={() => form.reset()}
            />
          </DialogTitle>
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
                  name="status"
                  label="สถานะ"
                  placeholder="เลือกสถานะ"
                  width="w-[240px]"
                >
                  {requestStatusOptions.map((status) => (
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
            </form>
          </Form>
        </ScrollArea>
        <DialogFooter>
          <SubmitButton isLoading={mutation.isPending} form="edit-intern-form">
            บันทึก
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
