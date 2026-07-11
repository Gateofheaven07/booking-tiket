// app.js — Logika utama CinemaGo.
// Alur: film → jadwal → kursi → nama/konfirmasi → booking → daftar.

const state = {
  film: null,
  schedule: null,
  seats: [],
};

const els = {
  steps: {
    film: document.getElementById("step-film"),
    schedule: document.getElementById("step-schedule"),
    seat: document.getElementById("step-seat"),
    confirm: document.getElementById("step-confirm"),
    success: document.getElementById("step-success"),
  },
  filmGrid: document.getElementById("filmGrid"),
  filmHero: document.getElementById("filmHero"),
  scheduleList: document.getElementById("scheduleList"),
  seatContext: document.getElementById("seatContext"),
  seatMap: document.getElementById("seatMap"),
  summaryContent: document.getElementById("summaryContent"),
  nameInput: document.getElementById("nameInput"),
  nameError: document.getElementById("nameError"),
  ticketCard: document.getElementById("ticketCard"),
  bookAgainBtn: document.getElementById("bookAgainBtn"),
  bookingsList: document.getElementById("bookingsList"),
  bookingsPanel: document.getElementById("bookingsPanel"),
  stepsIndicator: document.getElementById("stepsIndicator"),
  topbarStep: document.getElementById("topbarStep"),
  actionBar: document.getElementById("actionBar"),
  actionLabel: document.getElementById("actionLabel"),
  actionValue: document.getElementById("actionValue"),
  actionBtn: document.getElementById("actionBtn"),
};

let currentStep = "film";

// ---------- Navigasi antar-step ----------

