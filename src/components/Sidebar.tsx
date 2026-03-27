import React from 'react';
import { 
  Zap, Brain, ListTodo, CalendarRange, 
  Archive, Settings, ShieldCheck, Plus, 
  ChevronDown, Check, FolderPlus, Trash2, Edit2
} from 'lucide-react';
import { useSidebarWorkspace } from '../hooks/useSidebarWorkspace';
import { WorkspaceNameModal } from '../modals/WorkspaceNameModal';
import { DeleteWorkspaceModal } from '../modals/DeleteWorkspaceModal';
import { CannotDeleteWorkspaceModal } from '../modals/CannotDeleteWorkspaceModal';
import type { SidebarProps } from '../types/sidebar';

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate, onOpenSettings, onOpenNewTask }) => {
  const {
    workspaces, 
    activeWorkspace,
    activeWorkspaceId, 
    setActiveWorkspaceId, 
    activeCategory, 
    setActiveCategory, 
    dynamicProjects,
    brainDumpCount,
    modalState,
    inputValue,
    setInputValue,
    closeDropdown,
    closeModal,
    openCreateWorkspaceModal,
    openRenameWorkspaceModal,
    openDeleteWorkspaceModal,
    submitWorkspaceAction,
    confirmDeleteWorkspace,
  } = useSidebarWorkspace();

  return (
    <>
      <aside className="flex flex-col h-screen w-64 bg-base-100/60 backdrop-blur-xl border-r border-base-content/10 text-base-content select-none shrink-0">
        
        <div className="h-14 px-3 flex items-center border-b border-base-content/5 shrink-0">
          <div className="dropdown dropdown-bottom w-full">
            <div tabIndex={0} role="button" className="flex items-center justify-between w-full px-2 py-1.5 hover:bg-base-200/50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-base-content/5">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <img 
                  src="./favicon.svg" 
                  alt="Stride Logo" 
                  className="w-5 h-5 shrink-0 object-contain" 
                />
                <span className="font-semibold text-sm truncate opacity-90" title={activeWorkspace?.name}>
                  {activeWorkspace?.name}
                </span>
              </div>
              <ChevronDown size={14} className="opacity-40 shrink-0 ml-2" />
            </div>

            <ul tabIndex={0} className="dropdown-content z-50 menu p-2 shadow-xl bg-base-100/95 backdrop-blur-3xl border border-base-content/10 rounded-box w-60 mt-2">
              <li className="menu-title text-[10px] uppercase opacity-50 pb-1">Switch Workspace</li>
              
              {workspaces.map((ws) => (
                <li key={ws.id}>
                  <a 
                    className={activeWorkspaceId === ws.id ? "bg-base-content/5" : ""}
                    onClick={() => {
                      setActiveWorkspaceId(ws.id);
                      closeDropdown();
                    }}
                  >
                    <span className="truncate">{ws.name}</span>
                    {activeWorkspaceId === ws.id && <Check size={14} className="ml-auto opacity-70" />}
                  </a>
                </li>
              ))}
              
              <div className="divider my-1 opacity-20"></div>
              
              <li className="menu-title text-[10px] uppercase opacity-50 pb-1">Manage</li>
              <li><a onClick={openCreateWorkspaceModal}><FolderPlus size={14} className="opacity-70" /> Create Workspace</a></li>
              <li><a onClick={openRenameWorkspaceModal}><Edit2 size={14} className="opacity-70" /> Rename Current</a></li>
              <li><a onClick={openDeleteWorkspaceModal} className="text-error hover:bg-error/10 hover:text-error"><Trash2 size={14} /> Delete Current</a></li>
            </ul>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2">
          <ul className="menu menu-sm w-full gap-0.5 p-0">
            
            <li className="menu-title text-[10px] uppercase tracking-wider opacity-50 mt-2">Views</li>
            
            <li>
              <a onClick={() => {
                  onNavigate('focus');
                  setActiveCategory('All'); 
                }} 
                className={`flex justify-between items-center w-full cursor-pointer ${activeView === 'focus' && activeCategory === 'All' ? 'bg-base-content/10 font-medium' : ''}`}>
                <div className="flex items-center gap-2">
                  <Zap size={16} className={activeView === 'focus' && activeCategory === 'All' ? 'text-primary' : 'opacity-70'} /> Focus
                </div>
              </a>
            </li>
            
            <li>
              <a onClick={() => onNavigate('brainDump')} className={`flex justify-between items-center w-full cursor-pointer ${activeView === 'brainDump' ? 'bg-base-content/10 font-medium' : ''}`}>
                <div className="flex items-center gap-2">
                  <Brain size={16} className={activeView === 'brainDump' ? 'text-primary' : 'opacity-70'} /> Brain Dump
                </div>
                {brainDumpCount > 0 && (
                  <span className="bg-base-content/10 text-base-content rounded-md px-1.5 py-0.5 text-[10px] font-bold min-w-6 text-center shrink-0">
                    {brainDumpCount}
                  </span>
                )}
              </a>
            </li>
            
            <li>
              <a onClick={() => onNavigate('allTasks')} className={`flex justify-between items-center w-full cursor-pointer ${activeView === 'allTasks' ? 'bg-base-content/10 font-medium' : ''}`}>
                <div className="flex items-center gap-2">
                  <ListTodo size={16} className={activeView === 'allTasks' ? 'text-primary' : 'opacity-70'} /> All Tasks
                </div>
              </a>
            </li>
            
            <li>
              <a onClick={() => onNavigate('timeline')} className={`flex justify-between items-center w-full cursor-pointer ${activeView === 'timeline' ? 'bg-base-content/10 font-medium' : ''}`}>
                <div className="flex items-center gap-2">
                  <CalendarRange size={16} className={activeView === 'timeline' ? 'text-primary' : 'opacity-70'} /> Timeline
                </div>
              </a>
            </li>

            <li className="menu-title flex flex-row items-center justify-between text-[10px] uppercase tracking-wider opacity-50 mt-8 mb-1">
              <span>Projects</span>
              <button 
                className="hover:opacity-100 transition-opacity flex justify-end min-w-6 p-0 bg-transparent border-none cursor-pointer"
                onClick={onOpenNewTask}
                title="Create new task"
              >
                <Plus size={14} />
              </button>
            </li>
            
            {dynamicProjects.length === 0 ? (
              <li>
                <span className="text-[11px] italic opacity-40 cursor-default hover:bg-transparent flex justify-center w-full mt-2">
                  No active projects yet
                </span>
              </li>
            ) : (
              dynamicProjects.map((project) => {
                const isActiveProject = activeView === 'focus' && activeCategory === project.name;
                
                return (
                  <li key={project.id}>
                    <a 
                      className={`flex items-center justify-between w-full ${isActiveProject ? 'bg-base-content/10 font-medium' : ''}`}
                      onClick={() => {
                        setActiveCategory(project.name);
                        if (activeView !== 'focus') onNavigate('focus');
                      }}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${project.color}`}></span>
                        <span className="truncate">{project.name}</span>
                      </div>
                      <span className="text-[11px] font-medium opacity-50 min-w-6 text-right shrink-0 pr-1">
                        {project.count}
                      </span>
                    </a>
                  </li>
                );
              })
            )}
          </ul>
        </div>

        <div className="p-3 border-t border-base-content/5 mt-auto shrink-0">
          <ul className="menu menu-sm w-full gap-0.5 p-0">
            
            <li>
              <a 
                onClick={() => onNavigate('archive')}
                className={`flex items-center gap-2 cursor-pointer w-full ${activeView === 'archive' ? 'bg-base-content/10 font-medium' : ''}`}
              >
                <Archive size={16} className={activeView === 'archive' ? 'text-primary' : 'opacity-70'} /> 
                Archive
              </a>
            </li>
            
            <li>
              <a 
                onClick={onOpenSettings} 
                className="flex items-center gap-2 cursor-pointer w-full"
              >
                <Settings size={16} className="opacity-70" /> 
                Settings
              </a>
            </li>

          </ul>
          
          <div className="mt-4 mb-2 mx-3 flex items-center gap-2 text-[11px] opacity-40 uppercase tracking-wide font-medium">
            <ShieldCheck size={14} className="text-success" />
            <span>Local-First Workspace</span>
          </div>
        </div>

      </aside>

      <WorkspaceNameModal
        isOpen={modalState === 'create' || modalState === 'rename'}
        mode={modalState === 'rename' ? 'rename' : 'create'}
        value={inputValue}
        onChange={setInputValue}
        onCancel={closeModal}
        onSave={submitWorkspaceAction}
      />

      <DeleteWorkspaceModal
        isOpen={modalState === 'delete'}
        workspaceName={activeWorkspace?.name}
        onCancel={closeModal}
        onConfirm={confirmDeleteWorkspace}
      />

      <CannotDeleteWorkspaceModal
        isOpen={modalState === 'cannotDelete'}
        onClose={closeModal}
      />
    </>
  );
};