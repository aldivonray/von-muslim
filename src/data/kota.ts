export type Lokasi = { label: string; latitude: number; longitude: number };

// Preset cities. Free-text city lookup is intentionally not used: unknown names fall back silently in aladhan.
export const kotaPilihan: Lokasi[] = [
  { label: "Jakarta", latitude: -6.2088, longitude: 106.8456 },
  { label: "Bandung", latitude: -6.9175, longitude: 107.6191 },
  { label: "Surabaya", latitude: -7.2575, longitude: 112.7521 },
  { label: "Yogyakarta", latitude: -7.7956, longitude: 110.3695 },
  { label: "Semarang", latitude: -6.9667, longitude: 110.4167 },
  { label: "Malang", latitude: -7.9666, longitude: 112.6326 },
  { label: "Medan", latitude: 3.5952, longitude: 98.6722 },
  { label: "Banda Aceh", latitude: 5.5483, longitude: 95.3238 },
  { label: "Padang", latitude: -0.9471, longitude: 100.4172 },
  { label: "Palembang", latitude: -2.9761, longitude: 104.7754 },
  { label: "Pontianak", latitude: -0.0263, longitude: 109.3425 },
  { label: "Balikpapan", latitude: -1.2379, longitude: 116.8529 },
  { label: "Makassar", latitude: -5.1477, longitude: 119.4327 },
  { label: "Manado", latitude: 1.4748, longitude: 124.8421 },
  { label: "Denpasar", latitude: -8.6705, longitude: 115.2126 },
  { label: "Mataram", latitude: -8.5833, longitude: 116.1167 },
  { label: "Jayapura", latitude: -2.5337, longitude: 140.7181 },
];
