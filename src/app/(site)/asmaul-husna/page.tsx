import type { Metadata } from "next";
import { Star } from "lucide-react";
import { NomorBadge } from "@/components/nomor-badge";
import { PageHeader } from "@/components/page-header";
import { getAsmaulHusna } from "@/lib/content-api";

export const metadata: Metadata = { title: "Asmaul Husna" };

export default async function AsmaulHusnaPage() {
  const names = await getAsmaulHusna();
  return (
    <div className="space-y-8">
      <PageHeader
        icon={Star}
        eyebrow="Al-Asma' al-Husna"
        title="Asmaul Husna"
        description="99 nama indah Allah beserta maknanya. Kenali, renungkan, dan sebut dalam doa."
      />
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {names.map((n) => (
          <li
            key={n.id}
            className="group relative flex flex-col items-center overflow-hidden rounded-3xl border bg-card p-4 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-gold/50 hover:shadow-lg hover:shadow-gold/10 sm:p-6"
          >
            <div
              aria-hidden="true"
              className="bg-pattern absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
            />
            <NomorBadge n={n.id} className="relative self-start" />
            <p
              dir="rtl"
              lang="ar"
              className="font-arabic relative mt-1 text-4xl leading-[1.7] text-primary sm:text-5xl"
            >
              {n.arab}
            </p>
            <p className="relative mt-2 font-bold">{n.latin}</p>
            <p className="relative mt-1 text-sm leading-5 text-muted-foreground">
              {n.indo}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
