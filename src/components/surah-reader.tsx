"use client";

import {
  Bookmark,
  BookmarkCheck,
  BookOpenCheck,
  Check,
  Minus,
  Pause,
  Play,
  Plus,
  Settings2,
  SkipBack,
  SkipForward,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NomorBadge } from "@/components/nomor-badge";
import { Button } from "@/components/ui/button";
import type { Ayat } from "@/lib/content-api";
import { useLocalStorage } from "@/lib/use-local-storage";
import { usePenanda, useTerakhirDibaca } from "@/lib/use-penanda";
import { cn } from "@/lib/utils";

// Kode qari sesuai equran.id. "05" is the default.
const qariList = [
  { kode: "01", nama: "Abdullah Al-Juhany" },
  { kode: "02", nama: "Abdul Muhsin Al-Qasim" },
  { kode: "03", nama: "Abdurrahman as-Sudais" },
  { kode: "04", nama: "Ibrahim Al-Dossari" },
  { kode: "05", nama: "Misyari Rasyid Al-Afasi" },
  { kode: "06", nama: "Yasser Al-Dosari" },
];

const isQari = (value: unknown): value is string =>
  typeof value === "string" && qariList.some((q) => q.kode === value);

// Size and line-height together: cn() drops a separate leading-* when a text-* size follows.
const UKURAN_ARAB = [
  "text-2xl/[2.3] sm:text-3xl/[2.3]",
  "text-3xl/[2.3] sm:text-4xl/[2.3]",
  "text-4xl/[2.3] sm:text-5xl/[2.3]",
  "text-5xl/[2.3] sm:text-6xl/[2.3]",
];

type Tampilan = { ukuran: number; latin: boolean; arti: boolean };
const TAMPILAN_AWAL: Tampilan = { ukuran: 1, latin: true, arti: true };

function isTampilan(value: unknown): value is Tampilan {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    Number.isInteger(v.ukuran) &&
    (v.ukuran as number) >= 0 &&
    (v.ukuran as number) < UKURAN_ARAB.length &&
    typeof v.latin === "boolean" &&
    typeof v.arti === "boolean"
  );
}

function waktu(detik: number) {
  if (!Number.isFinite(detik)) return "0:00";
  return `${Math.floor(detik / 60)}:${String(Math.floor(detik % 60)).padStart(2, "0")}`;
}

function Equalizer({ paused }: { paused: boolean }) {
  return (
    <span aria-hidden="true" className="flex h-3.5 items-end gap-[3px]">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className={cn(
            "animate-eq h-full w-[3px] rounded-full bg-current",
            paused && "[animation-play-state:paused]",
          )}
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </span>
  );
}

const pill =
  "inline-flex h-10 items-center gap-2 rounded-full text-sm font-semibold transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

const playerIcon =
  "flex size-9 shrink-0 items-center justify-center rounded-full text-white/85 transition-colors hover:bg-white/15 hover:text-white disabled:opacity-30";

type Playing = { mode: "full" } | { mode: "ayat"; nomor: number } | null;

