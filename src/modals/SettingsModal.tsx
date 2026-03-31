

import { HardDriveDownload, ScrollText, type LucideProps } from "lucide-react";
import type { SettingsModalProps } from "../types/modals";

const APP_VERSION: string = import.meta.env.VITE_APP_VERSION ?? "1.0.0";

const GITHUB_URL = "https://github.com/senRyuu286/stride";
const CHANGELOG_URL = "https://github.com/senRyuu286/stride/releases";

interface SettingsModalPropsExtended extends SettingsModalProps {
  onOpenBackup: () => void;
}

export const GitHub = ({ 
  size = 24, 
  strokeWidth = 2, 
  color = "currentColor", 
  className = "", 
  ...props 
}: LucideProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`lucide lucide-github ${className}`}
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.2-.3 2.4 0 3.5-.73 1.02-1.08 2.25-1 3.5 0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export function SettingsModal({
  isOpen,
  theme,
  onThemeChange,
  onDeleteAllData,
  onOpenBackup,
  onClose,
}: SettingsModalPropsExtended) {
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
        <div className="form-control w-full mb-6">
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
        <div className="pt-5 border-t border-base-content/10 mb-6">
          <h4 className="text-base-content/50 font-bold mb-1 text-xs uppercase tracking-widest">
            Data
          </h4>
          <p className="text-xs leading-relaxed opacity-70 mb-4">
            Export your tasks and workspaces as a JSON file, or transfer to
            another device via QR code.
          </p>
          <button
            onClick={onOpenBackup}
            className="btn btn-outline btn-sm sm:btn-md w-full rounded-xl gap-2"
          >
            <HardDriveDownload size={15} />
            Backup & Restore
          </button>
        </div>
        <div className="pt-5 border-t border-base-content/10">
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
        <div className="mt-6 pt-4 border-t border-base-content/5 flex items-center justify-between">
          <span className="text-[11px] font-mono text-base-content/30 select-none">
            v{APP_VERSION}
          </span>
          <div className="flex items-center gap-3">
            <a
              href={CHANGELOG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] text-base-content/40 hover:text-base-content/70 transition-colors"
              title="See Changelog"
            >
              <ScrollText size={13} />
              Changelog
            </a>

            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base-content/40 hover:text-base-content/70 transition-colors"
              title="View on GitHub"
            >
              <GitHub size={15} />
            </a>
          </div>
        </div>

        <div className="modal-action mt-4 sm:mt-5">
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