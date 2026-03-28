import { type PriorityLevel } from "../store/useTaskStore";
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
              value={title}
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
                    className="btn btn-ghost px-2 shrink-0"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
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
                className="input input-bordered flex-1 bg-base-200/50"
                placeholder="Add a step..."
                value={subtaskInput}
                onChange={(event) => setSubtaskInput(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && handleAddPendingSubtask()}
              />
              <button className="btn btn-secondary shrink-0" onClick={handleAddPendingSubtask}>
                Add
              </button>
            </div>
            {pendingSubtasks.length > 0 && (
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
              value={description}
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
              disabled={!title.trim()}
            >
              {taskToEdit ? "Save Task" : "Create Task"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}