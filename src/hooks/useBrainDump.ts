import { useMemo, useState } from "react";
import { type Subtask } from "../store/useTaskStore";
import { useTasks } from "./useTasks";
import { BRAIN_DUMP_CATEGORY, createId, mergeTaskLists } from "../utils/taskHelpers";

export function useBrainDump() {
  const {
    addTask,
    updateTask,
    deleteTask,
    activeWorkspaceId,
    upcomingTasks,
    dailyTasks,
  } = useTasks();

  const [inputValue, setInputValue] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const brainDumpTasks = useMemo(
    () =>
      mergeTaskLists(upcomingTasks, dailyTasks).filter(
        (task) =>
          task.workspaceId === activeWorkspaceId &&
          task.category === BRAIN_DUMP_CATEGORY &&
          task.status !== "completed",
      ),
    [upcomingTasks, dailyTasks, activeWorkspaceId],
  );

  const handleQuickAdd = (event?: React.FormEvent) => {
    event?.preventDefault();
    if (!inputValue.trim()) {
      return;
    }

    addTask({
      title: inputValue.trim(),
      category: BRAIN_DUMP_CATEGORY,
      workspaceId: activeWorkspaceId,
      description: "",
      dueDate: null,
      priority: "None",
      tags: [],
      subtasks: [],
      status: "todo",
    });

    setInputValue("");
  };

  const handleDelete = (id: string) => {
    deleteTask(id);
  };

  const handleSaveEdit = (id: string) => {
    if (editValue.trim()) {
      updateTask(id, { title: editValue.trim() });
    }

    setEditingId(null);
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleDeleteSelected = () => {
    selectedIds.forEach((id) => deleteTask(id));
    setSelectedIds(new Set());
  };

  const handleMergeSelected = () => {
    const mergedTitle = window.prompt("Enter a name for the new combined task:");
    if (!mergedTitle?.trim()) {
      return;
    }

    const tasksToMerge = brainDumpTasks.filter((task) => selectedIds.has(task.id));
    const newSubtasks: Subtask[] = tasksToMerge.map((task) => ({
      id: createId(),
      title: task.title,
      isCompleted: false,
    }));

    addTask({
      title: mergedTitle.trim(),
      category: BRAIN_DUMP_CATEGORY,
      workspaceId: activeWorkspaceId,
      description: "Merged from multiple Brain Dump thoughts.",
      dueDate: null,
      priority: "None",
      tags: [],
      subtasks: newSubtasks,
      status: "todo",
    });

    tasksToMerge.forEach((task) => deleteTask(task.id));
    setSelectedIds(new Set());
  };

  const handleClearAll = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete ALL unprocessed Brain Dump tasks? This cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    brainDumpTasks.forEach((task) => deleteTask(task.id));
    setSelectedIds(new Set());
  };

  return {
    inputValue,
    setInputValue,
    selectedIds,
    editingId,
    setEditingId,
    editValue,
    setEditValue,
    brainDumpTasks,
    handleQuickAdd,
    handleDelete,
    handleSaveEdit,
    toggleSelection,
    handleDeleteSelected,
    handleMergeSelected,
    handleClearAll,
  };
}