function showStep(stepName) {
  currentStep = stepName;
  Object.entries(els.steps).forEach(([name, el]) => {
    el.classList.toggle("hidden", name !== stepName);
  });
  // Panel daftar booking hanya tampil di step film (home).
  els.bookingsPanel.classList.toggle("hidden", stepName !== "film");
  updateIndicator(stepName);
  updateActionBar();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateIndicator(stepName) {
  const order = { film: 1, schedule: 2, seat: 3, confirm: 4, success: 4 };
  const current = order[stepName] || 1;
  const labels = { 1: "Pilih Film", 2: "Pilih Jadwal", 3: "Pilih Kursi", 4: "Konfirmasi" };
  els.topbarStep.textContent = "Langkah " + current + "/4 · " + labels[current];
  els.stepsIndicator.querySelectorAll("li").forEach((li) => {
    const n = Number(li.dataset.step);
    li.classList.toggle("active", n === current);
    li.classList.toggle("done", n < current);
  });
}

// Action bar kontekstual (muncul di step kursi & konfirmasi).
function updateActionBar() {
  if (currentStep === "seat") {
    els.actionBar.classList.remove("hidden");
    els.actionLabel.textContent = "Kursi Dipilih";
    const sorted = [...state.seats].sort();
    els.actionValue.textContent = sorted.length ? sorted.join(", ") : "-";
    els.actionBtn.textContent = "Lanjut ke Konfirmasi";
    els.actionBtn.disabled = state.seats.length === 0;
    els.actionBtn.onclick = goToConfirm;
  } else if (currentStep === "confirm") {
    els.actionBar.classList.remove("hidden");
    els.actionLabel.textContent = "Total Kursi";
    els.actionValue.textContent = state.seats.length + " kursi";
    els.actionBtn.textContent = "Booking Sekarang";
    els.actionBtn.disabled = false;
    els.actionBtn.onclick = handleBooking;
  } else {
    els.actionBar.classList.add("hidden");
  }
}

// ---------- STEP 1: Daftar film ----------

function renderFilms() {
  els.filmGrid.innerHTML = "";
  FILMS.forEach((film) => {
    const card = document.createElement("div");
    card.className = "film-card";
    card.innerHTML = `
      <div class="poster-wrap">
        <img src="${film.poster}" alt="Poster ${escapeHtml(film.judul)}" loading="lazy" />
        <span class="poster-rating">★ ${film.rating}</span>
      </div>
      <div class="film-body">
        <h3>${escapeHtml(film.judul)}</h3>
        <p class="film-meta">${escapeHtml(film.genre)}</p>
        <p class="film-meta">⏱ ${film.durasi}</p>
      </div>
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
  els.filmHero.innerHTML = `
    <img src="${film.poster}" alt="Poster ${escapeHtml(film.judul)}" />
    <div class="hero-info">
      <span class="hero-badge">★ ${film.rating}</span>
      <h3>${escapeHtml(film.judul)}</h3>
      <p class="hero-meta">${escapeHtml(film.genre)}</p>
      <p class="hero-meta">⏱ ${film.durasi}</p>
    </div>
  `;
  els.scheduleList.innerHTML = "";
  film.schedules.forEach((sch) => {
    const btn = document.createElement("button");
    btn.className = "schedule-btn";
    btn.innerHTML = `${sch.jam}<small>Studio 1</small>`;
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
  els.seatContext.textContent = `${film.judul} · Jadwal ${schedule.jam}`;

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

  updateActionBar();
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
  updateActionBar();
}

// ---------- STEP 4: Nama & konfirmasi ----------

function goToConfirm() {
  renderSummary();
  showStep("confirm");
}

function renderSummary() {
  const { film, schedule, seats } = state;
  const sorted = [...seats].sort();
  els.summaryContent.innerHTML = `
    <dt>Film</dt><dd>${escapeHtml(film.judul)}</dd>
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

  // Validasi ganda: kursi mungkin sudah keburu dipesan (mis. tab lain).
  const bookedNow = getBookedSeats(film.id, schedule.id);
  const conflict = state.seats.filter((s) => bookedNow.includes(s));
  if (conflict.length > 0) {
    alert(
      "Maaf, kursi berikut baru saja dipesan: " +
        conflict.join(", ") +
        ".\nSilakan pilih kursi lain."
    );
    state.seats = state.seats.filter((s) => !bookedNow.includes(s));
    renderSeatMap();
    showStep("seat");
    return;
  }

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

  renderTicket(booking);
  renderBookings();
  showStep("success");
}

function renderTicket(booking) {
  els.ticketCard.innerHTML = `
    <dl>
      <dt>Nama</dt><dd>${escapeHtml(booking.nama)}</dd>
      <dt>Film</dt><dd>${escapeHtml(booking.filmJudul)}</dd>
      <dt>Jadwal</dt><dd>${booking.jam}</dd>
      <dt>Kursi</dt><dd>${booking.seats.join(", ")}</dd>
    </dl>
  `;
}

// ---------- Daftar booking (FR-07) ----------

function renderBookings() {
  const bookings = getBookings();
  if (bookings.length === 0) {
    els.bookingsList.innerHTML =
      '<p class="empty-text">Belum ada booking. Yuk pesan tiket pertamamu!</p>';
    return;
  }
  els.bookingsList.innerHTML = "";
  [...bookings].reverse().forEach((b) => {
    const item = document.createElement("div");
    item.className = "booking-item";
    item.innerHTML = `
      <div class="bi-top">
        <span class="b-name">${escapeHtml(b.nama)}</span>
        <span class="b-jam">🕐 ${b.jam}</span>
      </div>
      <div class="b-film">${escapeHtml(b.filmJudul)}</div>
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

document.querySelectorAll(".btn-back").forEach((btn) => {
  btn.addEventListener("click", () => showStep(btn.dataset.back));
});

els.bookAgainBtn.addEventListener("click", resetFlow);

els.nameInput.addEventListener("input", () => {
  if (els.nameInput.value.trim()) els.nameError.classList.add("hidden");
});

// Bottom navigation.
document.querySelectorAll(".nav-item").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach((n) => n.classList.remove("active"));
    btn.classList.add("active");
    const nav = btn.dataset.nav;
    if (nav === "home") {
      resetFlow();
    } else if (nav === "bookings") {
      resetFlow();
      els.bookingsPanel.scrollIntoView({ behavior: "smooth" });
    } else if (nav === "info") {
      alert(
        "CinemaGo — aplikasi simulasi booking kursi bioskop.\n\n" +
          "Data booking disimpan di Local Storage browser. " +
          "Tanpa login, tanpa server. Menghapus data browser akan menghapus semua booking."
      );
    }
  });
});

// ---------- Inisialisasi ----------

renderFilms();
renderBookings();
showStep("film");
