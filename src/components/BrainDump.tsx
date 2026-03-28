import {
  Brain,
  Plus,
  Trash2,
  FolderOutput,
  CheckSquare,
  AlertOctagon,
} from "lucide-react";
import { useBrainDump } from "../hooks/useBrainDump";
import type { BrainDumpProps } from "../types/components";

export default function BrainDump({ onTaskSelect }: BrainDumpProps) {
  const {
    inputValue,
    setInputValue,
    selectedIds,
    editingId,
    setEditingId,
    editValue,
    setEditValue,
    brainDumpTasks,
    handleQuickAdd,
    handleDelete,
    handleSaveEdit,
    toggleSelection,
    handleDeleteSelected,
    handleMergeSelected,
    handleClearAll,
  } = useBrainDump();

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 md:px-8 py-8 md:py-10">
      
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-base-200 flex items-center justify-center text-primary shadow-sm border border-base-content/5 shrink-0">
              <Brain size={24} className="md:w-7 md:h-7" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">Brain Dump</h1>
          </div>
          <p className="text-sm md:text-base text-base-content/60 ml-1">
            Quickly capture thoughts. Process them later.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {selectedIds.size > 1 && (
            <button
              onClick={handleMergeSelected}
              className="btn btn-sm btn-secondary"
            >
              <CheckSquare size={16} /> Merge ({selectedIds.size})
            </button>
          )}
          {selectedIds.size > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="btn btn-sm btn-error btn-outline"
            >
              <Trash2 size={16} /> Delete
            </button>
          )}
          {selectedIds.size === 0 && brainDumpTasks.length > 0 && (
            <button
              onClick={handleClearAll}
              className="btn btn-sm btn-ghost text-error hover:bg-error/10"
            >
              <AlertOctagon size={16} /> Clear Dump
            </button>
          )}
        </div>
      </div>
      <form onSubmit={handleQuickAdd} className="mb-6 md:mb-8 relative group">
        <input
          id="brain-dump-input"
          name="brainDumpInput"
          type="text"
          placeholder="What's on your mind? Type and hit Enter..."
          className="input input-bordered w-full h-12 md:h-14 text-sm md:text-base bg-base-200/50 pr-14 md:pr-16 focus:bg-base-100 transition-colors shadow-sm"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          autoFocus
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-primary btn-sm h-8 w-8 md:h-10 md:w-10 p-0 rounded-lg"
          title="Quick Add"
        >
          <Plus size={20} />
        </button>
      </form>
      <div className="pb-12">
        <h3 className="text-xs md:text-sm font-semibold uppercase tracking-wider opacity-50 mb-4">
          Unprocessed Thoughts ({brainDumpTasks.length})
        </h3>

        {brainDumpTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 opacity-40 text-center border-2 border-dashed border-base-content/10 rounded-2xl">
            <Brain size={48} className="mb-4 opacity-50" />
            <p className="text-sm md:text-base">Your mind is clear.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {brainDumpTasks.map((task) => (
              <li
                key={task.id}
                className={`group flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-3 p-3 bg-base-100 border rounded-xl transition-all shadow-sm ${
                  selectedIds.has(task.id)
                    ? "border-primary bg-primary/5"
                    : "border-base-content/10 hover:border-base-content/30"
                }`}
              >
                <div className="flex items-center flex-1 min-w-0 gap-3 w-full md:w-auto">
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
                        className="font-medium text-sm md:text-base text-base-content truncate cursor-text select-none"
                        title="Double-click to edit"
                      >
                        {task.title}
                      </h4>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-end w-full md:w-auto gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0 mt-2 md:mt-0 pl-7 md:pl-0">
                  <button
                    onClick={() => onTaskSelect(task)}
                    className="btn btn-ghost btn-xs md:btn-sm gap-1 md:btn-square"
                    title="Process Task (Open Editor)"
                  >
                    <FolderOutput size={14} className="md:w-4 md:h-4" />
                    <span className="md:hidden text-xs">Process</span>
                  </button>

                  <button
                    onClick={() => handleDelete(task.id)}
                    className="btn btn-ghost btn-xs md:btn-sm gap-1 md:btn-square text-error hover:bg-error/10"
                    title="Delete task"
                  >
                    <Trash2 size={14} className="md:w-4 md:h-4" />
                    <span className="md:hidden text-xs">Delete</span>
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