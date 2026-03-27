import { type PriorityLevel } from "../context/TaskContext";
import { useNewTaskModalForm } from "../hooks/useNewTaskModalForm";
import type { NewTaskModalProps } from "../types/modals";
import { BRAIN_DUMP_CATEGORY } from "../utils/taskHelpers";

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

  return (
    <div className="modal modal-open bg-black/40 backdrop-blur-sm z-50">
      <div className="modal-box bg-base-100 border border-base-content/10 shadow-2xl max-w-2xl">
        <h3 className="font-bold text-xl mb-6">
          {taskToEdit ? "Process Task" : "Create New Task"}
        </h3>
        <div className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Task Name*</span>
            </label>
            <input
              autoFocus
              type="text"
              className="input input-bordered w-full bg-base-200/50"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="What needs to be done?"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Project / Category</span>
              </label>
              {!isAddingNewCategory ? (
                <select
                  className="select select-bordered w-full bg-base-200/50"
                  value={category}
                  onChange={(event) => {
                    if (event.target.value === "+++NEW+++") {
                      setIsAddingNewCategory(true);
                      setCategory("");
                    } else {
                      setCategory(event.target.value);
                    }
                  }}
                >
                  {existingCategories.map((existingCategory) => (
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
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    placeholder="New project name..."
                  />
                  <button
                    className="btn btn-ghost px-2"
                    onClick={() => {
                      setIsAddingNewCategory(false);
                      setCategory(existingCategories[0] || BRAIN_DUMP_CATEGORY);
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
                value={priority}
                onChange={(event) => setPriority(event.target.value as PriorityLevel)}
              >
                <option value="None" className="bg-base-100">None</option>
                <option value="Low" className="bg-base-100">Low</option>
                <option value="Medium" className="bg-base-100">Medium</option>
                <option value="High" className="bg-base-100">High</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Due Date & Time</span>
              </label>
              <input
                type="datetime-local"
                className="input input-bordered w-full bg-base-200/50 text-base-content"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Tags</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full bg-base-200/50"
                value={tagsInput}
                onChange={(event) => setTagsInput(event.target.value)}
                placeholder="Exam, Reading, Urgent"
              />
            </div>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Subtasks</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                className="input input-bordered input-sm flex-1 bg-base-200/50"
                placeholder="Add a step..."
                value={subtaskInput}
                onChange={(event) => setSubtaskInput(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && handleAddPendingSubtask()}
              />
              <button className="btn btn-sm btn-secondary" onClick={handleAddPendingSubtask}>
                Add
              </button>
            </div>
            {pendingSubtasks.length > 0 && (
              <ul className="space-y-1 mt-1">
                {pendingSubtasks.map((subtask, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center text-sm bg-base-200/30 px-3 py-1.5 rounded-md border border-base-content/5"
                  >
                    <span>{subtask}</span>
                    <button
                      className="btn btn-ghost btn-xs text-error opacity-70"
                      onClick={() => handleRemovePendingSubtask(index)}
                    >
                      X
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Notes & Details</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full bg-base-200/50 h-24"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Add notes here..."
            />
          </div>
        </div>
        <div className="modal-action mt-6 pt-4 border-t border-base-content/10">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => saveTask(onClose)} disabled={!title.trim()}>
            {taskToEdit ? "Save Task" : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
}
