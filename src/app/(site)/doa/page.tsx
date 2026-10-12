import type { Metadata } from "next";
import { HandHeart } from "lucide-react";
import { DoaList } from "@/components/doa-list";
import { PageHeader } from "@/components/page-header";
import { getDoaList } from "@/lib/content-api";

export const metadata: Metadata = { title: "Doa Harian" };

export default async function DoaPage() {
  const doa = await getDoaList();
  return (
    <div className="space-y-8">
      <PageHeader
        icon={HandHeart}
        eyebrow="Amalan harian"
        title="Doa Harian"
        description={`${doa.length} doa sehari-hari lengkap dengan tulisan Arab, latin, arti, dan sumbernya.`}
      />
      <div className="mx-auto max-w-3xl">
        <DoaList doa={doa} />
      </div>
    </div>
  );
}
