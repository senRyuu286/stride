import { useMemo, type ComponentType } from "react";
import { CalendarDays, Clock, AlertCircle, Calendar as CalendarIcon, Flag, Circle, CheckCircle2 } from "lucide-react";
import { type Task } from "../store/useTaskStore";
import { useTasks } from "../hooks/useTasks";
import { mergeTaskLists } from "../utils/taskHelpers";

export interface TimelineProps {
  onTaskSelect: (task: Task) => void;
}

interface TimelineSectionProps {
  title: "Overdue" | "Today" | "Tomorrow" | "Upcoming";
  tasks: Task[];
  icon: ComponentType<{ size?: number; className?: string }>;
  colorClass: string;
  onTaskSelect: (task: Task) => void;
  onToggleTaskCompletion: (taskId: string) => void;
  isLast?: boolean;
}

function formatTimelineTime(isoString: string) {
  return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatTimelineDate(isoString: string) {
  return new Date(isoString).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function TimelineSection({
  title,
  tasks,
  icon: Icon,
  colorClass,
  onTaskSelect,
  onToggleTaskCompletion,
  isLast = false,
}: TimelineSectionProps) {
  if (tasks.length === 0) return null;

  return (
    <div className="relative pl-10 md:pl-12 pb-8 md:pb-10">
      {!isLast && (
        <div className="absolute left-4 top-8 -bottom-2.5 w-px bg-base-content/10"></div>
      )}
      
      <div className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center bg-base-100 border-2 ${colorClass} z-10`}>
        <Icon size={14} className={colorClass.replace('border-', 'text-')} />
      </div>

      <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 flex items-center gap-2 md:gap-3 h-8">
        {title}
        <span className="badge badge-sm badge-ghost opacity-60 text-xs">{tasks.length}</span>
      </h2>

      <div className="space-y-2 md:space-y-3">
        {tasks.map((task: Task) => (
          <div 
            key={task.id}
            onClick={() => onTaskSelect(task)}
            className={`group flex items-center gap-2 md:gap-3 p-3 bg-base-100 rounded-xl border border-base-content/10 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer ${
              task.status === 'completed' ? 'opacity-60' : ''
            }`}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleTaskCompletion(task.id);
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

            <div className="flex-1 min-w-0 pr-1 md:pr-2">
              <h4 className={`font-medium text-sm md:text-base truncate ${task.status === 'completed' ? 'line-through text-base-content/50' : 'text-base-content'}`}>
                {task.title}
              </h4>
              {task.category && (
                <p className="text-[10px] md:text-xs opacity-60 truncate mt-0.5">{task.category}</p>
              )}
            </div>
            <div className="flex flex-col items-end sm:flex-row sm:items-center gap-1 sm:gap-3 shrink-0 text-[10px] md:text-xs font-medium">
              {task.priority !== 'None' && (
                <div className="flex items-center gap-1 opacity-70">
                  <Flag size={12} className={`md:w-3.5 md:h-3.5 ${
                    task.priority === 'High' ? 'text-error' : 
                    task.priority === 'Medium' ? 'text-warning' : 
                    'text-info'
                  }`} />
                  <span className="hidden sm:inline">{task.priority}</span>
                </div>
              )}
              
              <div className="flex items-center gap-1.5 bg-base-200/50 px-2 md:px-2.5 py-1 rounded-md text-right">
                <Clock size={10} className="md:w-3 md:h-3 opacity-50 shrink-0 hidden sm:block" />
                <span className={title === 'Overdue' ? 'text-error font-semibold' : 'opacity-70'}>
                  {title === 'Upcoming' ? `${formatTimelineDate(task.dueDate!)} ` : ''}
                  <span className="hidden sm:inline text-base-content/30">{title === 'Upcoming' ? '- ' : ''}</span>
                  {formatTimelineTime(task.dueDate!)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Timeline({ onTaskSelect }: TimelineProps) {
  const { 
    upcomingTasks, 
    dailyTasks, 
    activeWorkspaceId, 
    toggleTaskCompletion 
  } = useTasks();

  const timelineTasks = useMemo(() => {
    return mergeTaskLists(upcomingTasks, dailyTasks).filter(
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

  const hasAnyTasks = Object.values(groupedTasks).some(group => group.length > 0);

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 md:px-8 py-8 md:py-10">
      <div className="mb-8 md:mb-10">
        <div className="flex items-center gap-3 md:gap-4 mb-2">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-base-200 flex items-center justify-center text-primary shadow-sm border border-base-content/5 shrink-0">
            <CalendarDays size={24} className="md:w-6.5 md:h-6.5" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Timeline</h1>
        </div>
        <p className="text-sm md:text-base text-base-content/60 mt-2">
          Your schedule and upcoming deadlines at a glance.
        </p>
      </div>
      <div className="pb-12">
        {!hasAnyTasks ? (
          <div className="flex flex-col items-center justify-center h-48 opacity-40 text-center border-2 border-dashed border-base-content/10 rounded-2xl">
            <CalendarIcon size={48} className="mb-4 opacity-50" />
            <p className="text-sm md:text-base">No scheduled tasks found.</p>
            <p className="text-xs md:text-sm mt-1">Add a due date to a task to see it here!</p>
          </div>
        ) : (
          <div className="pt-2">
            <TimelineSection 
              title="Overdue" 
              tasks={groupedTasks.overdue} 
              icon={AlertCircle} 
              colorClass="border-error text-error" 
              onTaskSelect={onTaskSelect}
              onToggleTaskCompletion={toggleTaskCompletion}
            />
            <TimelineSection 
              title="Today" 
              tasks={groupedTasks.today} 
              icon={Clock} 
              colorClass="border-primary text-primary" 
              onTaskSelect={onTaskSelect}
              onToggleTaskCompletion={toggleTaskCompletion}
            />
            <TimelineSection 
              title="Tomorrow" 
              tasks={groupedTasks.tomorrow} 
              icon={CalendarDays} 
              colorClass="border-info text-info" 
              onTaskSelect={onTaskSelect}
              onToggleTaskCompletion={toggleTaskCompletion}
            />
            <TimelineSection 
              title="Upcoming" 
              tasks={groupedTasks.upcoming} 
              icon={CalendarIcon} 
              colorClass="border-base-content/30 text-base-content/50" 
              onTaskSelect={onTaskSelect}
              onToggleTaskCompletion={toggleTaskCompletion}
              isLast={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}