import type { Metadata } from "next";
import { CircleDot } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { TasbihCounter } from "@/components/tasbih-counter";

export const metadata: Metadata = { title: "Tasbih Digital" };

export default function TasbihPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        icon={CircleDot}
        eyebrow="Dzikir"
        title="Tasbih Digital"
        description="Hitung dzikir dengan satu ketukan. Pilih bacaan dan target, hitungan tersimpan otomatis."
      />
      <div className="mx-auto max-w-5xl">
        <TasbihCounter />
      </div>
    </div>
  );
}
