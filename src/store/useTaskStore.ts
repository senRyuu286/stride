import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { BRAIN_DUMP_CATEGORY, createId } from "../utils/taskHelpers";

export type PriorityLevel = "High" | "Medium" | "Low" | "None";
export type TaskStatus = "todo" | "in-progress" | "completed";

export interface Subtask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Workspace {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  workspaceId: string;
  title: string;
  category: string;
  dueDate: string | null;
  completionDate?: string | null;
  description: string;
  subtasks: Subtask[];
  status: TaskStatus;
  priority: PriorityLevel;
  tags: string[];
}

interface TaskState {
  workspaces: Workspace[];
  activeWorkspaceId: string;
  activeCategory: string;
  upcomingTasks: Task[];
  dailyTasks: (Task | null)[];

  setActiveWorkspaceId: (id: string) => void;
  setActiveCategory: (category: string) => void;
  setUpcomingTasks: (tasks: Task[] | ((prev: Task[]) => Task[])) => void;
  setDailyTasks: (
    tasks: (Task | null)[] | ((prev: (Task | null)[]) => (Task | null)[]),
  ) => void;

  addWorkspace: (name: string) => void;
  updateWorkspace: (id: string, updates: Partial<Workspace>) => void;
  deleteWorkspace: (id: string) => void;

  addTask: (task: Pick<Task, "title" | "workspaceId"> & Partial<Task>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskCompletion: (taskId: string) => void;

  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      workspaces: [{ id: "ws_default", name: "My Workspace" }],
      activeWorkspaceId: "ws_default",
      activeCategory: "All",
      upcomingTasks: [],
      dailyTasks: [null, null, null],
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      setActiveWorkspaceId: (id) =>
        set({
          activeWorkspaceId: id,
          activeCategory: "All",
        }),

      setActiveCategory: (category) => set({ activeCategory: category }),

      setUpcomingTasks: (updater) =>
        set((state) => ({
          upcomingTasks:
            typeof updater === "function"
              ? updater(state.upcomingTasks)
              : updater,
        })),

      setDailyTasks: (updater) =>
        set((state) => ({
          dailyTasks:
            typeof updater === "function" ? updater(state.dailyTasks) : updater,
        })),

      addWorkspace: (name) => {
        const newWorkspace: Workspace = { id: `ws_${createId()}`, name };
        set((state) => ({
          workspaces: [...state.workspaces, newWorkspace],
          activeWorkspaceId: newWorkspace.id,
          activeCategory: "All",
        }));
      },

      updateWorkspace: (id, updates) =>
        set((state) => ({
          workspaces: state.workspaces.map((ws) =>
            ws.id === id ? { ...ws, ...updates } : ws,
          ),
        })),

      deleteWorkspace: (id) =>
        set((state) => {
          const filtered = state.workspaces.filter((ws) => ws.id !== id);
          let nextActiveId = state.activeWorkspaceId;

          if (state.activeWorkspaceId === id && filtered.length > 0) {
            nextActiveId = filtered[0].id;
          }

          return {
            workspaces: filtered,
            activeWorkspaceId: nextActiveId,
            activeCategory: "All",
          };
        }),

      addTask: (newTaskData) => {
        const newTask: Task = {
          id: createId(),
          workspaceId: newTaskData.workspaceId,
          title: newTaskData.title,
          category: newTaskData.category || BRAIN_DUMP_CATEGORY,
          dueDate: newTaskData.dueDate || null,
          completionDate: newTaskData.completionDate || null,
          description: newTaskData.description || "",
          subtasks: newTaskData.subtasks || [],
          status: newTaskData.status || "todo",
          priority: newTaskData.priority || "None",
          tags: newTaskData.tags || [],
        };
        set((state) => ({ upcomingTasks: [...state.upcomingTasks, newTask] }));
      },

      updateTask: (taskId, updates) =>
        set((state) => {
          const finalUpdates = { ...updates };
          
          if (updates.status === "completed") {
            finalUpdates.completionDate = new Date().toISOString();
          } else if (updates.status === "todo" || updates.status === "in-progress") {
             finalUpdates.completionDate = null;
          }

          return {
            upcomingTasks: state.upcomingTasks.map((t) =>
              t.id === taskId ? { ...t, ...finalUpdates } : t,
            ),
            dailyTasks: state.dailyTasks.map((t) =>
              t?.id === taskId ? { ...t, ...finalUpdates } : t,
            ),
          };
        }),

      deleteTask: (taskId) =>
        set((state) => ({
          upcomingTasks: state.upcomingTasks.filter((t) => t.id !== taskId),
          dailyTasks: state.dailyTasks.map((t) =>
            t?.id === taskId ? null : t,
          ),
        })),

      toggleTaskCompletion: (taskId) => {
        const applyToggle = (task: Task): Task => {
          if (task.id === taskId) {
            const isCompleting = task.status !== "completed";
            return {
              ...task,
              status: isCompleting ? "completed" : "todo",
              completionDate: isCompleting ? new Date().toISOString() : null,
            };
          }
          return task;
        };

        set((state) => ({
          upcomingTasks: state.upcomingTasks.map(applyToggle),
          dailyTasks: state.dailyTasks.map((t) => (t ? applyToggle(t) : null)),
        }));
      },
    }),
    {
      name: "stride-task-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: (state) => {
        return (_deletedState, error) => {
          if (error) {
            console.error("Hydration failed:", error);
          }
          state?.setHasHydrated(true);
        };
      },
    },
  ),
);