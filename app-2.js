(() => {
  "use strict";

  const TRIP = window.ROAD_TRIP;
  const STORAGE_KEY = "northwest-road-trip-2026-state-v1";
  const VALID_VIEWS = ["home", "itinerary", "route", "lists", "more"];
  const defaultState = {
    schema: 1,
    checks: {},
    completedDays: {},
    hotels: clone(TRIP.reservations || {}),
    notes: { general: "", daily: {} },
    customItems: { shopping: [], packing: [], border: [] },
    activeList: "shopping"
  };

  let state = loadState();
  let itineraryFilter = "all";
  let deferredInstallPrompt = null;
  let toastTimer = null;
  let noteSaveTimer = null;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function mergeState(saved) {
    const next = clone(defaultState);
    if (!saved || typeof saved !== "object") return next;
    next.checks = saved.checks && typeof saved.checks === "object" ? saved.checks : {};
    next.completedDays = saved.completedDays && typeof saved.completedDays === "object" ? saved.completedDays : {};
    next.hotels = { ...(TRIP.reservations || {}), ...(saved.hotels && typeof saved.hotels === "object" ? saved.hotels : {}) };
    next.notes = {
      general: saved.notes && typeof saved.notes.general === "string" ? saved.notes.general : "",
      daily: saved.notes && saved.notes.daily && typeof saved.notes.daily === "object" ? saved.notes.daily : {}
    };
    next.customItems = {
      shopping: saved.customItems && Array.isArray(saved.customItems.shopping) ? saved.customItems.shopping : [],
      packing: saved.customItems && Array.isArray(saved.customItems.packing) ? saved.customItems.packing : [],
      border: saved.customItems && Array.isArray(saved.customItems.border) ? saved.customItems.border : []
    };
    next.activeList = ["shopping", "packing", "border"].includes(saved.activeList) ? saved.activeList : "shopping";
    return next;
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return mergeState(saved);
    } catch (error) {
      console.warn("Could not read saved trip data", error);
      return clone(defaultState);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Could not save trip data", error);
      showToast("This browser could not save the latest change.");
    }
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function parseDate(iso) {
    return new Date(`${iso}T12:00:00`);
  }

  function todayLocal() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);
  }

  function sameDate(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  function daysBetween(from, to) {
    const dayMs = 86400000;
    return Math.ceil((to.getTime() - from.getTime()) / dayMs);
  }

  function formatDate(iso, options = { weekday: "long", month: "long", day: "numeric" }) {
    return new Intl.DateTimeFormat("en-CA", options).format(parseDate(iso));
  }

  function dateParts(iso) {
    const date = parseDate(iso);
    return {
      month: new Intl.DateTimeFormat("en-CA", { month: "short" }).format(date),
      day: new Intl.DateTimeFormat("en-CA", { day: "numeric" }).format(date)
    };
  }

  function getTripPhase() {
    const today = todayLocal();
    const start = parseDate(TRIP.startDate);
    const end = parseDate(TRIP.endDate);
    if (today < start) return "before";
    if (today > end) return "after";
    return "during";
  }

  function getCurrentOrNextDay() {
    const today = todayLocal();
    const exact = TRIP.days.find((day) => sameDate(parseDate(day.date), today));
    if (exact) return exact;
    const upcoming = TRIP.days.find((day) => parseDate(day.date) > today);
    return upcoming || TRIP.days[TRIP.days.length - 1];
  }

  function getDayStatus(day) {
    const today = todayLocal();
    const date = parseDate(day.date);
    if (sameDate(date, today)) return "current";
    if (date < today) return "past";
    return "future";
  }

  function showToast(message, duration = 2600) {
    const toast = $("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), duration);
  }

  function setView(view, options = {}) {
    if (!VALID_VIEWS.includes(view)) view = "home";
    $$(".view").forEach((element) => element.classList.toggle("active", element.dataset.view === view));
    $$(".nav-button").forEach((button) => {
      const active = button.dataset.nav === view;
      button.classList.toggle("active", active);
      if (active) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
    history.replaceState(null, "", `#${view}`);
    if (!options.keepScroll) window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function googleDirections(stops) {
    const cleaned = stops.filter(Boolean);
    if (cleaned.length < 2) return googleSearch(cleaned[0] || "");
    const params = new URLSearchParams({
      api: "1",
      origin: cleaned[0],
      destination: cleaned[cleaned.length - 1],
      travelmode: "driving"
    });
    if (cleaned.length > 2) params.set("waypoints", cleaned.slice(1, -1).join("|"));
    return `https://www.google.com/maps/dir/?${params.toString()}`;
  }

  function appleDirections(start, end) {
    const params = new URLSearchParams({ saddr: start, daddr: end, dirflg: "d" });
    return `https://maps.apple.com/?${params.toString()}`;
  }

  function googleSearch(query) {
    const params = new URLSearchParams({ api: "1", query });
    return `https://www.google.com/maps/search/?${params.toString()}`;
  }

  function renderStats() {
    $("#trip-stats").innerHTML = TRIP.stats
      .map((stat) => `<div class="stat-item"><strong>${escapeHtml(stat.value)}</strong><span>${escapeHtml(stat.label)}</span></div>`)
      .join("");
    $("#hero-subtitle").textContent = TRIP.subtitle;
    $("#app-version").textContent = TRIP.version;
  }

  function renderCountdown() {
    const phase = getTripPhase();
    const today = todayLocal();
    const start = parseDate(TRIP.startDate);
    const end = parseDate(TRIP.endDate);
    const label = $("#trip-state-label");
    const card = $("#countdown-card");

    if (phase === "before") {
      const days = Math.max(0, daysBetween(today, start));
      label.textContent = `${days} day${days === 1 ? "" : "s"} to departure`;
      card.innerHTML = `
        <div class="countdown-number">${days}</div>
        <div class="countdown-copy">
          <strong>${days === 1 ? "Departure is tomorrow" : "Departure countdown"}</strong>
          <span>Leave Edmonton at 6:00 PM on Thursday, July 30.</span>
        </div>`;
    } else if (phase === "during") {
      const tripDay = Math.floor((today - start) / 86400000) + 1;
      const remaining = Math.max(0, daysBetween(today, end));
      label.textContent = `Trip day ${tripDay}`;
      card.innerHTML = `
        <div class="countdown-number">${tripDay}</div>
        <div class="countdown-copy">
          <strong>Today is road-trip day ${tripDay}</strong>
          <span>${remaining === 0 ? "Home day." : `${remaining} day${remaining === 1 ? "" : "s"} remain after today.`}</span>
        </div>`;
    } else {
      label.textContent = "Trip complete";
      card.innerHTML = `
        <div class="countdown-number">10</div>
        <div class="countdown-copy">
          <strong>The loop is complete</strong>
          <span>Keep the notes and checkmarks as a trip record, or export a final backup.</span>
        </div>`;
    }
  }

  function renderNextDay() {
    const day = getCurrentOrNextDay();
    const parts = dateParts(day.date);
    const status = getDayStatus(day);
    const actionLabel = status === "current" ? "Open today's plan" : status === "past" ? "Open final day" : "Open this day";
    $("#next-day-card").innerHTML = `
      <article class="next-card">
        <div class="next-card-top">
          <div class="date-tile"><span>${escapeHtml(parts.month)}</span><strong>${escapeHtml(parts.day)}</strong></div>
          <div class="next-card-copy">
            <h3>${escapeHtml(day.title)}</h3>
            <p>${escapeHtml(day.summary)}</p>
            <div class="route-line-text"><span>${escapeHtml(day.start)}</span><span class="route-arrow">to</span><span>${escapeHtml(day.end)}</span></div>
            <button class="text-button" type="button" data-open-day="${escapeHtml(day.id)}">${actionLabel}</button>
          </div>
        </div>
        <div class="next-card-meta">
          <span><strong>${escapeHtml(day.distanceKm ? `${day.distanceKm} km` : "Local")}</strong>Distance</span>
          <span><strong>${escapeHtml(day.driveTime)}</strong>Drive estimate</span>
        </div>
      </article>`;
  }

  function getReadiness() {
    const hotelDays = TRIP.days.filter((day) => day.overnight !== "Home");
    const reminderDone = TRIP.reminders.filter((item) => state.checks[`reminder:${item.id}`]).length;
    const hotelsDone = hotelDays.filter((day) => state.hotels[day.id] && state.hotels[day.id].name).length;
    const total = TRIP.reminders.length + hotelDays.length;
    const done = reminderDone + hotelsDone;
    return { done, total, percent: total ? Math.round((done / total) * 100) : 0 };
  }

  function renderReminders() {
    $("#reminders-list").innerHTML = TRIP.reminders
      .map((item) => {
        const key = `reminder:${item.id}`;
        return `<div class="compact-check">
          <input id="${key}" type="checkbox" data-check-key="${key}" ${state.checks[key] ? "checked" : ""}>
          <label for="${key}">${escapeHtml(item.text)}</label>
        </div>`;
      })
      .join("");
    updateReadiness();
  }

  function updateReadiness() {
    const readiness = getReadiness();
    $("#readiness-label").textContent = `${readiness.percent}%`;
    $("#readiness-bar").style.width = `${readiness.percent}%`;
  }

  function timelineHtml(items) {
    return `<div class="timeline">${items
      .map(
        (item) => `<div class="timeline-item">
          <div class="timeline-time">${escapeHtml(item.time)}</div>
          <div class="timeline-copy"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.detail)}</span></div>
        </div>`
      )
      .join("")}</div>`;
  }

  function listHtml(items) {
    return `<ul class="clean-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  }

  function dayCardHtml(day, index) {
    const completed = Boolean(state.completedDays[day.id]);
    const status = getDayStatus(day);
    const hotel = state.hotels[day.id] || {};
    const hotelSummary = day.overnight === "Home"
      ? "Home"
      : hotel.name
        ? `${hotel.name}${hotel.confirmation ? ` - confirmation saved` : ""}`
        : `Not entered - ${day.hotelHint}`;
    const dailyNote = state.notes.daily[day.id] || "";
    const open = status === "current" || (getTripPhase() === "before" && index === 0);
    return `<details class="day-card ${completed ? "completed" : ""} ${status === "current" ? "current" : ""}" data-day-id="${escapeHtml(day.id)}" data-tone="${escapeHtml(day.tone)}" ${open ? "open" : ""}>
      <summary>
        <div class="day-number">${index + 1}</div>
        <div class="day-summary-copy">
          <strong>${escapeHtml(day.shortDate)} - ${escapeHtml(day.title)}</strong>
          <span>${escapeHtml(day.distanceKm ? `${day.distanceKm} km` : "Local day")} - ${escapeHtml(day.overnight)}</span>
        </div>
        <span class="day-summary-badge">Done</span>
      </summary>
      <div class="day-body">
        <div class="day-hero">
          <p>${escapeHtml(day.summary)}</p>
          <div class="route-line-text"><span>${escapeHtml(day.start)}</span><span class="route-arrow">to</span><span>${escapeHtml(day.end)}</span></div>
          <div class="meta-grid">
            <div class="meta-box"><span>Distance</span><strong>${escapeHtml(day.distanceKm ? `${day.distanceKm} km` : "Local")}</strong></div>
            <div class="meta-box"><span>Driving</span><strong>${escapeHtml(day.driveTime)}</strong></div>
            <div class="meta-box"><span>Leave</span><strong>${escapeHtml(day.departure)}</strong></div>
            <div class="meta-box"><span>Overnight</span><strong>${escapeHtml(day.overnight)}</strong></div>
          </div>
        </div>

        <div class="day-section">
          <div class="day-section-title">Plan</div>
          ${timelineHtml(day.timeline)}
        </div>

        <div class="day-section">
          <div class="day-section-title">Must do</div>
          ${listHtml(day.mustDo)}
        </div>

        ${day.optional.length ? `<div class="day-section"><div class="day-section-title">If time allows</div>${listHtml(day.optional)}</div>` : ""}

        ${day.alerts.map((alert) => `<div class="alert-box">${escapeHtml(alert)}</div>`).join("")}

        <div class="day-section">
          <div class="day-section-title">Stay</div>
          <p class="supporting-copy">${escapeHtml(hotelSummary)}</p>
        </div>

        <div class="day-actions">
          <a class="primary-button" href="${escapeHtml(googleDirections(day.stops))}" target="_blank" rel="noopener">Google Maps</a>
          <a class="secondary-button" href="${escapeHtml(appleDirections(day.start, day.end))}" target="_blank" rel="noopener">Apple Maps</a>
          ${day.overnight !== "Home" ? `<button class="secondary-button full-row" type="button" data-edit-hotel="${escapeHtml(day.id)}">Edit this stay</button>` : ""}
        </div>

        <div class="day-section daily-notes-section">
          <label class="day-section-title" for="note-${escapeHtml(day.id)}">Day notes</label>
          <textarea id="note-${escapeHtml(day.id)}" class="daily-notes" data-daily-note="${escapeHtml(day.id)}" rows="3" placeholder="Parking details, favourite moment, change of plan...">${escapeHtml(dailyNote)}</textarea>
        </div>

        <div class="day-complete-row">
          <span class="supporting-copy">${escapeHtml(day.timeZoneNote)}</span>
          <label><input type="checkbox" data-complete-day="${escapeHtml(day.id)}" ${completed ? "checked" : ""}> Day done</label>
        </div>
      </div>
    </details>`;
  }

  function filteredDays() {
    if (itineraryFilter === "upcoming") {
      return TRIP.days.filter((day) => ["current", "future"].includes(getDayStatus(day)));
    }
    if (itineraryFilter === "incomplete") {
      return TRIP.days.filter((day) => !state.completedDays[day.id]);
    }
    return TRIP.days;
  }

  function renderItinerary() {
    const days = filteredDays();
    $("#itinerary-list").innerHTML = days.length
      ? days.map((day) => dayCardHtml(day, TRIP.days.indexOf(day))).join("")
      : `<div class="empty-state">No days match this filter.</div>`;
    $$(".chip[data-filter]").forEach((button) => button.classList.toggle("active", button.dataset.filter === itineraryFilter));
  }

  function renderRouteMap() {
    const width = 760;
    const height = 420;
    const padX = 60;
    const padY = 42;
    const lons = TRIP.routeOverview.map((stop) => stop.lon);
    const lats = TRIP.routeOverview.map((stop) => stop.lat);
    const minLon = Math.min(...lons) - 0.35;
    const maxLon = Math.max(...lons) + 0.35;
    const minLat = Math.min(...lats) - 0.35;
    const maxLat = Math.max(...lats) + 0.35;
    const toPoint = (stop) => ({
      x: padX + ((stop.lon - minLon) / (maxLon - minLon)) * (width - padX * 2),
      y: height - padY - ((stop.lat - minLat) / (maxLat - minLat)) * (height - padY * 2)
    });
    const points = TRIP.routeOverview.map((stop) => ({ stop, ...toPoint(stop) }));
    const path = points.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");
    const labelOffsets = {
      edmonton: [10, -10],
      lethbridge: [10, -9],
      glacier: [10, -8],
      missoula: [10, 16],
      silverwood: [10, 21],
      coeurdalene: [10, 15],
      spokanevalley: [-105, 15],
      sandpoint: [10, -20],
      nelson: [10, -10],
      penticton: [-70, -10],
      clearwater: [-82, -10],
      hinton: [10, -10],
      berwyn: [10, 15]
    };
    const labels = points
      .map(({ stop, x, y }) => {
        const offset = labelOffsets[stop.id] || [10, -10];
        return `<g>
          <circle class="map-pin-ring" cx="${x}" cy="${y}" r="8"></circle>
          <circle class="map-pin-core ${escapeHtml(stop.type)}" cx="${x}" cy="${y}" r="4.5"></circle>
          <text class="map-stop-label" x="${x + offset[0]}" y="${y + offset[1]}">${escapeHtml(stop.name)}</text>
        </g>`;
      })
      .join("");

    $("#route-map").innerHTML = `<svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <text class="map-region-label" x="590" y="82">AB</text>
      <text class="map-region-label" x="105" y="110">BC</text>
      <text class="map-region-label" x="500" y="315">MT</text>
      <text class="map-region-label" x="275" y="315">ID</text>
      <text class="map-region-label" x="82" y="325">WA</text>
      <polyline class="map-route-shadow" points="${path}"></polyline>
      <polyline class="map-route-line" points="${path}"></polyline>
      ${labels}
    </svg>`;
  }

  function renderRouteDayList() {
    $("#route-day-list").innerHTML = TRIP.days
      .map(
        (day) => `<div class="route-day-row">
          <div class="route-day-date">${escapeHtml(day.shortDate)}</div>
          <div class="route-day-copy"><strong>${escapeHtml(day.title)}</strong><span>${escapeHtml(day.driveTime)}</span></div>
          <a class="small-map-button" href="${escapeHtml(googleDirections(day.stops))}" target="_blank" rel="noopener" aria-label="Open ${escapeHtml(day.title)} in Google Maps">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path></svg>
          </a>
        </div>`
      )
      .join("");
  }

  function getListGroups(type) {
    let groups;
    if (type === "border") {
      groups = [{ category: "Crossing checklist", items: TRIP.borderChecklist }];
    } else {
      groups = clone(TRIP[type]);
    }
    const custom = state.customItems[type] || [];
    if (custom.length) groups.push({ category: "Added by you", items: custom.map((item) => ({ ...item, custom: true })) });
    return groups;
  }

  function getListItems(type) {
    return getListGroups(type).flatMap((group) => group.items);
  }

  function renderListProgress(type) {
    const items = getListItems(type);
    const done = items.filter((item) => state.checks[`${type}:${item.id}`]).length;
    const percent = items.length ? Math.round((done / items.length) * 100) : 0;
    const title = type === "shopping" ? "Shopping list" : type === "packing" ? "Packing list" : "Border checklist";
    $("#list-progress-wrap").innerHTML = `<div class="list-progress-card">
      <div class="progress-ring" style="--progress:${percent * 3.6}deg" data-label="${percent}%"></div>
      <div class="list-progress-copy"><strong>${title}</strong><span>${done} of ${items.length} complete</span></div>
    </div>`;
  }

  function renderChecklist() {
    const type = state.activeList;
    $$("[data-list-tab]").forEach((button) => button.setAttribute("aria-selected", String(button.dataset.listTab === type)));
    const groups = getListGroups(type);
    $("#checklist-content").innerHTML = `<div class="checklist-groups">${groups
      .map(
        (group) => `<section class="check-group">
          <h2>${escapeHtml(group.category)}</h2>
          ${group.items
            .map((item) => {
              const key = `${type}:${item.id}`;
              return `<div class="check-row">
                <input id="check-${escapeHtml(key)}" type="checkbox" data-check-key="${escapeHtml(key)}" ${state.checks[key] ? "checked" : ""}>
                <label class="check-copy" for="check-${escapeHtml(key)}">
                  <span class="check-title">${escapeHtml(item.name)}</span>
                  ${item.detail ? `<span class="check-detail">${escapeHtml(item.detail)}</span>` : ""}
                </label>
                ${item.query ? `<a class="check-map-link" href="${escapeHtml(googleSearch(item.query))}" target="_blank" rel="noopener">Map</a>` : ""}
                ${item.custom ? `<button class="delete-item-button" type="button" data-delete-custom="${escapeHtml(type)}:${escapeHtml(item.id)}" aria-label="Delete ${escapeHtml(item.name)}">Delete</button>` : ""}
              </div>`;
            })
            .join("")}
        </section>`
      )
      .join("")}</div>`;
    renderListProgress(type);
    $("#custom-item-input").placeholder = type === "shopping" ? "Add a store or purchase" : type === "packing" ? "Add something to pack" : "Add a border reminder";
  }

  function renderHotels() {
    const nights = TRIP.days.filter((day) => day.overnight !== "Home");
    $("#hotel-list").innerHTML = nights
      .map((day) => {
        const hotel = state.hotels[day.id] || {};
        const saved = Boolean(hotel.name);
        const detail = saved
          ? [hotel.address, hotel.confirmation ? `Confirmation ${hotel.confirmation}` : ""].filter(Boolean).join(" - ") || "Stay details saved"
          : day.hotelHint;
        return `<article class="hotel-card">
          <div class="hotel-date">${escapeHtml(day.shortDate)}</div>
          <div class="hotel-copy">
            <strong>${escapeHtml(saved ? hotel.name : day.overnight)}</strong>
            <span>${escapeHtml(detail)}</span>
            <em class="hotel-status ${saved ? "saved" : ""}">${saved ? "Saved" : "Needs booking details"}</em>
            ${saved ? `<div class="hotel-links">
              ${hotel.address ? `<a href="${escapeHtml(googleSearch(hotel.address))}" target="_blank" rel="noopener">Map</a>` : ""}
              ${hotel.website ? `<a href="${escapeHtml(hotel.website)}" target="_blank" rel="noopener">Website</a>` : ""}
              ${hotel.phone ? `<a href="tel:${escapeHtml(hotel.phone.replace(/[^+\d]/g, ""))}">Call</a>` : ""}
            </div>` : ""}
          </div>
          <button class="edit-hotel-button" type="button" data-edit-hotel="${escapeHtml(day.id)}" aria-label="Edit stay for ${escapeHtml(day.shortDate)}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4l11-11-4-4L4 16v4zM13.5 6.5l4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg>
          </button>
        </article>`;
      })
      .join("");
    updateReadiness();
  }

  function openHotelDialog(dayId) {
    const day = TRIP.days.find((item) => item.id === dayId);
    if (!day || day.overnight === "Home") return;
    const hotel = state.hotels[dayId] || {};
    $("#hotel-dialog-title").textContent = `${day.shortDate} - ${day.overnight}`;
    $("#hotel-day-id").value = dayId;
    $("#hotel-name").value = hotel.name || "";
    $("#hotel-address").value = hotel.address || "";
    $("#hotel-confirmation").value = hotel.confirmation || "";
    $("#hotel-phone").value = hotel.phone || "";
    $("#hotel-website").value = hotel.website || "";
    $("#hotel-checkin").value = hotel.checkin || "";
    $("#hotel-checkout").value = hotel.checkout || "";
    $("#hotel-notes").value = hotel.notes || "";
    const dialog = $("#hotel-dialog");
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    setTimeout(() => $("#hotel-name").focus(), 80);
  }

  function closeHotelDialog() {
    const dialog = $("#hotel-dialog");
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }

  function saveHotel(event) {
    event.preventDefault();
    const dayId = $("#hotel-day-id").value;
    if (!dayId) return;
    state.hotels[dayId] = {
      name: $("#hotel-name").value.trim(),
      address: $("#hotel-address").value.trim(),
      confirmation: $("#hotel-confirmation").value.trim(),
      phone: $("#hotel-phone").value.trim(),
      website: $("#hotel-website").value.trim(),
      checkin: $("#hotel-checkin").value,
      checkout: $("#hotel-checkout").value,
      notes: $("#hotel-notes").value.trim()
    };
    saveState();
    closeHotelDialog();
    renderHotels();
    renderItinerary();
    showToast("Stay details saved on this device.");
  }

  function renderLiveChecks() {
    $("#live-checks-list").innerHTML = TRIP.liveChecks
      .map(
        (item) => `<a class="live-check-card" href="${escapeHtml(item.url)}" target="_blank" rel="noopener">
          <span class="live-check-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14L21 3m0 0h-7m7 0v7M19 13v7H4V5h7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>
          <span class="live-check-copy"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.note)}</span><small>${escapeHtml(item.verified)}</small></span>
        </a>`
      )
      .join("");
  }

  function renderNotes() {
    $("#general-notes").value = state.notes.general || "";
  }

  function saveGeneralNotes() {
    state.notes.general = $("#general-notes").value;
    saveState();
    const status = $("#notes-save-status");
    status.textContent = "Saved locally";
    clearTimeout(noteSaveTimer);
    noteSaveTimer = setTimeout(() => {
      status.textContent = "";
    }, 1500);
  }

  function saveDailyNote(dayId, value) {
    state.notes.daily[dayId] = value;
    saveState();
  }

  function renderInstallHelp() {
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
    const help = $("#install-help");
    if (isStandalone) {
      help.innerHTML = `<strong>Installed.</strong><p>This app is running from the Home Screen. Open it online once after each published update so the new files can cache.</p>`;
    } else if (isIos) {
      help.innerHTML = `<strong>Install on iPhone</strong><ol><li>Open the published site in Safari.</li><li>Tap the Share button.</li><li>Choose Add to Home Screen, then Add.</li><li>Open the new icon once while online to finish caching.</li></ol>`;
    } else {
      help.innerHTML = `<strong>Install this PWA</strong><p>Use the browser install button when available. After the first online load, the itinerary and saved data remain available offline.</p>`;
    }
  }

  function renderAll() {
    renderStats();
    renderCountdown();
    renderNextDay();
    renderReminders();
    renderItinerary();
    renderRouteMap();
    renderRouteDayList();
    renderChecklist();
    renderHotels();
    renderNotes();
    renderLiveChecks();
    renderInstallHelp();
  }

  function openDay(dayId) {
    itineraryFilter = "all";
    renderItinerary();
    setView("itinerary");
    requestAnimationFrame(() => {
      const card = $(`[data-day-id="${CSS.escape(dayId)}"]`);
      if (!card) return;
      card.open = true;
      card.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function updateNetworkStatus() {
    const online = navigator.onLine;
    const element = $("#network-status");
    element.textContent = online ? "Online" : "Offline";
    element.classList.toggle("online", online);
    element.classList.toggle("offline", !online);
  }

  function buildBackup() {
    return {
      app: TRIP.appId,
      appVersion: TRIP.version,
      exportedAt: new Date().toISOString(),
      state
    };
  }

  function exportBackup() {
    const backup = JSON.stringify(buildBackup(), null, 2);
    const blob = new Blob([backup], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `northwest-road-trip-backup-${date}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast("Trip backup created.");
  }

  async function importBackup(file) {
    if (!file) return;
    try {
      const text = await file.text();
      const backup = JSON.parse(text);
      if (backup.app !== TRIP.appId || !backup.state) throw new Error("This is not a Northwest Road Trip backup.");
      state = mergeState(backup.state);
      saveState();
      renderAll();
      showToast("Trip backup restored.");
    } catch (error) {
      console.error(error);
      showToast(error.message || "The backup file could not be imported.", 4200);
    } finally {
      $("#import-file").value = "";
    }
  }

  function resetData() {
    const confirmed = window.confirm("Reset every checkmark, note, hotel, and custom item stored in this app?");
    if (!confirmed) return;
    state = clone(defaultState);
    saveState();
    renderAll();
    showToast("Local trip data reset.");
  }

  function addCustomItem(event) {
    event.preventDefault();
    const input = $("#custom-item-input");
    const name = input.value.trim();
    if (!name) return;
    const type = state.activeList;
    state.customItems[type].push({ id: `custom-${Date.now()}`, name });
    input.value = "";
    saveState();
    renderChecklist();
    showToast("Checklist item added.");
  }

  function deleteCustomItem(type, id) {
    state.customItems[type] = state.customItems[type].filter((item) => item.id !== id);
    delete state.checks[`${type}:${id}`];
    saveState();
    renderChecklist();
  }

  function handleCheckChange(input) {
    const key = input.dataset.checkKey;
    state.checks[key] = input.checked;
    saveState();
    if (key.startsWith("reminder:")) updateReadiness();
    if (["shopping", "packing", "border"].some((prefix) => key.startsWith(`${prefix}:`))) renderListProgress(state.activeList);
  }

  function handleCompletedDay(input) {
    const dayId = input.dataset.completeDay;
    state.completedDays[dayId] = input.checked;
    saveState();
    const card = input.closest(".day-card");
    if (card) card.classList.toggle("completed", input.checked);
    showToast(input.checked ? "Day marked complete." : "Day reopened.");
  }

  function openOverview(part) {
    const outbound = [
      "Edmonton, AB",
      "Lethbridge, AB",
      "Carway Border Crossing, AB",
      "St. Mary Visitor Center, Glacier National Park",
      "Logan Pass Visitor Center, Glacier National Park",
      "Lake McDonald Lodge, Glacier National Park",
      "Missoula, MT",
      "Silverwood Theme Park, Athol, ID",
      "Coeur d'Alene, ID",
      "Spokane Valley Mall, WA",
      "Sandpoint, ID"
    ];
    const returnRoute = [
      "Sandpoint, ID",
      "Nelson, BC",
      "Penticton, BC",
      "Clearwater, BC",
      "Helmcken Falls, Wells Gray Provincial Park",
      "Hinton, AB",
      "Berwyn, AB"
    ];
    window.open(googleDirections(part === 1 ? outbound : returnRoute), "_blank", "noopener");
  }

  function handleAction(action) {
    switch (action) {
      case "open-current-day":
        openDay(getCurrentOrNextDay().id);
        break;
      case "open-route":
        setView("route");
        break;
      case "open-itinerary":
        setView("itinerary");
        break;
      case "open-hotels":
        setView("more");
        setTimeout(() => $("#stays-section").scrollIntoView({ behavior: "smooth", block: "start" }), 120);
        break;
      case "open-lists":
        setView("lists");
        break;
      case "open-live-checks":
        setView("more");
        setTimeout(() => $("#live-checks-section").scrollIntoView({ behavior: "smooth", block: "start" }), 120);
        break;
      case "export-backup":
        exportBackup();
        break;
      case "open-google-overview-1":
        openOverview(1);
        break;
      case "open-google-overview-2":
        openOverview(2);
        break;
      case "print-trip":
        window.print();
        break;
      case "close-hotel-dialog":
        closeHotelDialog();
        break;
      case "reset-data":
        resetData();
        break;
      case "check-update":
        checkForUpdate();
        break;
      default:
        break;
    }
  }

  async function checkForUpdate() {
    if (!("serviceWorker" in navigator)) {
      showToast("Service workers are not available in this browser.");
      return;
    }
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        showToast("Publish the app over HTTPS before checking for updates.");
        return;
      }
      await registration.update();
      showToast("Update check complete. Reload if a new version was published.");
    } catch (error) {
      console.error(error);
      showToast("The update check could not be completed.");
    }
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator) || !/^https?:$/.test(location.protocol)) return;
    window.addEventListener("load", async () => {
      try {
        const registration = await navigator.serviceWorker.register("./service-worker.js", { scope: "./" });
        registration.addEventListener("updatefound", () => {
          const worker = registration.installing;
          if (!worker) return;
          worker.addEventListener("statechange", () => {
            if (worker.state === "installed" && navigator.serviceWorker.controller) {
              showToast("A new app version is ready. Reload to use it.", 5000);
            }
          });
        });
      } catch (error) {
        console.warn("Service worker registration failed", error);
      }
    });
  }

  function setupInstallPrompt() {
    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      deferredInstallPrompt = event;
      $("#install-button").classList.remove("hidden");
    });
    $("#install-button").addEventListener("click", async () => {
      if (!deferredInstallPrompt) {
        setView("more");
        setTimeout(() => $("#install-title").scrollIntoView({ behavior: "smooth", block: "start" }), 120);
        return;
      }
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      $("#install-button").classList.add("hidden");
    });
    window.addEventListener("appinstalled", () => {
      deferredInstallPrompt = null;
      $("#install-button").classList.add("hidden");
      renderInstallHelp();
      showToast("Road Trip 2026 installed.");
    });
  }

  function bindEvents() {
    document.addEventListener("click", (event) => {
      const nav = event.target.closest("[data-nav]");
      if (nav) {
        setView(nav.dataset.nav);
        return;
      }

      const action = event.target.closest("[data-action]");
      if (action) {
        handleAction(action.dataset.action);
        return;
      }

      const day = event.target.closest("[data-open-day]");
      if (day) {
        openDay(day.dataset.openDay);
        return;
      }

      const editHotel = event.target.closest("[data-edit-hotel]");
      if (editHotel) {
        openHotelDialog(editHotel.dataset.editHotel);
        return;
      }

      const filter = event.target.closest("[data-filter]");
      if (filter) {
        itineraryFilter = filter.dataset.filter;
        renderItinerary();
        return;
      }

      const listTab = event.target.closest("[data-list-tab]");
      if (listTab) {
        state.activeList = listTab.dataset.listTab;
        saveState();
        renderChecklist();
        return;
      }

      const deleteButton = event.target.closest("[data-delete-custom]");
      if (deleteButton) {
        const [type, id] = deleteButton.dataset.deleteCustom.split(":");
        deleteCustomItem(type, id);
      }
    });

    document.addEventListener("change", (event) => {
      const input = event.target;
      if (input.matches("[data-check-key]")) handleCheckChange(input);
      if (input.matches("[data-complete-day]")) handleCompletedDay(input);
      if (input.id === "import-file") importBackup(input.files[0]);
    });

    document.addEventListener("input", (event) => {
      const input = event.target;
      if (input.id === "general-notes") saveGeneralNotes();
      if (input.matches("[data-daily-note]")) saveDailyNote(input.dataset.dailyNote, input.value);
    });

    $("#custom-item-form").addEventListener("submit", addCustomItem);
    $("#hotel-form").addEventListener("submit", saveHotel);
    $("#hotel-dialog").addEventListener("click", (event) => {
      if (event.target === $("#hotel-dialog")) closeHotelDialog();
    });

    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);
    window.addEventListener("hashchange", () => {
      const view = location.hash.replace("#", "");
      if (VALID_VIEWS.includes(view)) setView(view, { keepScroll: true });
    });
  }

  function init() {
    if (!TRIP) {
      document.body.innerHTML = "<p>Trip data could not be loaded.</p>";
      return;
    }
    renderAll();
    bindEvents();
    updateNetworkStatus();
    setupInstallPrompt();
    registerServiceWorker();
    const initialView = location.hash.replace("#", "");
    setView(VALID_VIEWS.includes(initialView) ? initialView : "home", { keepScroll: true });
  }

  init();
})();
