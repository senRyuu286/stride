import { useMemo } from "react";
import { Folder, Circle, CheckCircle2, Calendar, Flag, ListTodo } from "lucide-react";
import { type Task } from "../context/TaskContext";
import { useTasks } from "../hooks/useTasks";
import { BRAIN_DUMP_CATEGORY, mergeTaskLists } from "../utils/taskHelpers";

export interface AllTasksProps {
  onTaskSelect: (task: Task) => void;
}

export default function AllTasks({ onTaskSelect }: AllTasksProps) {
  const { 
    upcomingTasks, 
    dailyTasks, 
    activeWorkspaceId, 
    toggleTaskCompletion 
  } = useTasks();

  const workspaceTasks = useMemo(() => {
    return mergeTaskLists(upcomingTasks, dailyTasks).filter(
      (t) => t.workspaceId === activeWorkspaceId && t.category !== BRAIN_DUMP_CATEGORY
    );
  }, [upcomingTasks, dailyTasks, activeWorkspaceId]);

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

  return (
    <div className="max-w-4xl mx-auto w-full px-6 py-10 md:px-8 h-full flex flex-col">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-xl bg-base-200 flex items-center justify-center text-primary shadow-sm border border-base-content/5">
            <ListTodo size={26} />
          </div>
          <h1 className="text-3xl font-bold">All Tasks</h1>
        </div>
        <p className="text-base-content/60 mt-2">
          A bird's-eye view of everything across all your projects.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-12 space-y-8">
        {Object.keys(groupedTasks).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 opacity-40 text-center border-2 border-dashed border-base-content/10 rounded-2xl">
            <Folder size={48} className="mb-4 opacity-50" />
            <p>No active tasks found in this workspace.</p>
          </div>
        ) : (
          Object.entries(groupedTasks).map(([category, tasks]) => (
            <div key={category} className="bg-base-100 rounded-2xl border border-base-content/10 overflow-hidden shadow-sm">
              <div className="bg-base-200/50 px-4 py-3 border-b border-base-content/10 flex items-center gap-2">
                <Folder size={18} className="text-primary" />
                <h2 className="font-semibold text-lg">{category}</h2>
                <span className="badge badge-sm badge-ghost ml-auto">
                  {tasks.length}
                </span>
              </div>

              <ul className="divide-y divide-base-content/5">
                {tasks.map((task) => (
                  <li 
                    key={task.id}
                    className={`group flex items-center gap-3 p-3 hover:bg-base-200/30 transition-colors cursor-pointer ${
                      task.status === 'completed' ? 'opacity-60' : ''
                    }`}
                    onClick={() => onTaskSelect(task)}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTaskCompletion(task.id);
                      }}
                      className="text-base-content/30 hover:text-success transition-colors shrink-0"
                    >
                      {task.status === 'completed' ? (
                        <CheckCircle2 size={20} className="text-success" />
                      ) : (
                        <Circle size={20} />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <h4 className={`font-medium truncate ${task.status === 'completed' ? 'line-through text-base-content/50' : 'text-base-content'}`}>
                        {task.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 text-xs opacity-60">
                      {task.priority !== 'None' && (
                        <div className="flex items-center gap-1">
                          <Flag size={14} className={
                            task.priority === 'High' ? 'text-error' : 
                            task.priority === 'Medium' ? 'text-warning' : 
                            'text-info'
                          } />
                          <span className="hidden sm:inline">{task.priority}</span>
                        </div>
                      )}
                      
                      {task.dueDate && (
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
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