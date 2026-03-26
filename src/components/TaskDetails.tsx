import React from 'react';
import type { Task } from '../context/TaskContext'; // Import the Task type from your Focus file
 // Import the Task type from your Focus file

interface TaskDetailsProps {
  task: Task;
  onClose: () => void;
}

export function TaskDetails({ task, onClose }: TaskDetailsProps) {
  return (
    <aside className="w-full md:w-80 lg:w-96 bg-base-100/95 backdrop-blur-2xl border-l border-base-content/10 shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-200 absolute right-0 h-full md:relative md:animate-none shrink-0">
      
      {/* HEADER ALIGNMENT FIX: 
        We use 'h-16' to force the height to match standard Tailwind topbars. 
        If your Topbar is taller, change this to 'h-20' or 'h-24'. 
      */}
      <div className="h-14 flex justify-between items-center px-6 border-b border-base-content/5">
        <div className="flex items-center gap-2">
          {/* Dynamic dot color based on priority */}
          <span className={`w-2 h-2 rounded-full inline-block ${task.priority === 'High' ? 'bg-error' : task.priority === 'Medium' ? 'bg-warning' : 'bg-info'}`}></span>
          <span className="text-xs font-semibold text-base-content/70 uppercase tracking-wider">
            {task.category}
          </span>
        </div>
        <button 
          className="btn btn-sm btn-circle btn-ghost"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
      
      {/* Body */}
      <div className="p-6 flex-1 overflow-y-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">{task.title}</h2>
          <p className="text-sm text-base-content/60 flex items-center gap-2">
            📅 Due In: <span className="text-error font-semibold">{task.daysLeft} Days</span>
          </p>
        </div>

        <div className="form-control w-full">
          <label className="label px-0">
            <span className="label-text font-bold text-base-content/70">Notes & Details</span>
          </label>
          <textarea 
            className="textarea textarea-bordered bg-base-200/50 h-40 w-full text-base-content/80 leading-relaxed focus:outline-primary border-base-content/10" 
            placeholder="Add rubric, links, or specific study chapters here..."
            defaultValue={task.description || ''}
          ></textarea>
        </div>

        <div>
          <label className="label px-0">
            <span className="label-text font-bold text-base-content/70">Sub-tasks</span>
          </label>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <input type="checkbox" className="checkbox checkbox-primary checkbox-sm rounded" /> 
              <span className="text-sm">Step 1</span>
            </li>
            <li className="flex items-center gap-3">
              <input type="checkbox" className="checkbox checkbox-primary checkbox-sm rounded" /> 
              <span className="text-sm">Step 2</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-base-content/5 bg-base-200/30">
        <button className="btn btn-primary w-full shadow-sm" onClick={onClose}>
          Mark as Complete
        </button>
      </div>
    </aside>
  );
}