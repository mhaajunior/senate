"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import {
  DefaultValues,
  FieldValues,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { ZodType } from "zod";
import CustomFormField, { FormFieldType } from "./CustomFormField";
import { Form } from "./ui/form";
import { SelectItem } from "./ui/select";
import { SelectOption } from "@/lib/options";

interface Props<T extends FieldValues> {
  form: UseFormReturn<T>;
  statusOptions: SelectOption[];
  loading?: boolean;
  fieldName: keyof T & string;
  label: string;
  submitFnc?: (val: string, form: UseFormReturn<T>) => void;
}

function StatusSelection<T extends FieldValues>({
  form,
  statusOptions,
  loading = false,
  fieldName,
  label,
  submitFnc,
}: Props<T>) {
  return (
    <Form {...form}>
      <form className="flex flex-col gap-6">
        <div className="flex gap-6 flex-wrap">
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name={fieldName}
            label={label}
            placeholder="เลือกสถานะ"
            width="w-[240px]"
            loading={loading}
            submitBtn={!!submitFnc}
            submitFnc={(val) => {
              if (submitFnc) {
                submitFnc(val, form);
              }
            }}
          >
            {statusOptions.map((status) => (
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
  );
}

export default StatusSelection;
