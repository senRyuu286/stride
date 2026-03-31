import React, { useState, useMemo, useEffect, useRef } from "react";
import { type Task } from "../store/useTaskStore";
import { useTasks } from "../hooks/useTasks";
import { Zap, Plus, Filter, ListChecks } from "lucide-react";
import { BRAIN_DUMP_CATEGORY } from "../utils/taskHelpers";
import { getWholeDaysLeft } from "../utils/dateHelpers";

export interface FocusProps {
  onTaskSelect: (task: Task) => void;
}

type SortOption = "Date" | "Priority";

export default function Focus({ onTaskSelect }: FocusProps) {
  const {
    activeWorkspaceId,
    activeCategory,
    setActiveCategory,
    upcomingTasks,
    dailyTasks,
    setUpcomingTasks,
    setDailyTasks,
    toggleTaskCompletion,
  } = useTasks();

  const [sortBy, setSortBy] = useState<SortOption>("Date");
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const dropdownRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        dropdownRef.current.hasAttribute("open") &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        dropdownRef.current.removeAttribute("open");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const completedDaily = dailyTasks.filter(
      (t) => t && t.status === "completed",
    ) as Task[];

    if (completedDaily.length > 0) {
      const newDaily = dailyTasks.filter((t) => t && t.status !== "completed");
      setDailyTasks(newDaily);

      setUpcomingTasks((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newUpcoming = [...prev];
        completedDaily.forEach((t) => {
          if (!existingIds.has(t.id)) newUpcoming.push(t);
        });
        return newUpcoming;
      });
    }
  }, [dailyTasks, setDailyTasks, setUpcomingTasks]);

  const workspaceDailySlots = useMemo(() => {
    const slots: (Task | null)[] = [null, null, null];
    const currentWsTasks = dailyTasks.filter(
      (t) => t && t.workspaceId === activeWorkspaceId,
    ) as Task[];

    currentWsTasks.forEach((task, index) => {
      if (index < 3) slots[index] = task;
    });
    return slots;
  }, [dailyTasks, activeWorkspaceId]);

  const categories = useMemo(() => {
    const workspaceTasks = upcomingTasks.filter(
      (t) =>
        t.workspaceId === activeWorkspaceId &&
        t.status !== "completed" &&
        t.category !== BRAIN_DUMP_CATEGORY,
    );
    const uniqueCategories = Array.from(
      new Set(workspaceTasks.map((t) => t.category).filter(Boolean)),
    );
    return ["All", ...uniqueCategories];
  }, [upcomingTasks, activeWorkspaceId]);

  const filteredAndSortedUpcoming = useMemo(() => {
    let tasks = upcomingTasks.filter(
      (t) =>
        t.workspaceId === activeWorkspaceId &&
        t.status !== "completed" &&
        t.category !== BRAIN_DUMP_CATEGORY,
    );

    if (activeCategory !== "All") {
      tasks = tasks.filter((t) => t.category === activeCategory);
    }

    tasks.sort((a, b) => {
      if (sortBy === "Date") {
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        return dateA - dateB;
      }

      if (sortBy === "Priority") {
        const pLevel: Record<string, number> = { High: 1, Medium: 2, Low: 3 };
        const pA = pLevel[a.priority] || 4;
        const pB = pLevel[b.priority] || 4;
        return pA - pB;
      }
      return 0;
    });

    return tasks;
  }, [upcomingTasks, activeWorkspaceId, activeCategory, sortBy]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, task: Task) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", task.id);
    setDraggedTask(task);
  };

  const handleDropOnSlot = (
    e: React.DragEvent<HTMLDivElement>,
    slotIndex: number,
  ) => {
    e.preventDefault();
    if (!draggedTask) return;

    setUpcomingTasks((prev) => prev.filter((t) => t.id !== draggedTask.id));

    const currentWsTasks = dailyTasks.filter(
      (t) => t && t.workspaceId === activeWorkspaceId,
    ) as Task[];
    const otherWsTasks = dailyTasks.filter(
      (t) => t && t.workspaceId !== activeWorkspaceId,
    ) as Task[];

    const existingTask = workspaceDailySlots[slotIndex];
    const newWsTasks = currentWsTasks.filter((t) => t.id !== draggedTask.id);

    if (existingTask && existingTask.id !== draggedTask.id) {
      setUpcomingTasks((prev) => [...prev, existingTask]);

      const targetIndex = currentWsTasks.findIndex(
        (t) => t.id === existingTask.id,
      );
      if (targetIndex !== -1) {
        newWsTasks[targetIndex] = draggedTask;
      } else {
        newWsTasks.push(draggedTask);
      }
    } else {
      if (newWsTasks.length < 3) {
        newWsTasks.push(draggedTask);
      } else {
        setUpcomingTasks((prev) => [...prev, draggedTask]);
        setDraggedTask(null);
        return;
      }
    }

    setDailyTasks([...otherWsTasks, ...newWsTasks]);
    setDraggedTask(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) =>
    e.preventDefault();

  const handleRemoveFromDaily = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation();
    const newGlobalDaily = dailyTasks.filter((t) => t?.id !== task.id);
    setDailyTasks(newGlobalDaily);
    setUpcomingTasks((prev) => [...prev, task]);
  };

  const handleMoveToDaily = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation();
    const currentWsTasks = dailyTasks.filter(
      (t) => t && t.workspaceId === activeWorkspaceId,
    ) as Task[];
    if (currentWsTasks.length >= 3) return;

    setUpcomingTasks((prev) => prev.filter((t) => t.id !== task.id));
    const otherWsTasks = dailyTasks.filter(
      (t) => t && t.workspaceId !== activeWorkspaceId,
    ) as Task[];
    setDailyTasks([...otherWsTasks, ...currentWsTasks, task]);
  };

  const isDailyFull = workspaceDailySlots.every((slot) => slot !== null);

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-6 md:px-8 md:py-10">
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-3 md:gap-4 mb-2">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-base-200 flex items-center justify-center text-primary shadow-sm border border-base-content/5">
            <Zap size={22} className="md:w-6.5 md:h-6.5" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Focus</h1>
        </div>
        <p className="text-sm md:text-base text-base-content/60 mt-2">
          Tackle your most important tasks for the day.
        </p>
      </div>

      <section className="mb-10 md:mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {workspaceDailySlots.map((task, index) => (
            <div
              key={index}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDropOnSlot(e, index)}
              onClick={() => task && onTaskSelect(task)}
              className={`transition-all h-full ${task ? "cursor-pointer relative group" : ""}`}
            >
              {task ? (
                <div className="card h-full bg-base-200/50 border-2 border-primary/20 shadow-sm hover:border-primary">
                  <button
                    onClick={(e) => handleRemoveFromDaily(e, task)}
                    className="btn btn-xs btn-circle btn-ghost absolute top-2 right-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10 hover:bg-base-300"
                    aria-label="Remove from Daily 3"
                    title="Remove from Daily Focus"
                  >
                    ✕
                  </button>

                  <div className="card-body p-4 md:p-5 flex flex-col justify-center min-w-0">
                    {(task.tags?.[0] || task.priority === "High") && (
                      <div className="badge badge-error gap-1 mb-2 font-medium text-[10px] uppercase tracking-wider">
                        {task.tags?.[0] || "HIGH PRIORITY"}
                      </div>
                    )}
                    <h4 className="font-bold text-base md:text-lg leading-tight pr-6 wrap-break-word">
                      {task.title}
                    </h4>
                    <p className="text-xs md:text-sm text-base-content/60 mt-1 flex items-center gap-2 truncate">
                      <span className="truncate">{task.category}</span>
                      {task.subtasks && task.subtasks.length > 0 && (
                        <span className="flex items-center gap-1 shrink-0 bg-base-content/5 px-1.5 py-0.5 rounded-md" title={`${task.subtasks.length} subtasks`}>
                          <ListChecks size={12} />
                          {task.subtasks.length}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-24 md:h-32 rounded-xl border-2 border-dashed border-base-content/10 flex items-center justify-center text-base-content/40 text-sm font-medium hover:bg-base-200/50 hover:text-base-content/70 hover:border-base-content/30 cursor-pointer">
                  <span className="hidden md:inline">Drag Task Here</span>
                  <span className="md:hidden">Empty Slot</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between gap-3 mb-4">
          <h3 className="text-sm font-semibold text-base-content/50 uppercase tracking-widest shrink-0">
            Pending Tasks
          </h3>

          <div className="hidden md:flex items-center gap-2">
            <select
              className="select select-bordered select-sm bg-base-200/50 min-w-30"
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option className="bg-base-100" key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              className="select select-bordered select-sm bg-base-200/50 min-w-35"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
            >
              <option value="Date">Sort by Date</option>
              <option value="Priority">Sort by Priority</option>
            </select>
          </div>
          <details
            ref={dropdownRef}
            className="dropdown dropdown-end md:hidden"
          >
            <summary className="btn btn-sm btn-ghost bg-base-200 border-base-content/10 gap-2">
              <Filter size={14} />
              <span className="text-xs font-medium">Filter</span>
            </summary>
            <div className="dropdown-content z-50 p-4 shadow-xl bg-base-100 rounded-box w-64 border border-base-content/10 mt-2 flex flex-col gap-3">
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-xs font-bold">Category</span>
                </label>
                <select
                  className="select select-bordered select-sm w-full bg-base-200/50"
                  value={activeCategory}
                  onChange={(e) => {
                    setActiveCategory(e.target.value);
                    e.target.closest("details")?.removeAttribute("open");
                  }}
                >
                  {categories.map((c) => (
                    <option className="bg-base-100" key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-xs font-bold">Sort by</span>
                </label>
                <select
                  className="select select-bordered select-sm w-full bg-base-200/50"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as SortOption);
                    e.target.closest("details")?.removeAttribute("open");
                  }}
                >
                  <option value="Date" className="bg-base-100">
                    Sort by Date
                  </option>
                  <option value="Priority" className="bg-base-100">
                    Sort by Priority
                  </option>
                </select>
              </div>
            </div>
          </details>
        </div>

        <div className="space-y-2">
          {filteredAndSortedUpcoming.length === 0 ? (
            <div className="text-center py-8 text-base-content/50 border-2 border-dashed border-base-content/10 rounded-xl">
              No pending tasks found. Time to relax!
            </div>
          ) : (
            filteredAndSortedUpcoming.map((task) => {
              const daysLeft = getWholeDaysLeft(task.dueDate);

              return (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                  onClick={() => onTaskSelect(task)}
                  className="flex items-center justify-between p-3 md:p-4 rounded-xl bg-base-200/30 border border-base-content/5 hover:bg-base-200/80 hover:border-base-content/10 transition-all cursor-grab active:cursor-grabbing group"
                >
                  <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1 pr-2">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary checkbox-sm rounded-md shrink-0"
                      checked={task.status === "completed"}
                      onChange={() => toggleTaskCompletion(task.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-sm group-hover:text-primary transition-colors truncate">
                        {task.title}
                      </h4>
                      <span className="text-xs text-base-content/50 mt-1 flex flex-wrap sm:flex-nowrap items-center gap-1">
                        <span
                          className={`w-2 h-2 rounded-full inline-block shrink-0 ${
                            task.priority === "High"
                              ? "bg-error"
                              : task.priority === "Medium"
                                ? "bg-warning"
                                : task.priority === "Low"
                                  ? "bg-info"
                                  : "bg-base-content/20"
                          }`}
                        />
                        <span className="truncate">{task.category}</span>
                        {task.subtasks && task.subtasks.length > 0 && (
                          <>
                            <span className="opacity-50 shrink-0 mx-0.5">•</span>
                            <span className="flex items-center gap-1 shrink-0 bg-base-content/5 px-1.5 py-0.5 rounded-md" title={`${task.subtasks.length} subtasks`}>
                              <ListChecks size={10} />
                              {task.subtasks.length}
                            </span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!isDailyFull && (
                      <button
                        onClick={(e) => handleMoveToDaily(e, task)}
                        className="btn btn-xs btn-circle btn-ghost bg-base-200 text-base-content/60 hover:text-primary md:hidden"
                        title="Add to Daily Focus"
                      >
                        <Plus size={14} />
                      </button>
                    )}

                    <div
                      className={`badge badge-ghost text-[10px] uppercase tracking-wider font-medium shrink-0 ${
                        daysLeft !== null && daysLeft <= 1
                          ? "badge-error badge-outline"
                          : "opacity-70"
                      }`}
                    >
                      {daysLeft === null
                        ? "No Date"
                        : daysLeft === 0
                          ? "Today"
                          : daysLeft < 0
                            ? "Overdue"
                            : `In ${daysLeft}d`}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}