export function SurahReader({
  surah,
  namaLatin,
  ayat,
  audioFull,
  bismillah,
}: {
  surah: number;
  namaLatin: string;
  ayat: Ayat[];
  audioFull: Record<string, string>;
  bismillah: string | null;
}) {
  const [qari, setQari] = useLocalStorage("vonmuslim:qari", "05", isQari);
  const [tampilan, setTampilan] = useLocalStorage(
    "vonmuslim:tampilan",
    TAMPILAN_AWAL,
    isTampilan,
  );
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [playing, setPlaying] = useState<Playing>(null);
  const [paused, setPaused] = useState(true);
  const [posisi, setPosisi] = useState(0);
  const [durasi, setDurasi] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { has, toggle } = usePenanda();
  const [progress, setProgress] = useTerakhirDibaca();

  const audioSrc =
    playing === null
      ? undefined
      : playing.mode === "full"
        ? audioFull[qari]
        : ayat.find((a) => a.nomorAyat === playing.nomor)?.audio[qari];

  // Starts playback after the audio src has been committed to the DOM.
  useEffect(() => {
    const el = audioRef.current;
    if (!el || !audioSrc) return;
    if (playing?.mode === "ayat") {
      document
        .getElementById(`ayat-${playing.nomor}`)
        ?.scrollIntoView({ block: "center", behavior: "smooth" });
    }
    el.play().catch(() => setAudioError(true));
  }, [audioSrc, playing]);

  function startPlaying(next: Playing) {
    setAudioError(false);
    setPlaying(next);
  }

  function togglePause() {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) el.play().catch(() => setAudioError(true));
    else el.pause();
  }

  function stop() {
    audioRef.current?.pause();
    setPlaying(null);
  }

  function handleEnded() {
    if (playing?.mode === "ayat" && playing.nomor < ayat.length) {
      startPlaying({ mode: "ayat", nomor: playing.nomor + 1 });
    } else {
      setPlaying(null);
    }
  }

  const namaQari = qariList.find((q) => q.kode === qari)?.nama;
  const nomorDiputar = playing?.mode === "ayat" ? playing.nomor : null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <audio
        ref={audioRef}
        preload="none"
        src={audioSrc}
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
        onLoadStart={() => {
          setPosisi(0);
          setDurasi(0);
        }}
        onTimeUpdate={(e) => setPosisi(e.currentTarget.currentTime)}
        onDurationChange={(e) => setDurasi(e.currentTarget.duration)}
        onEnded={handleEnded}
        onError={() => {
          if (audioSrc) setAudioError(true);
        }}
        className="hidden"
      />

      <div className="rounded-3xl border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              playing?.mode === "full"
                ? togglePause()
                : startPlaying({ mode: "full" })
            }
            className="group flex min-w-0 flex-1 items-center gap-3 rounded-2xl p-1 text-left focus-visible:outline-2 focus-visible:outline-ring"
          >
            <span className="surface-hero flex size-14 shrink-0 items-center justify-center rounded-full text-gold-soft shadow-lg shadow-primary/30 ring-4 ring-primary/10 transition-transform group-hover:scale-105 group-active:scale-95">
              {playing?.mode === "full" && !paused ? (
                <Pause className="size-6 fill-current" aria-hidden="true" />
              ) : (
                <Play
                  className="size-6 translate-x-0.5 fill-current"
                  aria-hidden="true"
                />
              )}
            </span>
            <span className="min-w-0">
              <span className="block font-bold">
                {playing?.mode === "full" && !paused
                  ? "Jeda surat lengkap"
                  : "Putar surat lengkap"}
              </span>
              <span className="block truncate text-sm text-muted-foreground">
                Murottal oleh {namaQari}
              </span>
            </span>
          </button>
          <Button
            variant={settingsOpen ? "secondary" : "ghost"}
            size="icon"
            className="size-11 shrink-0 rounded-full"
            aria-expanded={settingsOpen}
            aria-controls="pengaturan-bacaan"
            aria-label="Pengaturan bacaan"
            title="Pengaturan bacaan dan qari"
            onClick={() => setSettingsOpen(!settingsOpen)}
          >
            <Settings2 aria-hidden="true" />
          </Button>
        </div>

        {settingsOpen && (
          <div
            id="pengaturan-bacaan"
            className="mt-3 grid gap-4 rounded-2xl bg-muted/70 p-4 sm:grid-cols-2 sm:items-center"
          >
            <div className="space-y-1.5 sm:col-span-2">
              <label htmlFor="qari" className="text-sm font-medium">
                Qari
              </label>
              <select
                id="qari"
                value={qari}
                onChange={(e) => setQari(e.target.value)}
                className="h-10 w-full rounded-full border bg-background px-4 text-sm"
              >
                {qariList.map((q) => (
                  <option key={q.kode} value={q.kode}>
                    {q.nama}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Ukuran Arab</span>
              <Button
                variant="outline"
                size="icon-sm"
                className="rounded-full"
                aria-label="Perkecil teks Arab"
                disabled={tampilan.ukuran === 0}
                onClick={() =>
                  setTampilan({ ...tampilan, ukuran: tampilan.ukuran - 1 })
                }
              >
                <Minus aria-hidden="true" />
              </Button>
              <span className="w-6 text-center text-sm tabular-nums">
                {tampilan.ukuran + 1}
              </span>
              <Button
                variant="outline"
                size="icon-sm"
                className="rounded-full"
                aria-label="Perbesar teks Arab"
                disabled={tampilan.ukuran === UKURAN_ARAB.length - 1}
                onClick={() =>
                  setTampilan({ ...tampilan, ukuran: tampilan.ukuran + 1 })
                }
              >
                <Plus aria-hidden="true" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2 sm:justify-end">
              {(
                [
                  ["latin", "Tampilkan latin"],
                  ["arti", "Tampilkan terjemahan"],
                ] as const
              ).map(([field, label]) => (
                <label key={field} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={tampilan[field]}
                    onChange={(e) =>
                      setTampilan({ ...tampilan, [field]: e.target.checked })
                    }
                    className="size-4 accent-primary"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {bismillah && (
        <div className="flex items-center gap-4 py-4" aria-label="Basmalah">
          <span
            aria-hidden="true"
            className="h-px flex-1 bg-linear-to-r from-transparent to-gold/60"
          />
          <p
            dir="rtl"
            lang="ar"
            className="font-arabic text-center text-3xl leading-[2] text-primary sm:text-4xl"
          >
            {bismillah}
          </p>
          <span
            aria-hidden="true"
            className="h-px flex-1 bg-linear-to-l from-transparent to-gold/60"
          />
        </div>
      )}

      <ol className="space-y-4">
        {ayat.map((a) => {
          const nomor = a.nomorAyat;
          const bookmarked = has(surah, nomor);
          const isPlaying = nomorDiputar === nomor;
          const lastReadHere =
            progress?.surah === surah && progress.ayat === nomor;
          return (
            <li
              key={nomor}
              id={`ayat-${nomor}`}
              className={cn(
                "scroll-mt-24 rounded-3xl border bg-card p-5 transition-all duration-300 sm:p-8",
                isPlaying &&
                  "border-primary bg-primary/[0.04] ring-4 ring-primary/10",
              )}
            >
              <div className="flex items-center gap-2">
                <NomorBadge n={nomor} />
                {lastReadHere && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gold-soft/60 px-2.5 py-1 text-xs font-semibold text-gold">
                    <BookOpenCheck className="size-3.5" aria-hidden="true" />
                    Terakhir dibaca
                  </span>
                )}
              </div>
              <p
                dir="rtl"
                lang="ar"
                className={cn(
                  "font-arabic mt-4 text-right",
                  UKURAN_ARAB[tampilan.ukuran],
                )}
              >
                {a.teksArab}
              </p>
              {tampilan.latin && (
                <p className="mt-5 text-sm leading-6 italic text-primary/80">
                  {a.teksLatin}
                </p>
              )}
              {tampilan.arti && (
                <p className="mt-3 leading-7 text-pretty text-foreground/90">
                  {a.teksIndonesia}
                </p>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-dashed pt-4">
                <button
                  type="button"
                  aria-label={
                    isPlaying && !paused
                      ? `Jeda ayat ${nomor}`
                      : `Putar ayat ${nomor}`
                  }
                  onClick={() =>
                    isPlaying
                      ? togglePause()
                      : startPlaying({ mode: "ayat", nomor })
                  }
                  className={cn(
                    pill,
                    "pr-4 pl-1.5",
                    isPlaying
                      ? "surface-hero text-white shadow-md shadow-primary/25"
                      : "bg-primary/10 text-primary hover:bg-primary/15",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-7 items-center justify-center rounded-full",
                      isPlaying
                        ? "bg-gold-soft text-deep"
                        : "bg-primary text-primary-foreground",
                    )}
                  >
                    {isPlaying && !paused ? (
                      <Pause
                        className="size-3.5 fill-current"
                        aria-hidden="true"
                      />
                    ) : (
                      <Play
                        className="size-3.5 translate-x-px fill-current"
                        aria-hidden="true"
                      />
                    )}
                  </span>
                  {isPlaying ? (
                    <>
                      <Equalizer paused={paused} />
                      {paused ? "Lanjut" : "Memutar"}
                    </>
                  ) : (
                    "Putar"
                  )}
                </button>

                <button
                  type="button"
                  aria-pressed={bookmarked}
                  aria-label={
                    bookmarked
                      ? `Hapus simpanan ayat ${nomor}`
                      : `Simpan ayat ${nomor}`
                  }
                  onClick={() => toggle(surah, nomor)}
                  className={cn(
                    pill,
                    "px-4",
                    bookmarked
                      ? "bg-gold text-white shadow-md shadow-gold/30 hover:bg-gold/90"
                      : "bg-gold-soft/45 text-gold hover:bg-gold-soft/80",
                  )}
                >
                  {bookmarked ? (
                    <BookmarkCheck
                      key="on"
                      className="animate-in zoom-in-50 size-4 fill-current duration-300"
                      aria-hidden="true"
                    />
                  ) : (
                    <Bookmark key="off" className="size-4" aria-hidden="true" />
                  )}
                  {bookmarked ? "Tersimpan" : "Simpan"}
                </button>
                <button
                  type="button"
                  disabled={lastReadHere}
                  aria-label={`Tandai ayat ${nomor} terakhir dibaca`}
                  onClick={() => setProgress({ surah, ayat: nomor })}
                  className={cn(
                    pill,
                    "w-10 justify-center sm:w-auto sm:px-4",
                    lastReadHere
                      ? "bg-secondary text-foreground disabled:opacity-100"
                      : "border bg-background text-muted-foreground hover:border-primary/40 hover:text-primary",
                  )}
                >
                  {lastReadHere ? (
                    <Check className="size-4 text-primary" aria-hidden="true" />
                  ) : (
                    <BookOpenCheck className="size-4" aria-hidden="true" />
                  )}
                  <span className="hidden sm:inline">
                    {lastReadHere ? "Ditandai" : "Tandai dibaca"}
                  </span>
                </button>
              </div>
            </li>
          );
        })}
      </ol>

      {playing && (
        <div className="animate-in fade-in slide-in-from-bottom-4 sticky bottom-3 z-30 duration-300">
          <div
            role="region"
            aria-label={`Pemutar audio ${namaLatin}`}
            className="surface-hero relative isolate overflow-hidden rounded-3xl p-3 text-white shadow-2xl shadow-primary/30 ring-1 ring-white/10"
          >
            <div
              aria-hidden="true"
              className="bg-pattern-light absolute inset-0 -z-10"
            />
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={togglePause}
                aria-label={paused ? "Lanjutkan audio" : "Jeda audio"}
                className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gold-soft text-deep shadow-lg transition-transform hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {paused ? (
                  <Play
                    className="size-5 translate-x-0.5 fill-current"
                    aria-hidden="true"
                  />
                ) : (
                  <Pause className="size-5 fill-current" aria-hidden="true" />
                )}
              </button>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 truncate text-sm font-semibold">
                  <Equalizer paused={paused} />
                  {nomorDiputar
                    ? `Ayat ${nomorDiputar} dari ${ayat.length}`
                    : "Surat lengkap"}
                  <span className="truncate font-normal text-white/60">
                    · {namaLatin}
                  </span>
                </p>
                <div className="mt-1.5 flex items-center gap-2 text-[11px] text-white/70 tabular-nums">
                  <span>{waktu(posisi)}</span>
                  <input
                    type="range"
                    min={0}
                    max={durasi || 0}
                    step={0.1}
                    value={posisi}
                    onChange={(e) => {
                      if (audioRef.current)
                        audioRef.current.currentTime = Number(e.target.value);
                    }}
                    aria-label="Posisi audio"
                    className="h-1 min-w-0 flex-1 cursor-pointer accent-gold-soft"
                  />
                  <span>{waktu(durasi)}</span>
                </div>
              </div>
              {nomorDiputar && (
                <>
                  <button
                    type="button"
                    className={cn(playerIcon, "hidden sm:flex")}
                    aria-label="Ayat sebelumnya"
                    disabled={nomorDiputar === 1}
                    onClick={() =>
                      startPlaying({ mode: "ayat", nomor: nomorDiputar - 1 })
                    }
                  >
                    <SkipBack
                      className="size-4 fill-current"
                      aria-hidden="true"
                    />
                  </button>
                  <button
                    type="button"
                    className={playerIcon}
                    aria-label="Ayat berikutnya"
                    disabled={nomorDiputar === ayat.length}
                    onClick={() =>
                      startPlaying({ mode: "ayat", nomor: nomorDiputar + 1 })
                    }
                  >
                    <SkipForward
                      className="size-4 fill-current"
                      aria-hidden="true"
                    />
                  </button>
                </>
              )}
              <button
                type="button"
                className={playerIcon}
                aria-label="Tutup pemutar"
                onClick={stop}
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
            {audioError && (
              <p role="alert" className="mt-2 px-1 text-xs text-gold-soft">
                Audio tidak bisa diputar. Periksa koneksi atau ganti qari.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
