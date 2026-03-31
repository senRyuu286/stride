import React, { useMemo, useState } from "react";
import { type PriorityLevel, useTaskStore } from "../store/useTaskStore";
import { useNewTaskModalForm } from "../hooks/useNewTaskModalForm";
import type { NewTaskModalProps } from "../types/modals";
import { BRAIN_DUMP_CATEGORY } from "../utils/taskHelpers";

const formatToLocalDatetime = (d: Date) => {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export function NewTaskModal({ onClose, taskToEdit }: NewTaskModalProps) {
  const {
    existingCategories,
    title,
    setTitle,
    category,
    setCategory,
    isAddingNewCategory,
    setIsAddingNewCategory,
    description,
    setDescription,
    dueDate,
    setDueDate,
    priority,
    setPriority,
    tagsInput,
    setTagsInput,
    subtaskInput,
    setSubtaskInput,
    pendingSubtasks,
    handleAddPendingSubtask,
    handleRemovePendingSubtask,
    saveTask,
  } = useNewTaskModalForm(taskToEdit);

const upcomingTasks = useTaskStore((state) => state.upcomingTasks);
  const dailyTasks = useTaskStore((state) => state.dailyTasks);

  const allTasks = useMemo(() => {
    return [
      ...(upcomingTasks || []),
      ...(dailyTasks || []).filter((t): t is NonNullable<typeof t> => t !== null),
    ];
  }, [upcomingTasks, dailyTasks]);
  
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState("");

  const availableTags = useMemo(() => {
    const predefined = ["Work", "Personal", "Urgent", "Study", "Health", "Finance", "Errands", "Project"];
    const existing = allTasks.flatMap((t) => t?.tags || []);
    return Array.from(new Set([...predefined, ...existing, ...customTags])).filter(Boolean);
  }, [allTasks, customTags]);

const selectedTagsList = useMemo(() => {
    if (!tagsInput || typeof tagsInput !== "string") return [];
    return tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
  }, [tagsInput]);

  const toggleTag = (tag: string) => {
    if (selectedTagsList.includes(tag)) {
      setTagsInput(selectedTagsList.filter((t) => t !== tag).join(", "));
    } else {
      setTagsInput([...selectedTagsList, tag].join(", "));
    }
  };

  const addCustomTag = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    const t = newTagInput.trim();
    if (!t) return;
    if (!customTags.includes(t)) {
      setCustomTags((prev) => [...prev, t]);
    }
    if (!selectedTagsList.includes(t)) {
      setTagsInput([...selectedTagsList, t].join(", "));
    }
    setNewTagInput("");
  };

const quickDates = useMemo(() => {
    const now = new Date();

    const today = new Date(now);
    today.setHours(23, 59, 0, 0);

    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(23, 59, 0, 0);

    const thisWeek = new Date(now);
    thisWeek.setDate(now.getDate() + (7 - now.getDay()));
    thisWeek.setHours(23, 59, 0, 0);

    const nextWeek = new Date(thisWeek);
    nextWeek.setDate(thisWeek.getDate() + 7);
    nextWeek.setHours(23, 59, 0, 0);

    return [
      { label: "Today", value: formatToLocalDatetime(today) },
      { label: "Tomorrow", value: formatToLocalDatetime(tomorrow) },
      { label: "This Week", value: formatToLocalDatetime(thisWeek) },
      { label: "Next Week", value: formatToLocalDatetime(nextWeek) },
    ];
  }, []);

  return (
    <div className="modal modal-open modal-bottom sm:modal-middle bg-neutral-900/40 backdrop-blur-sm z-50 sm:p-4">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
        aria-hidden="true"
      ></div>

      <div className="modal-box relative bg-base-100 border border-base-content/10 shadow-2xl rounded-t-3xl sm:rounded-2xl p-0 w-full max-w-2xl max-h-[90vh] flex flex-col z-10 animate-slide-up sm:animate-pop-in overflow-hidden">

        <div className="w-full flex justify-center absolute top-3 left-0 sm:hidden z-20 pointer-events-none">
          <div className="w-12 h-1.5 bg-base-content/20 rounded-full" />
        </div>

        <div className="px-6 pt-8 pb-4 sm:pt-6 sm:pb-4 border-b border-base-content/10 shrink-0 bg-base-100 z-10">
          <h3 className="font-bold text-lg sm:text-xl text-base-content m-0">
            {taskToEdit ? "Process Task" : "Create New Task"}
          </h3>
        </div>
        <div className="p-6 overflow-y-auto space-y-5">
          <div className="form-control">
            <label className="label pt-0">
              <span className="label-text font-medium">Task Name*</span>
            </label>
            <input
              autoFocus
              type="text"
              className="input input-bordered w-full bg-base-200/50"
              value={title || ""}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="What needs to be done?"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Project / Category</span>
              </label>
              {!isAddingNewCategory ? (
                <select
                  className="select select-bordered w-full bg-base-200/50"
                  value={category || ""}
                  onChange={(event) => {
                    if (event.target.value === "+++NEW+++") {
                      setIsAddingNewCategory(true);
                      setCategory("");
                    } else {
                      setCategory(event.target.value);
                    }
                  }}
                >
                  {(existingCategories || []).map((existingCategory) => (
                    <option
                      key={existingCategory}
                      value={existingCategory}
                      className="bg-base-100"
                    >
                      {existingCategory}
                    </option>
                  ))}
                  <option disabled className="bg-base-100">
                    ----------
                  </option>
                  <option value="+++NEW+++" className="bg-base-100">
                    + Add New Project...
                  </option>
                </select>
              ) : (
                <div className="flex gap-2">
                  <input
                    autoFocus
                    type="text"
                    className="input input-bordered w-full bg-base-200/50"
                    value={category || ""}
                    onChange={(event) => setCategory(event.target.value)}
                    placeholder="New project name..."
                  />
                  <button
                    className="btn btn-ghost px-2 shrink-0"
                    onClick={() => {
                      setIsAddingNewCategory(false);
                      setCategory(existingCategories?.[0] || BRAIN_DUMP_CATEGORY);
                    }}
                  >
                    X
                  </button>
                </div>
              )}
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Priority</span>
              </label>
              <select
                className="select select-bordered w-full bg-base-200/50"
                value={priority || "None"}
                onChange={(event) => setPriority(event.target.value as PriorityLevel)}
              >
                <option value="None" className="bg-base-100">None</option>
                <option value="Low" className="bg-base-100">Low</option>
                <option value="Medium" className="bg-base-100">Medium</option>
                <option value="High" className="bg-base-100">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Due Date & Time</span>
              </label>
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-2">
                  {quickDates.map((qd) => (
                    <button
                      key={qd.label}
                      type="button"
                      onClick={() => setDueDate(qd.value)}
                      className={`badge badge-lg cursor-pointer transition-colors ${
                        dueDate === qd.value
                          ? "badge-primary"
                          : "badge-outline border-base-content/20 bg-base-200/50 hover:bg-base-300"
                      }`}
                    >
                      {qd.label}
                    </button>
                  ))}
                </div>
                <input
                  type="datetime-local"
                  className="input input-bordered w-full bg-base-200/50 text-base-content"
                  value={dueDate || ""}
                  onChange={(event) => setDueDate(event.target.value)}
                />
              </div>
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Tags</span>
              </label>
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="input input-bordered w-full bg-base-200/50"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addCustomTag(e)}
                    placeholder="Type and press add..."
                  />
                  <button
                    type="button"
                    className="btn btn-secondary shrink-0"
                    onClick={addCustomTag}
                  >
                    Add
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2 max-h-27.5 overflow-y-auto pb-1 scrollbar-thin">
                  {availableTags.map((tag) => {
                    const isSelected = selectedTagsList.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`badge badge-lg cursor-pointer transition-colors ${
                          isSelected
                            ? "badge-primary"
                            : "badge-outline border-base-content/20 bg-base-200/50 hover:bg-base-300"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Subtasks</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                className="input input-bordered flex-1 bg-base-200/50"
                placeholder="Add a step..."
                value={subtaskInput || ""}
                onChange={(event) => setSubtaskInput(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && handleAddPendingSubtask()}
              />
              <button className="btn btn-secondary shrink-0" onClick={handleAddPendingSubtask}>
                Add
              </button>
            </div>
            {(pendingSubtasks || []).length > 0 && (
              <ul className="space-y-2 mt-1">
                {pendingSubtasks.map((subtask, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center text-sm bg-base-200/30 px-3 py-2 rounded-md border border-base-content/5"
                  >
                    <span className="truncate pr-2">{subtask}</span>
                    <button
                      className="btn btn-ghost btn-xs text-error opacity-70 shrink-0"
                      onClick={() => handleRemovePendingSubtask(index)}
                    >
                      X
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="form-control pb-4">
            <label className="label">
              <span className="label-text font-medium">Notes & Details</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full bg-base-200/50 h-24 sm:h-32"
              value={description || ""}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Add notes here..."
            />
          </div>
        </div>
        <div className="p-4 sm:px-6 sm:py-4 border-t border-base-content/10 shrink-0 bg-base-100 z-10 pb-safe">
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 w-full">
            <button 
              className="btn btn-ghost w-full sm:w-auto order-2 sm:order-1 rounded-xl" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary w-full sm:w-auto order-1 sm:order-2 rounded-xl" 
              onClick={() => saveTask(onClose)} 
              disabled={!title?.trim()}
            >
              {taskToEdit ? "Save Task" : "Create Task"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}