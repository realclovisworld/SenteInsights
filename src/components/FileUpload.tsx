import { useCallback, useState } from "react";
import { Upload } from "lucide-react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  label?: string;
}

const FileUpload = ({ onFileSelect, accept = ".pdf", label = "Drag your statement here or click to browse" }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        setFileName(file.name);
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setFileName(file.name);
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  return (
    <label
      className={`upload-zone flex flex-col items-center gap-4 ${isDragging ? "border-primary bg-primary-light" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <Upload className="w-10 h-10 text-muted" />
      <p className="text-sm text-muted font-medium">
        {fileName || label}
      </p>
      <p className="text-xs text-muted">Supports PDF statements from MTN MoMo & Airtel Money</p>
      <input type="file" accept={accept} className="hidden" onChange={handleChange} />
    </label>
  );
};

export default FileUpload;
