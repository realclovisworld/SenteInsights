import { useCallback, useState, useRef } from "react";
import { Upload, FileText, CheckCircle2, XCircle, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

export type BatchFileStatus = "queued" | "parsing" | "done" | "error";

export interface BatchFileItem {
  id: string;
  file: File;
  status: BatchFileStatus;
  progress: number;
  error?: string;
  transactionCount?: number;
}

interface BatchFileUploadProps {
  onFilesSelect: (files: File[]) => void;
  maxFiles?: number;
  items: BatchFileItem[];
  onRemove?: (id: string) => void;
}

const STATUS_ICONS: Record<BatchFileStatus, React.ElementType> = {
  queued: FileText,
  parsing: Loader2,
  done: CheckCircle2,
  error: XCircle,
};

const STATUS_COLORS: Record<BatchFileStatus, string> = {
  queued: "text-muted-foreground",
  parsing: "text-primary animate-spin",
  done: "text-[hsl(var(--chart-2))]",
  error: "text-destructive",
};

const BatchFileUpload = ({ onFilesSelect, maxFiles = 10, items, onRemove }: BatchFileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (fileList: FileList) => {
      const files = Array.from(fileList)
        .filter((f) => f.type === "application/pdf" || f.name.endsWith(".pdf"))
        .slice(0, maxFiles);
      if (files.length > 0) onFilesSelect(files);
    },
    [onFilesSelect, maxFiles]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) handleFiles(e.target.files);
      if (inputRef.current) inputRef.current.value = "";
    },
    [handleFiles]
  );

  const totalDone = items.filter((i) => i.status === "done").length;
  const totalItems = items.length;
  const isProcessing = items.some((i) => i.status === "parsing" || i.status === "queued");

  return (
    <div className="space-y-4">
      <label
        className={`upload-zone flex flex-col items-center gap-4 cursor-pointer ${isDragging ? "border-primary bg-primary-light" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <Upload className="w-10 h-10 text-muted-foreground" />
        <p className="text-sm text-muted-foreground font-medium">
          Drop multiple PDF statements here or click to browse
        </p>
        <p className="text-xs text-muted-foreground">
          Select up to {maxFiles} files at once · Supports MTN MoMo & Airtel Money
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          multiple
          className="hidden"
          onChange={handleChange}
        />
      </label>

      {totalItems > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">
              {isProcessing
                ? `Processing ${totalDone} of ${totalItems} files…`
                : `${totalDone} of ${totalItems} files processed`}
            </span>
            {!isProcessing && totalDone === totalItems && (
              <span className="text-[hsl(var(--chart-2))] font-medium text-xs">All done ✓</span>
            )}
          </div>
          <Progress value={totalItems > 0 ? (totalDone / totalItems) * 100 : 0} className="h-2" />

          <AnimatePresence>
            {items.map((item) => {
              const Icon = STATUS_ICONS[item.status];
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-background"
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${STATUS_COLORS[item.status]}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.file.name}</p>
                    {item.status === "done" && item.transactionCount != null && (
                      <p className="text-xs text-muted-foreground">{item.transactionCount} transactions found</p>
                    )}
                    {item.status === "error" && item.error && (
                      <p className="text-xs text-destructive">{item.error}</p>
                    )}
                  </div>
                  {item.status === "parsing" && (
                    <div className="w-20">
                      <Progress value={item.progress} className="h-1.5" />
                    </div>
                  )}
                  {(item.status === "queued" || item.status === "error") && onRemove && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => onRemove(item.id)}
                    >
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default BatchFileUpload;
