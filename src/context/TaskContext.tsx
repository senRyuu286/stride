import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type PriorityLevel = 'High' | 'Medium' | 'Low' | 'None';
export type TaskStatus = 'todo' | 'in-progress' | 'completed';

export interface Subtask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Workspace {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  workspaceId: string;
  title: string;
  category: string;
  dueDate: string | null; 
  completionDate: string | null; 
  description: string;
  subtasks: Subtask[];
  status: TaskStatus;
  priority: PriorityLevel;
  tags: string[];
}

const INITIAL_WORKSPACES: Workspace[] = [
  { id: 'ws_1', name: '1st Semester 2025-2026' },
  { id: 'ws_2', name: '2nd Semester 2025-2026' },
];

const INITIAL_UPCOMING: Task[] = [
  { 
    id: '1', 
    workspaceId: 'ws_2',
    title: 'Write Literature Essay Draft 1', 
    category: 'Literature', 
    dueDate: '2026-03-30T23:59:00Z',
    completionDate: null,
    description: 'Focus on the main thesis statement.', 
    subtasks: [
      { id: 'sub_1', title: 'Outline arguments', isCompleted: true },
      { id: 'sub_2', title: 'Write intro', isCompleted: false }
    ],
    status: 'in-progress',
    priority: 'Medium',
    tags: ['Essay', 'Midterm']
  },
  { 
    id: '2', 
    workspaceId: 'ws_2',
    title: 'Calculus Assignment 4', 
    category: 'Math', 
    dueDate: '2026-03-28T17:00:00Z',
    completionDate: null,
    description: 'Derivatives practice pages 40-42.', 
    subtasks: [],
    status: 'todo',
    priority: 'High',
    tags: ['Homework']
  },
  { 
    id: '3', 
    workspaceId: 'ws_1',
    title: 'Read Chapter 5', 
    category: 'History', 
    dueDate: '2026-04-05T12:00:00Z',
    completionDate: null,
    description: 'The Industrial Revolution.', 
    subtasks: [],
    status: 'todo',
    priority: 'Low',
    tags: ['Reading']
  },
];

const INITIAL_DAILY: (Task | null)[] = [
  { 
    id: '5', 
    workspaceId: 'ws_2',
    title: 'Physics Midterm Review', 
    category: 'Physics', 
    dueDate: '2026-03-27T08:00:00Z',
    completionDate: null,
    description: 'Review kinematics and dynamics.', 
    subtasks: [],
    status: 'todo',
    priority: 'High',
    tags: ['EXAM TOMORROW']
  },
  null, 
  null
];

interface TaskContextType {
  workspaces: Workspace[];
  activeWorkspaceId: string;
  setActiveWorkspaceId: (id: string) => void;
  
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  
  upcomingTasks: Task[];
  dailyTasks: (Task | null)[];
  setUpcomingTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setDailyTasks: React.Dispatch<React.SetStateAction<(Task | null)[]>>;

  addWorkspace: (name: string) => void;
  updateWorkspace: (id: string, updates: Partial<Workspace>) => void;
  deleteWorkspace: (id: string) => void;

  addTask: (task: Pick<Task, 'title' | 'workspaceId'> & Partial<Task>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskCompletion: (taskId: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(() => {
    const saved = localStorage.getItem('focus_workspaces');
    return saved ? JSON.parse(saved) : INITIAL_WORKSPACES;
  });

  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>(() => {
    const saved = localStorage.getItem('focus_activeWorkspaceId');
    return saved ? JSON.parse(saved) : 'ws_2';
  });

  const [activeCategory, setActiveCategory] = useState<string>(() => {
    const saved = localStorage.getItem('focus_activeCategory');
    return saved ? JSON.parse(saved) : 'All';
  });

  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('focus_upcomingTasks');
    return saved ? JSON.parse(saved) : INITIAL_UPCOMING;
  });

  const [dailyTasks, setDailyTasks] = useState<(Task | null)[]>(() => {
    const saved = localStorage.getItem('focus_dailyTasks');
    return saved ? JSON.parse(saved) : INITIAL_DAILY;
  });

