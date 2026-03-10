import { useCallback, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileText, Image, CheckCircle2, ShieldCheck } from "lucide-react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  label?: string;
}

const formatIcons = [
  {
    label: "PDF",
    icon: FileText,
    color: "#4472ef",
    bg: "rgba(139, 68, 239, 0.15)",
  },
  
  
];

const FileUpload = ({
  onFileSelect,
  accept = ".pdf",
}: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      setFileName(file.name);
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div className="space-y-3">
      {/* Upload card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.44, ease: [0.4, 0, 0.2, 1] }}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        aria-label="Upload file"
        className="relative cursor-pointer rounded-2xl overflow-hidden select-none"
        style={{
          background: "linear-gradient(145deg, #2757aa 0%, #0f1624 100%)",
          border: `2px dashed ${isDragging ? "#2757aa" : "#2757aa"}`,
          transition: "border-color 0.2s cubic-bezier(0.4,0,0.2,1)",
        }}
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.998 }}
      >
        {/* Ambient glow when dragging */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(99,102,241,.18) 0%, transparent 70%)",
              }}
            />
          )}
        </AnimatePresence>

        <div className="flex flex-col items-center px-8 py-12 gap-5">
          {/* Icon badge */}
          <AnimatePresence mode="wait">
            {fileName ? (
              <motion.div
                key="check"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.28, ease: [0.34, 1.56, 0.64, 1] }}
                className="flex items-center justify-center w-20 h-20 rounded-full"
                style={{ background: "rgba(34,197,94,.18)" }}
              >
                <CheckCircle2
                  className="w-9 h-9"
                  style={{ color: "#22C55E" }}
                  strokeWidth={2}
                />
              </motion.div>
            ) : (
              <motion.div
                key="upload"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.28, ease: [0.34, 1.56, 0.64, 1] }}
              >
                <motion.div
                  className="flex items-center justify-center w-20 h-20 rounded-full"
                  style={{ background: "rgba(99,102,241,.18)" }}
                  animate={isDragging ? { scale: [1, 1.08, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                >
                  <UploadCloud
                    className="w-9 h-9"
                    style={{ color: "rgba(99,102,241,.9)" }}
                    strokeWidth={1.75}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Heading */}
          <div className="text-center space-y-1">
            <p className="text-[1rem] font-semibold text-white leading-snug">
              {fileName ? fileName : "Click to upload or drag and drop"}
            </p>
            {!fileName && (
              <p className="text-[0.8125rem]" style={{ color: "rgba(148,163,184,.7)" }}>
                MTN MoMo &amp; Airtel Money statements supported
              </p>
            )}
          </div>

          {/* Select Files button */}
          {!fileName && (
            <motion.button
              type="button"
              onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-[10px] text-sm font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, #2757aa 0%, #2757aa 100%)",
                boxShadow: "0 4px 18px rgba(99,102,241,.40), inset 0 1px 0 rgba(255,255,255,.18)",
                border: "1px solid rgba(255,255,255,.12)",
              }}
              whileHover={{
                y: -2,
                boxShadow: "0 6px 24px rgba(99,102,241,.55), inset 0 1px 0 rgba(255,255,255,.22)",
              }}
              whileTap={{ y: 0 }}
              transition={{ duration: 0.22, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <UploadCloud className="w-4 h-4" strokeWidth={2} />
              Select Files
            </motion.button>
          )}

          {/* Format badges */}
          {!fileName && (
            <div className="flex flex-col items-center gap-2">
              <p
                className="text-[0.75rem] font-medium"
                style={{ color: "rgba(148,163,184,.65)" }}
              >
                Supported formats:
              </p>
              <div className="flex items-center gap-4">
                {formatIcons.map((f) => (
                  <div key={f.label} className="flex items-center gap-1.5">
                    <div
                      className="flex items-center justify-center w-6 h-6 rounded-[5px]"
                      style={{ background: f.bg }}
                    >
                      <f.icon
                        className="w-3.5 h-3.5"
                        style={{ color: f.color }}
                        strokeWidth={2}
                      />
                    </div>
                    <span
                      className="text-[0.75rem] font-semibold"
                      style={{ color: "rgba(203,213,225,.8)" }}
                    >
                      {f.label}
                    </span>
                  </div>
                ))}
              </div>
              <p
                className="text-[0.75rem]"
                style={{ color: "rgba(100,116,139,.75)" }}
              >
                Up to 50 MB per file
              </p>
            </div>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleChange}
        />
      </motion.div>

      {/* Security badge - sits below the card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="flex items-center justify-center gap-1.5"
      >
        <ShieldCheck
          className="w-3.5 h-3.5"
          style={{ color: "#22C55E" }}
          strokeWidth={2}
        />
        <span className="text-[0.75rem] text-muted">
          Your data never leaves your browser. Files are not stored or transmitted.
        </span>
      </motion.div>
    </div>
  );
};

export default FileUpload;
