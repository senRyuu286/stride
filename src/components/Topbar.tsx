import React from 'react';
import { PanelRight, Plus } from 'lucide-react';

export const Topbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between w-full h-14 shrink-0 px-6 bg-base-100/80 backdrop-blur-md border-b border-base-content/5 select-none">
      
      {/* LEFT: Branding */}
      <div className="flex items-center">
        {/* The CSS Mask Stride Logo */}
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

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-2">
        {/* Right Pane Toggle (Notepad) */}
        <button 
          className="btn btn-sm btn-square btn-ghost text-base-content/70 hover:text-base-content hover:bg-base-content/10 mr-2"
          title="Toggle Details Pane"
        >
          <PanelRight size={16} />
        </button>

        {/* Primary Action: Add Task */}
        <button className="btn btn-sm bg-primary text-primary-content border-none hover:bg-primary/90 shadow-sm gap-1.5 px-4 font-medium tracking-wide">
          <Plus size={16} />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
};