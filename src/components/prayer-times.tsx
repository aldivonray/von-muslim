"use client";

import Link from "next/link";
import {
  ArrowRight,
  CloudSun,
  MapPin,
  Moon,
  RotateCw,
  Sun,
  SunDim,
  Sunrise,
  Sunset,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LokasiPicker } from "@/components/lokasi-picker";
import { useLokasi } from "@/lib/use-lokasi";
import { cn } from "@/lib/utils";

type Timings = Record<
  "Fajr" | "Dhuhr" | "Asr" | "Maghrib" | "Isha" | "Sunrise",
  string
>;
type Jadwal = {
  timings: Timings;
  meta: { timezone: string };
};

// Sunrise is shown for reference but is never the "next shalat".
const WAKTU: {
  key: keyof Timings;
  nama: string;
  icon: LucideIcon;
  shalat: boolean;
}[] = [
  { key: "Fajr", nama: "Subuh", icon: Sunrise, shalat: true },
  { key: "Sunrise", nama: "Terbit", icon: SunDim, shalat: false },
  { key: "Dhuhr", nama: "Dzuhur", icon: Sun, shalat: true },
  { key: "Asr", nama: "Ashar", icon: CloudSun, shalat: true },
  { key: "Maghrib", nama: "Maghrib", icon: Sunset, shalat: true },
  { key: "Isha", nama: "Isya", icon: Moon, shalat: true },
];

// The key is part of the state so a stale response for another city is never shown.
type State = { key: string; data?: Jadwal; error?: boolean };

function clockHHmm(timeZone: string, at: number) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(at));
}

const toMinutes = (hhmm: string) =>
  Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5));

function sisaWaktu(now: string, target: string) {
  const diff = (toMinutes(target) - toMinutes(now) + 1440) % 1440;
  const jam = Math.floor(diff / 60);
  const menit = diff % 60;
  if (diff === 0) return "Waktunya sekarang";
  return `${jam ? `${jam} jam ` : ""}${menit} menit lagi`;
}

