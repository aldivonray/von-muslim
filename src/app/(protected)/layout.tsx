import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { requireSession } from "@/lib/session";

export const runtime = "nodejs";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireSession();
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
