import React, { useState, useMemo } from 'react';
import { useTasks, type Task, type PriorityLevel } from '../context/TaskContext';

export interface FocusProps {
  onTaskSelect: (task: Task) => void;
}

type SortOption = 'Date' | 'Priority';

export default function Focus({ onTaskSelect }: FocusProps) {
  const { upcomingTasks, dailyTasks, setUpcomingTasks, setDailyTasks } = useTasks();
  
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('Date');
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(upcomingTasks.map(t => t.category)));
    return ['All', ...uniqueCategories];
  }, [upcomingTasks]);

  const filteredAndSortedUpcoming = useMemo(() => {
    let tasks = [...upcomingTasks];
    if (filterCategory !== 'All') tasks = tasks.filter(t => t.category === filterCategory);
    
    tasks.sort((a, b) => {
      if (sortBy === 'Date') return a.daysLeft - b.daysLeft;
      if (sortBy === 'Priority') {
        const pLevel: Record<PriorityLevel, number> = { High: 1, Medium: 2, Low: 3 };
        return pLevel[a.priority] - pLevel[b.priority];
      }
      return 0;
    });
    return tasks;
  }, [upcomingTasks, filterCategory, sortBy]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, task: Task) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.id); 
    setDraggedTask(task);
  };
  
  const handleDropOnSlot = (e: React.DragEvent<HTMLDivElement>, slotIndex: number) => {
    e.preventDefault(); 
    if (!draggedTask) return;
    
    setUpcomingTasks(prev => prev.filter(t => t.id !== draggedTask.id));
    
    const newDaily = [...dailyTasks];
    const existingTask = newDaily[slotIndex];
    
    if (existingTask) {
      setUpcomingTasks(prev => [...prev, existingTask]); 
    }
    
    newDaily[slotIndex] = draggedTask;
    setDailyTasks(newDaily);
    setDraggedTask(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  return (
    <div className="max-w-4xl mx-auto w-full px-6 py-10 md:px-8">
      
      <section className="mb-12">
        <h3 className="text-sm font-semibold text-base-content/50 uppercase tracking-widest mb-4">
          The Daily 3
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dailyTasks.map((task, index) => (
            <div 
              key={index}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDropOnSlot(e, index)}
              onClick={() => task && onTaskSelect(task)}
              className={`transition-all h-full ${task ? 'cursor-pointer' : ''}`}
            >
              {task ? (
                <div className="card h-full bg-base-200/50 border-2 border-primary/20 shadow-sm hover:border-primary">
                  <div className="card-body p-5 flex flex-col justify-center">
                    {(task.tag || task.priority === 'High') && (
                       <div className="badge badge-error gap-1 mb-2 font-medium text-[10px] uppercase tracking-wider w-max">
                         {task.tag || 'HIGH PRIORITY'}
                       </div>
                    )}
                    <h4 className="font-bold text-lg leading-tight">{task.title}</h4>
                    <p className="text-sm text-base-content/60 mt-1">{task.category}</p>
                  </div>
                </div>
              ) : (
                <div className="h-32 rounded-xl border-2 border-dashed border-base-content/10 flex items-center justify-center text-base-content/40 text-sm font-medium hover:bg-base-200/50 hover:text-base-content/70 hover:border-base-content/30 cursor-pointer">
                  Drag Task Here
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-sm font-semibold text-base-content/50 uppercase tracking-widest">
            Up Next
          </h3>
          <div className="flex gap-2">
            <select 
              className="select select-bordered select-sm bg-base-200/50"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select 
              className="select select-bordered select-sm bg-base-200/50"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
            >
              <option value="Date">Sort by Date</option>
              <option value="Priority">Sort by Priority</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          {filteredAndSortedUpcoming.length === 0 ? (
            <div className="text-center py-8 text-base-content/50 border-2 border-dashed border-base-content/10 rounded-xl">
              No tasks found in this category.
            </div>
          ) : (
            filteredAndSortedUpcoming.map((task) => (
              <div 
                key={task.id} 
                draggable
                onDragStart={(e) => handleDragStart(e, task)}
                onClick={() => onTaskSelect(task)}
                className="flex items-center justify-between p-4 rounded-xl bg-base-200/30 border border-base-content/5 hover:bg-base-200/80 hover:border-base-content/10 transition-all cursor-grab active:cursor-grabbing group"
              >
                <div className="flex items-center gap-4">
                  <input type="checkbox" className="checkbox checkbox-primary checkbox-sm rounded-md" onClick={(e) => e.stopPropagation()} />
                  <div>
                    <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">{task.title}</h4>
                    <span className="text-xs text-base-content/50 mt-1 flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-full inline-block ${task.priority === 'High' ? 'bg-error' : task.priority === 'Medium' ? 'bg-warning' : 'bg-info'}`}></span>
                      {task.category}
                    </span>
                  </div>
                </div>
                <div className="badge badge-ghost text-[10px] uppercase tracking-wider font-medium opacity-70">
                  In {task.daysLeft} days
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}