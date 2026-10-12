"use client";

import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main
      id="main-content"
      className="bg-pattern flex min-h-svh flex-col items-center justify-center px-6 py-24 text-center"
    >
      <h1 className="text-3xl font-bold tracking-tight">Terjadi kesalahan</h1>
      <p className="mt-3 max-w-md leading-7 text-muted-foreground">
        Sumber data mungkin sedang sibuk. Coba lagi beberapa saat.
      </p>
      <Button onClick={reset} className="mt-8 rounded-full px-6">
        <RotateCw aria-hidden="true" />
        Coba lagi
      </Button>
    </main>
  );
}
