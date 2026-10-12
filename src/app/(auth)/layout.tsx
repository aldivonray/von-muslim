import { redirect } from "next/navigation";
import { Brand } from "@/components/brand";
import { getSession } from "@/lib/session";
import { siteConfig } from "@/config/site";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (await getSession()) redirect(siteConfig.homePath);
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <aside className="surface-hero relative isolate hidden overflow-hidden p-12 text-white lg:flex lg:flex-col lg:justify-end">
        <div
          aria-hidden="true"
          className="bg-pattern-light absolute inset-0 -z-10"
        />
        <p className="text-xs font-semibold tracking-[0.2em] text-gold-soft uppercase">
          {siteConfig.name}
        </p>
        <p className="mt-3 max-w-md text-3xl leading-tight font-bold text-balance">
          Teman harian untuk membaca Al-Qur&apos;an dan menjaga waktu shalat.
        </p>
      </aside>
      <div className="bg-pattern flex flex-col">
        <header className="px-6 py-6 sm:px-10">
          <Brand />
        </header>
        <main
          id="main-content"
          className="flex flex-1 items-center justify-center px-6 pb-16"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
