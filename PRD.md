# Product Requirement Document (PRD)

# Booking Kursi Bioskop Sederhana

## 1. Informasi Produk

**Nama Produk:** Booking Kursi Bioskop Sederhana

**Versi:** 1.0

**Tujuan:**
Membangun aplikasi sederhana yang memungkinkan pengguna memesan kursi bioskop tanpa perlu membuat akun atau login. Pengguna hanya perlu memilih film, jadwal, kursi, kemudian mengisi nama untuk melakukan booking.

---

# 2. Latar Belakang

Proses pemesanan tiket bioskop umumnya memerlukan registrasi akun dan pembayaran online. Untuk kebutuhan pembelajaran atau demonstrasi, aplikasi ini dibuat lebih sederhana dengan fokus pada proses pemilihan kursi dan penyimpanan data secara lokal menggunakan browser.

---

# 3. Target Pengguna

- Mahasiswa (untuk tugas atau pembelajaran)
- Pengguna yang ingin melakukan simulasi booking kursi bioskop

---

# 4. Tujuan Produk

- Memudahkan pengguna melakukan simulasi pemesanan kursi.
- Menampilkan status kursi yang telah dipesan.
- Mencegah satu kursi dipesan lebih dari satu kali.
- Menyimpan data booking secara lokal pada browser.

---

# 5. Ruang Lingkup

## Fitur yang Termasuk

- Melihat daftar film
- Memilih jadwal tayang
- Memilih kursi
- Mengisi nama pemesan
- Melakukan booking
- Melihat daftar booking
- Menyimpan data booking menggunakan Local Storage browser

## Fitur yang Tidak Termasuk

- Login dan registrasi
- Database
- Backend/API
- Pembayaran
- QR Code tiket
- Email notifikasi
- Riwayat pemesanan pengguna berdasarkan akun
- Manajemen admin

---

# 6. Functional Requirements

## FR-01 Melihat Daftar Film

Pengguna dapat:

- Melihat daftar film.
- Memilih film yang ingin ditonton.

---

## FR-02 Memilih Jadwal

Pengguna dapat:

- Melihat jadwal berdasarkan film.
- Memilih salah satu jadwal tayang.

---

## FR-03 Memilih Kursi

Pengguna dapat:

- Melihat denah kursi.
- Memilih satu atau lebih kursi.
- Melihat status kursi:
  - Tersedia
  - Sudah Dipesan

Sistem tidak mengizinkan kursi yang telah dipesan dipilih kembali.

---

## FR-04 Mengisi Nama Pemesan

Pengguna diminta mengisi:

- Nama pemesan

Nama digunakan sebagai identitas pada data booking.

---

## FR-05 Konfirmasi Booking

Sebelum booking disimpan, sistem menampilkan ringkasan:

- Nama pemesan
- Judul film
- Jadwal tayang
- Nomor kursi

Pengguna menekan tombol **Booking** untuk menyelesaikan proses.

---

## FR-06 Penyimpanan Booking

Setelah booking berhasil:

- Data booking disimpan ke **Local Storage** browser.
- Status kursi berubah menjadi **Sudah Dipesan**.
- Sistem menampilkan pesan **Booking Berhasil**.
- Data tetap tersedia selama Local Storage browser tidak dihapus.

---

## FR-07 Daftar Booking

Sistem menampilkan daftar booking yang tersimpan pada Local Storage, meliputi:

- Nama pemesan
- Film
- Jadwal
- Nomor kursi

Daftar booking akan diperbarui secara otomatis setiap kali terdapat booking baru.

---

# 7. User Flow

1. Pengguna membuka aplikasi.
2. Memilih film.
3. Memilih jadwal tayang.
4. Memilih kursi.
5. Mengisi nama pemesan.
6. Menekan tombol **Booking**.
7. Sistem menyimpan data ke Local Storage browser.
8. Kursi berubah menjadi **Sudah Dipesan**.
9. Pengguna melihat konfirmasi booking.
10. Saat aplikasi dibuka kembali, sistem memuat data booking dari Local Storage sehingga status kursi dan daftar booking tetap tersimpan.

---

# 8. Aturan Bisnis

- Nama pemesan wajib diisi.
- Pengguna hanya dapat memilih kursi yang masih tersedia.
- Kursi yang telah dipesan tidak dapat dipilih kembali.
- Booking dianggap selesai setelah pengguna menekan tombol **Booking**.
- Status kursi berubah menjadi **Sudah Dipesan** setelah booking berhasil.
- Seluruh data booking disimpan pada Local Storage browser.
- Menghapus data browser atau Local Storage akan menghapus seluruh data booking.

---

# 9. Non-Functional Requirements

- Tampilan sederhana dan mudah digunakan.
- Dapat diakses melalui browser desktop maupun mobile.
- Tidak memerlukan koneksi ke database atau server.
- Menggunakan Local Storage sebagai media penyimpanan data sementara.
- Waktu respons cepat pada penggunaan normal.
- Sistem mencegah terjadinya pemesanan kursi ganda berdasarkan data yang tersimpan di Local Storage.

---

# 10. Kriteria Keberhasilan

Produk dianggap berhasil apabila:

- Pengguna dapat melakukan booking tanpa login.
- Status kursi berubah setelah booking berhasil.
- Kursi yang telah dipesan tidak dapat dipilih kembali.
- Data booking tersimpan di Local Storage.
- Data booking tetap tersedia setelah halaman di-refresh atau browser dibuka kembali (selama Local Storage tidak dihapus).
- Seluruh alur booking dapat diselesaikan tanpa kesalahan.

---

# 11. Rencana Pengembangan

| Tahap        | Aktivitas                                                |
| ------------ | -------------------------------------------------------- |
| Analisis     | Menentukan kebutuhan aplikasi                            |
| Desain       | Membuat wireframe dan desain antarmuka                   |
| Pengembangan | Implementasi fitur booking dan penyimpanan Local Storage |
| Pengujian    | Menguji seluruh alur booking dan penyimpanan data        |
| Finalisasi   | Perbaikan bug dan penyelesaian dokumentasi               |
