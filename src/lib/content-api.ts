import "server-only";
import { notFound } from "next/navigation";

// Content is always fetched from public APIs, never typed by hand.
// Cache for 7 days; errors other than 404 bubble up to app/error.tsx.
const WEEK = 604800;

async function getJson<T>(url: string, revalidate: number): Promise<T> {
  const res = await fetch(url, { next: { revalidate } });
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error(`Sumber data gagal (${res.status})`);
  return (await res.json()) as T;
}

export type SurahSummary = {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audioFull: Record<string, string>;
};

export type Ayat = {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: Record<string, string>;
};

export type SurahRef = { nomor: number; namaLatin: string } | false;

export type SurahDetail = SurahSummary & {
  ayat: Ayat[];
  suratSelanjutnya: SurahRef;
  suratSebelumnya: SurahRef;
};

export type Doa = {
  id: number;
  grup: string;
  nama: string;
  ar: string;
  tr: string;
  idn: string;
  tentang: string;
  tag: string[];
};

export type AsmaulHusna = {
  id: number;
  arab: string;
  latin: string;
  indo: string;
};

export async function getSurahList() {
  return (
    await getJson<{ data: SurahSummary[] }>(
      "https://equran.id/api/v2/surat",
      WEEK,
    )
  ).data;
}

export async function getSurah(nomor: number) {
  return (
    await getJson<{ data: SurahDetail }>(
      `https://equran.id/api/v2/surat/${nomor}`,
      WEEK,
    )
  ).data;
}

export async function getDoaList() {
  return (await getJson<{ data: Doa[] }>("https://equran.id/api/doa", WEEK))
    .data;
}

export async function getAsmaulHusna() {
  return (
    await getJson<{ data: AsmaulHusna[] }>(
      "https://api.myquran.com/v2/husna/semua",
      WEEK,
    )
  ).data;
}
