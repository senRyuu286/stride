import type { Task } from "../store/useTaskStore";

export const BRAIN_DUMP_CATEGORY = "Brain Dump";

export function createId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15);
}

export function mergeTaskLists(
  upcomingTasks: Task[],
  dailyTasks: (Task | null)[],
): Task[] {
  const validDailyTasks = dailyTasks.filter((task): task is Task => task !== null);
  const combined = [...upcomingTasks, ...validDailyTasks];

  const uniqueTasksMap = new Map<string, Task>();
  for (const task of combined) {
    uniqueTasksMap.set(task.id, task);
  }

  return Array.from(uniqueTasksMap.values());
}
