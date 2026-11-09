// Small client-side download helpers (no server round-trip needed).

/** Trigger a browser download of a text blob. */
export function downloadText(filename: string, text: string, mime = "text/plain") {
  if (typeof window === "undefined") return;
  const blob = new Blob([text], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function csvCell(v: string): string {
  // Quote if the value contains a comma, quote, or newline.
  if (/[",\n]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

/** Build a two-column (Field,Value) CSV from label/value rows. */
export function rowsToCsv(rows: { label: string; value: string }[]): string {
  const lines = ["Field,Value"];
  for (const r of rows) {
    lines.push(`${csvCell(r.label)},${csvCell(r.value)}`);
  }
  return lines.join("\r\n");
}

/** Slugify a name for a filename. */
export function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "download"
  );
}
