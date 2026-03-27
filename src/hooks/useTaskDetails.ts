import { useCallback, useMemo, useState } from "react";
import { type Task } from "../context/TaskContext";
import { useTasks } from "./useTasks";
import { formatFullDate, getWholeDaysLeft } from "../utils/dateHelpers";

export function useTaskDetails(task: Task, onClose: () => void) {
  const { upcomingTasks, dailyTasks, updateTask, toggleTaskCompletion, deleteTask } = useTasks();

  const activeTask = useMemo(
    () =>
      upcomingTasks.find((item) => item.id === task.id) ||
      dailyTasks.find((item) => item?.id === task.id) ||
      task,
    [upcomingTasks, dailyTasks, task],
  );

  const [notes, setNotes] = useState(activeTask.description || "");
  const daysLeft = getWholeDaysLeft(activeTask.dueDate);
  const formattedDate = formatFullDate(activeTask.dueDate);

  const syncNotesFromTask = useCallback(() => {
    if (notes !== activeTask.description) {
      setNotes(activeTask.description || "");
    }
  }, [notes, activeTask.description]);

  const saveNotes = () => {
    if (notes !== activeTask.description) {
      updateTask(activeTask.id, { description: notes });
    }
  };

  const completeTask = () => {
    if (activeTask.status !== "completed" && activeTask.subtasks.length > 0) {
      const completedSubtasks = activeTask.subtasks.map((subtask) => ({
        ...subtask,
        isCompleted: true,
      }));
      updateTask(activeTask.id, { subtasks: completedSubtasks });
    }

    toggleTaskCompletion(activeTask.id);
    onClose();
  };

  const toggleSubtask = (subtaskId: string) => {
    const updatedSubtasks = activeTask.subtasks.map((subtask) =>
      subtask.id === subtaskId
        ? { ...subtask, isCompleted: !subtask.isCompleted }
        : subtask,
    );
    updateTask(activeTask.id, { subtasks: updatedSubtasks });
  };

  const deleteCurrentTask = () => {
    deleteTask(activeTask.id);
    onClose();
  };

  return {
    activeTask,
    notes,
    setNotes,
    daysLeft,
    formattedDate,
    syncNotesFromTask,
    saveNotes,
    completeTask,
    toggleSubtask,
    deleteCurrentTask,
  };
}
