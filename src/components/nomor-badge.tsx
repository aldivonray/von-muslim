import { cn } from "@/lib/utils";

// Rub el hizb style star used for surah, ayat, and list numbers.
export function NomorBadge({
  n,
  className,
}: {
  n: number | string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex size-11 shrink-0 items-center justify-center text-sm font-semibold text-primary",
        className,
      )}
    >
      <svg
        viewBox="0 0 40 40"
        aria-hidden="true"
        className="absolute inset-0 size-full"
      >
        <g
          fill="currentColor"
          fillOpacity="0.08"
          stroke="currentColor"
          strokeOpacity="0.5"
          strokeWidth="1.2"
        >
          <rect x="8" y="8" width="24" height="24" rx="2" />
          <rect
            x="8"
            y="8"
            width="24"
            height="24"
            rx="2"
            transform="rotate(45 20 20)"
          />
        </g>
      </svg>
      <span className="relative tabular-nums">{n}</span>
    </span>
  );
}
