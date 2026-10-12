import Link from "next/link";
import { NomorBadge } from "@/components/nomor-badge";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="bg-pattern flex min-h-svh flex-col items-center justify-center px-6 py-24 text-center"
    >
      <NomorBadge n={404} className="size-24 text-xl" />
      <h1 className="mt-6 text-3xl font-bold tracking-tight">
        Halaman tidak ditemukan
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        Halaman yang Anda cari tidak ada atau sudah dipindahkan.
      </p>
      <Button asChild className="mt-8 rounded-full px-6">
        <Link href="/">Ke beranda</Link>
      </Button>
    </main>
  );
}
