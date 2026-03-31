

import type { Task } from "../store/useTaskStore";

export interface NewTaskModalProps {
  onClose: () => void;
  taskToEdit?: Task | null;
}

export interface SettingsModalProps {
  isOpen: boolean;
  theme: string;
  onThemeChange: (nextTheme: string) => void;
  onDeleteAllData: () => void;
  onClose: () => void;
}

export interface DeleteAllDataConfirmModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export interface DeleteTaskModalProps {
  isOpen: boolean;
  taskTitle?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}