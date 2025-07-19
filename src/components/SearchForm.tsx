"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SelectItem } from "@/components/ui/select";
import { Form } from "@/components/ui/form";

import CustomFormField, { FormFieldType } from "./CustomFormField";
import { SearchFormValidation } from "@/lib/validation";
import SubmitButton from "./SubmitButton";
import {
  groupOptions,
  internStatusOptions,
  officeOptions,
  SelectOption,
} from "@/lib/options";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

const SearchForm = ({
  onSubmitData,
  isLoading,
}: {
  onSubmitData: (values: z.infer<typeof SearchFormValidation>) => void;
  isLoading: boolean;
}) => {
  const [filteredGroup, setFilteredGroup] = useState<SelectOption[]>([]);

  const form = useForm<z.infer<typeof SearchFormValidation>>({
    resolver: zodResolver(SearchFormValidation),
    defaultValues: {
      internStatus: "1",
      firstName: "",
      lastName: "",
      academy: "",
    },
  });

  const internStatus = form.watch("internStatus");
  const office = form.watch("office");

  const onSubmit = async (values: z.infer<typeof SearchFormValidation>) => {
    onSubmitData(values);
  };

  useEffect(() => {
    if (internStatus === "1") {
      form.setValue("office", "");
      form.setValue("group", "");
    }
  }, [internStatus]);

  useEffect(() => {
    const filter = groupOptions.filter(
      (group) => group.officeId === Number(office)
    );
    setFilteredGroup(filter);
  }, [office]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <div className="flex gap-6 flex-wrap">
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="internStatus"
            label="สถานะ"
            placeholder="เลือกสถานะ"
          >
            {internStatusOptions.map((status) => (
              <SelectItem key={status.id} value={status.id.toString()}>
                <div className="flex cursor-pointer items-center gap-2">
                  <p>{status.name}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>
        </div>
        <div className="flex gap-6 flex-wrap">
          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name="startDate"
            label="วันที่เริ่มฝึกงาน"
            placeholder="เลือกวัน"
          />
          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name="endDate"
            label="วันที่สิ้นสุดฝึกงาน"
            placeholder="เลือกวัน"
          />
        </div>
        <div className="flex gap-6 flex-wrap">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="firstName"
            label="ชื่อ"
            placeholder="กรอกชื่อ"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="lastName"
            label="นามสกุล"
            placeholder="กรอกนามสกุล"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="academy"
            label="สถานศึกษา"
            placeholder="กรอกสถานศึกษา"
          />
        </div>
        {internStatus === "2" && (
          <div className="flex gap-6 flex-wrap">
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="office"
              label="สำนัก"
              placeholder="เลือกสำนัก"
              showClearBtn
            >
              {officeOptions.map((office) => (
                <SelectItem key={office.id} value={office.id.toString()}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <p>{office.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="group"
              label="กลุ่มงาน"
              placeholder="เลือกกลุ่มงาน"
              showClearBtn
            >
              {filteredGroup.map((group) => (
                <SelectItem key={group.id} value={group.id.toString()}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <p>{group.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>
          </div>
        )}
        <div className="w-full flex gap-6">
          <SubmitButton isLoading={isLoading}>ค้นหา</SubmitButton>
          <Button
            type="button"
            onClick={() => form.reset()}
            variant="destructive"
          >
            ล้างค่า
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SearchForm;
