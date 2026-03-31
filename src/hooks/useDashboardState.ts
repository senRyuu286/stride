import { useEffect, useState } from "react";
import type { Task } from "../store/useTaskStore";
import type { ViewState } from "../types/view";

export function useDashboardState() {
  const [activeView, setActiveView] = useState<ViewState>("focus");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [isDeleteAllConfirmOpen, setIsDeleteAllConfirmOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("stride-theme") || "system");

  useEffect(() => {
    localStorage.setItem("stride-theme", theme);
    let activeTheme = theme;

    if (theme === "system") {
      activeTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    const themeClassName = activeTheme === "dark" ? "stride-dark" : "stride-light";
    document.documentElement.setAttribute("data-theme", themeClassName);
  }, [theme]);

  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);

  const openBackup = () => setIsBackupOpen(true);
  const closeBackup = () => setIsBackupOpen(false);

  const openNewTaskModal = () => {
    setTaskToEdit(null);
    setIsNewTaskModalOpen(true);
  };

  const editTask = (task: Task) => {
    setTaskToEdit(task);
    setIsNewTaskModalOpen(true);
  };

  const closeNewTaskModal = () => {
    setIsNewTaskModalOpen(false);
    setTaskToEdit(null);
  };

  const selectTask = (task: Task) => {
    setSelectedTask(task);
    setIsRightSidebarOpen(true);
  };

  const closeTaskDetails = () => {
    setSelectedTask(null);
    setIsRightSidebarOpen(false);
  };

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen((current) => !current);
  };

  const promptDeleteAllData = () => {
    setIsDeleteAllConfirmOpen(true);
  };

  const cancelDeleteAllData = () => {
    setIsDeleteAllConfirmOpen(false);
  };

  const executeDataWipe = () => {
    localStorage.clear();
    window.location.reload();
  };

  return {
    activeView,
    setActiveView,
    selectedTask,
    isSettingsOpen,
    isRightSidebarOpen,
    isNewTaskModalOpen,
    isBackupOpen,
    taskToEdit,
    isDeleteAllConfirmOpen,
    theme,
    setTheme,
    openSettings,
    closeSettings,
    openBackup,
    closeBackup,
    openNewTaskModal,
    editTask,
    closeNewTaskModal,
    selectTask,
    closeTaskDetails,
    toggleRightSidebar,
    promptDeleteAllData,
    cancelDeleteAllData,
    executeDataWipe,
  };
}