import React from 'react';
import { PanelRight, Plus, Menu } from 'lucide-react';

interface TopbarProps {
  onOpenNewTask: () => void;
  onToggleRightSidebar: () => void;
  isRightSidebarOpen: boolean;
}

export const Topbar: React.FC<TopbarProps> = ({ 
  onOpenNewTask, 
  onToggleRightSidebar, 
  isRightSidebarOpen 
}) => {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between w-full h-14 md:h-16 shrink-0 px-3 md:px-6 bg-base-100/90 backdrop-blur-md border-b border-base-content/5 select-none">

      <div className="flex items-center gap-1 md:gap-2">
        <label 
          htmlFor="sidebar-drawer" 
          className="btn btn-sm md:btn-md btn-square btn-ghost drawer-button lg:hidden text-base-content/70 hover:text-base-content hover:bg-base-content/10 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu size={20} className="md:w-5.5 md:h-5.5" />
        </label>

        <div 
          className="w-20 md:w-24 h-5 md:h-6 bg-base-content transition-colors ml-1 md:ml-0"
          style={{
            WebkitMaskImage: `url(${import.meta.env.BASE_URL}/stride.svg)`,
            WebkitMaskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            WebkitMaskPosition: 'left center',
            maskImage: `url(${import.meta.env.BASE_URL}/stride.svg)`,
            maskSize: 'contain',
            maskRepeat: 'no-repeat',
            maskPosition: 'left center',
          }}
          title="Stride"
        />
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
        <button 
          onClick={onToggleRightSidebar}
          className={`btn btn-sm md:btn-md btn-square btn-ghost hover:text-base-content hover:bg-base-content/10 transition-colors rounded-lg md:rounded-xl ${
            isRightSidebarOpen 
              ? 'bg-base-content/10 text-base-content' 
              : 'text-base-content/70'
          }`}
          title="Toggle Details Pane"
        >
          <PanelRight size={18} className="md:w-5 md:h-5" />
        </button>

        <button 
          onClick={onOpenNewTask}
          className="btn btn-sm md:btn-md bg-primary text-primary-content border-none hover:bg-primary/90 shadow-sm gap-1.5 px-3 md:px-5 font-medium tracking-wide rounded-lg md:rounded-xl"
          title="New Task"
        >
          <Plus size={18} className="md:w-5 md:h-5" />
          <span className="hidden sm:inline text-sm md:text-base">New Task</span>
        </button>
      </div>
    </header>
  );
};