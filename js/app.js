// app.js — Logika utama aplikasi booking kursi bioskop.
// Mengorkestrasi alur: film → jadwal → kursi → nama/konfirmasi → booking → daftar.

// State pilihan pengguna saat ini.
const state = {
  film: null, // objek film
  schedule: null, // objek schedule
  seats: [], // array nomor kursi terpilih, mis. ["A1","A2"]
};

// Referensi elemen.
const els = {
  steps: {
    film: document.getElementById("step-film"),
    schedule: document.getElementById("step-schedule"),
    seat: document.getElementById("step-seat"),
    confirm: document.getElementById("step-confirm"),
    success: document.getElementById("step-success"),
  },
  filmGrid: document.getElementById("filmGrid"),
  selectedFilmInfo: document.getElementById("selectedFilmInfo"),
  scheduleList: document.getElementById("scheduleList"),
  seatContext: document.getElementById("seatContext"),
  seatMap: document.getElementById("seatMap"),
  selectedSeatsText: document.getElementById("selectedSeatsText"),
  toConfirmBtn: document.getElementById("toConfirmBtn"),
  nameInput: document.getElementById("nameInput"),
  nameError: document.getElementById("nameError"),
  summaryContent: document.getElementById("summaryContent"),
  bookBtn: document.getElementById("bookBtn"),
  successDetail: document.getElementById("successDetail"),
  bookAgainBtn: document.getElementById("bookAgainBtn"),
  bookingsList: document.getElementById("bookingsList"),
  stepsIndicator: document.getElementById("stepsIndicator"),
};

// ---------- Navigasi antar-step ----------

