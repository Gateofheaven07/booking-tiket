// data.js — Data statis film, jadwal, dan konfigurasi denah kursi.
// Semua data di-hardcode karena aplikasi tidak memakai backend/database.

// Konfigurasi denah kursi: baris A–E, 8 kursi per baris.
const SEAT_CONFIG = {
  rows: ["A", "B", "C", "D", "E"],
  seatsPerRow: 8,
};

// Daftar film. Setiap film punya beberapa jadwal tayang.
const FILMS = [
  {
    id: "f1",
    judul: "Petualangan Langit Biru",
    emoji: "🎈",
    poster: "assets/petualangan-langit-biru.png",
    rating: "8.4",
    genre: "Petualangan / Keluarga",
    durasi: "1j 45m",
    schedules: [
      { id: "f1-s1", jam: "12:00" },
      { id: "f1-s2", jam: "15:30" },
      { id: "f1-s3", jam: "19:00" },
    ],
  },
  {
    id: "f2",
    judul: "Misteri Kota Tua",
    emoji: "🕵️",
    poster: "assets/misteri-kota-tua.png",
    rating: "8.1",
    genre: "Thriller / Misteri",
    durasi: "2j 05m",
    schedules: [
      { id: "f2-s1", jam: "13:15" },
      { id: "f2-s2", jam: "16:45" },
      { id: "f2-s3", jam: "20:15" },
    ],
  },
  {
    id: "f3",
    judul: "Robot Penjaga Galaksi",
    emoji: "🤖",
    poster: "assets/robot-penjaga-galaksi.png",
    rating: "8.9",
    genre: "Sci-Fi / Aksi",
    durasi: "2j 20m",
    schedules: [
      { id: "f3-s1", jam: "11:30" },
      { id: "f3-s2", jam: "14:40" },
      { id: "f3-s3", jam: "18:20" },
      { id: "f3-s4", jam: "21:30" },
    ],
  },
  {
    id: "f4",
    judul: "Senyum di Ujung Musim",
    emoji: "🌸",
    poster: "assets/senyum-di-ujung-musim.png",
    rating: "7.9",
    genre: "Drama / Romansa",
    durasi: "1j 55m",
    schedules: [
      { id: "f4-s1", jam: "12:50" },
      { id: "f4-s2", jam: "17:10" },
      { id: "f4-s3", jam: "20:40" },
    ],
  },
];

// Helper pencarian data (dipakai app.js).
function findFilm(filmId) {
  return FILMS.find((f) => f.id === filmId) || null;
}

function findSchedule(film, scheduleId) {
  if (!film) return null;
  return film.schedules.find((s) => s.id === scheduleId) || null;
}
