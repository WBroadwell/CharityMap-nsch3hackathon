/**
 * Utility Functions
 *
 * Shared helper functions used across the application.
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * cn - Class Name Merger
 *
 * Combines multiple class names and resolves Tailwind CSS conflicts.
 * Used for conditional styling in components.
 *
 * Example: cn("bg-red-500", condition && "bg-blue-500", "text-white")
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * parseLocalDate - Date String Parser
 *
 * Parses a date string as local time instead of UTC.
 *
 * Problem: When JavaScript parses "2025-02-01", it treats it as UTC midnight.
 * This causes the date to shift back one day in timezones behind UTC.
 *
 * Solution: Add a time component (12:00:00) to ensure the date stays correct
 * regardless of the user's timezone.
 *
 * Example:
 *   parseLocalDate("2025-02-01") returns a Date object for Feb 1, 2025
 */
export function parseLocalDate(dateStr: string | Date): Date {
  if (dateStr instanceof Date) return dateStr;
  return new Date(dateStr + "T12:00:00");
}
