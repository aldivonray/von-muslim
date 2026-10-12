import type { Metadata } from "next";
import { Compass } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { QiblaCompass } from "@/components/qibla-compass";

export const metadata: Metadata = { title: "Arah Kiblat" };

export default function KiblatPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        icon={Compass}
        eyebrow="Menghadap Ka'bah"
        title="Arah Kiblat"
        description="Arah Ka'bah dari lokasi Anda. Aktifkan kompas di ponsel agar panah mengikuti arah perangkat."
      />
      <div className="mx-auto max-w-5xl">
        <QiblaCompass />
      </div>
    </div>
  );
}
