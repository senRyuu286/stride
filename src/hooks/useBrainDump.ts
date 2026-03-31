import { useMemo, useState } from "react";
import { useTasks } from "./useTasks";
import { BRAIN_DUMP_CATEGORY, mergeTaskLists } from "../utils/taskHelpers";

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

  const handleComplete = (id: string) => {
    updateTask(id, { status: "completed" });
  };

  const handleSaveEdit = (id: string) => {
    if (editValue.trim()) {
      updateTask(id, { title: editValue.trim() });
    }

    setEditingId(null);
  };

  const handleClearAll = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete ALL unprocessed Brain Dump tasks? This cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    brainDumpTasks.forEach((task) => deleteTask(task.id));
  };

  return {
    inputValue,
    setInputValue,
    editingId,
    setEditingId,
    editValue,
    setEditValue,
    brainDumpTasks,
    handleQuickAdd,
    handleDelete,
    handleComplete,
    handleSaveEdit,
    handleClearAll,
  };
}