export function PrayerTimes({ compact = false }: { compact?: boolean }) {
  const [lokasi, setLokasi] = useLokasi();
  const [attempt, setAttempt] = useState(0);
  const key = `${lokasi.latitude},${lokasi.longitude},${attempt}`;
  const [state, setState] = useState<State>({ key: "" });
  const [clock, setClock] = useState(() => Date.now());

  useEffect(() => {
    const controller = new AbortController();
    fetch(
      `https://api.aladhan.com/v1/timings?latitude=${lokasi.latitude}&longitude=${lokasi.longitude}&method=20`,
      { signal: controller.signal },
    )
      .then(async (res) => {
        if (!res.ok) throw new Error(String(res.status));
        return (await res.json()) as { data: Jadwal };
      })
      .then((json) => setState({ key, data: json.data }))
      .catch(() => {
        if (!controller.signal.aborted) setState({ key, error: true });
      });
    return () => controller.abort();
  }, [key, lokasi.latitude, lokasi.longitude]);

  useEffect(() => {
    const id = setInterval(() => setClock(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const loading = state.key !== key;
  const data = loading ? undefined : state.data;
  const failed = !loading && state.error;

  if (failed || !data) {
    const message = failed ? (
      <div role="alert" className="space-y-3">
        <p>Jadwal shalat belum bisa dimuat. Periksa koneksi lalu coba lagi.</p>
        <Button
          size="sm"
          variant={compact ? "secondary" : "outline"}
          onClick={() => setAttempt((n) => n + 1)}
        >
          <RotateCw aria-hidden="true" />
          Coba lagi
        </Button>
      </div>
    ) : (
      <p className="animate-pulse">Memuat jadwal shalat…</p>
    );
    return compact ? (
      <div className="rounded-3xl bg-white/10 p-6 text-white/80 ring-1 ring-white/15 backdrop-blur-md">
        {message}
      </div>
    ) : (
      <div className="space-y-6">
        <LokasiPicker value={lokasi} onChange={setLokasi} />
        <div className="rounded-3xl border bg-card p-6 text-muted-foreground">
          {message}
        </div>
      </div>
    );
  }

  const zona = data.meta.timezone;
  const now = clockHHmm(zona, clock);
  const times = WAKTU.map((w) => ({
    ...w,
    waktu: data.timings[w.key].slice(0, 5),
  }));
  const shalat = times.filter((t) => t.shalat);
  // Lexicographic compare works for zero-padded HH:mm; after Isya the next is Subuh.
  const berikut = shalat.find((t) => t.waktu > now) ?? shalat[0];
  const sisa = sisaWaktu(now, berikut.waktu);
  const hijriah = new Intl.DateTimeFormat("id-ID-u-ca-islamic-umalqura", {
    timeZone: zona,
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(clock);

  if (compact) {
    return (
      <div className="rounded-3xl bg-white/10 p-5 text-white ring-1 ring-white/15 backdrop-blur-md sm:p-6">
        <div className="flex items-center justify-between gap-3 text-xs">
          <p className="font-semibold tracking-[0.18em] text-gold-soft uppercase">
            Shalat berikutnya
          </p>
          <p className="flex items-center gap-1 text-white/70">
            <MapPin className="size-3.5" aria-hidden="true" />
            {lokasi.label}
          </p>
        </div>
        <p className="mt-3 text-4xl font-bold tracking-tight">
          {berikut.nama} <span className="tabular-nums">{berikut.waktu}</span>
        </p>
        <p className="mt-1 text-sm text-white/75">{sisa}</p>
        <ul className="mt-5 grid grid-cols-5 gap-1 text-center">
          {shalat.map((t) => (
            <li
              key={t.key}
              aria-current={t === berikut ? "true" : undefined}
              className={cn(
                "rounded-xl px-1 py-2",
                t === berikut && "bg-white/15 ring-1 ring-white/20",
              )}
            >
              <span className="block text-[11px] text-white/60">{t.nama}</span>
              <span className="block text-sm font-semibold tabular-nums">
                {t.waktu}
              </span>
            </li>
          ))}
        </ul>
        <Link
          href="/jadwal-shalat"
          className="group mt-4 inline-flex items-center gap-1 text-sm font-medium text-gold-soft"
        >
          Jadwal lengkap & ganti kota
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 rounded-3xl border bg-card p-5 sm:p-6">
        <LokasiPicker value={lokasi} onChange={setLokasi} />
        <p className="text-sm text-muted-foreground">
          {hijriah} · {zona}
        </p>
      </div>

      <div className="surface-hero relative isolate overflow-hidden rounded-3xl p-6 text-white sm:p-8">
        <div
          aria-hidden="true"
          className="bg-pattern-light absolute inset-0 -z-10"
        />
        <p className="text-xs font-semibold tracking-[0.18em] text-gold-soft uppercase">
          Menuju {berikut.nama}
        </p>
        <p className="mt-2 text-5xl font-bold tracking-tight tabular-nums sm:text-6xl">
          {berikut.waktu}
        </p>
        <p className="mt-2 text-white/80">
          {sisa} · {lokasi.label}
        </p>
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {times.map((t) => {
          const Icon = t.icon;
          const next = t === berikut;
          return (
            <li
              key={t.key}
              aria-current={next ? "true" : undefined}
              className={cn(
                "relative rounded-2xl border bg-card p-5 transition-shadow",
                next &&
                  "border-primary bg-primary/5 shadow-lg shadow-primary/10",
                !t.shalat && "bg-muted/60",
              )}
            >
              <Icon
                className={cn("size-6", next ? "text-primary" : "text-gold")}
                aria-hidden="true"
              />
              <p className="mt-3 text-sm text-muted-foreground">{t.nama}</p>
              <p className="text-2xl font-bold tabular-nums">{t.waktu}</p>
              {next && (
                <span className="absolute top-4 right-4 rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
                  Berikutnya
                </span>
              )}
            </li>
          );
        })}
      </ul>
      <p className="text-xs text-muted-foreground">
        Terbit bukan waktu shalat, ditampilkan sebagai batas akhir Subuh. Data
        dari aladhan.com, metode Kemenag RI (method 20).
      </p>
    </div>
  );
}
