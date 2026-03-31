

import type { Task, Workspace } from "../store/useTaskStore";

export interface StrideBackupPayload {
  
  schemaVersion: 1;
  exportedAt: string; 
  workspaces: Workspace[];
  activeWorkspaceId: string;
  upcomingTasks: Task[];
  dailyTasks: (Task | null)[];
}

export function buildBackupPayload(
  workspaces: Workspace[],
  activeWorkspaceId: string,
  upcomingTasks: Task[],
  dailyTasks: (Task | null)[],
): StrideBackupPayload {
  return {
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    workspaces,
    activeWorkspaceId,
    upcomingTasks,
    dailyTasks,
  };
}

export function downloadBackupJSON(payload: StrideBackupPayload): void {
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `stride-backup-${formatDateForFilename(payload.exportedAt)}.json`;
  anchor.click();

setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export type ValidationResult =
  | { ok: true; payload: StrideBackupPayload }
  | { ok: false; error: string };

export function parseAndValidateBackup(raw: string): ValidationResult {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, error: "File is not valid JSON." };
  }

  if (typeof parsed !== "object" || parsed === null) {
    return { ok: false, error: "Backup file has an unexpected format." };
  }

  const obj = parsed as Record<string, unknown>;

  if (obj.schemaVersion !== 1) {
    return {
      ok: false,
      error: `Unsupported backup version: ${obj.schemaVersion ?? "unknown"}.`,
    };
  }

  if (!Array.isArray(obj.workspaces)) {
    return { ok: false, error: "Backup is missing workspace data." };
  }

  if (!Array.isArray(obj.upcomingTasks)) {
    return { ok: false, error: "Backup is missing task data." };
  }

  if (!Array.isArray(obj.dailyTasks)) {
    return { ok: false, error: "Backup is missing daily task data." };
  }

  if (typeof obj.activeWorkspaceId !== "string") {
    return { ok: false, error: "Backup is missing active workspace reference." };
  }

const rawUpcoming = obj.upcomingTasks as Record<string, unknown>[];
  const upcomingTasks = rawUpcoming.map((t) => ({
    ...t,
    completionDate: t.completionDate !== undefined ? t.completionDate : null,
  }));

  const rawDaily = obj.dailyTasks as (Record<string, unknown> | null)[];
  const dailyTasks = rawDaily.map((t) =>
    t ? { ...t, completionDate: t.completionDate !== undefined ? t.completionDate : null } : null
  );

  const payload = {
    ...obj,
    upcomingTasks,
    dailyTasks,
  } as unknown as StrideBackupPayload;

  return { ok: true, payload };
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsText(file);
  });
}

function formatDateForFilename(isoDate: string): string {
  
  return isoDate.slice(0, 10);
}