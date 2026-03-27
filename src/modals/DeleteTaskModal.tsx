import type { DeleteTaskModalProps } from "../types/modals";

export function DeleteTaskModal({
  isOpen,
  taskTitle,
  onCancel,
  onConfirm,
}: DeleteTaskModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal modal-open bg-black/40 backdrop-blur-sm z-50">
      <div className="modal-box bg-base-100 border border-base-content/10 shadow-2xl">
        <h3 className="font-bold text-xl mb-4 text-error">Delete Task</h3>
        <p className="opacity-80">
          Are you sure you want to delete
          <span className="font-semibold text-base-content"> "{taskTitle}"</span>? This action
          cannot be undone.
        </p>
        <div className="modal-action mt-6">
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn btn-error" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}
