"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SelectItem } from "@/components/ui/select";
import { Form } from "@/components/ui/form";

import CustomFormField, { FormFieldType } from "./CustomFormField";
import {
  SearchFormValidation,
  SearchFormValidationType,
} from "@/lib/validation";
import SubmitButton from "./SubmitButton";
import { GroupSelectOption, SelectOption } from "@/lib/options";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchGroup, fetchOffice } from "@/lib/api";

const SearchForm = ({
  onSubmitData,
  isLoading,
  internStatus,
}: {
  onSubmitData: (values: SearchFormValidationType) => void;
  isLoading: boolean;
  internStatus: string;
}) => {
  const [officeOptions, setOfficeOptions] = useState<SelectOption[]>([]);
  const [groupOptions, setGroupOptions] = useState<GroupSelectOption[]>([]);
  const [filteredGroup, setFilteredGroup] = useState<SelectOption[]>([]);

  const form = useForm<SearchFormValidationType>({
    resolver: zodResolver(SearchFormValidation),
    defaultValues: {
      firstName: "",
      lastName: "",
      academy: "",
    },
  });

  const office = form.watch("office");

  const { data: officeResponse, isSuccess: isSuccess1 } = useQuery({
    queryKey: ["office"],
    queryFn: () => fetchOffice(),
  });

  const { data: groupResponse, isSuccess: isSuccess2 } = useQuery({
    queryKey: ["group"],
    queryFn: () => fetchGroup(),
  });

  const onSubmit = async (values: SearchFormValidationType) => {
    onSubmitData(values);
  };

  useEffect(() => {
    if (isSuccess1 && officeResponse?.results?.office) {
      const { office } = officeResponse?.results;
      setOfficeOptions(office);
    }
  }, [isSuccess1, officeResponse]);

  useEffect(() => {
    if (isSuccess2 && groupResponse?.results?.group) {
      const { group } = groupResponse?.results;
      setGroupOptions(group);
    }
  }, [isSuccess2, groupResponse]);

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
    form.setValue("group", "");
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
              {officeOptions.map((office) => (
                <SelectItem key={office.id} value={String(office.id)}>
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
