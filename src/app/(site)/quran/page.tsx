import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { ContinueReading } from "@/components/continue-reading";
import { PageHeader } from "@/components/page-header";
import { SurahList } from "@/components/surah-list";
import { getSurahList } from "@/lib/content-api";

export const metadata: Metadata = { title: "Al-Qur'an" };

export default async function QuranPage() {
  const surat = await getSurahList();
  return (
    <div className="space-y-8">
      <PageHeader
        icon={BookOpen}
        eyebrow="Kalamullah"
        title="Al-Qur'an"
        description="114 surat lengkap dengan teks Arab, latin, terjemahan Indonesia, dan audio murottal dari enam qari."
      />
      <ContinueReading surat={surat} />
      <SurahList surat={surat} />
    </div>
  );
}
