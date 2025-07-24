"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { SelectItem } from "@/components/ui/select";
import { Form } from "@/components/ui/form";

import CustomFormField, { FormFieldType } from "./CustomFormField";
import {
  SearchFormValidation,
  SearchFormValidationType,
} from "@/lib/validation";
import SubmitButton from "./SubmitButton";
import { SelectOption } from "@/lib/options";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useDataStore } from "@/store/useDataStore";

const SearchForm = ({
  onSubmitData,
  isLoading,
  internStatus,
}: {
  onSubmitData: (values: SearchFormValidationType) => void;
  isLoading: boolean;
  internStatus: string;
}) => {
  const { office, group } = useDataStore();
  const [filteredGroup, setFilteredGroup] = useState<SelectOption[]>([]);

  const form = useForm<SearchFormValidationType>({
    resolver: zodResolver(SearchFormValidation),
    defaultValues: {
      firstName: "",
      lastName: "",
      academy: "",
    },
  });

  const officeField = form.watch("office");

  const onSubmit = async (values: SearchFormValidationType) => {
    onSubmitData(values);
  };

  useEffect(() => {
    if (internStatus === "1") {
      form.setValue("office", "");
      form.setValue("group", "");
    }
  }, [internStatus]);

  useEffect(() => {
    const filter = group.filter((g) => g.officeId === Number(officeField));
    form.setValue("group", "");
    setFilteredGroup(filter);
  }, [officeField]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <div className="flex gap-6 flex-wrap">
          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name="startDate"
            label="วันที่เริ่มฝึกงาน"
            placeholder="เลือกวัน"
            width="w-[240px]"
          />
          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name="endDate"
            label="วันที่สิ้นสุดฝึกงาน"
            placeholder="เลือกวัน"
            width="w-[240px]"
          />
        </div>
        <div className="flex gap-6 flex-wrap">
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
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="academy"
            label="สถานศึกษา"
            placeholder="กรอกสถานศึกษา"
            width="w-[240px]"
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
              name="group"
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
