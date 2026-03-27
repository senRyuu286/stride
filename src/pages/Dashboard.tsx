import { Sidebar } from "../components/Sidebar";
import { Topbar } from "../components/Topbar";
import { TaskDetails } from "../components/TaskDetails";
import {
  TaskProvider,
} from "../context/TaskContext";
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
    <TaskProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-base-100 text-base-content font-sans">
        <Sidebar
          activeView={activeView}
          onNavigate={setActiveView}
          onOpenSettings={openSettings}
          onOpenNewTask={openNewTaskModal}
        />

        <main className="flex flex-col flex-1 min-w-0 bg-base-100 relative">
          <Topbar
            onOpenNewTask={openNewTaskModal}
            onToggleRightSidebar={toggleRightSidebar}
            isRightSidebarOpen={isRightSidebarOpen}
          />
          <div className="flex-1 overflow-y-auto pb-20">
            {renderDashboardView({
              activeView,
              onTaskSelect: selectTask,
              onBrainDumpTaskSelect: editTask,
            })}
          </div>
        </main>

        {isRightSidebarOpen && (
          <aside className="w-80 border-l border-base-content/10 bg-base-50 shrink-0 h-full overflow-y-auto z-10 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.02)]">
            {selectedTask ? (
              <TaskDetails
                task={selectedTask}
                onClose={closeTaskDetails}
                onEditTask={editTask}
              />
            ) : (
              <div className="flex items-center justify-center h-full opacity-40 text-sm font-medium p-6 text-center">
                Select a task to view details!
              </div>
            )}
          </aside>
        )}

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
    </TaskProvider>
  );
}