import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { th } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatThaiDateTime(date: Date | string, haveTime = false) {
  if (!date) return isNull(date);

  const d = new Date(date);
  const buddhistYear = d.getFullYear() + 543;

  const formatted = format(d, haveTime ? "d MMM HH:mm:ss" : "d MMM", {
    locale: th,
  });
  if (haveTime) {
    const split = formatted.split(" ");
    return `${split[0]} ${split[1]} ${String(buddhistYear).slice(2)} ${
      split[2]
    }`;
  }

  return `${formatted} ${String(buddhistYear).slice(2)}`;
}

export function isNull(x: any) {
  return x ? x : "-";
}
