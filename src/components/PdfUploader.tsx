import { Upload } from "lucide-react";
import { useRef, type ChangeEvent } from "react";

import { Button } from "./ui/button";

type PdfUploaderProps = {
  onFilesSelected: (files: FileList) => void;
  isLoading: boolean;
  isDisabled: boolean;
};

export function PdfUploader({ onFilesSelected, isLoading, isDisabled }: PdfUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const disabled = isLoading || isDisabled;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onFilesSelected(event.target.files);
      event.target.value = "";
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        type="button"
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
        className="bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400"
      >
        <Upload className="mr-2 size-4" />
        {isLoading ? "Processing PDFs..." : "Upload PDFs"}
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,application/pdf"
        multiple
        onChange={handleChange}
        disabled={disabled}
      />
      <p className="text-sm text-muted-foreground">
        Reuploading with the same filename replaces the previous row.
      </p>
    </div>
  );
}