// Tampilkan satu step, sembunyikan lainnya. stepName ∈ film|schedule|seat|confirm|success
function showStep(stepName) {
  Object.entries(els.steps).forEach(([name, el]) => {
    el.classList.toggle("hidden", name !== stepName);
  });
  updateIndicator(stepName);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateIndicator(stepName) {
  // Peta step → nomor indikator (success dianggap tahap terakhir).
  const order = { film: 1, schedule: 2, seat: 3, confirm: 4, success: 4 };
  const current = order[stepName] || 1;
  els.stepsIndicator.querySelectorAll("li").forEach((li) => {
    const n = Number(li.dataset.step);
    li.classList.toggle("active", n === current);
    li.classList.toggle("done", n < current);
  });
}

// ---------- STEP 1: Daftar film ----------

function renderFilms() {
  els.filmGrid.innerHTML = "";
  FILMS.forEach((film) => {
    const card = document.createElement("div");
    card.className = "film-card";
    card.innerHTML = `
      <div class="film-emoji">${film.emoji}</div>
      <h3>${film.judul}</h3>
      <p class="film-meta">${film.genre}</p>
      <p class="film-meta">⏱ ${film.durasi}</p>
    `;
    card.addEventListener("click", () => selectFilm(film));
    els.filmGrid.appendChild(card);
  });
}

function selectFilm(film) {
  state.film = film;
  state.schedule = null;
  state.seats = [];
  renderSchedules();
  showStep("schedule");
}

// ---------- STEP 2: Jadwal ----------

function renderSchedules() {
  const film = state.film;
  els.selectedFilmInfo.innerHTML =
    `${film.emoji} <strong>${film.judul}</strong> — ${film.genre} · ${film.durasi}`;
  els.scheduleList.innerHTML = "";
  film.schedules.forEach((sch) => {
    const btn = document.createElement("button");
    btn.className = "schedule-btn";
    btn.textContent = "🕐 " + sch.jam;
    btn.addEventListener("click", () => selectSchedule(sch));
    els.scheduleList.appendChild(btn);
  });
}

function selectSchedule(schedule) {
  state.schedule = schedule;
  state.seats = [];
  renderSeatMap();
  showStep("seat");
}

// ---------- STEP 3: Denah kursi ----------

function renderSeatMap() {
  const { film, schedule } = state;
  els.seatContext.innerHTML =
    `${film.emoji} <strong>${film.judul}</strong> · Jadwal <strong>${schedule.jam}</strong>`;

  const bookedSeats = getBookedSeats(film.id, schedule.id);
  els.seatMap.innerHTML = "";

  SEAT_CONFIG.rows.forEach((row) => {
    const rowEl = document.createElement("div");
    rowEl.className = "seat-row";

    const label = document.createElement("span");
    label.className = "row-label";
    label.textContent = row;
    rowEl.appendChild(label);

    for (let i = 1; i <= SEAT_CONFIG.seatsPerRow; i++) {
      const seatId = row + i;
      const seatBtn = document.createElement("button");
      seatBtn.className = "seat";
      seatBtn.textContent = i;
      seatBtn.dataset.seat = seatId;

      if (bookedSeats.includes(seatId)) {
        seatBtn.classList.add("booked");
        seatBtn.disabled = true;
        seatBtn.title = "Sudah dipesan";
      } else {
        seatBtn.addEventListener("click", () => toggleSeat(seatId, seatBtn));
      }
      rowEl.appendChild(seatBtn);
    }
    els.seatMap.appendChild(rowEl);
  });

  updateSeatSelectionUI();
}

function toggleSeat(seatId, seatBtn) {
  const idx = state.seats.indexOf(seatId);
  if (idx >= 0) {
    state.seats.splice(idx, 1);
    seatBtn.classList.remove("selected");
  } else {
    state.seats.push(seatId);
    seatBtn.classList.add("selected");
  }
  updateSeatSelectionUI();
}

function updateSeatSelectionUI() {
  if (state.seats.length === 0) {
    els.selectedSeatsText.textContent = "Belum ada kursi dipilih.";
    els.toConfirmBtn.disabled = true;
  } else {
    const sorted = [...state.seats].sort();
    els.selectedSeatsText.textContent =
      `Kursi dipilih: ${sorted.join(", ")} (${sorted.length} kursi)`;
    els.toConfirmBtn.disabled = false;
  }
}

// ---------- STEP 4: Nama & konfirmasi ----------

function renderSummary() {
  const { film, schedule, seats } = state;
  const sorted = [...seats].sort();
  els.summaryContent.innerHTML = `
    <dt>Film</dt><dd>${film.judul}</dd>
    <dt>Jadwal</dt><dd>${schedule.jam}</dd>
    <dt>Nomor Kursi</dt><dd>${sorted.join(", ")}</dd>
    <dt>Jumlah</dt><dd>${sorted.length} kursi</dd>
  `;
  els.nameInput.value = "";
  els.nameError.classList.add("hidden");
}

function handleBooking() {
  const nama = els.nameInput.value.trim();

  // Validasi nama (Aturan Bisnis: nama wajib diisi).
  if (!nama) {
    els.nameError.classList.remove("hidden");
    els.nameInput.focus();
    return;
  }
  els.nameError.classList.add("hidden");

  const { film, schedule } = state;

  // Validasi ganda: pastikan kursi belum keburu dipesan (mis. dari tab lain).
  const bookedNow = getBookedSeats(film.id, schedule.id);
  const conflict = state.seats.filter((s) => bookedNow.includes(s));
  if (conflict.length > 0) {
    alert(
      "Maaf, kursi berikut baru saja dipesan orang lain: " +
        conflict.join(", ") +
        ".\nSilakan pilih kursi lain."
    );
    renderSeatMap(); // refresh denah, buang kursi yang bentrok
    state.seats = state.seats.filter((s) => !bookedNow.includes(s));
    updateSeatSelectionUI();
    showStep("seat");
    return;
  }

  // Simpan booking.
  const booking = {
    id: generateBookingId(),
    nama: nama,
    filmId: film.id,
    filmJudul: film.judul,
    scheduleId: schedule.id,
    jam: schedule.jam,
    seats: [...state.seats].sort(),
    createdAt: new Date().toISOString(),
  };
  saveBooking(booking);

  renderSuccess(booking);
  renderBookings();
  showStep("success");
}

function renderSuccess(booking) {
  els.successDetail.innerHTML = `
    <dt>Nama</dt><dd>${escapeHtml(booking.nama)}</dd>
    <dt>Film</dt><dd>${booking.filmJudul}</dd>
    <dt>Jadwal</dt><dd>${booking.jam}</dd>
    <dt>Kursi</dt><dd>${booking.seats.join(", ")}</dd>
  `;
}

// ---------- Daftar booking (FR-07) ----------

function renderBookings() {
  const bookings = getBookings();
  if (bookings.length === 0) {
    els.bookingsList.innerHTML =
      '<p class="empty-text">Belum ada booking. Silakan lakukan booking pertama Anda.</p>';
    return;
  }
  // Tampilkan terbaru di atas.
  els.bookingsList.innerHTML = "";
  [...bookings].reverse().forEach((b) => {
    const item = document.createElement("div");
    item.className = "booking-item";
    item.innerHTML = `
      <span class="b-name">${escapeHtml(b.nama)}</span>
      <span class="b-film">${escapeHtml(b.filmJudul)}</span>
      <span class="b-meta">Jadwal ${b.jam}</span>
      <span class="b-seats">🎟 ${(b.seats || []).join(", ")}</span>
    `;
    els.bookingsList.appendChild(item);
  });
}

// ---------- Util ----------

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function resetFlow() {
  state.film = null;
  state.schedule = null;
  state.seats = [];
  showStep("film");
}

// ---------- Event listener global ----------

// Tombol "kembali" antar step.
document.querySelectorAll(".btn-back").forEach((btn) => {
  btn.addEventListener("click", () => showStep(btn.dataset.back));
});

els.toConfirmBtn.addEventListener("click", () => {
  renderSummary();
  showStep("confirm");
});

els.bookBtn.addEventListener("click", handleBooking);
els.bookAgainBtn.addEventListener("click", resetFlow);

// Sembunyikan error saat user mulai mengetik.
els.nameInput.addEventListener("input", () => {
  if (els.nameInput.value.trim()) els.nameError.classList.add("hidden");
});

// ---------- Inisialisasi (muat data dari Local Storage) ----------

renderFilms();
renderBookings();
showStep("film");
