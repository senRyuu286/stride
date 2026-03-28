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
    <div className="modal modal-open modal-bottom sm:modal-middle bg-neutral-900/40 backdrop-blur-sm z-50 p-4">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
        aria-hidden="true"
      ></div>

      <div className="modal-box relative bg-base-100 border border-base-content/10 shadow-2xl rounded-t-3xl sm:rounded-2xl p-6 w-11/12 max-w-sm z-10 animate-slide-up sm:animate-pop-in">

        <div className="w-full flex justify-center absolute top-3 left-0 sm:hidden">
          <div className="w-12 h-1.5 bg-base-content/20 rounded-full" />
        </div>

        <h3 className="font-bold text-lg sm:text-xl mb-6 mt-2 sm:mt-0">Settings</h3>
        <div className="form-control w-full mb-8">
          <label htmlFor="theme-select" className="label py-0 mb-2">
            <span className="label-text font-medium text-base-content/70">Appearance</span>
          </label>
          <select
            id="theme-select"
            className="select select-bordered w-full bg-base-200/50 focus:outline-none"
            value={theme}
            onChange={(event) => onThemeChange(event.target.value)}
          >
            <option value="system" className="bg-base-100">System Default</option>
            <option value="light" className="bg-base-100">Stride Light</option>
            <option value="dark" className="bg-base-100">Stride Dark</option>
          </select>
        </div>
        <div className="pt-6 border-t border-base-content/10 mt-6">
          <h4 className="text-error font-bold mb-1 text-xs uppercase tracking-widest">
            Danger Zone
          </h4>
          <p className="text-xs leading-relaxed opacity-70 mb-4">
            Permanently delete all tasks, projects, and workspaces from local storage.
          </p>
          <button
            onClick={onDeleteAllData}
            className="btn btn-error btn-outline btn-sm sm:btn-md w-full rounded-xl hover:bg-error! hover:text-error-content! transition-colors"
          >
            Delete All Stride Data
          </button>
        </div>

        <div className="modal-action mt-6 sm:mt-8">
          <button 
            className="btn btn-ghost w-full sm:w-auto rounded-xl" 
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}