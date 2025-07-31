import Image from "next/image";
import { Control } from "react-hook-form";

import { Checkbox } from "./ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import MyDatepicker from "./MyDatepicker";
import { X } from "lucide-react";
import { Loader } from "./Loader";
import { cn } from "@/lib/utils";
import PasswordInput from "./PasswordInput";

export enum FormFieldType {
  INPUT = "input",
  PASSWORD = "password",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

export interface CustomProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
  fieldType: FormFieldType;
  showClearBtn?: boolean;
  loading?: boolean;
  submitBtn?: boolean;
  submitFnc?: (val: any) => void;
  width?: string;
}

const RenderInput = ({ field, props }: { field: any; props: CustomProps }) => {
  switch (props.fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400 h-fit">
          {props.iconSrc && (
            <Image
              src={props.iconSrc}
              height={24}
              width={24}
              alt={props.iconAlt || "icon"}
              className="ml-2"
            />
          )}
          <FormControl>
            <Input
              placeholder={props.placeholder}
              {...field}
              className="shad-input border-0"
            />
          </FormControl>
        </div>
      );
    case FormFieldType.PASSWORD:
      return (
        <FormControl>
          <PasswordInput
            placeholder={props.placeholder}
            {...field}
            className={cn("shad-input border-0", props.width || "w-full")}
          />
        </FormControl>
      );
    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={props.placeholder}
            {...field}
            className={cn("shad-textArea", props.width || "w-full")}
            disabled={props.disabled}
          />
        </FormControl>
      );
    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <div className="flex items-center gap-4">
            <Checkbox
              id={props.name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <label htmlFor={props.name} className="checkbox-label">
              {props.label}
            </label>
          </div>
        </FormControl>
      );
    case FormFieldType.DATE_PICKER:
      return <MyDatepicker field={field} props={props} />;
    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select
            onValueChange={(val) => {
              field.onChange(val);
              if (props.submitBtn) {
                props.submitFnc!(val);
              }
            }}
            value={field.value}
            disabled={props.disabled || props.loading}
          >
            <div className="relative">
              <FormControl>
                <SelectTrigger
                  className={cn(
                    "relative shad-select-trigger group",
                    props.width || "w-full"
                  )}
                >
                  <SelectValue placeholder={props.placeholder} />
                  {props.loading && (
                    <Loader
                      size="sm"
                      className="absolute right-8 top-1/2 -translate-y-1/2 opacity-75"
                    />
                  )}
                </SelectTrigger>
              </FormControl>
              {field.value && props.showClearBtn && (
                <div className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 bg-white rounded-md dark:bg-gray-700 dark:border-black p-1">
                  <X
                    size={16}
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      field.onChange("");
                    }}
                  />
                </div>
              )}
            </div>
            <SelectContent className="shad-select-content">
              {props.children}
            </SelectContent>
          </Select>
        </FormControl>
      );
    case FormFieldType.SKELETON:
      return props.renderSkeleton ? props.renderSkeleton(field) : null;
    default:
      return null;
  }
};

const CustomFormField = (props: CustomProps) => {
  const { control, name, label, width } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div>
          <FormItem className={cn(width || "w-full")}>
            {props.fieldType !== FormFieldType.CHECKBOX && label && (
              <FormLabel className="shad-input-label">{label}</FormLabel>
            )}
            <RenderInput field={field} props={props} />
          </FormItem>
          <FormMessage className="shad-error" />
        </div>
      )}
    />
  );
};

export default CustomFormField;
