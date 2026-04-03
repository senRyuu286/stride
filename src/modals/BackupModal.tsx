import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  Download,
  Upload,
  QrCode,
  Camera,
  CheckCircle,
  AlertCircle,
  X,
  Loader,
} from "lucide-react";
import { useTaskStore } from "../store/useTaskStore";
import {
  buildBackupPayload,
  downloadBackupJSON,
  parseAndValidateBackup,
  readFileAsText,
  type StrideBackupPayload,
} from "../utils/backupRestore";
import {
  renderQRToCanvas,
  decodeQRFromImageData,
} from "../utils/qrCode";
import type { BackupModalProps } from "../types/modals";

type Tab = "export" | "import" | "qr-generate" | "qr-scan";

export function BackupModal({ isOpen, onClose }: BackupModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>("export");
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [pendingPayload, setPendingPayload] =
    useState<StrideBackupPayload | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setActiveTab("export");
        setStatus({ type: null, message: "" });
        setPendingPayload(null);
      }, 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal modal-open modal-bottom sm:modal-middle bg-neutral-900/40 backdrop-blur-sm z-50 p-4">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="modal-box relative bg-base-100 border border-base-content/10 shadow-2xl rounded-t-3xl sm:rounded-2xl p-6 w-11/12 max-w-sm z-10 animate-slide-up sm:animate-pop-in">
        <div className="w-full flex justify-center absolute top-3 left-0 sm:hidden">
          <div className="w-12 h-1.5 bg-base-content/20 rounded-full" />
        </div>
        <div className="flex items-center justify-between mb-5 mt-2 sm:mt-0">
          <h3 className="font-bold text-lg sm:text-xl">Backup & Restore</h3>
          <button
            className="btn btn-ghost btn-sm btn-circle opacity-60 hover:opacity-100"
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-1 mb-5 bg-base-200/60 p-1 rounded-xl">
          {(
            [
              { id: "export", icon: Download, label: "Export" },
              { id: "import", icon: Upload, label: "Import" },
              { id: "qr-generate", icon: QrCode, label: "QR" },
              { id: "qr-scan", icon: Camera, label: "Scan" },
            ] as const
          ).map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => {
                setActiveTab(id);
                setStatus({ type: null, message: "" });
                setPendingPayload(null);
              }}
              className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg text-[10px] font-medium transition-all cursor-pointer border-none outline-none ${
                activeTab === id
                  ? "bg-base-100 shadow text-base-content"
                  : "text-base-content/50 hover:text-base-content/80 bg-transparent"
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
        <div className="min-h-45">
          {activeTab === "export" && (
            <ExportTab
              status={status}
              setStatus={setStatus}
              onClose={onClose}
            />
          )}
          {activeTab === "import" && (
            <ImportTab
              status={status}
              setStatus={setStatus}
              pendingPayload={pendingPayload}
              setPendingPayload={setPendingPayload}
              onClose={onClose}
            />
          )}
          {activeTab === "qr-generate" && (
            <QRGenerateTab status={status} setStatus={setStatus} />
          )}
          {activeTab === "qr-scan" && (
            <QRScanTab
              status={status}
              setStatus={setStatus}
              pendingPayload={pendingPayload}
              setPendingPayload={setPendingPayload}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBanner({
  type,
  message,
}: {
  type: "success" | "error";
  message: string;
}) {
  return (
    <div
      className={`flex items-start gap-2 p-3 rounded-xl text-xs leading-relaxed mt-4 ${
        type === "success"
          ? "bg-success/10 text-success border border-success/20"
          : "bg-error/10 text-error border border-error/20"
      }`}
    >
      {type === "success" ? (
        <CheckCircle size={14} className="mt-0.5 shrink-0" />
      ) : (
        <AlertCircle size={14} className="mt-0.5 shrink-0" />
      )}
      <span>{message}</span>
    </div>
  );
}

function ExportTab({
  status,
  setStatus,
  onClose,
}: {
  status: { type: "success" | "error" | null; message: string };
  setStatus: React.Dispatch<
    React.SetStateAction<{ type: "success" | "error" | null; message: string }>
  >;
  onClose: () => void;
}) {
  const { workspaces, activeWorkspaceId, upcomingTasks, dailyTasks } =
    useTaskStore();

  const handleExport = () => {
    try {
      const payload = buildBackupPayload(
        workspaces,
        activeWorkspaceId,
        upcomingTasks,
        dailyTasks,
      );
      downloadBackupJSON(payload);
      setStatus({
        type: "success",
        message: "Backup downloaded successfully. Store it somewhere safe.",
      });
    } catch {
      setStatus({
        type: "error",
        message: "Something went wrong while exporting. Please try again.",
      });
    }
  };

  const taskCount = upcomingTasks.length;
  const workspaceCount = workspaces.length;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-base-content/70 leading-relaxed">
        Download all your Stride data as a{" "}
        <span className="font-medium text-base-content">.json</span> file. Use
        it to restore on another device or keep as a backup.
      </p>

      <div className="bg-base-200/50 rounded-xl p-3 text-xs text-base-content/60 space-y-1">
        <div className="flex justify-between">
          <span>Workspaces</span>
          <span className="font-semibold text-base-content/80">
            {workspaceCount}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Tasks</span>
          <span className="font-semibold text-base-content/80">{taskCount}</span>
        </div>
      </div>

      <button
        onClick={handleExport}
        className="btn btn-primary w-full rounded-xl gap-2"
      >
        <Download size={15} />
        Download Backup
      </button>

      {status.type && (
        <StatusBanner type={status.type} message={status.message} />
      )}

      {status.type === "success" && (
        <button
          onClick={onClose}
          className="btn btn-ghost btn-sm w-full rounded-xl"
        >
          Done
        </button>
      )}
    </div>
  );
}

function ImportTab({
  status,
  setStatus,
  pendingPayload,
  setPendingPayload,
  onClose,
}: {
  status: { type: "success" | "error" | null; message: string };
  setStatus: React.Dispatch<
    React.SetStateAction<{ type: "success" | "error" | null; message: string }>
  >;
  pendingPayload: StrideBackupPayload | null;
  setPendingPayload: React.Dispatch<
    React.SetStateAction<StrideBackupPayload | null>
  >;
  onClose: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setUpcomingTasks, setDailyTasks, setActiveWorkspaceId } =
    useTaskStore();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = "";
    setStatus({ type: null, message: "" });
    setPendingPayload(null);

    try {
      const raw = await readFileAsText(file);
      const result = parseAndValidateBackup(raw);

      if (!result.ok) {
        setStatus({ type: "error", message: result.error });
        return;
      }

      setPendingPayload(result.payload);
    } catch {
      setStatus({
        type: "error",
        message: "Failed to read the file. Make sure it is a valid Stride backup.",
      });
    }
  };

  const handleConfirmImport = () => {
    if (!pendingPayload) return;

    try {
      setUpcomingTasks(pendingPayload.upcomingTasks);
      setDailyTasks(pendingPayload.dailyTasks);
      setActiveWorkspaceId(pendingPayload.activeWorkspaceId);
      useTaskStore.setState({ workspaces: pendingPayload.workspaces });

      setPendingPayload(null);
      setStatus({
        type: "success",
        message: "Data restored successfully. Your workspace is ready.",
      });
    } catch {
      setStatus({
        type: "error",
        message: "Restore failed. Your previous data is untouched.",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-base-content/70 leading-relaxed">
        Select a <span className="font-medium text-base-content">.json</span>{" "}
        file exported from Stride to restore your data.
      </p>
      {pendingPayload ? (
        <div className="flex flex-col gap-3">
          <div className="bg-warning/10 border border-warning/20 rounded-xl p-3 text-xs text-warning leading-relaxed">
            <p className="font-semibold mb-1">Replace current data?</p>
            <p className="opacity-80">
              This will overwrite all your current tasks and workspaces with
              the backup from{" "}
              <span className="font-medium">
                {new Date(pendingPayload.exportedAt).toLocaleDateString()}
              </span>
              . This cannot be undone.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPendingPayload(null)}
              className="btn btn-ghost btn-sm flex-1 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmImport}
              className="btn btn-warning btn-sm flex-1 rounded-xl"
            >
              Yes, Restore
            </button>
          </div>
        </div>
      ) : (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleFileSelect}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-outline w-full rounded-xl gap-2"
          >
            <Upload size={15} />
            Choose Backup File
          </button>
        </>
      )}

      {status.type && (
        <StatusBanner type={status.type} message={status.message} />
      )}

      {status.type === "success" && (
        <button
          onClick={onClose}
          className="btn btn-ghost btn-sm w-full rounded-xl"
        >
          Done
        </button>
      )}
    </div>
  );
}

function QRGenerateTab({
  status,
  setStatus,
}: {
  status: { type: "success" | "error" | null; message: string };
  setStatus: React.Dispatch<
    React.SetStateAction<{ type: "success" | "error" | null; message: string }>
  >;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const { workspaces, activeWorkspaceId, upcomingTasks, dailyTasks } =
    useTaskStore();

  const handleGenerate = async () => {
    if (!canvasRef.current) return;

    setIsGenerating(true);
    setStatus({ type: null, message: "" });
    setIsGenerated(false);

    try {
      const payload = buildBackupPayload(
        workspaces,
        activeWorkspaceId,
        upcomingTasks,
        dailyTasks,
      );
      await renderQRToCanvas(canvasRef.current, payload);
      setIsGenerated(true);
    } catch (err) {
      setStatus({
        type: "error",
        message:
          err instanceof Error ? err.message : "Failed to generate QR code.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-base-content/70 leading-relaxed">
        Generate a QR code containing your Stride data. Scan it on another
        device to transfer instantly.
      </p>
      <div
        className={`flex justify-center transition-all duration-300 ${
          isGenerated ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
        }`}
      >
        <canvas
          ref={canvasRef}
          className="rounded-xl border border-base-content/10"
        />
      </div>

      {!isGenerated && (
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="btn btn-primary w-full rounded-xl gap-2"
        >
          {isGenerating ? (
            <>
              <Loader size={15} className="animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <QrCode size={15} />
              Generate QR Code
            </>
          )}
        </button>
      )}

      {isGenerated && (
        <button
          onClick={handleGenerate}
          className="btn btn-ghost btn-sm w-full rounded-xl gap-2 opacity-60"
        >
          Regenerate
        </button>
      )}

      {status.type && (
        <StatusBanner type={status.type} message={status.message} />
      )}
    </div>
  );
}

function QRScanTab({
  status,
  setStatus,
  pendingPayload,
  setPendingPayload,
  onClose,
}: {
  status: { type: "success" | "error" | null; message: string };
  setStatus: React.Dispatch<
    React.SetStateAction<{ type: "success" | "error" | null; message: string }>
  >;
  pendingPayload: StrideBackupPayload | null;
  setPendingPayload: React.Dispatch<
    React.SetStateAction<StrideBackupPayload | null>
  >;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);
  const scanLoopRef = useRef<() => void>(() => {});
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCameraLoading, setIsCameraLoading] = useState(false);

  const { setUpcomingTasks, setDailyTasks, setActiveWorkspaceId } =
    useTaskStore();

  const stopCamera = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setIsCameraActive(false);
  }, []);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  useEffect(() => {
    scanLoopRef.current = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
        rafRef.current = requestAnimationFrame(scanLoopRef.current);
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const result = decodeQRFromImageData(imageData);

      if (result) {
        stopCamera();
        if (!result.ok) {
          setStatus({ type: "error", message: result.error });
          return;
        }
        setPendingPayload(result.payload);
        return;
      }

      rafRef.current = requestAnimationFrame(scanLoopRef.current);
    };
  }, [stopCamera, setStatus, setPendingPayload]);

  const startCamera = async () => {
    setStatus({ type: null, message: "" });
    setIsCameraLoading(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      streamRef.current = stream;
      setIsCameraActive(true);
      setIsCameraLoading(false);

      requestAnimationFrame(() => {
        if (!videoRef.current) return;
        videoRef.current.srcObject = stream;
        videoRef.current.play().then(() => {
          rafRef.current = requestAnimationFrame(scanLoopRef.current);
        }).catch(() => {
          setStatus({
            type: "error",
            message: "Failed to start video playback. Please try again.",
          });
        });
      });
    } catch {
      setIsCameraLoading(false);
      setIsCameraActive(false);
      setStatus({
        type: "error",
        message:
          "Camera access was denied. Please allow camera permissions in your browser settings.",
      });
    }
  };

  const handleConfirmImport = () => {
    if (!pendingPayload) return;

    try {
      setUpcomingTasks(pendingPayload.upcomingTasks);
      setDailyTasks(pendingPayload.dailyTasks);
      setActiveWorkspaceId(pendingPayload.activeWorkspaceId);
      useTaskStore.setState({ workspaces: pendingPayload.workspaces });

      setPendingPayload(null);
      setStatus({
        type: "success",
        message: "Data restored from QR code. Your workspace is ready.",
      });
    } catch {
      setStatus({
        type: "error",
        message: "Restore failed. Your previous data is untouched.",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-base-content/70 leading-relaxed">
        Point your camera at a Stride QR code to transfer data to this device.
      </p>
      {pendingPayload && (
        <div className="flex flex-col gap-3">
          <div className="bg-warning/10 border border-warning/20 rounded-xl p-3 text-xs text-warning leading-relaxed">
            <p className="font-semibold mb-1">QR code detected. Replace current data?</p>
            <p className="opacity-80">
              Backup from{" "}
              <span className="font-medium">
                {new Date(pendingPayload.exportedAt).toLocaleDateString()}
              </span>{" "}
              with {pendingPayload.upcomingTasks.length} task(s) across{" "}
              {pendingPayload.workspaces.length} workspace(s).
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPendingPayload(null)}
              className="btn btn-ghost btn-sm flex-1 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmImport}
              className="btn btn-warning btn-sm flex-1 rounded-xl"
            >
              Yes, Restore
            </button>
          </div>
        </div>
      )}
      {!pendingPayload && (
        <>
          {isCameraActive && (
            <div className="relative rounded-xl overflow-hidden border border-base-content/10 bg-base-300">
              <video
                ref={videoRef}
                className="w-full rounded-xl"
                muted
                playsInline
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-40 h-40 border-2 border-primary/70 rounded-xl opacity-80" />
              </div>
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />

          {!isCameraActive && (
            <button
              onClick={startCamera}
              disabled={isCameraLoading}
              className="btn btn-primary w-full rounded-xl gap-2"
            >
              {isCameraLoading ? (
                <>
                  <Loader size={15} className="animate-spin" />
                  Starting Camera...
                </>
              ) : (
                <>
                  <Camera size={15} />
                  Start Camera
                </>
              )}
            </button>
          )}

          {isCameraActive && (
            <button
              onClick={stopCamera}
              className="btn btn-ghost btn-sm w-full rounded-xl gap-2"
            >
              <X size={14} />
              Stop Camera
            </button>
          )}
        </>
      )}

      {status.type && (
        <StatusBanner type={status.type} message={status.message} />
      )}

      {status.type === "success" && (
        <button
          onClick={onClose}
          className="btn btn-ghost btn-sm w-full rounded-xl"
        >
          Done
        </button>
      )}
    </div>
  );
}