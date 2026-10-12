"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/lib/use-local-storage";
import { cn } from "@/lib/utils";

type Tasbih = { count: number; target: number; dzikir: string };

const TARGETS = [33, 99, 100] as const;
const DZIKIR = ["Subhanallah", "Alhamdulillah", "Allahu Akbar", "Lainnya"];

const DEFAULT: Tasbih = { count: 0, target: 33, dzikir: "Subhanallah" };

const RING = 2 * Math.PI * 46;

function isTasbih(value: unknown): value is Tasbih {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.count === "number" &&
    Number.isInteger(v.count) &&
    v.count >= 0 &&
    typeof v.target === "number" &&
    v.target > 0 &&
    typeof v.dzikir === "string"
  );
}

function Pilihan({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly (string | number)[];
  value: string | number;
  onChange: (value: string | number) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-xs font-semibold tracking-[0.18em] text-gold uppercase">
        {label}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={option === value}
            onClick={() => onChange(option)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-ring",
              option === value
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-card",
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function TasbihCounter() {
  const [state, setState] = useLocalStorage("vonmuslim:tasbih", DEFAULT, isTasbih);
  const reached = state.count > 0 && state.count % state.target === 0;
  const putaran = Math.floor(state.count / state.target);
  // A full ring at each completed round, not an empty one.
  const sisa = state.count % state.target;
  const progres = reached ? 1 : sisa / state.target;

  function tambah() {
    setState({ ...state, count: state.count + 1 });
    if ((state.count + 1) % state.target === 0 && navigator.vibrate) {
      navigator.vibrate(60);
    }
  }

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr]">
      <div className="flex flex-col items-center gap-5">
        <p className="text-lg font-semibold text-primary">{state.dzikir}</p>
        <div className="relative size-72 sm:size-80">
          <svg viewBox="0 0 100 100" aria-hidden="true" className="absolute inset-0 -rotate-90">
            <circle cx="50" cy="50" r="46" fill="none" stroke="var(--border)" strokeWidth="3" />
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={RING}
              strokeDashoffset={RING * (1 - progres)}
              className="transition-[stroke-dashoffset] duration-300"
            />
          </svg>
          <button
            type="button"
            onClick={tambah}
            aria-label={`Tambah hitungan, saat ini ${state.count}`}
            className="surface-hero absolute inset-5 flex flex-col items-center justify-center rounded-full text-white shadow-2xl shadow-primary/30 transition-transform select-none active:scale-95 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            <span className="text-7xl font-bold tabular-nums">{state.count}</span>
            <span className="mt-2 text-sm text-white/75">
              target {state.target}
              {putaran > 0 && ` · ${putaran}× selesai`}
            </span>
            <span className="mt-4 rounded-full bg-white/10 px-3 py-1 text-xs text-gold-soft ring-1 ring-white/15">
              Ketuk untuk menghitung
            </span>
          </button>
        </div>
        <p role="status" className="min-h-6 font-semibold text-primary">
          {reached && `Target ${state.target} tercapai. Alhamdulillah.`}
        </p>
      </div>

      <div className="space-y-6 rounded-3xl border bg-card p-6 shadow-sm">
        <Pilihan
          label="Dzikir"
          options={DZIKIR}
          value={state.dzikir}
          onChange={(dzikir) => setState({ ...state, dzikir: String(dzikir) })}
        />
        <Pilihan
          label="Target"
          options={TARGETS}
          value={state.target}
          onChange={(target) => setState({ ...state, target: Number(target) })}
        />
        <Button
          variant="outline"
          className="rounded-full"
          disabled={state.count === 0}
          onClick={() => {
            if (window.confirm("Reset hitungan ke nol?"))
              setState({ ...state, count: 0 });
          }}
        >
          <RotateCcw aria-hidden="true" />
          Reset hitungan
        </Button>
        <p className="text-sm leading-6 text-muted-foreground">
          Hitungan tersimpan di perangkat ini, jadi aman saat halaman dimuat
          ulang. Ponsel bergetar setiap target tercapai.
        </p>
      </div>
    </div>
  );
}
