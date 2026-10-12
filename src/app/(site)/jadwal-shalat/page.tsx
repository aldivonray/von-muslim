import type { Metadata } from "next";
import { Clock } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { PrayerTimes } from "@/components/prayer-times";

export const metadata: Metadata = { title: "Jadwal Shalat" };

export default function JadwalShalatPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        icon={Clock}
        eyebrow="Waktu shalat"
        title="Jadwal Shalat"
        description="Waktu shalat hari ini sesuai kota Anda, lengkap dengan hitung mundur ke shalat berikutnya."
      />
      <div className="mx-auto max-w-4xl">
        <PrayerTimes />
      </div>
    </div>
  );
}
