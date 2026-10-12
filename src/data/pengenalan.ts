// Ringkasan konsep dasar. Dalil menunjuk ayat; teks ayat sendiri diambil dari API Al-Qur'an.
export type Dalil = { surah: number; ayat: number; nama: string };

export type Pokok = { judul: string; penjelasan: string; dalil: Dalil };

export const syahadat = {
  arab: "أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللّٰهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللّٰهِ",
  latin:
    "Asyhadu an laa ilaaha illallaah, wa asyhadu anna Muhammadar rasuulullaah.",
  arti: "Aku bersaksi bahwa tidak ada tuhan selain Allah, dan aku bersaksi bahwa Muhammad adalah utusan Allah.",
};

export const rukunIslam: Pokok[] = [
  {
    judul: "Syahadat",
    penjelasan:
      "Mengucapkan dan meyakini bahwa tidak ada tuhan selain Allah dan Nabi Muhammad adalah utusan-Nya.",
    dalil: { surah: 3, ayat: 18, nama: "Ali 'Imran" },
  },
  {
    judul: "Shalat",
    penjelasan:
      "Shalat lima waktu setiap hari sebagai hubungan langsung seorang hamba dengan Allah.",
    dalil: { surah: 2, ayat: 43, nama: "Al-Baqarah" },
  },
  {
    judul: "Zakat",
    penjelasan:
      "Menyisihkan sebagian harta yang telah mencapai nisab untuk orang yang berhak menerimanya.",
    dalil: { surah: 2, ayat: 43, nama: "Al-Baqarah" },
  },
  {
    judul: "Puasa Ramadhan",
    penjelasan:
      "Menahan diri dari makan, minum, dan hal yang membatalkan puasa dari terbit fajar hingga terbenam matahari.",
    dalil: { surah: 2, ayat: 183, nama: "Al-Baqarah" },
  },
  {
    judul: "Haji",
    penjelasan:
      "Mengunjungi Baitullah di Makkah untuk beribadah pada waktu yang telah ditentukan, bagi yang mampu.",
    dalil: { surah: 3, ayat: 97, nama: "Ali 'Imran" },
  },
];

export const rukunIman: Pokok[] = [
  {
    judul: "Iman kepada Allah",
    penjelasan: "Meyakini bahwa Allah itu Esa, tidak ada sekutu bagi-Nya.",
    dalil: { surah: 2, ayat: 285, nama: "Al-Baqarah" },
  },
  {
    judul: "Iman kepada Malaikat",
    penjelasan:
      "Meyakini bahwa malaikat adalah makhluk Allah yang taat dan melaksanakan perintah-Nya.",
    dalil: { surah: 2, ayat: 285, nama: "Al-Baqarah" },
  },
  {
    judul: "Iman kepada Kitab",
    penjelasan:
      "Meyakini kitab-kitab Allah yang diturunkan kepada para rasul, termasuk Al-Qur'an.",
    dalil: { surah: 2, ayat: 285, nama: "Al-Baqarah" },
  },
  {
    judul: "Iman kepada Rasul",
    penjelasan:
      "Meyakini bahwa Allah mengutus para rasul untuk menyampaikan wahyu kepada manusia.",
    dalil: { surah: 2, ayat: 285, nama: "Al-Baqarah" },
  },
  {
    judul: "Iman kepada Hari Akhir",
    penjelasan:
      "Meyakini adanya kehidupan setelah mati, hari perhitungan amal, dan balasan surga atau neraka.",
    dalil: { surah: 2, ayat: 177, nama: "Al-Baqarah" },
  },
  {
    judul: "Iman kepada Qada dan Qadar",
    penjelasan:
      "Meyakini bahwa segala sesuatu terjadi dengan ketetapan dan ukuran dari Allah.",
    dalil: { surah: 54, ayat: 49, nama: "Al-Qamar" },
  },
];

export const ihsan = {
  penjelasan:
    "Ihsan adalah beribadah kepada Allah seolah-olah engkau melihat-Nya. Jika engkau tidak melihat-Nya, sesungguhnya Dia melihatmu. Ini disampaikan dalam hadis Jibril yang diriwayatkan Imam Muslim.",
};
