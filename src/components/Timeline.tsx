import { useMemo } from "react";
import { CalendarDays, Clock, AlertCircle, Calendar as CalendarIcon, Flag, Circle, CheckCircle2 } from "lucide-react";
import { useTasks, type Task } from "../context/TaskContext";

export interface TimelineProps {
  onTaskSelect: (task: Task) => void;
}

export default function Timeline({ onTaskSelect }: TimelineProps) {
  const { 
    upcomingTasks, 
    dailyTasks, 
    activeWorkspaceId, 
    toggleTaskCompletion 
  } = useTasks();

  const timelineTasks = useMemo(() => {
    const combined = [
      ...upcomingTasks,
      ...dailyTasks.filter((t): t is Task => t !== null),
    ];
    
    return combined.filter(
      (t) => t.workspaceId === activeWorkspaceId && t.dueDate
    );
  }, [upcomingTasks, dailyTasks, activeWorkspaceId]);

  const groupedTasks = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const tomorrow = today + 86400000;

    const groups = {
      overdue: [] as Task[],
      today: [] as Task[],
      tomorrow: [] as Task[],
      upcoming: [] as Task[],
    };

    timelineTasks.forEach((task) => {
      if (!task.dueDate) return;
      const taskDate = new Date(task.dueDate);
      const taskDay = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate()).getTime();

      if (taskDay < today && task.status !== 'completed') {
        groups.overdue.push(task);
      } else if (taskDay === today) {
        groups.today.push(task);
      } else if (taskDay === tomorrow) {
        groups.tomorrow.push(task);
      } else if (taskDay > tomorrow) {
        groups.upcoming.push(task);
      }
    });

    const sortByDate = (a: Task, b: Task) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime();
    groups.overdue.sort(sortByDate);
    groups.today.sort(sortByDate);
    groups.tomorrow.sort(sortByDate);
    groups.upcoming.sort(sortByDate);

    return groups;
  }, [timelineTasks]);

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const TimelineSection = ({ title, tasks, icon: Icon, colorClass, isLast = false }: any) => {
    if (tasks.length === 0) return null;

    return (
      <div className="relative pl-12 pb-10">
        {!isLast && (
          <div className="absolute left-4 top-8 -bottom-2.5 w-px bg-base-content/10"></div>
        )}
        
        <div className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center bg-base-100 border-2 ${colorClass} z-10`}>
          <Icon size={14} className={colorClass.replace('border-', 'text-')} />
        </div>

        <h2 className="text-xl font-bold mb-4 flex items-center gap-3 h-8">
          {title}
          <span className="badge badge-sm badge-ghost opacity-60">{tasks.length}</span>
        </h2>

        <div className="space-y-3">
          {tasks.map((task: Task) => (
            <div 
              key={task.id}
              onClick={() => onTaskSelect(task)}
              className={`group flex items-center gap-3 p-3 bg-base-100 rounded-xl border border-base-content/10 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer ${
                task.status === 'completed' ? 'opacity-60' : ''
              }`}
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
                {task.category && (
                  <p className="text-xs opacity-60 truncate mt-0.5">{task.category}</p>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0 text-xs font-medium">
                {task.priority !== 'None' && (
                  <div className="flex items-center gap-1 opacity-70">
                    <Flag size={14} className={
                      task.priority === 'High' ? 'text-error' : 
                      task.priority === 'Medium' ? 'text-warning' : 
                      'text-info'
                    } />
                  </div>
                )}
                
                <div className="flex items-center gap-1.5 bg-base-200/50 px-2.5 py-1 rounded-md">
                  <Clock size={12} className="opacity-50" />
                  <span className={title === 'Overdue' ? 'text-error font-semibold' : 'opacity-70'}>
                    {title === 'Upcoming' ? `${formatDate(task.dueDate!)} - ` : ''}
                    {formatTime(task.dueDate!)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const hasAnyTasks = Object.values(groupedTasks).some(group => group.length > 0);

  return (
    <div className="max-w-4xl mx-auto w-full px-6 py-10 md:px-8 h-full flex flex-col">
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-xl bg-base-200 flex items-center justify-center text-primary shadow-sm border border-base-content/5">
            <CalendarDays size={26} />
          </div>
          <h1 className="text-3xl font-bold">Timeline</h1>
        </div>
        <p className="text-base-content/60 mt-2">
          Your schedule and upcoming deadlines at a glance.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-12">
        {!hasAnyTasks ? (
          <div className="flex flex-col items-center justify-center h-48 opacity-40 text-center border-2 border-dashed border-base-content/10 rounded-2xl">
            <CalendarIcon size={48} className="mb-4 opacity-50" />
            <p>No scheduled tasks found.</p>
            <p className="text-sm mt-1">Add a due date to a task to see it here!</p>
          </div>
        ) : (
          <div className="pt-2">
            <TimelineSection 
              title="Overdue" 
              tasks={groupedTasks.overdue} 
              icon={AlertCircle} 
              colorClass="border-error text-error" 
            />
            <TimelineSection 
              title="Today" 
              tasks={groupedTasks.today} 
              icon={Clock} 
              colorClass="border-primary text-primary" 
            />
            <TimelineSection 
              title="Tomorrow" 
              tasks={groupedTasks.tomorrow} 
              icon={CalendarDays} 
              colorClass="border-info text-info" 
            />
            <TimelineSection 
              title="Upcoming" 
              tasks={groupedTasks.upcoming} 
              icon={CalendarIcon} 
              colorClass="border-base-content/30 text-base-content/50" 
              isLast={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}