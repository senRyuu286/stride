import type { DeleteAllDataConfirmModalProps } from "../types/modals";

export function DeleteAllDataConfirmModal({
  isOpen,
  onCancel,
  onConfirm,
}: DeleteAllDataConfirmModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal modal-open bg-black/40 backdrop-blur-sm z-60">
      <div className="modal-box bg-base-100 border border-error/20 shadow-2xl">
        <h3 className="font-bold text-xl mb-4 text-error">Final Confirmation</h3>
        <p className="opacity-80 mb-4">
          Are you absolutely sure? This will wipe <strong>everything</strong>: all tasks,
          projects, workspaces, and settings.
        </p>
        <p className="opacity-80 font-bold uppercase text-xs text-error">
          This action cannot be undone.
        </p>
        <div className="modal-action mt-6">
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn btn-error" onClick={onConfirm}>Yes, Delete Everything</button>
        </div>
      </div>
    </div>
  );
}
