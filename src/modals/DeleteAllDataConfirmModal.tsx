import { AlertTriangle } from "lucide-react";
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
    <div className="modal modal-open modal-bottom sm:modal-middle bg-neutral-900/40 backdrop-blur-sm z-60 p-4">
      <div 
        className="fixed inset-0" 
        onClick={onCancel}
        aria-hidden="true"
      ></div>

      <div className="modal-box relative bg-base-100 border border-error/20 shadow-2xl rounded-t-3xl sm:rounded-2xl p-6 w-11/12 max-w-sm z-10 flex flex-col items-center text-center animate-slide-up sm:animate-pop-in">

        <div className="w-full flex justify-center absolute top-3 left-0 sm:hidden">
          <div className="w-12 h-1.5 bg-base-content/20 rounded-full" />
        </div>

        <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mb-4 mt-4 sm:mt-0">
          <AlertTriangle className="w-6 h-6 text-error" />
        </div>

        <h3 className="font-bold text-lg sm:text-xl mb-2 text-error">
          Final Confirmation
        </h3>
        
        <p className="opacity-80 text-sm sm:text-base mb-4">
          Are you absolutely sure? This will wipe <strong>everything</strong>: all tasks,
          projects, workspaces, and settings.
        </p>
        <p className="font-bold uppercase text-xs text-error mb-6 bg-error/10 px-3 py-2 rounded-lg w-full">
          This action cannot be undone.
        </p>

        <div className="flex flex-col sm:flex-row w-full gap-2 sm:mt-2">
          <button 
            className="btn btn-ghost w-full sm:flex-1 rounded-xl order-2 sm:order-1" 
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            className="btn btn-error w-full sm:flex-1 rounded-xl order-1 sm:order-2" 
            onClick={onConfirm}
          >
            Delete Everything
          </button>
        </div>
      </div>
    </div>
  );
}