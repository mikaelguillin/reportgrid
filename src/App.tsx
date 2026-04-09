import { useMemo, useState } from "react";
import { Field } from "@base-ui-components/react/field";

import { DocumentsTable } from "./components/DocumentsTable";
import { ExportButton } from "./components/ExportButton";
import { PdfUploader } from "./components/PdfUploader";
import { Input } from "./components/ui/input";
import { exportRowsToExcel } from "./lib/exportExcel";
import { normalizeInitials, normalizeMonthYear } from "./lib/formatters";
import { getPdfPageCount } from "./lib/pdfPages";
import { toDocSymbol } from "./lib/docSymbol";
import type { DocumentRow, StepKey } from "./types/documentRow";

const EMPTY_STEP = { initials: "", monthYear: "" };
const EMPTY_STEP_MONTH_YEAR: Record<StepKey, string> = {
  scan: "",
  postScanning: "",
  pdfMetadata: "",
  qualityCheck: "",
  upload: "",
};

function App() {
  const [rows, setRows] = useState<DocumentRow[]>([]);
  const [initials, setInitials] = useState("");
  const [stepMonthYears, setStepMonthYears] =
    useState<Record<StepKey, string>>(EMPTY_STEP_MONTH_YEAR);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canExport = useMemo(() => rows.length > 0 && !isLoading, [isLoading, rows.length]);

  const handleFiles = async (files: FileList) => {
    setError(null);
    setIsLoading(true);
    try {
      const nextRows = [...rows];
      for (const file of Array.from(files)) {
        if (!file.name.toLowerCase().endsWith(".pdf")) {
          continue;
        }
        const pagesF = await getPdfPageCount(file);
        const row: DocumentRow = {
          id: file.name,
          filename: file.name,
          docSymbol: toDocSymbol(file.name),
          pagesF,
          notes: "",
          scan: { ...EMPTY_STEP, monthYear: stepMonthYears.scan },
          postScanning: { ...EMPTY_STEP, monthYear: stepMonthYears.postScanning },
          pdfMetadata: { ...EMPTY_STEP, monthYear: stepMonthYears.pdfMetadata },
          qualityCheck: { ...EMPTY_STEP, monthYear: stepMonthYears.qualityCheck },
          upload: { ...EMPTY_STEP, monthYear: stepMonthYears.upload },
        };
        const existingIndex = nextRows.findIndex((item) => item.filename === file.name);
        if (existingIndex >= 0) {
          nextRows.splice(existingIndex, 1, row);
        } else {
          nextRows.push(row);
        }
      }
      setRows(nextRows);
    } catch (uploadError) {
      setError("Failed to process one or more PDFs.");
      console.error(uploadError);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStepMonthYear = (step: StepKey, value: string) => {
    const normalizedValue = normalizeMonthYear(value);
    setStepMonthYears((current) => ({ ...current, [step]: normalizedValue }));
    setRows((current) =>
      current.map((row) => ({ ...row, [step]: { ...row[step], monthYear: normalizedValue } })),
    );
  };

  const updateNotes = (id: string, notes: string) => {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, notes } : row)));
  };

  const handleExport = async () => {
    setError(null);
    if (rows.length === 0) {
      setError("Upload at least one PDF before exporting.");
      return;
    }
    const rowsWithInitials = rows.map((row) => ({
      ...row,
      scan: { ...row.scan, initials },
      postScanning: { ...row.postScanning, initials },
      pdfMetadata: { ...row.pdfMetadata, initials },
      qualityCheck: { ...row.qualityCheck, initials },
      upload: { ...row.upload, initials },
    }));
    await exportRowsToExcel(rowsWithInitials);
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1700px] flex-col gap-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold">Scan Reporting</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload PDFs, complete intials and workflow dates, then export to Excel.
        </p>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <Field.Root className="w-28">
          <Field.Label className="text-xs text-muted-foreground">Initials</Field.Label>
          <Input
            value={initials}
            onChange={(event) => setInitials(normalizeInitials(event.target.value))}
            placeholder="AB"
            maxLength={4}
            required
          />
        </Field.Root>
        <PdfUploader
          onFilesSelected={handleFiles}
          isLoading={isLoading}
          isDisabled={false}
        />
        <ExportButton disabled={!canExport} onExport={handleExport} />
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <DocumentsTable
        rows={rows}
        stepMonthYears={stepMonthYears}
        onStepMonthYearChange={updateStepMonthYear}
        onNotesChange={updateNotes}
      />
    </main>
  );
}

export default App;
