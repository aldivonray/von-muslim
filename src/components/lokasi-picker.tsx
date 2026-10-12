"use client";

import { LocateFixed, MapPin } from "lucide-react";
import { useId, useState } from "react";
import { kotaPilihan, type Lokasi } from "@/data/kota";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const round4 = (n: number) => Math.round(n * 10000) / 10000;

export function LokasiPicker({
  value,
  onChange,
}: {
  value: Lokasi;
  onChange: (lokasi: Lokasi) => void;
}) {
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const selectId = useId();

  const presetIndex = kotaPilihan.findIndex(
    (k) => k.latitude === value.latitude && k.longitude === value.longitude,
  );
  const isCustom = presetIndex === -1;

  function locate() {
    if (!navigator.geolocation) {
      setError("Lokasi tidak bisa diakses. Pilih kota secara manual.");
      return;
    }
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false);
        onChange({
          label: "Lokasi saya",
          latitude: round4(position.coords.latitude),
          longitude: round4(position.coords.longitude),
        });
      },
      () => {
        setLocating(false);
        setError("Lokasi tidak bisa diakses. Pilih kota secara manual.");
      },
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1.5">
          <Label htmlFor={selectId} className="text-xs text-muted-foreground">
            Kota
          </Label>
          <div className="relative">
            <MapPin
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-primary"
              aria-hidden="true"
            />
            <select
              id={selectId}
              value={isCustom ? "saya" : String(presetIndex)}
              onChange={(event) => {
                if (event.target.value !== "saya")
                  onChange(kotaPilihan[Number(event.target.value)]);
              }}
              className="h-10 min-w-44 rounded-full border bg-background pr-4 pl-9 text-sm font-medium focus-visible:outline-2 focus-visible:outline-ring"
            >
              {isCustom && <option value="saya">{value.label}</option>}
              {kotaPilihan.map((kota, index) => (
                <option key={kota.label} value={index}>
                  {kota.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <Button
          variant="outline"
          className="h-10 rounded-full"
          onClick={locate}
          disabled={locating}
        >
          <LocateFixed aria-hidden="true" />
          {locating ? "Mencari lokasi…" : "Gunakan lokasi saya"}
        </Button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
