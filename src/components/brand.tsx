import Link from "next/link";
import { MoonStar } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Brand({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2.5 rounded-sm text-lg font-bold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
        className,
      )}
      aria-label={`${siteConfig.name} beranda`}
    >
      <span className="surface-hero flex size-9 items-center justify-center rounded-xl text-gold-soft shadow-sm ring-1 ring-black/5">
        <MoonStar className="size-[18px]" aria-hidden="true" />
      </span>
      <span>{siteConfig.name}</span>
    </Link>
  );
}
