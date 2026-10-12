"use client";

import { Compass } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LokasiPicker } from "@/components/lokasi-picker";
import { useLokasi } from "@/lib/use-lokasi";

type OrientationEventLike = DeviceOrientationEvent & {
  webkitCompassHeading?: number;
};
type OrientationPermission = { requestPermission?: () => Promise<string> };

// Arah kiblat dihitung dari sudut searah jarum jam terhadap utara.
type State = { key: string; direction?: number; error?: boolean };

// Absolute events win. Relative deviceorientation is used only when no absolute event has arrived.
function useCompassHeading(enabled: boolean) {
  const [heading, setHeading] = useState<number | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let sawAbsolute = false;
    const fromEvent = (e: OrientationEventLike) =>
      e.webkitCompassHeading ?? (e.alpha !== null ? 360 - e.alpha : null);
    const onAbsolute = (event: Event) => {
      sawAbsolute = true;
      const h = fromEvent(event as OrientationEventLike);
      if (h !== null) setHeading(h);
    };
    const onRelative = (event: Event) => {
      if (sawAbsolute) return;
      const h = fromEvent(event as OrientationEventLike);
      if (h !== null) setHeading(h);
    };
    window.addEventListener("deviceorientationabsolute", onAbsolute);
    window.addEventListener("deviceorientation", onRelative);
    return () => {
      window.removeEventListener("deviceorientationabsolute", onAbsolute);
      window.removeEventListener("deviceorientation", onRelative);
    };
  }, [enabled]);

  return heading;
}

export function QiblaCompass() {
  const [lokasi, setLokasi] = useLokasi();
  const key = `${lokasi.latitude},${lokasi.longitude}`;
  const [state, setState] = useState<State>({ key: "" });
  const [sensorOn, setSensorOn] = useState(false);
  const [sensorMsg, setSensorMsg] = useState<string | null>(null);
  const heading = useCompassHeading(sensorOn);

  useEffect(() => {
    const controller = new AbortController();
    fetch(
      `https://api.aladhan.com/v1/qibla/${lokasi.latitude}/${lokasi.longitude}`,
      { signal: controller.signal },
    )
      .then(async (res) => {
        if (!res.ok) throw new Error(String(res.status));
        return (await res.json()) as { data: { direction: number } };
      })
      .then((json) => setState({ key, direction: json.data.direction }))
      .catch(() => {
        if (!controller.signal.aborted) setState({ key, error: true });
      });
    return () => controller.abort();
  }, [key, lokasi.latitude, lokasi.longitude]);

  const loading = state.key !== key;
  const direction = loading ? undefined : state.direction;

  async function enableSensor() {
    const DeviceOrientation = window.DeviceOrientationEvent as unknown as
      OrientationPermission | undefined;
    if (!DeviceOrientation) {
      setSensorMsg("Perangkat ini tidak punya sensor kompas.");
      return;
    }
    if (DeviceOrientation.requestPermission) {
      const result = await DeviceOrientation.requestPermission();
      if (result !== "granted") {
        setSensorMsg("Izin sensor ditolak. Panah tetap bisa dipakai manual.");
        return;
      }
    }
    setSensorMsg(null);
    setSensorOn(true);
  }

  const dialRotation = heading === null ? 0 : -heading;
  // Signed difference in (-180, 180]; within 5° counts as facing the qibla.
  const selisih =
    heading === null || direction === undefined
      ? null
      : ((direction - heading + 540) % 360) - 180;
  const menghadap = selisih !== null && Math.abs(selisih) < 5;

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.1fr]">
      <div className="surface-hero relative isolate mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-full p-3 shadow-2xl shadow-primary/20">
        <div
          aria-hidden="true"
          className="bg-pattern-light absolute inset-0 -z-10"
        />
        {state.error ? (
          <p
            role="alert"
            className="flex h-full items-center justify-center px-10 text-center text-white/85"
          >
            Arah kiblat belum bisa dimuat. Coba lagi beberapa saat.
          </p>
        ) : loading || direction === undefined ? (
          <p className="flex h-full animate-pulse items-center justify-center text-white/80">
            Menghitung arah kiblat…
          </p>
        ) : (
          <svg
            viewBox="-120 -120 240 240"
            role="img"
            aria-label={`Arah kiblat ${direction.toFixed(1)} derajat dari utara`}
            className="h-full w-full"
          >
            <g
              style={{
                transform: `rotate(${dialRotation}deg)`,
                transition: "transform 0.2s linear",
              }}
            >
              <circle
                r="114"
                fill="rgb(255 255 255 / 0.04)"
                stroke="rgb(255 255 255 / 0.18)"
              />
              {Array.from({ length: 72 }, (_, i) => (
                <line
                  key={i}
                  y1={-110}
                  y2={i % 6 === 0 ? -98 : -104}
                  transform={`rotate(${i * 5})`}
                  stroke="white"
                  strokeOpacity={i % 6 === 0 ? 0.7 : 0.25}
                  strokeWidth={i % 6 === 0 ? 2 : 1}
                />
              ))}
              {(
                [
                  ["U", 0, -80],
                  ["T", 82, 5],
                  ["S", 0, 88],
                  ["B", -82, 5],
                ] as const
              ).map(([huruf, x, y]) => (
                <text
                  key={huruf}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  fill={huruf === "U" ? "var(--gold-soft)" : "white"}
                  fillOpacity={huruf === "U" ? 1 : 0.75}
                  fontSize={huruf === "U" ? 16 : 13}
                  fontWeight="700"
                >
                  {huruf}
                </text>
              ))}
              <g transform={`rotate(${direction})`}>
                <line
                  y1="-8"
                  y2="-66"
                  stroke="var(--gold-soft)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <rect
                  x="-11"
                  y="-92"
                  width="22"
                  height="22"
                  rx="3"
                  fill="#111"
                  stroke="var(--gold-soft)"
                  strokeWidth="1.5"
                />
                <rect
                  x="-11"
                  y="-86"
                  width="22"
                  height="3.5"
                  fill="var(--gold-soft)"
                />
              </g>
              <circle r="7" fill="var(--gold-soft)" />
            </g>
          </svg>
        )}
      </div>

      <div className="space-y-5">
        <div className="rounded-3xl border bg-card p-5 shadow-sm sm:p-6">
          <LokasiPicker value={lokasi} onChange={setLokasi} />
        </div>
        {direction !== undefined && !loading && (
          <div className="rounded-3xl border bg-card p-6 shadow-sm">
            <p className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">
              Arah kiblat
            </p>
            <p className="mt-1 text-5xl font-bold tracking-tight tabular-nums text-primary">
              {direction.toFixed(1)}°
            </p>
            <p className="mt-1 text-muted-foreground">
              dari utara searah jarum jam · {lokasi.label}
            </p>
            {menghadap && (
              <p
                role="status"
                className="mt-4 rounded-2xl bg-primary px-4 py-3 font-semibold text-primary-foreground"
              >
                Anda sudah menghadap kiblat.
              </p>
            )}
            <div className="mt-5 space-y-3">
              {!sensorOn && (
                <Button
                  className="h-11 rounded-full px-5"
                  onClick={enableSensor}
                >
                  <Compass aria-hidden="true" />
                  Aktifkan kompas perangkat
                </Button>
              )}
              {sensorMsg && (
                <p role="status" className="text-sm text-muted-foreground">
                  {sensorMsg}
                </p>
              )}
              <p className="text-sm leading-6 text-muted-foreground">
                Letakkan ponsel mendatar, lalu putar badan hingga Ka&apos;bah
                berada di atas. Jauhkan dari benda logam agar kompas akurat.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
