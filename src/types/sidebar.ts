import type { ViewState } from "./view";

export interface SidebarProps {
  activeView: ViewState;
  onNavigate: (view: ViewState) => void;
  onOpenSettings: () => void;
  onOpenNewTask: () => void;
}

export type SidebarModalState =
  | "none"
  | "create"
  | "rename"
  | "delete"
  | "cannotDelete";

export interface SidebarProjectItem {
  id: string;
  name: string;
  count: number;
  color: string;
}
