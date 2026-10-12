// Read the clock here, not in a component body (react-hooks/purity).
const ZONA = "Asia/Jakarta";
const WIB_MS = 7 * 3_600_000;

export function hariIni() {
  const now = new Date();
  return {
    // Changes at midnight WIB; used to rotate the daily ayat, name, and doa.
    indeks: Math.floor((now.getTime() + WIB_MS) / 86_400_000),
    masehi: new Intl.DateTimeFormat("id-ID", {
      timeZone: ZONA,
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(now),
    hijriah: new Intl.DateTimeFormat("id-ID-u-ca-islamic-umalqura", {
      timeZone: ZONA,
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(now),
  };
}
