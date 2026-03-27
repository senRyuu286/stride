import type { SettingsModalProps } from "../types/modals";

export function SettingsModal({
  isOpen,
  theme,
  onThemeChange,
  onDeleteAllData,
  onClose,
}: SettingsModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal modal-open bg-black/40 backdrop-blur-sm z-50">
      <div className="modal-box bg-base-100 border border-base-content/10 shadow-2xl">
        <h3 className="font-bold text-xl mb-6">Settings</h3>
        <div className="form-control w-full mb-6">
          <label htmlFor="theme-select" className="label">
            <span className="label-text font-medium mb-4">Appearance</span>
          </label>
          <select
            id="theme-select"
            className="select select-bordered w-full bg-base-200/50"
            value={theme}
            onChange={(event) => onThemeChange(event.target.value)}
          >
            <option value="system" className="bg-base-100">System Default</option>
            <option value="light" className="bg-base-100">Stride Light</option>
            <option value="dark" className="bg-base-100">Stride Dark</option>
          </select>
        </div>
        <div className="pt-4 border-t border-base-content/10 mt-6">
          <h4 className="text-error font-semibold mb-2 text-sm uppercase tracking-wider">
            Danger Zone
          </h4>
          <p className="text-xs opacity-70 mb-4">
            Permanently delete all tasks, projects, and workspaces from local storage.
          </p>
          <button
            onClick={onDeleteAllData}
            className="btn btn-error btn-outline w-full hover:bg-error! hover:text-error-content!"
          >
            Delete All Stride Data
          </button>
        </div>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
