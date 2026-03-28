import { useMemo } from "react";
import { Archive as ArchiveIcon, CheckCircle2, RotateCcw, Calendar } from "lucide-react";
import { type Task } from "../context/TaskContext";
import { useTasks } from "../hooks/useTasks";
import { mergeTaskLists } from "../utils/taskHelpers";

export interface ArchiveProps {
  onTaskSelect: (task: Task) => void;
}

export default function Archive({ onTaskSelect }: ArchiveProps) {
  const { 
    upcomingTasks, 
    dailyTasks, 
    activeWorkspaceId, 
    toggleTaskCompletion,
  } = useTasks();

  const archivedTasks = useMemo(() => {
    return mergeTaskLists(upcomingTasks, dailyTasks).filter(
      (t) => t.workspaceId === activeWorkspaceId && t.status === 'completed'
    );
  }, [upcomingTasks, dailyTasks, activeWorkspaceId]);

  const formatDate = (isoString: string | null) => {
    if (!isoString) return "No date";
    return new Date(isoString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 md:px-8 py-8 md:py-10">
      
      <div className="mb-8 md:mb-10">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-xl bg-base-200 flex items-center justify-center text-primary shadow-sm border border-base-content/5">
            <ArchiveIcon size={26} />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Archive</h1>
        </div>
        <p className="text-sm md:text-base text-base-content/60 mt-2">
          A history of your completed tasks and past accomplishments.
        </p>
      </div>
      <div className="pb-12">
        {archivedTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 opacity-40 text-center border-2 border-dashed border-base-content/10 rounded-2xl">
            <ArchiveIcon size={48} className="mb-4 opacity-50" />
            <p>Your archive is empty.</p>
            <p className="text-sm mt-1">Completed tasks will show up here.</p>
          </div>
        ) : (
          <div className="bg-base-100 rounded-2xl border border-base-content/10 overflow-hidden shadow-sm">
            <ul className="divide-y divide-base-content/5">
              {archivedTasks.map((task) => (
                <li 
                  key={task.id}
                  className="group flex items-center gap-3 p-4 hover:bg-base-200/50 transition-colors cursor-pointer"
                  onClick={() => onTaskSelect(task)}
                >
                  <div className="text-success shrink-0 opacity-80">
                    <CheckCircle2 size={20} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate text-base-content/70 line-through">
                      {task.title}
                    </h4>
                    {task.category && (
                      <p className="text-xs opacity-50 truncate mt-0.5">{task.category}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 md:gap-4 shrink-0">
                    <div className="hidden sm:flex items-center gap-1.5 text-xs opacity-50">
                      <Calendar size={14} />
                      <span>{formatDate(task.dueDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTaskCompletion(task.id);
                        }}
                        className="p-2 md:p-1.5 bg-base-200 md:bg-transparent hover:bg-base-300 rounded-md text-base-content/70 hover:text-primary transition-colors tooltip tooltip-left"
                        data-tip="Restore Task"
                        aria-label="Restore Task"
                      >
                        <RotateCcw size={16} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}