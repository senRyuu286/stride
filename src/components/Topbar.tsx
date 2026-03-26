import React from 'react';
import { PanelRight, Plus } from 'lucide-react';

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
    <header className="sticky top-0 z-10 flex items-center justify-between w-full h-14 shrink-0 px-6 bg-base-100/80 backdrop-blur-md border-b border-base-content/5 select-none">

      <div className="flex items-center">
        <div 
          className="w-20 h-5 bg-base-content transition-colors"
          style={{
            WebkitMaskImage: 'url(./stride.svg)',
            WebkitMaskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            WebkitMaskPosition: 'left center',
            maskImage: 'url(./stride.svg)',
            maskSize: 'contain',
            maskRepeat: 'no-repeat',
            maskPosition: 'left center',
          }}
          title="Stride"
        />
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={onToggleRightSidebar}
          className={`btn btn-sm btn-square btn-ghost hover:text-base-content hover:bg-base-content/10 mr-2 transition-colors ${
            isRightSidebarOpen 
              ? 'bg-base-content/10 text-base-content' 
              : 'text-base-content/70'
          }`}
          title="Toggle Details Pane"
        >
          <PanelRight size={16} />
        </button>

        <button 
          onClick={onOpenNewTask}
          className="btn btn-sm bg-primary text-primary-content border-none hover:bg-primary/90 shadow-sm gap-1.5 px-4 font-medium tracking-wide"
        >
          <Plus size={16} />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
};