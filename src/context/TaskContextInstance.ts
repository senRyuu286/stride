import { createContext } from "react";
import type { TaskContextType } from "./TaskContext";

export const TaskContext = createContext<TaskContextType | undefined>(undefined);
