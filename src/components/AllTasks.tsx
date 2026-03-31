import { useMemo, useState, useEffect, useRef } from "react";
import { Folder, Circle, CheckCircle2, Calendar, Flag, ListTodo, ListChecks, Filter, X } from "lucide-react";
import { type Task, type PriorityLevel } from "../store/useTaskStore";
import { useTasks } from "../hooks/useTasks";
import { BRAIN_DUMP_CATEGORY, mergeTaskLists } from "../utils/taskHelpers";
import { getWholeDaysLeft, isWithinNextSevenDays } from "../utils/dateHelpers";

export interface AllTasksProps {
  onTaskSelect: (task: Task) => void;
}

type DateFilterType = "All" | "Overdue" | "Due Today" | "This Week" | "No Due Date";
type PriorityFilterType = PriorityLevel | "All";

export default function AllTasks({ onTaskSelect }: AllTasksProps) {
  const { 
    upcomingTasks, 
    dailyTasks, 
    activeWorkspaceId, 
    toggleTaskCompletion 
  } = useTasks();

const [priorityFilter, setPriorityFilter] = useState<PriorityFilterType>("All");
  const [dateFilter, setDateFilter] = useState<DateFilterType>("All");
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

  const workspaceTasks = useMemo(() => {
    return mergeTaskLists(upcomingTasks, dailyTasks).filter((t) => {
      
      const isInWorkspace = t.workspaceId === activeWorkspaceId && t.category !== BRAIN_DUMP_CATEGORY;
      if (!isInWorkspace) return false;

const matchesPriority = priorityFilter === "All" || t.priority === priorityFilter;

let matchesDate = true;
      const daysLeft = getWholeDaysLeft(t.dueDate);

      if (dateFilter === "Overdue") {
        matchesDate = daysLeft !== null && daysLeft < 0;
      } else if (dateFilter === "Due Today") {
        matchesDate = daysLeft === 0;
      } else if (dateFilter === "This Week") {
        matchesDate = isWithinNextSevenDays(t.dueDate);
      } else if (dateFilter === "No Due Date") {
        matchesDate = t.dueDate === null;
      }

      return matchesPriority && matchesDate;
    });
  }, [upcomingTasks, dailyTasks, activeWorkspaceId, priorityFilter, dateFilter]);

  const groupedTasks = useMemo(() => {
    const groups: Record<string, Task[]> = {};
    
    workspaceTasks.forEach((task) => {
      const category = task.category || "Uncategorized";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(task);
    });

    return Object.keys(groups)
      .sort()
      .reduce((acc, key) => {
        acc[key] = groups[key];
        return acc;
      }, {} as Record<string, Task[]>);
  }, [workspaceTasks]);

  const formatDate = (isoString: string | null) => {
    if (!isoString) return null;
    return new Date(isoString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCompletionDate = (isoString?: string | null) => {
    if (!isoString) return null;
    return `Completed ${new Date(isoString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })} at ${new Date(isoString).toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit'
    })}`;
  };

  const resetFilters = () => {
    setPriorityFilter("All");
    setDateFilter("All");
  };

  const hasActiveFilters = priorityFilter !== "All" || dateFilter !== "All";

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 md:px-8 py-8 md:py-10">
      
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-base-200 flex items-center justify-center text-primary shadow-sm border border-base-content/5 shrink-0">
              <ListTodo size={24} className="md:w-7 md:h-7" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">All Tasks</h1>
          </div>
          <p className="text-sm md:text-base text-base-content/60 ml-1">
            A bird's-eye view of everything across all your projects.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {hasActiveFilters && (
            <button 
              onClick={resetFilters}
              className="btn btn-ghost btn-sm text-error hidden md:flex"
              title="Clear Filters"
            >
              <X size={16} /> Clear
            </button>
          )}
          <div className="hidden md:flex items-center gap-2">
            <select 
              className="select select-bordered select-sm bg-base-200/50 min-w-35"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as PriorityFilterType)}
            >
              <option value="All" className="bg-base-100">All Priorities</option>
              <option value="High" className="bg-base-100">Priority: High</option>
              <option value="Medium" className="bg-base-100">Priority: Medium</option>
              <option value="Low" className="bg-base-100">Priority: Low</option>
              <option value="None" className="bg-base-100">No Priority</option>
            </select>

            <select 
              className="select select-bordered select-sm bg-base-200/50 min-w-35"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as DateFilterType)}
            >
              <option value="All" className="bg-base-100">All Dates</option>
              <option value="Overdue" className="bg-base-100">Overdue</option>
              <option value="Due Today" className="bg-base-100">Due Today</option>
              <option value="This Week" className="bg-base-100">This Week</option>
              <option value="No Due Date" className="bg-base-100">No Due Date</option>
            </select>
          </div>
          <details
            ref={dropdownRef}
            className="dropdown dropdown-end md:hidden"
          >
            <summary className="btn btn-sm btn-ghost bg-base-200 border-base-content/10 gap-2">
              <Filter size={14} />
              <span className="text-xs font-medium">Filter</span>
              {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-primary ml-1" />}
            </summary>
            <div className="dropdown-content z-50 p-4 shadow-xl bg-base-100 rounded-box w-64 border border-base-content/10 mt-2 flex flex-col gap-3">
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-xs font-bold">Priority</span>
                </label>
                <select
                  className="select select-bordered select-sm w-full bg-base-200/50"
                  value={priorityFilter}
                  onChange={(e) => {
                    setPriorityFilter(e.target.value as PriorityFilterType);
                    e.target.closest("details")?.removeAttribute("open");
                  }}
                >
                  <option value="All" className="bg-base-100">All Priorities</option>
                  <option value="High" className="bg-base-100">Priority: High</option>
                  <option value="Medium" className="bg-base-100">Priority: Medium</option>
                  <option value="Low" className="bg-base-100">Priority: Low</option>
                  <option value="None" className="bg-base-100">No Priority</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-xs font-bold">Date</span>
                </label>
                <select
                  className="select select-bordered select-sm w-full bg-base-200/50"
                  value={dateFilter}
                  onChange={(e) => {
                    setDateFilter(e.target.value as DateFilterType);
                    e.target.closest("details")?.removeAttribute("open");
                  }}
                >
                  <option value="All" className="bg-base-100">All Dates</option>
                  <option value="Overdue" className="bg-base-100">Overdue</option>
                  <option value="Due Today" className="bg-base-100">Due Today</option>
                  <option value="This Week" className="bg-base-100">This Week</option>
                  <option value="No Due Date" className="bg-base-100">No Due Date</option>
                </select>
              </div>
              
              {hasActiveFilters && (
                <button 
                  onClick={(e) => {
                    resetFilters();
                    e.currentTarget.closest("details")?.removeAttribute("open");
                  }}
                  className="btn btn-sm btn-outline btn-error mt-2 w-full"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </details>
        </div>
      </div>

      <div className="pb-12 space-y-6 md:space-y-8">
        {Object.keys(groupedTasks).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 opacity-40 text-center border-2 border-dashed border-base-content/10 rounded-2xl p-8">
            {hasActiveFilters ? (
               <>
                 <Filter size={48} className="mb-4 opacity-50 text-warning" />
                 <p className="text-sm md:text-base font-medium">No tasks match the selected filters.</p>
                 <button 
                   onClick={resetFilters} 
                   className="btn btn-link btn-sm text-primary no-underline mt-2"
                 >
                   Clear all filters
                 </button>
               </>
            ) : (
              <>
                <Folder size={48} className="mb-4 opacity-50" />
                <p className="text-sm md:text-base">No active tasks found in this workspace.</p>
              </>
            )}
          </div>
        ) : (
          Object.entries(groupedTasks).map(([category, tasks]) => (
            <div key={category} className="bg-base-100 rounded-2xl border border-base-content/10 overflow-hidden shadow-sm">
              <div className="bg-base-200/50 px-3 py-2 md:px-4 md:py-3 border-b border-base-content/10 flex items-center gap-2">
                <Folder size={16} className="text-primary md:w-4.5 md:h-4.5" />
                <h2 className="font-semibold text-sm md:text-lg">{category}</h2>
                <span className="badge badge-sm badge-ghost ml-auto text-xs">
                  {tasks.length}
                </span>
              </div>

              <ul className="divide-y divide-base-content/5">
                {tasks.map((task) => (
                  <li 
                    key={task.id}
                    className={`group flex items-center gap-2 md:gap-3 p-3 hover:bg-base-200/50 transition-colors cursor-pointer ${
                      task.status === 'completed' ? 'opacity-60' : ''
                    }`}
                    onClick={() => onTaskSelect(task)}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTaskCompletion(task.id);
                      }}
                      className="text-base-content/30 hover:text-success transition-colors shrink-0 p-1 md:p-0"
                      aria-label={task.status === 'completed' ? "Mark as incomplete" : "Mark as complete"}
                    >
                      {task.status === 'completed' ? (
                        <CheckCircle2 size={18} className="text-success md:w-5 md:h-5" />
                      ) : (
                        <Circle size={18} className="md:w-5 md:h-5" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0 pr-2">
                      <h4 className={`font-medium text-sm md:text-base truncate ${task.status === 'completed' ? 'line-through text-base-content/50' : 'text-base-content'}`}>
                        {task.title}
                      </h4>
                      {task.status === 'completed' && task.completionDate && (
                         <p className="text-[10px] md:text-xs text-base-content/50 mt-0.5 truncate">
                           {formatCompletionDate(task.completionDate)}
                         </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 md:gap-3 shrink-0 text-[10px] md:text-xs opacity-60">
                      {task.subtasks && task.subtasks.length > 0 && (
                        <div className="flex items-center gap-1" title={`${task.subtasks.length} subtasks`}>
                          <ListChecks size={12} className="md:w-3.5 md:h-3.5" />
                          <span>{task.subtasks.length}</span>
                        </div>
                      )}
                      
                      {task.priority !== 'None' && (
                        <div className="flex items-center gap-1">
                          <Flag size={12} className={`md:w-3.5 md:h-3.5 ${
                            task.priority === 'High' ? 'text-error' : 
                            task.priority === 'Medium' ? 'text-warning' : 
                            'text-info'
                          }`} />
                          <span className="hidden sm:inline">{task.priority}</span>
                        </div>
                      )}
                      
                      {task.dueDate && (
                        <div className="flex items-center gap-1">
                          <Calendar size={12} className="md:w-3.5 md:h-3.5" />
                          <span>{formatDate(task.dueDate)}</span>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
}