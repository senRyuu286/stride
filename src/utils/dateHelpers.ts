export function formatForDateTimeLocal(isoString?: string | null): string {
  if (!isoString) {
    return "";
  }

  return isoString.slice(0, 16);
}

export function getWholeDaysLeft(dueDateStr: string | null): number | null {
  if (!dueDateStr) {
    return null;
  }

  const due = new Date(dueDateStr);
  const now = new Date();

  due.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - now.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export function formatFullDate(dueDateStr: string | null): string {
  if (!dueDateStr) {
    return "";
  }

  return new Date(dueDateStr).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
