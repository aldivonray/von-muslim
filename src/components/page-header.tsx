import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Emerald banner shared by every content page so they read as one product.
export function PageHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
  children,
  centered = false,
  className,
}: {
  icon?: LucideIcon;
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  centered?: boolean;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "surface-hero animate-rise relative isolate overflow-hidden rounded-[2rem] px-6 py-10 text-white shadow-xl shadow-primary/10 sm:px-12 sm:py-14",
        centered && "text-center",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="bg-pattern-light absolute inset-0 -z-10 [mask-image:linear-gradient(to_left,black,transparent_85%)]"
      />
      {Icon && (
        <span className="mb-6 inline-flex size-12 items-center justify-center rounded-2xl bg-white/10 text-gold-soft ring-1 ring-white/20 backdrop-blur">
          <Icon className="size-6" aria-hidden="true" />
        </span>
      )}
      {eyebrow && (
        <p className="text-xs font-semibold tracking-[0.2em] text-gold-soft uppercase">
          {eyebrow}
        </p>
      )}
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-balance sm:text-5xl">
        {title}
      </h1>
      {description && (
        <p
          className={cn(
            "mt-4 max-w-2xl text-base leading-7 text-pretty text-white/80 sm:text-lg",
            centered && "mx-auto",
          )}
        >
          {description}
        </p>
      )}
      {children}
    </header>
  );
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  action,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">
            {eyebrow}
          </p>
        )}
        <h2 id={id} className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}
