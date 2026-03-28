import { useTaskStore } from "../store/useTaskStore";

export function useTasks() {
  const state = useTaskStore();
  
  return state;
}