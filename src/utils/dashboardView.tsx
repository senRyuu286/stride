import type { Task } from "../store/useTaskStore";
import AllTasks from "../components/AllTasks";
import Archive from "../components/Archive";
import BrainDump from "../components/BrainDump";
import Focus from "../components/Focus";
import Timeline from "../components/Timeline";
import type { ViewState } from "../types/view";

interface DashboardViewProps {
  activeView: ViewState;
  onTaskSelect: (task: Task) => void;
  onBrainDumpTaskSelect: (task: Task) => void;
}

const VIEW_COMPONENTS: Record<ViewState, React.ComponentType<any>> = {
  allTasks: AllTasks,
  timeline: Timeline,
  brainDump: BrainDump,
  archive: Archive,
  focus: Focus,
};

export function renderDashboardView({
  activeView,
  onTaskSelect,
  onBrainDumpTaskSelect,
}: DashboardViewProps) {
  const taskHandler = activeView === "brainDump" ? onBrainDumpTaskSelect : onTaskSelect;
  
  const Component = VIEW_COMPONENTS[activeView] || Focus;

  return <Component onTaskSelect={taskHandler} />;
}

