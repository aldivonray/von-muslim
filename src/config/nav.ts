import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  CircleDot,
  Clock,
  Compass,
  HandHeart,
  Info,
  MoonStar,
  Sparkles,
  Star,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
};

// Shared by the header and the home page feature grid.
export const navItems: readonly NavItem[] = [
  {
    href: "/",
    label: "Beranda",
    description: "Halaman utama VonMuslim.",
    icon: MoonStar,
  },
  {
    href: "/pengenalan",
    label: "Pengenalan Islam",
    description: "Syahadat, rukun Islam, rukun iman, dan ihsan.",
    icon: Info,
  },
  {
    href: "/quran",
    label: "Al-Qur'an",
    description: "Baca 114 surat dengan terjemahan dan audio murottal.",
    icon: BookOpen,
  },
  {
    href: "/ayat-pilihan",
    label: "Ayat Pilihan",
    description: "Ayat-ayat pilihan untuk direnungkan.",
    icon: Sparkles,
  },
  {
    href: "/jadwal-shalat",
    label: "Jadwal Shalat",
    description: "Waktu shalat sesuai lokasi Anda.",
    icon: Clock,
  },
  {
    href: "/doa",
    label: "Doa Harian",
    description: "Kumpulan doa sehari-hari dengan latin dan arti.",
    icon: HandHeart,
  },
  {
    href: "/asmaul-husna",
    label: "Asmaul Husna",
    description: "99 nama indah Allah.",
    icon: Star,
  },
  {
    href: "/kiblat",
    label: "Arah Kiblat",
    description: "Arah kiblat dari lokasi Anda.",
    icon: Compass,
  },
  {
    href: "/tasbih",
    label: "Tasbih",
    description: "Penghitung dzikir digital.",
    icon: CircleDot,
  },
] as const;
