import type { Metadata } from "next";
import { ShieldCheck, UserRound } from "lucide-react";
import Link from "next/link";
import { ContinueReading } from "@/components/continue-reading";
import { PageHeader, SectionHeading } from "@/components/page-header";
import { PenandaList } from "@/components/penanda-list";
import { Button } from "@/components/ui/button";
import { getSurahList } from "@/lib/content-api";
import { SignOutButton } from "@/components/sign-out-button";
import { hasPermission, requireSession } from "@/lib/session";

export const metadata: Metadata = { title: "Akun saya" };

export default async function AppPage() {
  const { user } = await requireSession();
  // Hiding the link is presentation only. /admin and its API guard themselves.
  const isAdmin = await hasPermission(user.id, { notes: ["read-any"] });
  const surat = await getSurahList();

  return (
    <div className="space-y-10">
      <PageHeader
        icon={UserRound}
        eyebrow={`Assalamu’alaikum, ${user.name}`}
        title="Akun saya"
        description={<span className="break-all">Masuk sebagai {user.email}</span>}
      >
        <div className="mt-6">
          <SignOutButton />
        </div>
      </PageHeader>

      <ContinueReading surat={surat} />

      <section aria-labelledby="penanda">
        <SectionHeading id="penanda" eyebrow="Di perangkat ini" title="Ayat tersimpan" />
        <PenandaList surat={surat} />
      </section>

      {isAdmin && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border bg-card p-5">
          <p className="text-sm leading-6 text-muted-foreground">
            Peran Anda dapat membaca catatan setiap akun.
          </p>
          <Button variant="outline" asChild size="sm" className="rounded-full">
            <Link href="/admin">
              <ShieldCheck aria-hidden="true" />
              Buka admin
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
