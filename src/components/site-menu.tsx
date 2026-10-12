"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navItems } from "@/config/nav";
import { cn } from "@/lib/utils";

// Shown inline on wide screens; everything else lives in the menu panel.
const UTAMA = ["/quran", "/jadwal-shalat", "/doa", "/ayat-pilihan"];

function useIsActive() {
  const pathname = usePathname();
  return (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);
}

export function PrimaryLinks() {
  const isActive = useIsActive();
  return (
    <nav aria-label="Navigasi utama" className="hidden lg:block">
      <ul className="flex items-center gap-6">
        {navItems
          .filter((item) => UTAMA.includes(item.href))
          .map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring",
                    "after:absolute after:inset-x-0 after:-bottom-0.5 after:mx-auto after:h-0.5 after:w-0 after:rounded-full after:bg-gold after:transition-all hover:after:w-4",
                    active && "text-primary after:w-6 hover:after:w-6",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
      </ul>
    </nav>
  );
}

export function MenuButton() {
  const isActive = useIsActive();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="h-10 rounded-full px-4">
          <LayoutGrid aria-hidden="true" />
          Menu
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full gap-0 overflow-y-auto sm:max-w-md"
      >
        <div className="surface-hero relative isolate shrink-0 overflow-hidden px-6 pt-6 pb-7 text-white">
          <div aria-hidden="true" className="bg-pattern-light absolute inset-0 -z-10" />
          <div className="flex items-start justify-between gap-4">
            <div>
              <SheetTitle className="text-2xl font-bold text-white">
                Jelajahi VonMuslim
              </SheetTitle>
              <SheetDescription className="mt-1 text-white/75">
                Semua fitur dalam satu ketukan.
              </SheetDescription>
            </div>
            <SheetClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-white hover:bg-white/15 hover:text-white"
                aria-label="Tutup menu"
              >
                <X aria-hidden="true" />
              </Button>
            </SheetClose>
          </div>
        </div>

        <nav aria-label="Semua fitur" className="shrink-0 p-4">
          <ul className="grid grid-cols-2 gap-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <SheetClose asChild>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex h-full flex-col rounded-2xl border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-2 focus-visible:outline-ring",
                        active && "border-primary ring-2 ring-primary/15",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary",
                          active && "surface-hero text-gold-soft",
                        )}
                      >
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <span className="mt-3 text-sm font-bold">{item.label}</span>
                      <span className="mt-0.5 text-xs leading-5 text-muted-foreground">
                        {item.description}
                      </span>
                    </Link>
                  </SheetClose>
                </li>
              );
            })}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
