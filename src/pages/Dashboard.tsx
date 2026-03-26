import { useState, useMemo, useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import { Topbar } from "../components/Topbar";
import Focus from "../components/Focus";
import { TaskDetails } from "../components/TaskDetails";
import {
  TaskProvider,
  type Task,
  useTasks,
  type PriorityLevel,
  type Subtask,
} from "../context/TaskContext";

import AllTasks from "../components/AllTasks";
import BrainDump from "../components/BrainDump";
import Timeline from "../components/Timeline";
import Archive from "../components/Archive";

export type ViewState =
  | "focus"
  | "allTasks"
  | "timeline"
  | "brainDump"
  | "archive";

function NewTaskModal({
  onClose,
  taskToEdit,
}: {
  onClose: () => void;
  taskToEdit?: Task | null;
}) {
  const { addTask, updateTask, activeWorkspaceId, upcomingTasks, dailyTasks } =
    useTasks();

  const existingCategories = useMemo(() => {
    const allTasks = [
      ...upcomingTasks,
      ...dailyTasks.filter((t): t is Task => t !== null),
    ];
    const workspaceTasks = allTasks.filter(
      (t) => t.workspaceId === activeWorkspaceId,
    );
    const categories = Array.from(
      new Set(workspaceTasks.map((t) => t.category).filter(Boolean)),
    );
    if (!categories.includes("Brain Dump")) categories.unshift("Brain Dump");
    return categories;
  }, [upcomingTasks, dailyTasks, activeWorkspaceId]);

  const formatForDateTimeLocal = (isoString?: string | null) => {
    if (!isoString) return "";
    return isoString.slice(0, 16);
  };

  const [title, setTitle] = useState(taskToEdit?.title || "");
  const [category, setCategory] = useState(
    taskToEdit?.category || existingCategories[0] || "Brain Dump",
  );
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [description, setDescription] = useState(taskToEdit?.description || "");
  const [dueDate, setDueDate] = useState(
    formatForDateTimeLocal(taskToEdit?.dueDate),
  );
  const [priority, setPriority] = useState<PriorityLevel>(
    taskToEdit?.priority || "None",
  );
  const [tagsInput, setTagsInput] = useState(taskToEdit?.tags.join(", ") || "");

  const [subtaskInput, setSubtaskInput] = useState("");
  const [pendingSubtasks, setPendingSubtasks] = useState<string[]>(
    taskToEdit?.subtasks.map((st) => st.title) || [],
  );

  const handleAddPendingSubtask = (
    e?: React.KeyboardEvent | React.MouseEvent,
  ) => {
    e?.preventDefault();
    if (!subtaskInput.trim()) return;
    setPendingSubtasks([...pendingSubtasks, subtaskInput.trim()]);
    setSubtaskInput("");
  };

  const handleRemovePendingSubtask = (indexToRemove: number) => {
    setPendingSubtasks(
      pendingSubtasks.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleSave = () => {
    if (!title.trim()) return;
    const tagsArray = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    const formattedDueDate = dueDate ? new Date(dueDate).toISOString() : null;
    const formattedSubtasks: Subtask[] = pendingSubtasks.map((stTitle) => ({
      id: Math.random().toString(36).substring(2, 9),
      title: stTitle,
      isCompleted: false,
    }));

    if (taskToEdit) {
      updateTask(taskToEdit.id, {
        title,
        category: category.trim() || "Brain Dump",
        description,
        dueDate: formattedDueDate,
        priority,
        tags: tagsArray,
        subtasks: formattedSubtasks,
      });
    } else {
      addTask({
        title,
        category: category.trim() || "Brain Dump",
        workspaceId: activeWorkspaceId,
        description,
        dueDate: formattedDueDate,
        priority,
        tags: tagsArray,
        subtasks: formattedSubtasks,
      });
    }
    onClose();
  };

  return (
    <div className="modal modal-open bg-black/40 backdrop-blur-sm z-50">
      <div className="modal-box bg-base-100 border border-base-content/10 shadow-2xl max-w-2xl">
        <h3 className="font-bold text-xl mb-6">
          {taskToEdit ? "Process Task" : "Create New Task"}
        </h3>
        <div className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Task Name*</span>
            </label>
            <input
              autoFocus
              type="text"
              className="input input-bordered w-full bg-base-200/50"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Project / Category
                </span>
              </label>
              {!isAddingNewCategory ? (
                <select
                  className="select select-bordered w-full bg-base-200/50"
                  value={category}
                  onChange={(e) => {
                    if (e.target.value === "+++NEW+++") {
                      setIsAddingNewCategory(true);
                      setCategory("");
                    } else {
                      setCategory(e.target.value);
                    }
                  }}
                >
                  {existingCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option disabled>──────────</option>
                  <option value="+++NEW+++">+ Add New Project...</option>
                </select>
              ) : (
                <div className="flex gap-2">
                  <input
                    autoFocus
                    type="text"
                    className="input input-bordered w-full bg-base-200/50"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="New project name..."
                  />
                  <button
                    className="btn btn-ghost px-2"
                    onClick={() => {
                      setIsAddingNewCategory(false);
                      setCategory(existingCategories[0] || "Brain Dump");
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Priority</span>
              </label>
              <select
                className="select select-bordered w-full bg-base-200/50"
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
              >
                <option value="None">None</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Due Date & Time</span>
              </label>
              <input
                type="datetime-local"
                className="input input-bordered w-full bg-base-200/50 text-base-content"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Tags</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full bg-base-200/50"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Exam, Reading, Urgent"
              />
            </div>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Subtasks</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                className="input input-bordered input-sm flex-1 bg-base-200/50"
                placeholder="Add a step..."
                value={subtaskInput}
                onChange={(e) => setSubtaskInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleAddPendingSubtask()
                }
              />
              <button
                className="btn btn-sm btn-secondary"
                onClick={handleAddPendingSubtask}
              >
                Add
              </button>
            </div>
            {pendingSubtasks.length > 0 && (
              <ul className="space-y-1 mt-1">
                {pendingSubtasks.map((st, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center text-sm bg-base-200/30 px-3 py-1.5 rounded-md border border-base-content/5"
                  >
                    <span>{st}</span>
                    <button
                      className="btn btn-ghost btn-xs text-error opacity-70"
                      onClick={() => handleRemovePendingSubtask(index)}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Notes & Details</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full bg-base-200/50 h-24"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add notes here..."
            />
          </div>
        </div>
        <div className="modal-action mt-6 pt-4 border-t border-base-content/10">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={!title.trim()}
          >
            {taskToEdit ? "Save Task" : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [activeView, setActiveView] = useState<ViewState>("focus");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const [theme, setTheme] = useState(
    () => localStorage.getItem("stride-theme") || "system",
  );

  useEffect(() => {
    localStorage.setItem("stride-theme", theme);
    let activeTheme = theme;

    if (theme === "system") {
      activeTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "stride-dark"
        : "Stride-light";
    } else if (theme === "dark") {
      activeTheme = "stride-dark";
    } else if (theme === "light") {
      activeTheme = "stride-light";
    }

    document.documentElement.setAttribute("data-theme", activeTheme);
  }, [theme]);

  const handleDeleteAllData = () => {
    if (
      confirm(
        "⚠️ Are you sure? This will delete ALL tasks and settings. This cannot be undone.",
      )
    ) {
      if (
        confirm(
          "🚨 FINAL CONFIRMATION: Are you absolutely sure you want to wipe everything?",
        )
      ) {
        localStorage.clear();
        window.location.reload();
      }
    }
  };

  const renderCenterPane = () => {
    const commonProps = {
      onTaskSelect: (task: Task) => {
        setSelectedTask(task);
        setIsRightSidebarOpen(true);
      },
    };
    switch (activeView) {
      case "allTasks":
        return <AllTasks {...commonProps} />;
      case "timeline":
        return <Timeline {...commonProps} />;
      case "brainDump":
        return (
          <BrainDump
            onTaskSelect={(task) => {
              setTaskToEdit(task);
              setIsNewTaskModalOpen(true);
            }}
          />
        );
      case "archive":
        return <Archive {...commonProps} />;
      case "focus":
      default:
        return <Focus {...commonProps} />;
    }
  };

  return (
    <TaskProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-base-100 text-base-content font-sans">
        <Sidebar
          activeView={activeView}
          onNavigate={setActiveView}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenNewTask={() => {
            setTaskToEdit(null);
            setIsNewTaskModalOpen(true);
          }}
        />

        <main className="flex flex-col flex-1 min-w-0 bg-base-100 relative">
          <Topbar
            onOpenNewTask={() => {
              setTaskToEdit(null);
              setIsNewTaskModalOpen(true);
            }}
            onToggleRightSidebar={() =>
              setIsRightSidebarOpen(!isRightSidebarOpen)
            }
            isRightSidebarOpen={isRightSidebarOpen}
          />
          <div className="flex-1 overflow-y-auto pb-20">
            {renderCenterPane()}
          </div>
        </main>

        {isRightSidebarOpen && (
          <aside className="w-80 border-l border-base-content/10 bg-base-50 shrink-0 h-full overflow-y-auto z-10 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.02)]">
            {selectedTask ? (
              <TaskDetails
                task={selectedTask}
                onClose={() => {
                  setSelectedTask(null);
                  setIsRightSidebarOpen(false);
                }}
                onEditTask={(task) => {
                  setTaskToEdit(task);
                  setIsNewTaskModalOpen(true);
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full opacity-40 text-sm font-medium p-6 text-center">
                Select a task to view details!
              </div>
            )}
          </aside>
        )}

        {isNewTaskModalOpen && (
          <NewTaskModal
            taskToEdit={taskToEdit}
            onClose={() => {
              setIsNewTaskModalOpen(false);
              setTaskToEdit(null);
            }}
          />
        )}

        {isSettingsOpen && (
          <div className="modal modal-open bg-black/40 backdrop-blur-sm z-50">
            <div className="modal-box bg-base-100 border border-base-content/10 shadow-2xl">
              <h3 className="font-bold text-xl mb-6">Settings</h3>
              <div className="form-control w-full mb-6">
                <label htmlFor="theme-select" className="label">
                  <span className="label-text font-medium mb-4">Appearance</span>
                </label>
                <select
                  id="theme-select"
                  className="select select-bordered w-full bg-base-200/50"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                >
                  <option value="system">System Default</option>
                  <option value="light">Stride Light</option>
                  <option value="dark">Stride Dark</option>
                </select>
              </div>
              <div className="pt-4 border-t border-base-content/10 mt-6">
                <h4 className="text-error font-semibold mb-2 text-sm uppercase tracking-wider">
                  Danger Zone
                </h4>
                <p className="text-xs opacity-70 mb-4">
                  Permanently delete all tasks, projects, and workspaces from
                  local storage.
                </p>
                <button
                  onClick={handleDeleteAllData}
                  className="btn btn-error btn-outline w-full hover:bg-error! hover:text-error-content!"
                >
                  Delete All Stride Data
                </button>
              </div>
              <div className="modal-action">
                <button
                  className="btn btn-ghost"
                  onClick={() => setIsSettingsOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TaskProvider>
  );
}
