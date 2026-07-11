// storage.js — Helper penyimpanan booking ke Local Storage browser.
// Semua booking disimpan dalam satu key sebagai array JSON.

const STORAGE_KEY = "cinema_bookings";

// Ambil seluruh booking yang tersimpan. Selalu mengembalikan array.
function getBookings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    // Data korup / tidak valid → anggap kosong agar app tetap jalan.
    console.warn("Gagal membaca data booking:", e);
    return [];
  }
}

// Simpan satu booking baru (append ke daftar).
function saveBooking(booking) {
  const bookings = getBookings();
  bookings.push(booking);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  return booking;
}

// Ambil daftar nomor kursi yang SUDAH dipesan untuk kombinasi film + jadwal.
// Status "sudah dipesan" dihitung per (filmId + scheduleId), sehingga kursi
// yang sama pada jadwal berbeda tetap independen.
function getBookedSeats(filmId, scheduleId) {
  const seats = [];
  getBookings().forEach((b) => {
    if (b.filmId === filmId && b.scheduleId === scheduleId) {
      (b.seats || []).forEach((s) => seats.push(s));
    }
  });
  return seats;
}

// Buat id booking sederhana tanpa bergantung pada Date.now (aman & cukup unik).
function generateBookingId() {
  return "bk-" + Math.random().toString(36).slice(2, 10);
}

// Hapus seluruh data booking dari Local Storage (reset penuh).
function clearBookings() {
  localStorage.removeItem(STORAGE_KEY);
}
