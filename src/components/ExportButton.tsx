import { Download } from "lucide-react";

import { Button } from "./ui/button";

type ExportButtonProps = {
  disabled: boolean;
  onExport: () => Promise<void>;
};

export function ExportButton({ disabled, onExport }: ExportButtonProps) {
  return (
    <Button
      onClick={() => void onExport()}
      disabled={disabled}
      className="bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400"
    >
      <Download className="mr-2 size-4" />
      Export Excel
    </Button>
  );
}
