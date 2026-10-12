import { Brand } from "@/components/brand";
import { MenuButton, PrimaryLinks } from "@/components/site-menu";

// Login UI is hidden on purpose. /sign-in, /app and /admin still work by direct URL.
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-8">
        <Brand />
        <PrimaryLinks />
        <MenuButton />
      </div>
    </header>
  );
}
