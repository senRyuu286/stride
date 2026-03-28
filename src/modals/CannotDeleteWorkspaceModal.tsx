import { AlertCircle } from "lucide-react";

interface CannotDeleteWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CannotDeleteWorkspaceModal({
  isOpen,
  onClose,
}: CannotDeleteWorkspaceModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal modal-open modal-bottom sm:modal-middle bg-neutral-900/40 backdrop-blur-sm z-50 p-4">
      
      <div 
        className="fixed inset-0" 
        onClick={onClose}
        aria-hidden="true"
      ></div>
      <div className="modal-box relative bg-base-100 border border-base-content/10 shadow-2xl rounded-2xl p-6 w-11/12 max-w-sm z-10 flex flex-col items-center text-center animate-slide-up sm:animate-pop-in">

        <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6 text-warning" />
        </div>

        <h3 className="font-bold text-lg sm:text-xl mb-2 text-warning">
          Action Denied
        </h3>
        
        <p className="opacity-80 text-sm sm:text-base mb-6">
          You cannot delete your only workspace. Please create a new workspace before
          attempting to delete this one.
        </p>
        <button 
          className="btn btn-warning btn-outline w-full rounded-xl" 
          onClick={onClose}
        >
          Got it
        </button>
      </div>
    </div>
  );
}