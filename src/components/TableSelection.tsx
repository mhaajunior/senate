import { cn } from "@/lib/utils";
import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const TableSelection = ({
  label,
  color,
  active,
  count,
  loading = false,
  ...rest
}: {
  label: string;
  color?: string;
  active: boolean;
  count?: number;
  loading?: boolean;
  [rest: string]: any;
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            "bg-primary text-center relative p-2 text-sm text-background rounded-t-xl hover:cursor-pointer opacity-50 hover:opacity-100 w-[130px] whitespace-nowrap overflow-hidden text-ellipsis",
            active && "border-t-[5px] border-secondary !opacity-100",
            rest.className
          )}
          {...rest}
        >
          <p>{label}</p>
          {!loading && (
            <div className="absolute right-0 top-0 p-1 bg-foreground rounded-xl text-xs">
              {count || 0}
            </div>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
};

export default TableSelection;
