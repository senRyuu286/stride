import type { Task } from "../context/TaskContext";
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

export function renderDashboardView({
  activeView,
  onTaskSelect,
  onBrainDumpTaskSelect,
}: DashboardViewProps) {
  switch (activeView) {
    case "allTasks":
      return <AllTasks onTaskSelect={onTaskSelect} />;
    case "timeline":
      return <Timeline onTaskSelect={onTaskSelect} />;
    case "brainDump":
      return <BrainDump onTaskSelect={onBrainDumpTaskSelect} />;
    case "archive":
      return <Archive onTaskSelect={onTaskSelect} />;
    case "focus":
    default:
      return <Focus onTaskSelect={onTaskSelect} />;
  }
}
