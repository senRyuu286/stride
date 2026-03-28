import { Sidebar } from "../components/Sidebar";
import { Topbar } from "../components/Topbar";
import { TaskDetails } from "../components/TaskDetails";
import { NewTaskModal } from "../modals/NewTaskModal";
import { SettingsModal } from "../modals/SettingsModal";
import { DeleteAllDataConfirmModal } from "../modals/DeleteAllDataConfirmModal";
import { useDashboardState } from "../hooks/useDashboardState";
import { renderDashboardView } from "../utils/dashboardView";

export default function Dashboard() {
  const {
    activeView,
    setActiveView,
    selectedTask,
    isSettingsOpen,
    isRightSidebarOpen,
    isNewTaskModalOpen,
    taskToEdit,
    isDeleteAllConfirmOpen,
    theme,
    setTheme,
    openSettings,
    closeSettings,
    openNewTaskModal,
    editTask,
    closeNewTaskModal,
    selectTask,
    closeTaskDetails,
    toggleRightSidebar,
    promptDeleteAllData,
    cancelDeleteAllData,
    executeDataWipe,
  } = useDashboardState();

  return (
    <div className="drawer lg:drawer-open h-screen w-screen overflow-hidden bg-base-100 text-base-content font-sans">
      <input id="sidebar-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex h-full overflow-hidden relative">

        <main className="flex flex-col flex-1 min-w-0 bg-base-100 relative h-full">
          <Topbar
            onOpenNewTask={openNewTaskModal}
            onToggleRightSidebar={toggleRightSidebar}
            isRightSidebarOpen={isRightSidebarOpen}
          />
          <div className="flex-1 overflow-y-auto pb-10 lg:pb-0">
            {renderDashboardView({
              activeView,
              onTaskSelect: selectTask,
              onBrainDumpTaskSelect: editTask,
            })}
          </div>
        </main>
        
        {isRightSidebarOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/40 z-60 lg:hidden backdrop-blur-sm transition-opacity"
              onClick={toggleRightSidebar}
              aria-hidden="true"
            />

            <aside className="fixed inset-x-0 bottom-0 z-70 h-[85vh] bg-base-100 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] rounded-t-3xl overflow-hidden border-t border-base-content/10 flex flex-col lg:static lg:h-full lg:w-80 xl:w-96 lg:rounded-none lg:border-t-0 lg:border-l lg:shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.02)] lg:shrink-0 lg:z-10 transition-transform duration-300">
              
              {selectedTask ? (
                <TaskDetails
                  task={selectedTask}
                  onClose={closeTaskDetails}
                  onEditTask={editTask}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full opacity-40 text-sm font-medium p-6 text-center">
                  <p>Select a task to view details!</p>
                </div>
              )}
            </aside>
          </>
        )}
      </div>

      <div className="drawer-side z-80 lg:z-auto">
        <label htmlFor="sidebar-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <aside className="h-full w-4/5 max-w-[320px] lg:w-64 xl:w-72 bg-base-100 shrink-0 border-r border-base-content/10">
          <Sidebar
            activeView={activeView}
            onNavigate={setActiveView}
            onOpenSettings={openSettings}
            onOpenNewTask={openNewTaskModal}
          />
        </aside>
      </div>

      {isNewTaskModalOpen && (
        <NewTaskModal
          taskToEdit={taskToEdit}
          onClose={closeNewTaskModal}
        />
      )}

      <SettingsModal
        isOpen={isSettingsOpen}
        theme={theme}
        onThemeChange={setTheme}
        onDeleteAllData={promptDeleteAllData}
        onClose={closeSettings}
      />

      <DeleteAllDataConfirmModal
        isOpen={isDeleteAllConfirmOpen}
        onCancel={cancelDeleteAllData}
        onConfirm={executeDataWipe}
      />
    </div>
  );
}