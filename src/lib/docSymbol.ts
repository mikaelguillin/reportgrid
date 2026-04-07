export function toDocSymbol(filename: string): string {
  const withoutExt = filename.replace(/\.pdf$/i, "");
  const replaced = withoutExt.replaceAll("_", "/");
  return replaced.replace(/-[A-Za-z]$/, "");
}
