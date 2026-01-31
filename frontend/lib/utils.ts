import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Parse date string as local time to avoid timezone shift
// When JS parses "2025-02-01" it treats it as UTC midnight, shifting back a day locally
export function parseLocalDate(dateStr: string | Date): Date {
  if (dateStr instanceof Date) return dateStr;
  return new Date(dateStr + "T12:00:00");
}
