import { useMemo, useState, type KeyboardEvent, type MouseEvent } from "react";
import {
  type PriorityLevel,
  type Subtask,
  type Task,
} from "../store/useTaskStore";
import { useTasks } from "./useTasks";
import { formatForDateTimeLocal } from "../utils/dateHelpers";
import { BRAIN_DUMP_CATEGORY, createId, mergeTaskLists } from "../utils/taskHelpers";

export function useNewTaskModalForm(taskToEdit?: Task | null) {
  const { addTask, updateTask, activeWorkspaceId, upcomingTasks, dailyTasks } = useTasks();

  const existingCategories = useMemo(() => {
    const workspaceTasks = mergeTaskLists(upcomingTasks, dailyTasks).filter(
      (task) => task.workspaceId === activeWorkspaceId,
    );

    const categories = Array.from(
      new Set(workspaceTasks.map((task) => task.category).filter(Boolean)),
    );

    if (!categories.includes(BRAIN_DUMP_CATEGORY)) {
      categories.unshift(BRAIN_DUMP_CATEGORY);
    }

    return categories;
  }, [upcomingTasks, dailyTasks, activeWorkspaceId]);

  const [title, setTitle] = useState(taskToEdit?.title || "");
  const [category, setCategory] = useState(
    taskToEdit?.category || existingCategories[0] || BRAIN_DUMP_CATEGORY,
  );
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [description, setDescription] = useState(taskToEdit?.description || "");
  const [dueDate, setDueDate] = useState(formatForDateTimeLocal(taskToEdit?.dueDate));
  const [priority, setPriority] = useState<PriorityLevel>(taskToEdit?.priority || "None");
  const [tagsInput, setTagsInput] = useState(taskToEdit?.tags.join(", ") || "");
  const [subtaskInput, setSubtaskInput] = useState("");
  const [pendingSubtasks, setPendingSubtasks] = useState<string[]>(
    taskToEdit?.subtasks.map((subtask) => subtask.title) || [],
  );

  const handleAddPendingSubtask = (event?: KeyboardEvent | MouseEvent) => {
    event?.preventDefault();
    if (!subtaskInput.trim()) return;

    setPendingSubtasks((current) => [...current, subtaskInput.trim()]);
    setSubtaskInput("");
  };

  const handleRemovePendingSubtask = (indexToRemove: number) => {
    setPendingSubtasks((current) => current.filter((_, index) => index !== indexToRemove));
  };

  const saveTask = (onClose: () => void) => {
    if (!title.trim()) return;

    const tagsArray = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const formattedDueDate = dueDate ? new Date(dueDate).toISOString() : null;
    
    const formattedSubtasks: Subtask[] = pendingSubtasks.map((subtaskTitle) => ({
      id: createId(),
      title: subtaskTitle,
      isCompleted: false,
    }));

    const taskData = {
      title: title.trim(),
      category: category.trim() || BRAIN_DUMP_CATEGORY,
      description,
      dueDate: formattedDueDate,
      priority,
      tags: tagsArray,
      subtasks: formattedSubtasks,
    };

    if (taskToEdit) {
      updateTask(taskToEdit.id, taskData);
    } else {
      addTask({ ...taskData, workspaceId: activeWorkspaceId });
    }

    onClose();
  };

  return {
    existingCategories,
    title,
    setTitle,
    category,
    setCategory,
    isAddingNewCategory,
    setIsAddingNewCategory,
    description,
    setDescription,
    dueDate,
    setDueDate,
    priority,
    setPriority,
    tagsInput,
    setTagsInput,
    subtaskInput,
    setSubtaskInput,
    pendingSubtasks,
    handleAddPendingSubtask,
    handleRemovePendingSubtask,
    saveTask,
  };
}