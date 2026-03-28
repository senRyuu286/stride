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

  const closeMobileSidebar = () => {
    const drawer = document.getElementById('sidebar-drawer') as HTMLInputElement | null;
    if (drawer && drawer.checked) {
      drawer.checked = false;
    }
  };

  return (
    <>
      <aside className="flex flex-col h-full w-full md:w-64 lg:w-72 bg-base-100/95 md:bg-base-100/60 backdrop-blur-xl border-r border-base-content/10 text-base-content select-none shrink-0">
        <div className="h-14 md:h-16 px-3 md:px-4 flex items-center border-b border-base-content/5 shrink-0">
          <div className="dropdown dropdown-bottom w-full">
            <div tabIndex={0} role="button" className="flex items-center justify-between w-full px-2 py-2 md:py-1.5 hover:bg-base-200/50 rounded-xl md:rounded-lg transition-colors cursor-pointer border border-transparent hover:border-base-content/5">
              <div className="flex items-center gap-3 md:gap-2.5 overflow-hidden">
                <img 
                  src={`${import.meta.env.BASE_URL}/favicon.svg`} 
                  alt="Stride Logo" 
                  className="w-6 h-6 md:w-5 md:h-5 shrink-0 object-contain" 
                />
                <span className="font-semibold text-base md:text-sm truncate opacity-90" title={activeWorkspace?.name}>
                  {activeWorkspace?.name}
                </span>
              </div>
              <ChevronDown size={16} className="md:w-3.5 md:h-3.5 opacity-40 shrink-0 ml-2" />
            </div>

            <ul tabIndex={0} className="dropdown-content z-50 menu p-2 shadow-xl bg-base-100/95 backdrop-blur-3xl border border-base-content/10 rounded-box w-64 md:w-60 mt-2">
              <li className="menu-title text-xs md:text-[10px] uppercase opacity-50 pb-1">Switch Workspace</li>
              
              {workspaces.map((ws) => (
                <li key={ws.id}>
                  <a 
                    className={`py-2.5 md:py-1.5 ${activeWorkspaceId === ws.id ? "bg-base-content/5" : ""}`}
                    onClick={() => {
                      setActiveWorkspaceId(ws.id);
                      closeDropdown();
                    }}
                  >
                    <span className="truncate text-base md:text-sm">{ws.name}</span>
                    {activeWorkspaceId === ws.id && <Check size={16} className="md:w-3.5 md:h-3.5 ml-auto opacity-70" />}
                  </a>
                </li>
              ))}
              
              <div className="divider my-1 opacity-20"></div>
              
              <li className="menu-title text-xs md:text-[10px] uppercase opacity-50 pb-1">Manage</li>
              <li><a className="py-2.5 md:py-1.5 text-base md:text-sm" onClick={openCreateWorkspaceModal}><FolderPlus size={16} className="md:w-3.5 md:h-3.5 opacity-70" /> Create Workspace</a></li>
              <li><a className="py-2.5 md:py-1.5 text-base md:text-sm" onClick={openRenameWorkspaceModal}><Edit2 size={16} className="md:w-3.5 md:h-3.5 opacity-70" /> Rename Current</a></li>
              <li><a className="py-2.5 md:py-1.5 text-base md:text-sm text-error hover:bg-error/10 hover:text-error" onClick={openDeleteWorkspaceModal}><Trash2 size={16} className="md:w-3.5 md:h-3.5" /> Delete Current</a></li>
            </ul>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 md:py-2">
          <ul className="menu md:menu-sm w-full gap-1 md:gap-0.5 p-0">
            
            <li className="menu-title text-xs md:text-[10px] uppercase tracking-wider opacity-50 mt-2">Views</li>
            
            <li>
              <a onClick={() => {
                  onNavigate('focus');
                  setActiveCategory('All'); 
                  closeMobileSidebar();
                }} 
                className={`flex justify-between items-center w-full py-2.5 md:py-1.5 cursor-pointer text-base md:text-sm ${activeView === 'focus' && activeCategory === 'All' ? 'bg-base-content/10 font-medium' : ''}`}>
                <div className="flex items-center gap-3 md:gap-2">
                  <Zap size={18} className={`md:w-4 md:h-4 ${activeView === 'focus' && activeCategory === 'All' ? 'text-primary' : 'opacity-70'}`} /> Focus
                </div>
              </a>
            </li>
            
            <li>
              <a onClick={() => {
                  onNavigate('brainDump');
                  closeMobileSidebar();
                }} 
                className={`flex justify-between items-center w-full py-2.5 md:py-1.5 cursor-pointer text-base md:text-sm ${activeView === 'brainDump' ? 'bg-base-content/10 font-medium' : ''}`}>
                <div className="flex items-center gap-3 md:gap-2">
                  <Brain size={18} className={`md:w-4 md:h-4 ${activeView === 'brainDump' ? 'text-primary' : 'opacity-70'}`} /> Brain Dump
                </div>
                {brainDumpCount > 0 && (
                  <span className="bg-base-content/10 text-base-content rounded-md px-1.5 py-0.5 text-xs md:text-[10px] font-bold min-w-7 md:min-w-6 text-center shrink-0">
                    {brainDumpCount}
                  </span>
                )}
              </a>
            </li>
            
            <li>
              <a onClick={() => {
                  onNavigate('allTasks');
                  closeMobileSidebar();
                }} 
                className={`flex justify-between items-center w-full py-2.5 md:py-1.5 cursor-pointer text-base md:text-sm ${activeView === 'allTasks' ? 'bg-base-content/10 font-medium' : ''}`}>
                <div className="flex items-center gap-3 md:gap-2">
                  <ListTodo size={18} className={`md:w-4 md:h-4 ${activeView === 'allTasks' ? 'text-primary' : 'opacity-70'}`} /> All Tasks
                </div>
              </a>
            </li>
            
            <li>
              <a onClick={() => {
                  onNavigate('timeline');
                  closeMobileSidebar();
                }} 
                className={`flex justify-between items-center w-full py-2.5 md:py-1.5 cursor-pointer text-base md:text-sm ${activeView === 'timeline' ? 'bg-base-content/10 font-medium' : ''}`}>
                <div className="flex items-center gap-3 md:gap-2">
                  <CalendarRange size={18} className={`md:w-4 md:h-4 ${activeView === 'timeline' ? 'text-primary' : 'opacity-70'}`} /> Timeline
                </div>
              </a>
            </li>

            <li className="menu-title flex flex-row items-center justify-between text-xs md:text-[10px] uppercase tracking-wider opacity-50 mt-6 md:mt-8 mb-1">
              <span>Projects</span>
              <button 
                className="hover:opacity-100 transition-opacity flex justify-end min-w-8 md:min-w-6 p-1 md:p-0 bg-transparent border-none cursor-pointer"
                onClick={() => {
                  onOpenNewTask();
                  closeMobileSidebar();
                }}
                title="Create new task"
              >
                <Plus size={16} className="md:w-3.5 md:h-3.5" />
              </button>
            </li>
            
            {dynamicProjects.length === 0 ? (
              <li>
                <span className="text-xs md:text-[11px] italic opacity-40 cursor-default hover:bg-transparent flex justify-center w-full mt-2">
                  No active projects yet
                </span>
              </li>
            ) : (
              dynamicProjects.map((project) => {
                const isActiveProject = activeView === 'focus' && activeCategory === project.name;
                
                return (
                  <li key={project.id}>
                    <a 
                      className={`flex items-center justify-between w-full py-2.5 md:py-1.5 text-base md:text-sm ${isActiveProject ? 'bg-base-content/10 font-medium' : ''}`}
                      onClick={() => {
                        setActiveCategory(project.name);
                        if (activeView !== 'focus') onNavigate('focus');
                        closeMobileSidebar();
                      }}
                    >
                      <div className="flex items-center gap-3 md:gap-2 truncate">
                        <span className={`w-2.5 h-2.5 md:w-2 md:h-2 rounded-full shrink-0 ${project.color}`}></span>
                        <span className="truncate">{project.name}</span>
                      </div>
                      <span className="text-xs md:text-[11px] font-medium opacity-50 min-w-6 text-right shrink-0 pr-1">
                        {project.count}
                      </span>
                    </a>
                  </li>
                );
              })
            )}
          </ul>
        </div>

        <div className="p-3 md:p-3 border-t border-base-content/5 mt-auto shrink-0 pb-6 md:pb-3">
          <ul className="menu md:menu-sm w-full gap-1 md:gap-0.5 p-0">
            
            <li>
              <a 
                onClick={() => {
                  onNavigate('archive');
                  closeMobileSidebar();
                }}
                className={`flex items-center gap-3 md:gap-2 cursor-pointer w-full py-2.5 md:py-1.5 text-base md:text-sm ${activeView === 'archive' ? 'bg-base-content/10 font-medium' : ''}`}
              >
                <Archive size={18} className={`md:w-4 md:h-4 ${activeView === 'archive' ? 'text-primary' : 'opacity-70'}`} /> 
                Archive
              </a>
            </li>
            
            <li>
              <a 
                onClick={() => {
                  onOpenSettings();
                  closeMobileSidebar();
                }} 
                className="flex items-center gap-3 md:gap-2 cursor-pointer w-full py-2.5 md:py-1.5 text-base md:text-sm"
              >
                <Settings size={18} className="md:w-4 md:h-4 opacity-70" /> 
                Settings
              </a>
            </li>

          </ul>
          
          <div className="mt-4 mb-2 mx-3 flex items-center gap-2 text-xs md:text-[11px] opacity-40 uppercase tracking-wide font-medium">
            <ShieldCheck size={16} className="md:w-3.5 md:h-3.5 text-success" />
            <span>100% Local and Private</span>
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