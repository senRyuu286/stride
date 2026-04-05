export function formatForDateTimeLocal(isoString?: string | null): string {
  if (!isoString) return "";
  const d = new Date(isoString);

  if (isNaN(d.getTime())) return "";
  
  const pad = (n: number) => n.toString().padStart(2, "0");
  
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function getWholeDaysLeft(dueDateStr: string | null): number | null {
  if (!dueDateStr) return null;

  const due = new Date(dueDateStr);
  const now = new Date();

  if (isNaN(due.getTime())) return null;

  due.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - now.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export function isWithinNextSevenDays(dueDateStr: string | null): boolean {
  const daysLeft = getWholeDaysLeft(dueDateStr);
  if (daysLeft === null) return false;
  
  return daysLeft > 0 && daysLeft <= 7;
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