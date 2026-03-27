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
    <div className="modal modal-open bg-black/40 backdrop-blur-sm z-50">
      <div className="modal-box bg-base-100 border border-base-content/10 shadow-2xl">
        <h3 className="font-bold text-xl mb-4">
          {mode === "create" ? "Create Workspace" : "Rename Workspace"}
        </h3>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium mb-4">Workspace Name</span>
          </label>
          <input
            autoFocus
            type="text"
            className="input input-bordered w-full bg-base-200/50"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                onSave();
              }
            }}
            placeholder="e.g., Spring Semester"
          />
        </div>
        <div className="modal-action mt-6">
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn btn-primary" onClick={onSave} disabled={!value.trim()}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
