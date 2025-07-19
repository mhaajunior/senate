"use client";

import React, { useState } from "react";
import { CustomProps } from "./CustomFormField";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { cn, formatThaiDateTime } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { FormControl } from "./ui/form";
import { th } from "date-fns/locale";

const MyDatepicker = ({ field, props }: { field: any; props: CustomProps }) => {
  const [open, setOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={"outline"}
            className={cn(
              "w-[240px] pl-3 text-left font-normal",
              !field.value && "text-muted-foreground"
            )}
          >
            {field.value ? (
              formatThaiDateTime(field.value)
            ) : (
              <span>{props.placeholder}</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={field.value}
          onSelect={(date) => {
            field.onChange(date);
            setOpen(false);
          }}
          captionLayout="dropdown"
          startMonth={new Date(2023, 0)}
          endMonth={new Date(currentYear + 1, 11)}
          locale={th}
        />
      </PopoverContent>
    </Popover>
  );
};

export default MyDatepicker;
