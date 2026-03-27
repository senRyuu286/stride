import type { Task } from "../context/TaskContext";

export interface BrainDumpProps {
  onTaskSelect: (task: Task) => void;
}

export interface TaskDetailsProps {
  task: Task;
  onClose: () => void;
  onEditTask: (task: Task) => void;
}
