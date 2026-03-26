import React, { createContext, useContext, useState, type ReactNode } from 'react';

export type PriorityLevel = 'High' | 'Medium' | 'Low';

export interface Workspace {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  category: string;
  daysLeft: number;
  priority: PriorityLevel;
  description?: string;
  tag?: string;
  workspaceId: string;
}

const INITIAL_WORKSPACES: Workspace[] = [
  { id: 'ws_1', name: '1st Semester 2025-2026' },
  { id: 'ws_2', name: '2nd Semester 2025-2026' },
];

const INITIAL_UPCOMING: Task[] = [
  { id: '1', title: 'Write Literature Essay Draft 1', category: 'Literature', daysLeft: 3, priority: 'Medium', description: 'Focus on thesis.', workspaceId: 'ws_2' },
  { id: '2', title: 'Calculus Assignment 4', category: 'Math', daysLeft: 1, priority: 'High', description: 'Derivatives practice.', workspaceId: 'ws_2' },
  { id: '3', title: 'Read Chapter 5', category: 'History', daysLeft: 5, priority: 'Low', description: 'The Industrial Revolution.', workspaceId: 'ws_1' },
];

const INITIAL_DAILY: (Task | null)[] = [
  { id: '5', title: 'Physics Midterm Review', category: 'Physics', daysLeft: 1, priority: 'High', tag: 'EXAM TOMORROW', workspaceId: 'ws_2' },
  null,
  null
];

interface TaskContextType {
  workspaces: Workspace[];
  activeWorkspaceId: string;
  setActiveWorkspaceId: (id: string) => void;
  upcomingTasks: Task[];
  dailyTasks: (Task | null)[];
  setUpcomingTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setDailyTasks: React.Dispatch<React.SetStateAction<(Task | null)[]>>;
  addTask: (task: Omit<Task, 'id'>) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [workspaces] = useState<Workspace[]>(INITIAL_WORKSPACES);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>('ws_2');

  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>(INITIAL_UPCOMING);
  const [dailyTasks, setDailyTasks] = useState<(Task | null)[]>(INITIAL_DAILY);

  const addTask = (newTaskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: Math.random().toString(36).substring(2, 9),
    };
    setUpcomingTasks((prev) => [...prev, newTask]);
  };

  return (
    <TaskContext.Provider value={{ 
      workspaces, 
      activeWorkspaceId, 
      setActiveWorkspaceId,
      upcomingTasks, 
      dailyTasks, 
      setUpcomingTasks, 
      setDailyTasks, 
      addTask 
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}