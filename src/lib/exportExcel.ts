import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import { stepToExcelValue } from "./formatters";
import type { DocumentRow } from "../types/documentRow";

const HEADERS = [
  "Date",
  "Week",
  "Doc Symbol",
  "Scan",
  "Post-scanning",
  "PDF Metadata",
  "Quality check",
  "Upload",
  "Pages (F)",
  "Notes",
] as const;

function dateFormula(rowIndex: number): string {
  const uploadCell = `H${rowIndex}`;
  return `DATE(YEAR(TODAY()),VALUE(MID(${uploadCell},3,2)),VALUE(RIGHT(${uploadCell},2)))`;
}

function weekFormula(rowIndex: number): string {
  return `WEEKNUM(A${rowIndex})`;
}

export async function exportRowsToExcel(rows: DocumentRow[]) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Report");
  worksheet.addRow([...HEADERS]);

  rows.forEach((row, index) => {
    const excelRowNumber = index + 2;
    worksheet.addRow([
      { formula: dateFormula(excelRowNumber) },
      { formula: weekFormula(excelRowNumber) },
      row.docSymbol,
      stepToExcelValue(row.scan),
      stepToExcelValue(row.postScanning),
      stepToExcelValue(row.pdfMetadata),
      stepToExcelValue(row.qualityCheck),
      stepToExcelValue(row.upload),
      row.pagesF,
      row.notes,
    ]);
  });

  worksheet.columns = [
    { width: 14 },
    { width: 10 },
    { width: 24 },
    { width: 16 },
    { width: 18 },
    { width: 18 },
    { width: 16 },
    { width: 14 },
    { width: 12 },
    { width: 28 },
  ];

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, "pdf-report.xlsx");
}
