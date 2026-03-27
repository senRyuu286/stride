import type { Task } from "../context/TaskContext";

export const BRAIN_DUMP_CATEGORY = "Brain Dump";

export function createId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function mergeTaskLists(
  upcomingTasks: Task[],
  dailyTasks: (Task | null)[],
): Task[] {
  return [...upcomingTasks, ...dailyTasks.filter((task): task is Task => task !== null)];
}
