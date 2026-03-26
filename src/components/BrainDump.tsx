import React, { useState } from "react";
import {
  Brain,
  Plus,
  Trash2,
  FolderOutput,
  CheckSquare,
  AlertOctagon,
} from "lucide-react";
import { useTasks, type Task } from "../context/TaskContext";

export interface BrainDumpProps {
  onTaskSelect: (task: Task) => void;
}

export default function BrainDump({ onTaskSelect }: BrainDumpProps) {
  const { 
    addTask, 
    updateTask, 
    deleteTask, 
    activeWorkspaceId, 
    upcomingTasks, 
    dailyTasks,
  } = useTasks();

  const [inputValue, setInputValue] = useState("");

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const allTasks = [
    ...upcomingTasks,
    ...dailyTasks.filter((t): t is Task => t !== null),
  ];

  const brainDumpTasks = allTasks.filter(
    (task) =>
      task.workspaceId === activeWorkspaceId &&
      task.category === "Brain Dump" &&
      task.status !== "completed",
  );

  const handleQuickAdd = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    addTask({
      title: inputValue.trim(),
      category: "Brain Dump",
      workspaceId: activeWorkspaceId,
      description: "",
      dueDate: null,
      priority: "None",
      tags: [],
      subtasks: [],
      status: "todo", 
    });

    setInputValue("");
  };

  const handleDelete = (id: string) => {
    deleteTask(id);
  };

  const handleSaveEdit = (id: string) => {
    if (editValue.trim()) {
      updateTask(id, { title: editValue.trim() });
    }
    setEditingId(null);
  };

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) newSelection.delete(id);
    else newSelection.add(id);
    setSelectedIds(newSelection);
  };

  const handleMergeSelected = () => {
    const mergedTitle = window.prompt(
      "Enter a name for the new combined task:",
    );
    if (!mergedTitle?.trim()) return;

    const tasksToMerge = brainDumpTasks.filter((t) => selectedIds.has(t.id));

    const newSubtasks = tasksToMerge.map((t) => ({
      id: Math.random().toString(36).substring(2, 9),
      title: t.title,
      isCompleted: false,
    }));

    addTask({
      title: mergedTitle.trim(),
      category: "Brain Dump", 
      workspaceId: activeWorkspaceId,
      description: "Merged from multiple Brain Dump thoughts.",
      dueDate: null,
      priority: "None",
      tags: [],
      subtasks: newSubtasks,
      status: "todo",
    });

    tasksToMerge.forEach((t) => deleteTask(t.id));
    setSelectedIds(new Set());
  };

  const handleClearAll = () => {
    if (
      window.confirm(
        "Are you sure you want to delete ALL unprocessed Brain Dump tasks? This cannot be undone.",
      )
    ) {
      brainDumpTasks.forEach((t) => deleteTask(t.id));
      setSelectedIds(new Set());
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 h-full flex flex-col">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-base-200 flex items-center justify-center text-primary shadow-sm border border-base-content/5">
              <Brain size={28} />
            </div>
            <h1 className="text-3xl font-bold">Brain Dump</h1>
          </div>
          <p className="text-base-content/60 ml-1">
            Quickly capture thoughts. Process them later.
          </p>
        </div>

        <div className="flex gap-2 h-10">
          {selectedIds.size > 1 && (
            <button
              onClick={handleMergeSelected}
              className="btn btn-sm btn-secondary h-full"
            >
              <CheckSquare size={16} /> Merge Selected ({selectedIds.size})
            </button>
          )}
          {selectedIds.size > 0 && (
            <button
              onClick={() => {
                selectedIds.forEach((id) => deleteTask(id));
                setSelectedIds(new Set());
              }}
              className="btn btn-sm btn-error btn-outline h-full"
            >
              <Trash2 size={16} /> Delete Selected
            </button>
          )}
          {selectedIds.size === 0 && brainDumpTasks.length > 0 && (
            <button
              onClick={handleClearAll}
              className="btn btn-sm btn-ghost text-error hover:bg-error/10 h-full"
            >
              <AlertOctagon size={16} /> Clear Dump
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleQuickAdd} className="mb-8 relative group">
        <input
          id="brain-dump-input"
          name="brainDumpInput"
          type="text"
          placeholder="What's on your mind? Type and hit Enter..."
          className="input input-bordered input-lg w-full bg-base-200/50 pr-16 focus:bg-base-100 transition-colors shadow-sm"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          autoFocus
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-primary btn-sm h-10 w-10 p-0 rounded-lg"
          title="Quick Add"
        >
          <Plus size={20} />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto pr-2 pb-12">
        <h3 className="text-sm font-semibold uppercase tracking-wider opacity-50 mb-4">
          Unprocessed Thoughts ({brainDumpTasks.length})
        </h3>

        {brainDumpTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 opacity-40 text-center border-2 border-dashed border-base-content/10 rounded-2xl">
            <Brain size={48} className="mb-4 opacity-50" />
            <p>Your mind is clear.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {brainDumpTasks.map((task) => (
              <li
                key={task.id}
                className={`group flex items-center gap-3 p-3 bg-base-100 border rounded-xl transition-all shadow-sm ${
                  selectedIds.has(task.id)
                    ? "border-primary bg-primary/5"
                    : "border-base-content/10 hover:border-base-content/30"
                }`}
              >
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm checkbox-primary rounded-md shrink-0"
                  checked={selectedIds.has(task.id)}
                  onChange={() => toggleSelection(task.id)}
                />

                <div
                  className="flex-1 min-w-0"
                  onDoubleClick={() => {
                    setEditingId(task.id);
                    setEditValue(task.title);
                  }}
                >
                  {editingId === task.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        autoFocus
                        className="input input-sm input-bordered w-full"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleSaveEdit(task.id)
                        }
                        onBlur={() => handleSaveEdit(task.id)}
                      />
                    </div>
                  ) : (
                    <h4
                      className="font-medium text-base-content truncate cursor-text select-none"
                      title="Double-click to edit"
                    >
                      {task.title}
                    </h4>
                  )}
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">

                  <button
                    onClick={() => onTaskSelect(task)}
                    className="btn btn-ghost btn-sm btn-square"
                    title="Process Task (Open Editor)"
                  >
                    <FolderOutput size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(task.id)}
                    className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/10"
                    title="Delete task"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}