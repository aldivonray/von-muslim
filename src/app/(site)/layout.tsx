import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const runtime = "nodejs";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main
        id="main-content"
        className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-10"
      >
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
