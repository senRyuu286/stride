import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';
import Focus from '../components/Focus';
import { TaskDetails } from '../components/TaskDetails';
import { TaskProvider, type Task } from '../context/TaskContext';

import AllTasks from '../components/AllTasks';
import BrainDump from '../components/BrainDump';
import Timeline from '../components/Timeline';
import Archive from '../components/Archive';

export type ViewState = 'focus' | 'allTasks' | 'timeline' | 'brainDump' | 'archive';

export default function Dashboard() {
  const [activeView, setActiveView] = useState<ViewState>('focus');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState('system');

  const renderCenterPane = () => {
    switch (activeView) {
      case 'allTasks': return <AllTasks />;
      case 'timeline': return <Timeline />;
      case 'brainDump': return <BrainDump />;
      case 'archive': return <Archive />;
      case 'focus':
      default:
        return <Focus onTaskSelect={(task) => setSelectedTask(task)} />;
    }
  };

  return (
    <TaskProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-base-100 text-base-content font-sans">
        <Sidebar 
          activeView={activeView} 
          onNavigate={setActiveView} 
          onOpenSettings={() => setIsSettingsOpen(true)} 
        />

        <main className="flex flex-col flex-1 min-w-0 bg-base-100 relative">
          <Topbar />
          <div className="flex-1 overflow-y-auto pb-20">
            {renderCenterPane()}
          </div>
        </main>

        {selectedTask && (
          <TaskDetails task={selectedTask} onClose={() => setSelectedTask(null)} />
        )}

        {isSettingsOpen && (
          <div className="modal modal-open bg-black/40 backdrop-blur-sm z-50">
            <div className="modal-box bg-base-100 border border-base-content/10 shadow-2xl">
              <h3 className="font-bold text-xl mb-6">Settings</h3>
              
              <div className="form-control w-full mb-6">
                <label className="label">
                  <span className="label-text font-medium mb-4">Appearance</span>
                </label>
                <select 
                  className="select select-bordered w-full bg-base-200/50 focus:outline-none focus:border-primary"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                >
                  <option value="system">System Default</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>

              <div className="pt-4 border-t border-base-content/10 mt-6">
                <h4 className="text-error font-semibold mb-2 text-sm uppercase tracking-wider">Danger Zone</h4>
                <p className="text-xs opacity-70 mb-4">This action cannot be undone. This will permanently delete all your tasks, projects, and workspaces from your local storage.</p>
                <button className="btn btn-error btn-outline w-full hover:bg-error! hover:text-error-content!">
                  Delete All Stride Data
                </button>
              </div>

              <div className="modal-action">
                <button className="btn btn-ghost" onClick={() => setIsSettingsOpen(false)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TaskProvider>
  );
}