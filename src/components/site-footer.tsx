import Link from "next/link";
import { MoonStar } from "lucide-react";
import { navItems } from "@/config/nav";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="surface-hero relative isolate mt-16 overflow-hidden text-white">
      <div aria-hidden="true" className="bg-pattern-light absolute inset-0 -z-10" />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-8 md:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4">
          <p className="flex items-center gap-2.5 text-lg font-bold">
            <span className="flex size-9 items-center justify-center rounded-xl bg-white/10 text-gold-soft ring-1 ring-white/20">
              <MoonStar className="size-[18px]" aria-hidden="true" />
            </span>
            {siteConfig.name}
          </p>
          <p className="max-w-sm leading-7 text-white/75">
            Teman harian untuk membaca Al-Qur&apos;an, menjaga waktu shalat, dan
            mengenal Islam dengan tenang.
          </p>
          <p className="text-sm text-white/60">
            Sumber data: equran.id, myquran.com, dan aladhan.com.
          </p>
        </div>
        <nav aria-label="Navigasi footer">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-white/75 transition-colors hover:text-gold-soft"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {siteConfig.name}. Semoga bermanfaat.
      </p>
    </footer>
  );
}