  useEffect(() => { localStorage.setItem('focus_workspaces', JSON.stringify(workspaces)); }, [workspaces]);
  useEffect(() => { localStorage.setItem('focus_activeWorkspaceId', JSON.stringify(activeWorkspaceId)); }, [activeWorkspaceId]);
  useEffect(() => { localStorage.setItem('focus_upcomingTasks', JSON.stringify(upcomingTasks)); }, [upcomingTasks]);
  useEffect(() => { localStorage.setItem('focus_dailyTasks', JSON.stringify(dailyTasks)); }, [dailyTasks]);
  
  useEffect(() => { localStorage.setItem('focus_activeCategory', JSON.stringify(activeCategory)); }, [activeCategory]);
  useEffect(() => { setActiveCategory('All'); }, [activeWorkspaceId]); 


  const addWorkspace = (name: string) => {
    const newWorkspace: Workspace = {
      id: 'ws_' + Math.random().toString(36).substring(2, 9),
      name: name
    };
    setWorkspaces((prev) => [...prev, newWorkspace]);
    setActiveWorkspaceId(newWorkspace.id);
  };

  const updateWorkspace = (id: string, updates: Partial<Workspace>) => {
    setWorkspaces((prev) => 
      prev.map((ws) => (ws.id === id ? { ...ws, ...updates } : ws))
    );
  };

  const deleteWorkspace = (id: string) => {
    setWorkspaces((prev) => {
      const filtered = prev.filter((ws) => ws.id !== id);
      if (activeWorkspaceId === id && filtered.length > 0) {
        setActiveWorkspaceId(filtered[0].id);
      }
      return filtered;
    });
  };

  const addTask = (newTaskData: Pick<Task, 'title' | 'workspaceId'> & Partial<Task>) => {
    const newTask: Task = {
      id: Math.random().toString(36).substring(2, 9),
      workspaceId: newTaskData.workspaceId,
      title: newTaskData.title,
      category: newTaskData.category || 'Inbox',
      dueDate: newTaskData.dueDate || null,
      completionDate: newTaskData.completionDate || null,
      description: newTaskData.description || '',
      subtasks: newTaskData.subtasks || [],
      status: newTaskData.status || 'todo',
      priority: newTaskData.priority || 'None',
      tags: newTaskData.tags || [],
    };
    setUpcomingTasks((prev) => [...prev, newTask]);
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setUpcomingTasks((prev) => 
      prev.map((task) => (task.id === taskId ? { ...task, ...updates } : task))
    );
    setDailyTasks((prev) => 
      prev.map((task) => (task && task.id === taskId ? { ...task, ...updates } : task))
    );
  };

  const deleteTask = (taskId: string) => {
    setUpcomingTasks((prev) => prev.filter((task) => task.id !== taskId));
    setDailyTasks((prev) => prev.map((task) => (task?.id === taskId ? null : task)));
  };

  const toggleTaskCompletion = (taskId: string) => {
    const applyToggle = (task: Task): Task => {
      if (task.id === taskId) {
        const isCompleting = task.status !== 'completed';
        return {
          ...task,
          status: isCompleting ? 'completed' : 'todo',
          completionDate: isCompleting ? new Date().toISOString() : null,
        };
      }
      return task;
    };

    setUpcomingTasks((prev) => prev.map(applyToggle));
    setDailyTasks((prev) => prev.map((task) => (task ? applyToggle(task) : null)));
  };

  return (
    <TaskContext.Provider value={{ 
      workspaces, 
      activeWorkspaceId, 
      setActiveWorkspaceId,
      activeCategory, 
      setActiveCategory, 
      upcomingTasks, 
      dailyTasks, 
      setUpcomingTasks, 
      setDailyTasks, 
      addWorkspace,
      updateWorkspace,
      deleteWorkspace,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskCompletion 
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) throw new Error('useTasks must be used within a TaskProvider');
  return context;
}