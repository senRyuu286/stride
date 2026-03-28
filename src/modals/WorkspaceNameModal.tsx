interface WorkspaceNameModalProps {
  isOpen: boolean;
  mode: "create" | "rename";
  value: string;
  onChange: (value: string) => void;
  onCancel: () => void;
  onSave: () => void;
}

export function WorkspaceNameModal({
  isOpen,
  mode,
  value,
  onChange,
  onCancel,
  onSave,
}: WorkspaceNameModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal modal-open modal-bottom sm:modal-middle bg-neutral-900/40 backdrop-blur-sm z-50 p-4">
      <div 
        className="fixed inset-0" 
        onClick={onCancel}
        aria-hidden="true"
      ></div>

      <div className="modal-box relative bg-base-100 border border-base-content/10 shadow-2xl rounded-t-3xl sm:rounded-2xl p-6 w-11/12 max-w-sm z-10 animate-slide-up sm:animate-pop-in">

        <div className="w-full flex justify-center absolute top-3 left-0 sm:hidden">
          <div className="w-12 h-1.5 bg-base-content/20 rounded-full" />
        </div>

        <h3 className="font-bold text-lg sm:text-xl mb-4 mt-2 sm:mt-0">
          {mode === "create" ? "Create Workspace" : "Rename Workspace"}
        </h3>

        <div className="form-control">
          <label className="label py-0 mb-2">
            <span className="label-text font-medium text-base-content/70">Workspace Name</span>
          </label>
          <input
            autoFocus
            type="text"
            className="input input-bordered w-full bg-base-200/50 focus:border-primary focus:outline-none"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && value.trim()) {
                onSave();
              }
            }}
            placeholder="e.g., Spring Semester"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-8">
          <button 
            className="btn btn-ghost w-full sm:flex-1 order-2 sm:order-1 rounded-xl" 
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            className="btn btn-primary w-full sm:flex-1 order-1 sm:order-2 rounded-xl" 
            onClick={onSave} 
            disabled={!value.trim()}
          >
            {mode === "create" ? "Create" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}