import { useMemo, useState } from "react";
import { useTasks } from "./useTasks";
import type { SidebarModalState, SidebarProjectItem } from "../types/sidebar";
import { BRAIN_DUMP_CATEGORY, mergeTaskLists } from "../utils/taskHelpers";

export function useSidebarWorkspace() {
  const {
    workspaces,
    activeWorkspaceId,
    setActiveWorkspaceId,
    activeCategory,
    setActiveCategory,
    upcomingTasks,
    dailyTasks,
    addWorkspace,
    updateWorkspace,
    deleteWorkspace,
  } = useTasks();

  const [modalState, setModalState] = useState<SidebarModalState>("none");
  const [inputValue, setInputValue] = useState("");

  const activeWorkspace = useMemo(
    () => workspaces.find((workspace) => workspace.id === activeWorkspaceId),
    [workspaces, activeWorkspaceId],
  );

  const { dynamicProjects, brainDumpCount } = useMemo(() => {
    const counts: Record<string, number> = {};
    let dumpCount = 0;

    const allTasks = mergeTaskLists(upcomingTasks, dailyTasks);
    const activeWorkspaceTasks = allTasks.filter(
      (task) => task.workspaceId === activeWorkspaceId && task.status !== "completed",
    );

    activeWorkspaceTasks.forEach((task) => {
      const projectName = task.category || "Uncategorized";
      if (projectName === BRAIN_DUMP_CATEGORY) {
        dumpCount += 1;
      } else {
        counts[projectName] = (counts[projectName] || 0) + 1;
      }
    });

    const colors = ["bg-primary", "bg-secondary", "bg-accent", "bg-info", "bg-warning"];

    const projects: SidebarProjectItem[] = Object.entries(counts).map(([name, count], index) => ({
      id: name,
      name,
      count,
      color: colors[index % colors.length],
    }));

    return {
      dynamicProjects: projects,
      brainDumpCount: dumpCount,
    };
  }, [upcomingTasks, dailyTasks, activeWorkspaceId]);

  const closeDropdown = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const closeModal = () => {
    setModalState("none");
    setInputValue("");
  };

  const openCreateWorkspaceModal = () => {
    closeDropdown();
    setInputValue("");
    setModalState("create");
  };

  const openRenameWorkspaceModal = () => {
    closeDropdown();
    if (!activeWorkspace) return;
    setInputValue(activeWorkspace.name);
    setModalState("rename");
  };

  const openDeleteWorkspaceModal = () => {
    closeDropdown();
    if (workspaces.length <= 1) {
      setModalState("cannotDelete");
      return;
    }
    setModalState("delete");
  };

  const submitWorkspaceAction = () => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) return;

    if (modalState === "create") {
      addWorkspace(trimmedValue);
    } else if (modalState === "rename" && activeWorkspace) {
      if (trimmedValue !== activeWorkspace.name) {
        updateWorkspace(activeWorkspace.id, { name: trimmedValue });
      }
    }

    closeModal();
  };

  const confirmDeleteWorkspace = () => {
    if (activeWorkspace) {
      deleteWorkspace(activeWorkspaceId);
    }
    closeModal();
  };

  return {
    workspaces,
    activeWorkspace,
    activeWorkspaceId,
    setActiveWorkspaceId,
    activeCategory,
    setActiveCategory,
    dynamicProjects,
    brainDumpCount,
    modalState,
    inputValue,
    setInputValue,
    closeDropdown,
    closeModal,
    openCreateWorkspaceModal,
    openRenameWorkspaceModal,
    openDeleteWorkspaceModal,
    submitWorkspaceAction,
    confirmDeleteWorkspace,
  };
}