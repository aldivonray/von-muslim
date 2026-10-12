// Surah descriptions contain HTML from a third party. Render as text only, never with dangerouslySetInnerHTML.
export function stripHtml(html: string) {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .trim();
}
