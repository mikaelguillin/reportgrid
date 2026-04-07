import { Field } from "@base-ui-components/react/field";

import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import type { DocumentRow, StepKey } from "../types/documentRow";

type DocumentsTableProps = {
  rows: DocumentRow[];
  stepMonthYears: Record<StepKey, string>;
  onStepMonthYearChange: (step: StepKey, value: string) => void;
  onNotesChange: (id: string, value: string) => void;
};

const STEPS: Array<{ key: StepKey; label: string }> = [
  { key: "scan", label: "Scan" },
  { key: "postScanning", label: "Post-scanning" },
  { key: "pdfMetadata", label: "PDF Metadata" },
  { key: "qualityCheck", label: "Quality check" },
  { key: "upload", label: "Upload" },
];

export function DocumentsTable({
  rows,
  stepMonthYears,
  onStepMonthYearChange,
  onNotesChange,
}: DocumentsTableProps) {
  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
        Upload at least one PDF to start the report.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="min-w-[1100px] w-full border-collapse text-sm">
        <thead>
          <tr className="bg-muted/60">
            <th className="p-3 text-left font-medium">Doc Symbol</th>
            {STEPS.map((step) => (
              <th key={step.key} className="p-3 text-left font-medium">
                <div className="flex min-w-36 flex-col gap-2">
                  <span>{step.label}</span>
                  <Field.Root>
                    <Field.Label className="text-xs text-muted-foreground">MM/DD</Field.Label>
                    <Input
                      value={stepMonthYears[step.key]}
                      onChange={(event) => onStepMonthYearChange(step.key, event.target.value)}
                      placeholder="04/12"
                      maxLength={5}
                    />
                  </Field.Root>
                </div>
              </th>
            ))}
            <th className="p-3 text-left font-medium">Pages (F)</th>
            <th className="p-3 text-left font-medium">Notes</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="align-top border-t">
              <td className="p-3">
                <p className="font-medium">{row.docSymbol}</p>
                <p className="text-xs text-muted-foreground">{row.filename}</p>
              </td>
              {STEPS.map((step) => (
                <td key={step.key} className="p-3">
                  {row[step.key].monthYear || "-"}
                </td>
              ))}
              <td className="p-3">{row.pagesF}</td>
              <td className="p-3">
                <Textarea
                  value={row.notes}
                  onChange={(event) => onNotesChange(row.id, event.target.value)}
                  placeholder="Optional notes"
                  className="min-w-56"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
