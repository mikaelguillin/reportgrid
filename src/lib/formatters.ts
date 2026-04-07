import type { StepField } from "../types/documentRow";

export function normalizeInitials(value: string): string {
  return value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4);
}

export function normalizeMonthYear(value: string): string {
  const digits = value.replace(/[^\d]/g, "").slice(0, 4);
  if (digits.length <= 2) {
    return digits;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
}

export function isMonthYearValid(value: string): boolean {
  if (!/^\d{2}\/\d{2}$/.test(value)) {
    return false;
  }
  const month = Number(value.slice(0, 2));
  const day = Number(value.slice(3, 5));
  return month >= 1 && month <= 12 && day >= 1 && day <= 31;
}

export function stepToExcelValue(step: StepField): string {
  return `${step.initials}${step.monthYear.replace("/", "")}`;
}
