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
    <div className="modal modal-open bg-black/40 backdrop-blur-sm z-50">
      <div className="modal-box bg-base-100 border border-base-content/10 shadow-2xl">
        <h3 className="font-bold text-xl mb-4 text-warning">Action Denied</h3>
        <p className="opacity-80">
          You cannot delete your only workspace. Please create a new workspace before
          attempting to delete this one.
        </p>
        <div className="modal-action mt-6">
          <button className="btn btn-ghost" onClick={onClose}>Got it</button>
        </div>
      </div>
    </div>
  );
}
