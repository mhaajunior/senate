"use client";

import React from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import CustomFormField, { FormFieldType } from "./CustomFormField";
import { Form } from "./ui/form";
import { SelectItem } from "./ui/select";
import { SelectOption } from "@/lib/options";

interface Props<T extends FieldValues> {
  form: UseFormReturn<T>;
  statusOptions: SelectOption[];
  loading?: boolean;
  fieldName: keyof T & string;
  label?: string;
  width?: string;
  submitFnc?: (val: string, form: UseFormReturn<T>) => void;
}

function StatusSelection<T extends FieldValues>({
  form,
  statusOptions,
  loading = false,
  fieldName,
  label,
  width,
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
            width={width}
            loading={loading}
            onChangeFnc={(val) => {
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
