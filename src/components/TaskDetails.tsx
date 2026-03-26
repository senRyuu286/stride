import { useState, useEffect } from 'react';
import { Trash2, Calendar, FolderOutput } from 'lucide-react';
import { useTasks, type Task } from '../context/TaskContext';

interface TaskDetailsProps {
  task: Task;
  onClose: () => void;
  onEditTask: (task: Task) => void;
}

function getDaysLeft(dueDateStr: string | null): number | null {
  if (!dueDateStr) return null;
  const due = new Date(dueDateStr);
  const now = new Date();

  due.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  
  const diffTime = due.getTime() - now.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

function formatFullDate(dueDateStr: string | null): string {
  if (!dueDateStr) return "";
  return new Date(dueDateStr).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
}

export function TaskDetails({ task, onClose, onEditTask }: TaskDetailsProps) {
  const { upcomingTasks, dailyTasks, updateTask, toggleTaskCompletion, deleteTask } = useTasks();

  const activeTask = upcomingTasks.find(t => t.id === task.id) 
                  || dailyTasks.find(t => t?.id === task.id) 
                  || task;

  const [notes, setNotes] = useState(activeTask.description || '');
  const daysLeft = getDaysLeft(activeTask.dueDate);
  const formattedDate = formatFullDate(activeTask.dueDate);

  useEffect(() => {
    setNotes(activeTask.description || '');
  }, [activeTask.id, activeTask.description]);

  const handleSaveNotes = () => {
    if (notes !== activeTask.description) {
      updateTask(activeTask.id, { description: notes });
    }
  };

  const handleComplete = () => {
    if (activeTask.status !== 'completed' && activeTask.subtasks.length > 0) {
      const completedSubtasks = activeTask.subtasks.map(subtask => ({
        ...subtask,
        isCompleted: true
      }));
      updateTask(activeTask.id, { subtasks: completedSubtasks });
    }

    toggleTaskCompletion(activeTask.id);
    onClose(); 
  };

  const handleSubtaskToggle = (subtaskId: string) => {
    const updatedSubtasks = activeTask.subtasks.map(subtask => 
      subtask.id === subtaskId 
        ? { ...subtask, isCompleted: !subtask.isCompleted } 
        : subtask
    );
    updateTask(activeTask.id, { subtasks: updatedSubtasks });
  };

  const handleDelete = () => {
    const confirmed = window.confirm(`Are you sure you want to delete "${activeTask.title}"?`);
    if (confirmed) {
      deleteTask(activeTask.id);
      onClose(); 
    }
  };

  return (
    <aside className="w-full md:w-80 lg:w-100 bg-base-100/95 backdrop-blur-2xl border-l border-base-content/10 flex flex-col z-50 absolute right-0 inset-y-0 md:relative md:h-full shrink-0 shadow-2xl max-w-full overflow-hidden">

      <div className="h-14 flex justify-between items-center px-6 border-b border-base-content/10 shrink-0 w-full">
        <div className="flex items-center gap-2 min-w-0">
          <span 
            className={`w-2 h-2 rounded-full shrink-0 ${
              activeTask.priority === 'High' ? 'bg-error' : 
              activeTask.priority === 'Medium' ? 'bg-warning' : 
              activeTask.priority === 'Low' ? 'bg-info' :
              'bg-base-content/20'
            }`}
          />
          <span className="text-xs font-bold text-base-content/60 uppercase tracking-widest truncate">
            {activeTask.category}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">

          <button 
            className="btn btn-sm btn-square btn-ghost text-base-content/40 hover:text-primary transition-colors"
            onClick={() => {
              onEditTask(activeTask);
            }}
            aria-label="Process task"
            title="Process Task (Open Editor)"
          >
            <FolderOutput size={16} />
          </button>

          <button 
            className="btn btn-sm btn-square btn-ghost text-base-content/40 hover:text-error transition-colors"
            onClick={handleDelete}
            aria-label="Delete task"
            title="Delete Task"
          >
            <Trash2 size={16} />
          </button>

          <button 
            className="btn btn-sm btn-square btn-ghost text-base-content/70 shrink-0"
            onClick={onClose}
            aria-label="Close details"
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto overflow-x-hidden space-y-8 w-full">

        <div className="w-full min-w-0 flex flex-col">
          <h2 className={`text-3xl font-bold mb-4 wrap-break-word whitespace-pre-wrap ${activeTask.status === 'completed' ? 'line-through text-base-content/50' : 'text-base-content'}`}>
            {activeTask.title}
          </h2>
          
          <div className="flex flex-col gap-3 bg-base-200/50 p-4 rounded-xl border border-base-content/5">
            <div className="flex items-start gap-3">
              <Calendar size={18} className="text-base-content/50 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-base-content/80">
                  {formattedDate || "No Due Date"}
                </p>
                {daysLeft !== null && activeTask.status !== 'completed' && (
                  <p className={`text-xs mt-1 ${
                    daysLeft < 0 ? 'text-error font-bold' : 
                    daysLeft === 0 ? 'text-warning font-bold' : 
                    'text-base-content/50'
                  }`}>
                    {daysLeft === 0 ? 'Due Today' : daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days remaining`}
                  </p>
                )}
              </div>
            </div>
            
            {activeTask.tags && activeTask.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {activeTask.tags.map((tag) => (
                  <span key={tag} className="badge badge-sm badge-outline border-base-content/20 text-base-content/70 py-2 px-2.5">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3 w-full min-w-0">
          <h3 className="text-sm font-bold text-base-content/50 uppercase tracking-wider">Notes & Details</h3>
          <textarea 
            className="textarea textarea-bordered bg-base-100 text-base h-40 w-full text-base-content/90 leading-relaxed focus:outline-primary border-base-content/10 resize-none overflow-x-hidden transition-colors" 
            placeholder="Add rubrics, links, or specific thoughts here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={handleSaveNotes}
          />
        </div>

        {activeTask.subtasks && activeTask.subtasks.length > 0 && (
          <div className="space-y-3 w-full min-w-0">
            <h3 className="text-sm font-bold text-base-content/50 uppercase tracking-wider">Sub-tasks</h3>
            <ul className="space-y-2.5 w-full bg-base-100 border border-base-content/10 rounded-xl p-3"> 
              {activeTask.subtasks.map((subtask) => (
                <li key={subtask.id} className="flex items-start gap-3 w-full min-w-0 p-2 hover:bg-base-200/50 rounded-lg transition-colors"> 
                  <input 
                    type="checkbox" 
                    className="checkbox checkbox-primary checkbox-sm rounded mt-0.5 shrink-0" 
                    checked={subtask.isCompleted}
                    onChange={() => handleSubtaskToggle(subtask.id)}
                  /> 
                  <span className={`text-sm leading-snug wrap-break-word flex-1 min-w-0 ${subtask.isCompleted ? 'line-through text-base-content/40' : 'text-base-content/90'}`}>
                    {subtask.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="p-5 border-t border-base-content/10 bg-base-100/80 backdrop-blur-md shrink-0 w-full">
        <button 
          className={`btn w-full shadow-sm font-semibold text-base transition-all ${
            activeTask.status === 'completed' 
              ? 'btn-outline border-base-content/20 text-base-content/60 hover:btn-error' 
              : 'btn-primary text-primary-content hover:shadow-md hover:-translate-y-0.5'
          }`} 
          onClick={handleComplete}
        >
          {activeTask.status === 'completed' ? 'Restore Task' : 'Mark as Complete'}
        </button>
      </div>
    </aside>
  );
}