export type StepKey =
  | "scan"
  | "postScanning"
  | "pdfMetadata"
  | "qualityCheck"
  | "upload";

export type StepField = {
  initials: string;
  monthYear: string;
};

export type DocumentRow = {
  id: string;
  filename: string;
  docSymbol: string;
  pagesF: number;
  notes: string;
  scan: StepField;
  postScanning: StepField;
  pdfMetadata: StepField;
  qualityCheck: StepField;
  upload: StepField;
};
