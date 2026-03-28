export function formatForDateTimeLocal(isoString?: string | null): string {
  if (!isoString) return "";
  
  // Safety check: ensure it's a valid string before slicing
  try {
    return isoString.slice(0, 16);
  } catch {
    return "";
  }
}

export function getWholeDaysLeft(dueDateStr: string | null): number | null {
  if (!dueDateStr) return null;

  const due = new Date(dueDateStr);
  const now = new Date();

  if (isNaN(due.getTime())) return null;

  // Strip time for "whole day" calculation
  due.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - now.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export function formatFullDate(dueDateStr: string | null): string {
  if (!dueDateStr) return "";

  const date = new Date(dueDateStr);
  if (isNaN(date.getTime())) return "";

  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}