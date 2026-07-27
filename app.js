(() => {
  "use strict";

  const DATA = window.BOBSX4_DATA;
  if (!DATA || !DATA.app || !Array.isArray(DATA.adventures)) {
    document.body.innerHTML = "<main style='padding:2rem;font-family:system-ui'>Road Companion data could not be loaded.</main>";
    return;
  }

  const APP = DATA.app;
  const STORAGE_KEY = "bobsx4-road-companion-state-v3";
  const LEGACY_STORAGE_KEYS = ["northwest-road-trip-2026-state-v1"];
  const MS_PER_DAY = 86400000;
  const VALID_VIEWS = ["home", "trip", "adventure", "memories", "settings"];
  const VALID_TRIP_TABS = ["days", "route", "stays", "lists"];
  const JOURNAL_FIELDS = ["favorite", "ate", "bought", "surprise", "note"];

  let state = loadState();
  let itineraryFilter = "all";
  let activeTripTab = "days";
  let deferredInstallPrompt = null;
  let toastTimer = null;
  let journalSaveTimer = null;
  let notesSaveTimer = null;
  const expandedDays = new Set();

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function sanitizeUrl(url) {
    if (!url) return "";
    try {
      const parsed = new URL(url, window.location.href);
      if (!["http:", "https:", "tel:"].includes(parsed.protocol)) return "";
      return parsed.href;
    } catch {
      return "";
    }
  }

  function makeProfileProgress() {
    return { days: {} };
  }

  function makeAdventureState(adventure) {
    const profileProgress = {};
    DATA.defaultProfiles.forEach((profile) => {
      profileProgress[profile.id] = makeProfileProgress();
    });
    return {
      checks: {},
      completedDays: {},
      hotels: clone(adventure.reservations || {}),
      notes: { general: "", daily: {} },
      customItems: { shopping: [], packing: [], border: [] },
      activeList: "shopping",
      selectedAdventureDayId: null,
      profileProgress
    };
  }

  function buildDefaultState() {
    const profiles = {};
    DATA.defaultProfiles.forEach((profile) => {
      profiles[profile.id] = clone(profile);
    });
    const adventures = {};
    DATA.adventures.forEach((adventure) => {
      adventures[adventure.id] = makeAdventureState(adventure);
    });
    return {
      schema: APP.dataSchema,
      activeAdventureId: DATA.adventures[0].id,
      activeProfileId: DATA.defaultProfiles[0].id,
      profiles,
      adventures
    };
  }

  function mergeAdventureState(base, saved, adventure) {
    const next = clone(base);
    if (!saved || typeof saved !== "object") return next;
    next.checks = saved.checks && typeof saved.checks === "object" ? saved.checks : {};
    next.completedDays = saved.completedDays && typeof saved.completedDays === "object" ? saved.completedDays : {};
    next.hotels = {
      ...(adventure.reservations || {}),
      ...(saved.hotels && typeof saved.hotels === "object" ? saved.hotels : {})
    };
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
    next.selectedAdventureDayId = adventure.days.some((day) => day.id === saved.selectedAdventureDayId)
      ? saved.selectedAdventureDayId
      : null;
    next.profileProgress = {};
    Object.keys(stateProfileTemplates()).forEach((profileId) => {
      const savedProgress = saved.profileProgress && saved.profileProgress[profileId];
      next.profileProgress[profileId] = {
        days: savedProgress && savedProgress.days && typeof savedProgress.days === "object" ? savedProgress.days : {}
      };
    });
    return next;
  }

  function stateProfileTemplates() {
    const profiles = {};
    DATA.defaultProfiles.forEach((profile) => { profiles[profile.id] = profile; });
    return profiles;
  }

  function mergeState(saved) {
    const next = buildDefaultState();
    if (!saved || typeof saved !== "object") return next;

    next.activeAdventureId = DATA.adventures.some((adventure) => adventure.id === saved.activeAdventureId)
      ? saved.activeAdventureId
      : next.activeAdventureId;

    next.profiles = {};
    DATA.defaultProfiles.forEach((profile) => {
      const savedProfile = saved.profiles && saved.profiles[profile.id];
      next.profiles[profile.id] = {
        ...clone(profile),
        ...(savedProfile && typeof savedProfile === "object" ? savedProfile : {})
      };
      if (!["navigator", "explorer"].includes(next.profiles[profile.id].experience)) {
        next.profiles[profile.id].experience = profile.experience;
      }
    });

    next.activeProfileId = next.profiles[saved.activeProfileId]
      ? saved.activeProfileId
      : DATA.defaultProfiles[0].id;

    DATA.adventures.forEach((adventure) => {
      next.adventures[adventure.id] = mergeAdventureState(
        next.adventures[adventure.id],
        saved.adventures && saved.adventures[adventure.id],
        adventure
      );
    });

    return next;
  }

  function migrateLegacyState(legacy) {
    if (!legacy || typeof legacy !== "object") return null;
    const next = buildDefaultState();
    const adventure = DATA.adventures[0];
    const adventureState = next.adventures[adventure.id];
    adventureState.checks = legacy.checks && typeof legacy.checks === "object" ? legacy.checks : {};
    adventureState.completedDays = legacy.completedDays && typeof legacy.completedDays === "object" ? legacy.completedDays : {};
    adventureState.hotels = {
      ...(adventure.reservations || {}),
      ...(legacy.hotels && typeof legacy.hotels === "object" ? legacy.hotels : {})
    };
    adventureState.notes = {
      general: legacy.notes && typeof legacy.notes.general === "string" ? legacy.notes.general : "",
      daily: legacy.notes && legacy.notes.daily && typeof legacy.notes.daily === "object" ? legacy.notes.daily : {}
    };
    adventureState.customItems = {
      shopping: legacy.customItems && Array.isArray(legacy.customItems.shopping) ? legacy.customItems.shopping : [],
      packing: legacy.customItems && Array.isArray(legacy.customItems.packing) ? legacy.customItems.packing : [],
      border: legacy.customItems && Array.isArray(legacy.customItems.border) ? legacy.customItems.border : []
    };
    adventureState.activeList = ["shopping", "packing", "border"].includes(legacy.activeList) ? legacy.activeList : "shopping";
    return next;
  }

  function loadState() {
    try {
      const current = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (current) return mergeState(current);
    } catch (error) {
      console.warn("Could not read current Road Companion state", error);
    }

    for (const key of LEGACY_STORAGE_KEYS) {
      try {
        const legacy = JSON.parse(localStorage.getItem(key));
        const migrated = migrateLegacyState(legacy);
        if (migrated) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
          return migrated;
        }
      } catch (error) {
        console.warn(`Could not migrate ${key}`, error);
      }
    }
    return buildDefaultState();
  }

  function saveState() {
    try {
      state.schema = APP.dataSchema;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Could not save Road Companion state", error);
      showToast("This browser could not save the latest change.");
    }
  }

  function getAdventure() {
    return DATA.adventures.find((adventure) => adventure.id === state.activeAdventureId) || DATA.adventures[0];
  }

  function getAdventureState() {
    const adventure = getAdventure();
    if (!state.adventures[adventure.id]) state.adventures[adventure.id] = makeAdventureState(adventure);
    return state.adventures[adventure.id];
  }

  function getProfile() {
    return state.profiles[state.activeProfileId] || state.profiles[DATA.defaultProfiles[0].id];
  }

  function ensureProfileProgress(profileId = state.activeProfileId) {
    const adventureState = getAdventureState();
    if (!adventureState.profileProgress[profileId]) adventureState.profileProgress[profileId] = makeProfileProgress();
    return adventureState.profileProgress[profileId];
  }

  function emptyDayProgress() {
    return {
      missions: {},
      sightings: {},
      journal: { rating: 0, favorite: "", ate: "", bought: "", surprise: "", note: "" },
      photoDone: false,
      badgeClaimed: false
    };
  }

  function getDayProgress(dayId, profileId = state.activeProfileId, create = true) {
    const profileProgress = ensureProfileProgress(profileId);
    if (!profileProgress.days[dayId] && create) profileProgress.days[dayId] = emptyDayProgress();
    const progress = profileProgress.days[dayId] || emptyDayProgress();
    if (!progress.missions || typeof progress.missions !== "object") progress.missions = {};
    if (!progress.sightings || typeof progress.sightings !== "object") progress.sightings = {};
    if (!progress.journal || typeof progress.journal !== "object") progress.journal = emptyDayProgress().journal;
    JOURNAL_FIELDS.forEach((field) => {
      if (typeof progress.journal[field] !== "string") progress.journal[field] = "";
    });
    if (!Number.isFinite(Number(progress.journal.rating))) progress.journal.rating = 0;
    progress.photoDone = Boolean(progress.photoDone);
    progress.badgeClaimed = Boolean(progress.badgeClaimed);
    return progress;
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

  function calendarDayNumber(date) {
    return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / MS_PER_DAY;
  }

  function daysBetween(from, to) {
    return Math.round(calendarDayNumber(to) - calendarDayNumber(from));
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
    const adventure = getAdventure();
    const today = todayLocal();
    const start = parseDate(adventure.startDate);
    const end = parseDate(adventure.endDate);
    if (today < start) return "before";
    if (today > end) return "after";
    return "during";
  }

  function getCurrentOrNextDay() {
    const adventure = getAdventure();
    const today = todayLocal();
    const exact = adventure.days.find((day) => sameDate(parseDate(day.date), today));
    if (exact) return exact;
    const upcoming = adventure.days.find((day) => parseDate(day.date) > today);
    return upcoming || adventure.days[adventure.days.length - 1];
  }

  function getDayStatus(day) {
    const today = todayLocal();
    const date = parseDate(day.date);
    if (sameDate(date, today)) return "current";
    if (date < today) return "past";
    return "future";
  }

  function dayIndex(dayOrId) {
    const adventure = getAdventure();
    const id = typeof dayOrId === "string" ? dayOrId : dayOrId.id;
    return adventure.days.findIndex((day) => day.id === id);
  }

  function getSelectedAdventureDay() {
    const adventure = getAdventure();
    const adventureState = getAdventureState();
    const saved = adventure.days.find((day) => day.id === adventureState.selectedAdventureDayId);
    if (saved) return saved;
    const fallback = getCurrentOrNextDay();
    adventureState.selectedAdventureDayId = fallback.id;
    return fallback;
  }

  function selectAdventureDay(dayId, options = {}) {
    const adventure = getAdventure();
    if (!adventure.days.some((day) => day.id === dayId)) return;
    getAdventureState().selectedAdventureDayId = dayId;
    saveState();
    renderAdventure();
    if (options.scroll !== false) {
      requestAnimationFrame(() => $("#mission-briefing")?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  }

  function showToast(message, duration = 2800) {
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
    if (!options.keepScroll) {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
    if (view === "adventure") renderAdventure();
    if (view === "memories") renderMemories();
    if (view === "settings") renderSettings();
  }

  function setTripTab(tab) {
    if (!VALID_TRIP_TABS.includes(tab)) tab = "days";
    activeTripTab = tab;
    $$('[data-trip-tab]').forEach((button) => button.setAttribute("aria-selected", String(button.dataset.tripTab === tab)));
    $$('[data-trip-pane]').forEach((pane) => pane.classList.toggle("active", pane.dataset.tripPane === tab));
    if (tab === "route") renderRoute();
    if (tab === "stays") renderHotels();
    if (tab === "lists") renderChecklist();
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

  function hotelHasContent(hotel) {
    return Boolean(hotel && [hotel.name, hotel.address, hotel.confirmation, hotel.phone, hotel.website, hotel.notes].some((value) => String(value || "").trim()));
  }

  function resolveHotel(dayId, visited = new Set()) {
    const adventure = getAdventure();
    const adventureState = getAdventureState();
    const day = adventure.days.find((item) => item.id === dayId);
    if (!day || visited.has(dayId)) return { hotel: null, inherited: false, sourceDayId: null };
    visited.add(dayId);
    const explicit = adventureState.hotels[dayId];
    if (hotelHasContent(explicit)) return { hotel: explicit, inherited: false, sourceDayId: dayId };
    const index = dayIndex(dayId);
    if (index > 0) {
      const previous = adventure.days[index - 1];
      if (previous.overnight === day.overnight) {
        const resolved = resolveHotel(previous.id, visited);
        if (resolved.hotel) return { hotel: resolved.hotel, inherited: true, sourceDayId: resolved.sourceDayId };
      }
    }
    return { hotel: explicit || null, inherited: false, sourceDayId: dayId };
  }

  function effectiveStops(day) {
    const stops = [...(day.stops || [day.start, day.end])];
    const adventure = getAdventure();
    const index = dayIndex(day);
    const previousDay = index > 0 ? adventure.days[index - 1] : null;
    const previousHotel = previousDay ? resolveHotel(previousDay.id).hotel : null;
    const destinationHotel = resolveHotel(day.id).hotel;
    if (stops.length) {
      if (previousHotel && previousHotel.address) stops[0] = previousHotel.address;
      if (destinationHotel && destinationHotel.address && day.overnight !== "Home") stops[stops.length - 1] = destinationHotel.address;
    }
    return stops;
  }

  function effectiveEndpoints(day) {
    const adventure = getAdventure();
    const index = dayIndex(day);
    const previousDay = index > 0 ? adventure.days[index - 1] : null;
    const previousHotel = previousDay ? resolveHotel(previousDay.id).hotel : null;
    const destinationHotel = resolveHotel(day.id).hotel;
    return {
      start: previousHotel && previousHotel.address ? previousHotel.address : day.start,
      end: day.overnight === "Home" ? day.end : (destinationHotel && destinationHotel.address ? destinationHotel.address : day.end)
    };
  }

  function renderHeader() {
    const profile = getProfile();
    $("#header-version").textContent = APP.version;
    $("#app-version").textContent = APP.version;
    $("#build-date").textContent = APP.buildDate;
    $("#profile-name").textContent = profile.name;
    $("#profile-initials").textContent = (profile.name || profile.initials || "?").trim().slice(0, 1).toUpperCase();
    $("#profile-initials").style.background = profile.experience === "explorer" ? "var(--teal-soft)" : "var(--indigo-soft)";
    $("#profile-initials").style.color = profile.experience === "explorer" ? "var(--teal)" : "var(--indigo)";
  }

  function renderHome() {
    const adventure = getAdventure();
    $("#home-title").textContent = adventure.title;
    $("#hero-subtitle").textContent = adventure.subtitle;
    renderHomeStats();
    renderCountdown();
    renderNextDay();
    renderHomeProfileProgress();
    renderReadiness();
  }

  function renderHomeStats() {
    const adventure = getAdventure();
    const totalKm = adventure.days.reduce((sum, day) => sum + Number(day.distanceKm || 0), 0);
    const regions = new Set(adventure.routeOverview.map((point) => point.region).filter(Boolean));
    const stats = [
      { value: adventure.days.length, label: "travel days" },
      { value: adventure.days.filter((day) => day.overnight !== "Home").length, label: "nights" },
      { value: totalKm.toLocaleString("en-CA"), label: "planned km" },
      { value: regions.size, label: "regions" }
    ];
    $("#home-stats").innerHTML = stats.map((stat) => `<div class="stat-item"><strong>${escapeHtml(stat.value)}</strong><span>${escapeHtml(stat.label)}</span></div>`).join("");
  }

  function renderCountdown() {
    const adventure = getAdventure();
    const phase = getTripPhase();
    const today = todayLocal();
    const start = parseDate(adventure.startDate);
    const end = parseDate(adventure.endDate);
    const label = $("#trip-state-label");
    const card = $("#countdown-card");

    if (phase === "before") {
      const days = Math.max(0, daysBetween(today, start));
      label.textContent = `${days} day${days === 1 ? "" : "s"} to departure`;
      card.innerHTML = `<div class="countdown-number">${days}</div><div class="countdown-copy"><strong>${days === 0 ? "Departure day" : days === 1 ? "Departure is tomorrow" : "Departure countdown"}</strong><span>Leave Edmonton at 6:00 PM on Thursday, July 30.</span></div>`;
    } else if (phase === "during") {
      const tripDay = daysBetween(start, today) + 1;
      const remaining = Math.max(0, daysBetween(today, end));
      label.textContent = `Adventure day ${tripDay}`;
      card.innerHTML = `<div class="countdown-number">${tripDay}</div><div class="countdown-copy"><strong>Today is adventure day ${tripDay}</strong><span>${remaining === 0 ? "Home day." : `${remaining} day${remaining === 1 ? "" : "s"} remain after today.`}</span></div>`;
    } else {
      label.textContent = "Adventure complete";
      card.innerHTML = `<div class="countdown-number">✓</div><div class="countdown-copy"><strong>The loop is complete</strong><span>The itinerary is now a scrapbook. Keep the journals, badges, and sightings as the permanent record.</span></div>`;
    }
  }

  function renderNextDay() {
    const day = getCurrentOrNextDay();
    const parts = dateParts(day.date);
    $("#next-day-card").innerHTML = `
      <article class="next-day">
        <div class="next-day-head">
          <div>
            <span class="section-kicker">${escapeHtml(formatDate(day.date, { weekday: "long" }))}</span>
            <h3>${escapeHtml(day.title)}</h3>
          </div>
          <div class="next-day-date"><span>${escapeHtml(parts.month)}</span><strong>${escapeHtml(parts.day)}</strong></div>
        </div>
        <p>${escapeHtml(day.summary)}</p>
        <div class="route-meta"><span class="meta-pill">${escapeHtml(day.distanceKm)} km</span><span class="meta-pill">${escapeHtml(day.driveTime)}</span><span class="meta-pill">Night: ${escapeHtml(day.overnight)}</span></div>
      </article>`;
  }

  function profileMetrics(profileId = state.activeProfileId) {
    const adventure = getAdventure();
    const profileProgress = ensureProfileProgress(profileId);
    let sightings = 0;
    let missions = 0;
    let journals = 0;
    let ratings = 0;
    let dayBadges = 0;
    adventure.days.forEach((day) => {
      const progress = getDayProgress(day.id, profileId, false);
      sightings += Object.values(progress.sightings || {}).reduce((sum, value) => sum + Math.max(0, Number(value) || 0), 0);
      missions += Object.values(progress.missions || {}).filter(Boolean).length;
      if (journalHasContent(progress.journal)) journals += 1;
      if (Number(progress.journal.rating) > 0) ratings += 1;
      if (progress.badgeClaimed) dayBadges += 1;
    });
    return { sightings, missions, journals, ratings, dayBadges, days: profileProgress.days };
  }

  function earnedGlobalBadges(profileId = state.activeProfileId) {
    const metrics = profileMetrics(profileId);
    return DATA.globalBadges.filter((badge) => Number(metrics[badge.type]) >= Number(badge.threshold));
  }

  function renderHomeProfileProgress() {
    const profile = getProfile();
    const metrics = profileMetrics();
    const totalBadges = getAdventure().days.length + DATA.globalBadges.length;
    const earned = metrics.dayBadges + earnedGlobalBadges().length;
    const percent = totalBadges ? Math.round((earned / totalBadges) * 100) : 0;
    $("#profile-progress").innerHTML = `
      <div class="profile-progress-card">
        <div class="profile-progress-avatar">${escapeHtml((profile.name || "?").slice(0,1).toUpperCase())}</div>
        <div class="profile-progress-copy"><strong>${escapeHtml(profile.name)}</strong><span>${escapeHtml(profile.roleLabel || (profile.experience === "navigator" ? "Independent traveller" : "Visual explorer"))}</span><div class="mini-progress"><i style="width:${percent}%"></i></div><span>${earned} of ${totalBadges} badges · ${metrics.sightings} sightings</span></div>
      </div>`;
  }

  function flattenChecklist(listName) {
    const adventure = getAdventure();
    if (listName === "border") return (adventure.borderChecklist || []).map((item) => ({ ...item, category: "Border return" }));
    return (adventure[listName] || []).flatMap((group) => group.items.map((item) => ({ ...item, category: group.category })));
  }

  function checkKey(listName, itemId) {
    return `${listName}:${itemId}`;
  }

  function renderReadiness() {
    const adventure = getAdventure();
    const adventureState = getAdventureState();
    const items = [...flattenChecklist("packing"), ...flattenChecklist("border")];
    const completed = items.filter((item) => adventureState.checks[checkKey(item.category === "Border return" ? "border" : "packing", item.id)]).length;
    const percent = items.length ? Math.round((completed / items.length) * 100) : 0;
    $("#readiness-label").textContent = `${percent}%`;
    $("#readiness-bar").style.width = `${percent}%`;
    $("#reminders-list").innerHTML = (adventure.reminders || []).slice(0, 4).map((reminder) => `<div class="compact-item"><span class="dot"></span><span>${escapeHtml(reminder.text)}</span></div>`).join("");
  }

  function renderItinerary() {
    const adventure = getAdventure();
    const adventureState = getAdventureState();
    let days = adventure.days;
    if (itineraryFilter === "upcoming") days = days.filter((day) => getDayStatus(day) !== "past");
    if (itineraryFilter === "incomplete") days = days.filter((day) => !adventureState.completedDays[day.id]);

    $("#itinerary-list").innerHTML = days.map((day) => {
      const parts = dateParts(day.date);
      const status = getDayStatus(day);
      const complete = Boolean(adventureState.completedDays[day.id]);
      const expanded = expandedDays.has(day.id);
      return `
        <article class="day-card ${status} ${complete ? "complete" : ""} ${expanded ? "expanded" : ""}" data-day-card="${escapeHtml(day.id)}">
          <button class="day-summary" type="button" data-action="toggle-day" data-day-id="${escapeHtml(day.id)}" aria-expanded="${expanded}">
            <span class="day-date-tile"><span>${escapeHtml(parts.month)}</span><strong>${escapeHtml(parts.day)}</strong></span>
            <span class="day-summary-copy"><h3>${escapeHtml(day.title)}</h3><p>${escapeHtml(day.start)} → ${escapeHtml(day.end)}</p></span>
            <span class="day-distance">${escapeHtml(day.distanceKm)} km<small>${escapeHtml(day.driveTime)}</small></span>
          </button>
          <div class="day-details">
            <div class="detail-section"><p>${escapeHtml(day.summary)}</p><div class="route-meta"><span class="meta-pill">Depart: ${escapeHtml(day.departure)}</span><span class="meta-pill">Arrive: ${escapeHtml(day.arrival)}</span><span class="meta-pill">Night: ${escapeHtml(day.overnight)}</span></div></div>
            <div class="detail-section"><h4>Plan</h4><div class="timeline-list">${(day.timeline || []).map((item) => `<div class="timeline-row"><time>${escapeHtml(item.time)}</time><div><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.detail)}</p></div></div>`).join("")}</div></div>
            <div class="detail-section"><h4>Do not forget</h4><ul class="check-bullets">${(day.mustDo || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>
            ${(day.alerts || []).map((alert) => `<div class="alert-box">${escapeHtml(alert)}</div>`).join("")}
            <div class="day-actions">
              <a href="${escapeHtml(googleDirections(effectiveStops(day)))}" target="_blank" rel="noopener">Google Maps</a>
              <a href="${escapeHtml(appleDirections(effectiveEndpoints(day).start, effectiveEndpoints(day).end))}" target="_blank" rel="noopener">Apple Maps</a>
              <button type="button" data-action="open-day-adventure" data-day-id="${escapeHtml(day.id)}">Adventure page</button>
              <label class="day-complete-label"><input type="checkbox" data-day-complete="${escapeHtml(day.id)}" ${complete ? "checked" : ""}> Day complete</label>
            </div>
          </div>
        </article>`;
    }).join("") || `<div class="section-card"><p>No days match this filter.</p></div>`;
  }

  function renderRoute() {
    renderRouteMap();
    const adventure = getAdventure();
    $("#route-day-list").innerHTML = adventure.days.map((day) => {
      const endpoints = effectiveEndpoints(day);
      return `<article class="route-day-card"><div class="route-day-head"><div><strong>${escapeHtml(day.shortDate)} · ${escapeHtml(day.title)}</strong><span>${escapeHtml(day.distanceKm)} km · ${escapeHtml(day.driveTime)}</span></div></div><div class="route-day-links"><a href="${escapeHtml(googleDirections(effectiveStops(day)))}" target="_blank" rel="noopener">Google route</a><a href="${escapeHtml(appleDirections(endpoints.start, endpoints.end))}" target="_blank" rel="noopener">Apple route</a></div></article>`;
    }).join("");
  }

  function renderRouteMap() {
    const points = getAdventure().routeOverview || [];
    const container = $("#route-map");
    if (!points.length) {
      container.innerHTML = "<p style='padding:1rem'>No route overview is available.</p>";
      return;
    }
    const width = 900;
    const height = 430;
    const padding = 54;
    const lats = points.map((point) => point.lat);
    const lons = points.map((point) => point.lon);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);
    const project = (point) => ({
      x: padding + ((point.lon - minLon) / Math.max(.0001, maxLon - minLon)) * (width - padding * 2),
      y: padding + ((maxLat - point.lat) / Math.max(.0001, maxLat - minLat)) * (height - padding * 2)
    });
    const plotted = points.map((point) => ({ ...point, ...project(point) }));
    const polyline = plotted.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");
    const colours = { start: "#1f776f", overnight: "#245b78", highlight: "#d98545", home: "#2f7a4f" };
    container.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Road-trip route from Edmonton through Montana, Idaho, Washington, British Columbia, and home to Berwyn">
        <defs><filter id="route-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-opacity=".18"/></filter></defs>
        <path d="M0 350 C170 310 220 390 390 340 S700 270 900 310 L900 430 L0 430Z" fill="#dfecef" opacity=".8"></path>
        <path d="M0 190 C160 145 270 240 430 180 S715 95 900 145 L900 430 L0 430Z" fill="#e8f1ee" opacity=".78"></path>
        <polyline points="${polyline}" fill="none" stroke="#16324a" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" opacity=".17"></polyline>
        <polyline points="${polyline}" fill="none" stroke="#d98545" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="3 9"></polyline>
        ${plotted.map((point, index) => {
          const anchor = point.x > width - 180 ? "end" : "start";
          const dx = anchor === "end" ? -11 : 11;
          const dy = index % 2 === 0 ? -11 : 18;
          return `<g filter="url(#route-shadow)"><circle cx="${point.x}" cy="${point.y}" r="8" fill="${colours[point.type] || colours.overnight}" stroke="white" stroke-width="3"></circle><text x="${point.x + dx}" y="${point.y + dy}" text-anchor="${anchor}" fill="#263747" font-size="14" font-weight="750">${escapeHtml(point.name)}</text></g>`;
        }).join("")}
      </svg>`;
  }

  function renderHotels() {
    const adventure = getAdventure();
    $("#hotel-list").innerHTML = adventure.days.filter((day) => day.overnight !== "Home").map((day) => {
      const resolved = resolveHotel(day.id);
      const hotel = resolved.hotel || {};
      const title = hotel.name || `Stay in ${day.overnight}`;
      const mapQuery = hotel.address || day.overnight;
      const website = sanitizeUrl(hotel.website);
      const phone = String(hotel.phone || "").replace(/[^+\d]/g, "");
      return `
        <article class="hotel-card">
          <div class="hotel-card-head"><div><span class="hotel-date">${escapeHtml(formatDate(day.date, { weekday: "short", month: "short", day: "numeric" }))}</span><h3>${escapeHtml(title)}</h3><span class="hotel-city">${escapeHtml(day.overnight)}${resolved.inherited ? " · same stay as previous night" : ""}</span></div><button class="text-button" type="button" data-action="edit-hotel" data-day-id="${escapeHtml(day.id)}">Edit</button></div>
          <div class="hotel-details">
            ${hotel.address ? `<span>${escapeHtml(hotel.address)}</span>` : `<span>No street address saved yet.</span>`}
            ${hotel.confirmation ? `<span><strong>Confirmation:</strong> ${escapeHtml(hotel.confirmation)}</span>` : ""}
            ${hotel.notes ? `<span>${escapeHtml(hotel.notes)}</span>` : ""}
          </div>
          <div class="hotel-actions"><a href="${escapeHtml(googleSearch(mapQuery))}" target="_blank" rel="noopener">Map</a>${website ? `<a href="${escapeHtml(website)}" target="_blank" rel="noopener">Website</a>` : ""}${phone ? `<a href="tel:${escapeHtml(phone)}">Call</a>` : ""}<button type="button" data-action="edit-hotel" data-day-id="${escapeHtml(day.id)}">Details</button></div>
        </article>`;
    }).join("");
  }

  function renderChecklist() {
    const adventureState = getAdventureState();
    const listName = adventureState.activeList;
    $$('[data-list-tab]').forEach((button) => button.setAttribute("aria-selected", String(button.dataset.listTab === listName)));
    let groups = [];
    const adventure = getAdventure();
    if (listName === "border") groups = [{ category: "Border return", items: adventure.borderChecklist || [] }];
    else groups = adventure[listName] || [];
    const custom = adventureState.customItems[listName] || [];
    if (custom.length) groups = [...groups, { category: "Added on this device", items: custom.map((item) => ({ ...item, custom: true })) }];

    const allItems = groups.flatMap((group) => group.items);
    const completed = allItems.filter((item) => adventureState.checks[checkKey(listName, item.id)]).length;
    const percent = allItems.length ? Math.round((completed / allItems.length) * 100) : 0;
    $("#list-progress-wrap").innerHTML = `<div class="section-heading"><span class="supporting-copy">${completed} of ${allItems.length} complete</span><span class="progress-label">${percent}%</span></div><div class="progress-track"><span style="width:${percent}%"></span></div>`;

    $("#checklist-content").innerHTML = groups.map((group) => `<section class="checklist-group"><h3>${escapeHtml(group.category)}</h3>${group.items.map((item) => {
      const checked = Boolean(adventureState.checks[checkKey(listName, item.id)]);
      const detail = item.detail ? `<small>${escapeHtml(item.detail)}</small>` : "";
      const mapLink = item.query ? `<a href="${escapeHtml(googleSearch(item.query))}" target="_blank" rel="noopener" aria-label="Map ${escapeHtml(item.name)}">↗</a>` : "";
      return `<label class="checklist-row ${checked ? "checked" : ""}"><input type="checkbox" data-check-list="${escapeHtml(listName)}" data-check-id="${escapeHtml(item.id)}" ${checked ? "checked" : ""}><span>${escapeHtml(item.name)}${detail}</span>${item.custom ? `<button class="delete-item" type="button" data-action="delete-custom-item" data-list="${escapeHtml(listName)}" data-item-id="${escapeHtml(item.id)}" aria-label="Delete item">×</button>` : mapLink}</label>`;
    }).join("")}</section>`).join("") || `<div class="section-card"><p>No checklist items yet.</p></div>`;
  }

  function visibleMissions(day, profile = getProfile()) {
    return (day.adventure?.missions || []).filter((mission) => mission.audience === "all" || mission.audience === profile.experience);
  }

  function totalSightings(progress) {
    return Object.values(progress.sightings || {}).reduce((sum, value) => sum + Math.max(0, Number(value) || 0), 0);
  }

  function journalHasContent(journal) {
    if (!journal) return false;
    return Number(journal.rating) > 0 || JOURNAL_FIELDS.some((field) => String(journal[field] || "").trim());
  }

  function renderAdventure() {
    const day = getSelectedAdventureDay();
    const profile = getProfile();
    const progress = getDayProgress(day.id);
    const content = day.adventure || {};
    $("#adventure-profile-label").textContent = `${profile.name} · ${profile.experience === "navigator" ? "Navigator" : "Explorer"}`;
    $("#adventure-title").textContent = day.title;
    $("#adventure-date-line").textContent = `${formatDate(day.date)} · ${day.distanceKm} km · ${day.driveTime}`;
    renderAdventureDayStrip(day.id);

    const briefing = content.briefing?.[profile.experience] || content.briefing?.navigator || day.summary;
    $("#mission-briefing").innerHTML = `<span class="brief-date">${escapeHtml(day.shortDate)} · ${escapeHtml(day.start)} to ${escapeHtml(day.end)}</span><h2>Mission briefing</h2><p>${escapeHtml(briefing)}</p><div class="mission-route"><span>${escapeHtml(day.distanceKm)} km planned</span><span>${escapeHtml(day.driveTime)}</span><span>Night: ${escapeHtml(day.overnight)}</span></div>`;

    const missions = visibleMissions(day, profile);
    const completeMissions = missions.filter((mission) => progress.missions[mission.id]).length;
    const missionPercent = missions.length ? Math.round((completeMissions / missions.length) * 100) : 0;
    $("#mission-progress-label").textContent = `${completeMissions}/${missions.length}`;
    $("#mission-progress-bar").style.width = `${missionPercent}%`;
    $("#mission-list").innerHTML = missions.map((mission) => {
      const complete = Boolean(progress.missions[mission.id]);
      return `<label class="mission-item ${complete ? "complete" : ""}"><input type="checkbox" data-mission-id="${escapeHtml(mission.id)}" ${complete ? "checked" : ""}><span>${escapeHtml(mission.label)}</span></label>`;
    }).join("");

    $("#fact-list").innerHTML = (content.facts || []).map((fact) => `<article class="fact-card"><h3>${escapeHtml(fact.title)}</h3><p>${escapeHtml(fact.text)}</p>${fact.prompt ? `<span class="fact-prompt">Think about it: ${escapeHtml(fact.prompt)}</span>` : ""}${fact.sourceUrl ? `<a class="fact-source" href="${escapeHtml(fact.sourceUrl)}" target="_blank" rel="noopener">Source: ${escapeHtml(fact.sourceLabel || "Official information")}</a>` : ""}</article>`).join("") || `<p class="supporting-copy">No field notes for this day yet.</p>`;

    $("#photo-mission-text").textContent = content.photoMission?.[profile.experience] || content.photoMission?.navigator || "Capture one image that helps tell the story of the day.";
    $("#photo-mission-check").checked = Boolean(progress.photoDone);

    const sightings = content.spotting || [];
    const sightTotal = totalSightings(progress);
    $("#sighting-total").textContent = `${sightTotal} find${sightTotal === 1 ? "" : "s"}`;
    $("#spotting-grid").innerHTML = sightings.map((spot) => {
      const count = Math.max(0, Number(progress.sightings[spot.id]) || 0);
      return `<article class="spot-card"><div class="spot-card-head"><span class="spot-icon">${escapeHtml(spot.icon)}</span><span class="spot-label"><strong>${escapeHtml(spot.label)}</strong><span>${spot.target ? `Quest target ${escapeHtml(spot.target)}` : "Count each real sighting"}</span></span></div><div class="counter-control"><button type="button" data-action="decrement-sighting" data-spot-id="${escapeHtml(spot.id)}" aria-label="Subtract ${escapeHtml(spot.label)}">−</button><span class="counter-value">${count}</span><button type="button" data-action="increment-sighting" data-spot-id="${escapeHtml(spot.id)}" aria-label="Add ${escapeHtml(spot.label)}">+</button></div></article>`;
    }).join("");

    renderRating(progress.journal.rating);
    renderJournalFields(progress.journal, profile.experience);
    renderDayBadge(day, progress, missions);
    const teaser = content.teaser || { title: "Tomorrow", text: "Another travel day is waiting." };
    $("#tomorrow-teaser").innerHTML = `<span class="section-kicker">Last look ahead</span><h2 id="tomorrow-teaser-title">${escapeHtml(teaser.title)}</h2><p>${escapeHtml(teaser.text)}</p>`;
  }

  function renderAdventureDayStrip(selectedId) {
    const adventure = getAdventure();
    $("#adventure-day-strip").innerHTML = adventure.days.map((day) => {
      const parts = dateParts(day.date);
      const hasMemory = dayHasMemory(getDayProgress(day.id, state.activeProfileId, false));
      return `<button class="adventure-day-button ${day.id === selectedId ? "active" : ""} ${hasMemory ? "has-memory" : ""}" type="button" role="listitem" data-action="select-adventure-day" data-day-id="${escapeHtml(day.id)}"><span>${escapeHtml(parts.month)}</span><strong>${escapeHtml(parts.day)}</strong></button>`;
    }).join("");
    requestAnimationFrame(() => $("#adventure-day-strip .active")?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" }));
  }

  function renderRating(value) {
    const rating = Math.max(0, Math.min(5, Number(value) || 0));
    $("#rating-control").innerHTML = `<span class="sr-only">Rate the day from one to five</span>${[1,2,3,4,5].map((star) => `<button type="button" class="rating-button ${star <= rating ? "active" : ""}" data-action="set-rating" data-rating="${star}" aria-label="Rate ${star} out of 5">★</button>`).join("")}`;
  }

  function journalLabels(experience) {
    if (experience === "explorer") {
      return {
        favorite: "Favourite part of the day",
        ate: "Best thing I ate",
        bought: "What I bought or collected",
        surprise: "Funniest or most surprising thing",
        note: "One more thing I want to remember"
      };
    }
    return {
      favorite: "Best moment",
      ate: "Food stop worth remembering",
      bought: "What I picked up",
      surprise: "What surprised me",
      note: "Field note for future me"
    };
  }

  function renderJournalFields(journal, experience) {
    const labels = journalLabels(experience);
    $("#journal-fields").innerHTML = JOURNAL_FIELDS.map((field) => {
      const multiline = field === "note" || field === "surprise";
      const value = escapeHtml(journal[field] || "");
      return `<label>${escapeHtml(labels[field])}${multiline ? `<textarea rows="${field === "note" ? 4 : 3}" maxlength="600" data-journal-field="${field}">${value}</textarea>` : `<input type="text" maxlength="180" value="${value}" data-journal-field="${field}">`}</label>`;
    }).join("");
  }

  function badgeEligibility(day, progress, missions) {
    const completeMissions = missions.filter((mission) => progress.missions[mission.id]).length;
    const sightings = totalSightings(progress);
    const rating = Number(progress.journal.rating) || 0;
    const favorite = Boolean(String(progress.journal.favorite || "").trim());
    return {
      completeMissions,
      sightings,
      rating,
      favorite,
      eligible: completeMissions >= Math.min(2, missions.length) && sightings >= 3 && rating > 0 && favorite
    };
  }

  function renderDayBadge(day, progress, missions) {
    const badge = day.adventure?.badge;
    if (!badge) {
      $("#day-badge-card").innerHTML = `<p>No day badge is defined yet.</p>`;
      return;
    }
    const eligibility = badgeEligibility(day, progress, missions);
    $("#day-badge-card").innerHTML = `
      <div class="badge-layout"><span class="badge-symbol">${escapeHtml(badge.icon)}</span><div><span class="section-kicker">Day badge</span><h2 id="day-badge-title">${escapeHtml(badge.name)}</h2><p>${escapeHtml(badge.description)}</p></div></div>
      <div class="badge-state">${progress.badgeClaimed ? `<div class="badge-earned">✓ Badge added to Memories</div>` : `<p class="fine-print">Unlock with at least ${Math.min(2, missions.length)} missions, 3 real sightings, a day rating, and a favourite/best moment.</p><button class="primary-button" type="button" data-action="claim-day-badge" ${eligibility.eligible ? "" : "disabled"}>${eligibility.eligible ? "Claim badge" : "Badge not ready"}</button>`}</div>`;
  }

  function dayHasMemory(progress) {
    return Boolean(progress.badgeClaimed || progress.photoDone || journalHasContent(progress.journal) || totalSightings(progress) || Object.values(progress.missions || {}).some(Boolean));
  }

  function renderMemories() {
    const adventure = getAdventure();
    const profile = getProfile();
    const metrics = profileMetrics();
    const global = earnedGlobalBadges();
    const average = metrics.ratings ? (adventure.days.reduce((sum, day) => sum + (Number(getDayProgress(day.id, state.activeProfileId, false).journal.rating) || 0), 0) / metrics.ratings).toFixed(1) : "—";
    $("#memory-stats").innerHTML = [
      { value: metrics.sightings, label: "sightings" },
      { value: metrics.journals, label: "journal days" },
      { value: metrics.dayBadges + global.length, label: "badges" },
      { value: average, label: "average rating" }
    ].map((stat) => `<div class="memory-stat"><strong>${escapeHtml(stat.value)}</strong><span>${escapeHtml(stat.label)}</span></div>`).join("");

    const dayBadges = adventure.days.map((day) => ({ ...day.adventure.badge, earned: getDayProgress(day.id, state.activeProfileId, false).badgeClaimed, source: day.shortDate }));
    const globalBadges = DATA.globalBadges.map((badge) => ({ ...badge, earned: global.some((item) => item.id === badge.id), source: "Adventure" }));
    $("#badge-gallery").innerHTML = [...dayBadges, ...globalBadges].map((badge) => `<article class="badge-card ${badge.earned ? "" : "locked"}"><span class="badge-symbol">${escapeHtml(badge.icon)}</span><strong>${escapeHtml(badge.name)}</strong><p>${escapeHtml(badge.description)}</p><small>${badge.earned ? `Earned · ${escapeHtml(badge.source)}` : "Locked"}</small></article>`).join("");

    $("#scrapbook-list").innerHTML = adventure.days.map((day) => renderScrapbookCard(day, getDayProgress(day.id, state.activeProfileId, false), profile)).join("");
  }

  function renderScrapbookCard(day, progress, profile) {
    const parts = dateParts(day.date);
    const journal = progress.journal || emptyDayProgress().journal;
    const labels = journalLabels(profile.experience);
    const hasMemory = dayHasMemory(progress);
    const spots = (day.adventure?.spotting || []).map((spot) => ({ label: spot.label, count: Number(progress.sightings[spot.id]) || 0 })).filter((spot) => spot.count > 0);
    const rating = Math.max(0, Math.min(5, Number(journal.rating) || 0));
    return `<article class="scrapbook-card"><div class="scrapbook-head"><span class="day-date-tile"><span>${escapeHtml(parts.month)}</span><strong>${escapeHtml(parts.day)}</strong></span><div><h3>${escapeHtml(day.title)}</h3><p>${escapeHtml(day.start)} → ${escapeHtml(day.end)}</p></div><span class="scrapbook-rating">${rating ? "★".repeat(rating) : ""}</span></div><div class="scrapbook-body">${hasMemory ? `${journal.favorite ? `<div class="memory-line"><strong>${escapeHtml(labels.favorite)}</strong><span>${escapeHtml(journal.favorite)}</span></div>` : ""}${journal.ate ? `<div class="memory-line"><strong>${escapeHtml(labels.ate)}</strong><span>${escapeHtml(journal.ate)}</span></div>` : ""}${journal.bought ? `<div class="memory-line"><strong>${escapeHtml(labels.bought)}</strong><span>${escapeHtml(journal.bought)}</span></div>` : ""}${journal.surprise ? `<div class="memory-line"><strong>${escapeHtml(labels.surprise)}</strong><span>${escapeHtml(journal.surprise)}</span></div>` : ""}${journal.note ? `<div class="memory-line"><strong>${escapeHtml(labels.note)}</strong><span>${escapeHtml(journal.note)}</span></div>` : ""}${spots.length ? `<div class="sighting-summary">${spots.map((spot) => `<span class="sighting-chip">${escapeHtml(spot.label)} × ${spot.count}</span>`).join("")}</div>` : ""}${progress.photoDone ? `<span class="sighting-chip">Photo mission complete</span>` : ""}${progress.badgeClaimed ? `<span class="sighting-chip">Badge: ${escapeHtml(day.adventure.badge.name)}</span>` : ""}` : `<p class="empty-memory">No entry yet. Open this day in Adventure Mode to add field notes.</p>`}</div></article>`;
  }

  function renderSettings() {
    renderProfiles();
    renderInstallHelp();
    renderLiveChecks();
    $("#general-notes").value = getAdventureState().notes.general || "";
  }

  function renderProfiles() {
    const profiles = Object.values(state.profiles);
    const card = (profile, picker = false) => picker
      ? `<button class="profile-pick-button" type="button" data-action="select-profile" data-profile-id="${escapeHtml(profile.id)}"><span class="profile-avatar">${escapeHtml((profile.name || "?").slice(0,1).toUpperCase())}</span><span><strong>${escapeHtml(profile.name)}</strong><span>${escapeHtml(profile.experience === "navigator" ? "Independent prompts, route tasks, and photography" : "Visual prompts, spotting, and direct missions")}</span></span></button>`
      : `<article class="profile-card ${profile.id === state.activeProfileId ? "active" : ""}" data-experience="${escapeHtml(profile.experience)}"><span class="profile-avatar">${escapeHtml((profile.name || "?").slice(0,1).toUpperCase())}</span><div><strong>${escapeHtml(profile.name)}</strong><span>${escapeHtml(profile.experience === "navigator" ? "Navigator experience" : "Explorer experience")}</span></div><div class="profile-card-actions"><button type="button" data-action="select-profile" data-profile-id="${escapeHtml(profile.id)}">Use</button><button type="button" data-action="edit-profile" data-profile-id="${escapeHtml(profile.id)}">Edit</button></div></article>`;
    $("#profile-list").innerHTML = profiles.map((profile) => card(profile)).join("");
    $("#profile-picker-list").innerHTML = profiles.map((profile) => card(profile, true)).join("");
  }

  function renderInstallHelp() {
    const standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
    const help = $("#install-help");
    if (standalone) {
      help.innerHTML = `<p class="supporting-copy">Installed as a Home Screen app. Use <strong>Refresh app now</strong> after a GitHub Pages update if an old build remains cached.</p>`;
    } else if (/iphone|ipad|ipod/i.test(navigator.userAgent)) {
      help.innerHTML = `<p class="supporting-copy">In Safari, tap Share, choose <strong>Add to Home Screen</strong>, enable <strong>Open as Web App</strong>, and add it.</p>`;
    } else {
      help.innerHTML = `<p class="supporting-copy">Use the browser install control when available, or keep using the site directly.</p>`;
    }
  }

  function renderLiveChecks() {
    const checks = (getAdventure().liveChecks || []).filter((item) => item.id !== "concert");
    $("#live-checks-list").innerHTML = checks.map((item) => `<article class="live-check"><div><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.note)}${item.verified ? ` · ${escapeHtml(item.verified)}` : ""}</span></div><a href="${escapeHtml(item.url)}" target="_blank" rel="noopener">Open</a></article>`).join("");
  }

  function renderAll() {
    renderHeader();
    renderHome();
    renderItinerary();
    renderRoute();
    renderHotels();
    renderChecklist();
    renderAdventure();
    renderMemories();
    renderSettings();
    updateNetworkStatus();
  }

  function openHotelDialog(dayId) {
    const day = getAdventure().days.find((item) => item.id === dayId);
    if (!day) return;
    const resolved = resolveHotel(dayId);
    const hotel = resolved.hotel || {};
    $("#hotel-dialog-title").textContent = `${day.shortDate} · ${day.overnight}`;
    $("#hotel-day-id").value = dayId;
    $("#hotel-name").value = hotel.name || "";
    $("#hotel-address").value = hotel.address || "";
    $("#hotel-confirmation").value = hotel.confirmation || "";
    $("#hotel-phone").value = hotel.phone || "";
    $("#hotel-website").value = hotel.website || "";
    $("#hotel-checkin").value = hotel.checkin || "";
    $("#hotel-checkout").value = hotel.checkout || "";
    $("#hotel-notes").value = hotel.notes || "";
    $("#hotel-dialog").showModal();
  }

  function saveHotel(event) {
    event.preventDefault();
    const dayId = $("#hotel-day-id").value;
    if (!dayId) return;
    getAdventureState().hotels[dayId] = {
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
    $("#hotel-dialog").close();
    renderHotels();
    renderItinerary();
    renderRoute();
    showToast("Stay saved locally. Route links refreshed.");
  }

  function openProfileDialog(profileId) {
    const profile = state.profiles[profileId];
    if (!profile) return;
    $("#profile-dialog-title").textContent = `Edit ${profile.name}`;
    $("#profile-id").value = profileId;
    $("#profile-display-name").value = profile.name;
    $$('input[name="experience"]', $("#profile-form")).forEach((input) => { input.checked = input.value === profile.experience; });
    $("#profile-dialog").showModal();
  }

  function saveProfile(event) {
    event.preventDefault();
    const profileId = $("#profile-id").value;
    const profile = state.profiles[profileId];
    if (!profile) return;
    const name = $("#profile-display-name").value.trim();
    const experience = $('input[name="experience"]:checked', $("#profile-form"))?.value || profile.experience;
    profile.name = name || profile.name;
    profile.experience = ["navigator", "explorer"].includes(experience) ? experience : profile.experience;
    profile.roleLabel = profile.experience === "navigator" ? "Independent traveller" : "Visual explorer";
    saveState();
    $("#profile-dialog").close();
    renderAll();
    showToast("Adventure profile updated.");
  }

  function selectProfile(profileId) {
    if (!state.profiles[profileId]) return;
    state.activeProfileId = profileId;
    saveState();
    [$("#profile-picker"), $("#profile-dialog")].forEach((dialog) => { if (dialog?.open) dialog.close(); });
    renderAll();
    showToast(`${state.profiles[profileId].name} is now active.`);
  }

  function updateAdventureProgress(action, value) {
    const day = getSelectedAdventureDay();
    const progress = getDayProgress(day.id);
    action(progress, value);
    saveState();
    renderAdventure();
    renderHomeProfileProgress();
    renderMemories();
  }

  function setJournalField(field, value) {
    if (!JOURNAL_FIELDS.includes(field)) return;
    const day = getSelectedAdventureDay();
    const progress = getDayProgress(day.id);
    progress.journal[field] = value;
    saveState();
    const status = $("#journal-save-status");
    status.textContent = "Saving…";
    clearTimeout(journalSaveTimer);
    journalSaveTimer = setTimeout(() => {
      status.textContent = "Saved";
      renderDayBadge(day, progress, visibleMissions(day));
      renderHomeProfileProgress();
      renderMemories();
    }, 450);
  }

  function claimDayBadge() {
    const day = getSelectedAdventureDay();
    const progress = getDayProgress(day.id);
    const missions = visibleMissions(day);
    if (!badgeEligibility(day, progress, missions).eligible) return;
    progress.badgeClaimed = true;
    saveState();
    renderAdventure();
    renderHomeProfileProgress();
    renderMemories();
    showToast(`${day.adventure.badge.name} added to Memories.`);
  }

  function exportBackup() {
    const adventure = getAdventure();
    const payload = {
      appId: APP.id,
      appVersion: APP.version,
      exportedAt: new Date().toISOString(),
      adventureId: adventure.id,
      state
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Bobsx4-Road-Companion-backup-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast("Backup file created.");
  }

  async function importBackup(file) {
    try {
      const text = await file.text();
      const payload = JSON.parse(text);
      const incoming = payload.state || payload;
      if (!incoming || typeof incoming !== "object") throw new Error("No state object");
      state = mergeState(incoming);
      saveState();
      renderAll();
      showToast("Backup restored.");
    } catch (error) {
      console.error(error);
      showToast("That file is not a valid Road Companion backup.", 4200);
    }
  }

  async function checkForUpdate() {
    showToast("Checking the published build…");
    try {
      const response = await fetch(`release-manifest.json?check=${Date.now()}`, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const manifest = await response.json();
      if (manifest.versionCode && manifest.versionCode !== APP.versionCode) {
        showToast(`Version ${manifest.version} is published. Tap Refresh app now.`, 5200);
      } else {
        const registration = await navigator.serviceWorker?.getRegistration();
        await registration?.update();
        showToast(`You are on ${APP.version}.`);
      }
    } catch (error) {
      console.warn("Update check failed", error);
      showToast(navigator.onLine ? "Could not verify the published version." : "Offline: update check needs a connection.");
    }
  }

  async function refreshApp() {
    const button = $("#refresh-button");
    button?.classList.add("loading");
    showToast(navigator.onLine ? "Refreshing app files…" : "Reloading saved offline app…");
    try {
      if (navigator.onLine) {
        if ("caches" in window) {
          const keys = await caches.keys();
          await Promise.all(keys.filter((key) => key.startsWith("bobsx4-road-companion")).map((key) => caches.delete(key)));
        }
        if ("serviceWorker" in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (const registration of registrations) {
            await registration.update();
            if (registration.waiting) registration.waiting.postMessage({ type: "SKIP_WAITING" });
          }
        }
      }
    } catch (error) {
      console.warn("Refresh preparation failed", error);
    }
    setTimeout(() => window.location.reload(), 450);
  }

  function updateNetworkStatus() {
    const status = $("#network-status");
    if (!status) return;
    const online = navigator.onLine;
    status.textContent = online ? "Online" : "Offline";
    status.classList.toggle("online", online);
    status.classList.toggle("offline", !online);
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
    window.addEventListener("load", async () => {
      try {
        const registration = await navigator.serviceWorker.register("service-worker.js", { scope: "./" });
        registration.addEventListener("updatefound", () => {
          const worker = registration.installing;
          if (!worker) return;
          worker.addEventListener("statechange", () => {
            if (worker.state === "installed" && navigator.serviceWorker.controller) {
              showToast("A newer Road Companion build is ready. Tap Refresh.", 5200);
            }
          });
        });
      } catch (error) {
        console.warn("Service worker registration failed", error);
      }
    });
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (sessionStorage.getItem("bobsx4-controller-reloaded")) return;
      sessionStorage.setItem("bobsx4-controller-reloaded", "1");
      window.location.reload();
    });
  }

  function initInstallPrompt() {
    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      deferredInstallPrompt = event;
      $("#install-button").classList.remove("hidden");
    });
    $("#install-button").addEventListener("click", async () => {
      if (!deferredInstallPrompt) return;
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      $("#install-button").classList.add("hidden");
    });
  }

  function handleAction(button) {
    const action = button.dataset.action;
    if (!action) return;
    switch (action) {
      case "go-home": setView("home"); break;
      case "open-current-adventure":
      case "open-adventure": setView("adventure"); break;
      case "open-trip-days": setView("trip"); setTripTab("days"); break;
      case "open-stays": setView("trip"); setTripTab("stays"); break;
      case "open-lists": setView("trip"); setTripTab("lists"); break;
      case "open-memories": setView("memories"); break;
      case "refresh-app": refreshApp(); break;
      case "check-update": checkForUpdate(); break;
      case "print-trip": window.print(); break;
      case "toggle-day": {
        const dayId = button.dataset.dayId;
        if (expandedDays.has(dayId)) expandedDays.delete(dayId); else expandedDays.add(dayId);
        renderItinerary();
        break;
      }
      case "open-day-adventure": selectAdventureDay(button.dataset.dayId, { scroll: false }); setView("adventure"); break;
      case "edit-hotel": openHotelDialog(button.dataset.dayId); break;
      case "close-hotel-dialog": $("#hotel-dialog").close(); break;
      case "open-profile-menu": renderProfiles(); $("#profile-picker").showModal(); break;
      case "close-profile-picker": $("#profile-picker").close(); break;
      case "select-profile": selectProfile(button.dataset.profileId); break;
      case "edit-profile": openProfileDialog(button.dataset.profileId); break;
      case "close-profile-dialog": $("#profile-dialog").close(); break;
      case "previous-adventure-day": {
        const index = dayIndex(getSelectedAdventureDay());
        const days = getAdventure().days;
        selectAdventureDay(days[Math.max(0, index - 1)].id, { scroll: false });
        break;
      }
      case "next-adventure-day": {
        const index = dayIndex(getSelectedAdventureDay());
        const days = getAdventure().days;
        selectAdventureDay(days[Math.min(days.length - 1, index + 1)].id, { scroll: false });
        break;
      }
      case "current-adventure-day": selectAdventureDay(getCurrentOrNextDay().id, { scroll: false }); break;
      case "select-adventure-day": selectAdventureDay(button.dataset.dayId, { scroll: false }); break;
      case "increment-sighting": updateAdventureProgress((progress) => { progress.sightings[button.dataset.spotId] = (Number(progress.sightings[button.dataset.spotId]) || 0) + 1; }); break;
      case "decrement-sighting": updateAdventureProgress((progress) => { progress.sightings[button.dataset.spotId] = Math.max(0, (Number(progress.sightings[button.dataset.spotId]) || 0) - 1); }); break;
      case "set-rating": updateAdventureProgress((progress) => { progress.journal.rating = Number(button.dataset.rating) || 0; }); break;
      case "claim-day-badge": claimDayBadge(); break;
      case "delete-custom-item": {
        const listName = button.dataset.list;
        const itemId = button.dataset.itemId;
        const adventureState = getAdventureState();
        adventureState.customItems[listName] = adventureState.customItems[listName].filter((item) => item.id !== itemId);
        delete adventureState.checks[checkKey(listName, itemId)];
        saveState();
        renderChecklist();
        renderReadiness();
        break;
      }
      case "open-google-overview-1": {
        const days = getAdventure().days.slice(0, 5);
        const stops = [days[0].start, days[0].end, "St. Mary Visitor Center, Glacier National Park", days[1].end, days[2].end, "Spokane Valley Mall, WA", days[4].end];
        window.open(googleDirections(stops), "_blank", "noopener");
        break;
      }
      case "open-google-overview-2": {
        const days = getAdventure().days;
        const stops = [days[5].start, "Kootenay Bay Ferry Terminal, BC", days[5].end, days[6].end, "Kangaroo Creek Farm, Kelowna, BC", days[7].end, days[8].end, days[9].end];
        window.open(googleDirections(stops), "_blank", "noopener");
        break;
      }
      case "export-backup": exportBackup(); break;
      case "reset-data": {
        if (window.confirm("Reset all local Road Companion data on this device? This removes hotel details, journals, tallies, badges, and checklists.")) {
          localStorage.removeItem(STORAGE_KEY);
          state = buildDefaultState();
          saveState();
          renderAll();
          showToast("Local data reset.");
        }
        break;
      }
      default: break;
    }
  }

  function bindEvents() {
    document.addEventListener("click", (event) => {
      const nav = event.target.closest("[data-nav]");
      if (nav) {
        setView(nav.dataset.nav);
        return;
      }
      const tripTab = event.target.closest("[data-trip-tab]");
      if (tripTab) {
        setTripTab(tripTab.dataset.tripTab);
        return;
      }
      const filter = event.target.closest("[data-filter]");
      if (filter) {
        itineraryFilter = filter.dataset.filter;
        $$('[data-filter]').forEach((button) => button.classList.toggle("active", button.dataset.filter === itineraryFilter));
        renderItinerary();
        return;
      }
      const action = event.target.closest("[data-action]");
      if (action) handleAction(action);
    });

    document.addEventListener("change", (event) => {
      const target = event.target;
      if (target.matches("[data-day-complete]")) {
        getAdventureState().completedDays[target.dataset.dayComplete] = target.checked;
        saveState();
        renderItinerary();
        return;
      }
      if (target.matches("[data-check-list]")) {
        getAdventureState().checks[checkKey(target.dataset.checkList, target.dataset.checkId)] = target.checked;
        saveState();
        renderChecklist();
        renderReadiness();
        return;
      }
      if (target.matches("[data-mission-id]")) {
        updateAdventureProgress((progress) => { progress.missions[target.dataset.missionId] = target.checked; });
        return;
      }
      if (target.id === "photo-mission-check") {
        updateAdventureProgress((progress) => { progress.photoDone = target.checked; });
      }
    });

    document.addEventListener("input", (event) => {
      const target = event.target;
      if (target.matches("[data-journal-field]")) {
        setJournalField(target.dataset.journalField, target.value);
        return;
      }
      if (target.id === "general-notes") {
        getAdventureState().notes.general = target.value;
        saveState();
        $("#notes-save-status").textContent = "Saving…";
        clearTimeout(notesSaveTimer);
        notesSaveTimer = setTimeout(() => { $("#notes-save-status").textContent = "Saved"; }, 450);
      }
    });

    $("#hotel-form").addEventListener("submit", saveHotel);
    $("#profile-form").addEventListener("submit", saveProfile);
    $("#custom-item-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const input = $("#custom-item-input");
      const name = input.value.trim();
      if (!name) return;
      const listName = getAdventureState().activeList;
      getAdventureState().customItems[listName].push({ id: `custom-${Date.now()}`, name });
      input.value = "";
      saveState();
      renderChecklist();
    });
    $("#import-file").addEventListener("change", (event) => {
      const file = event.target.files?.[0];
      if (file) importBackup(file);
      event.target.value = "";
    });

    $$('[data-list-tab]').forEach((button) => button.addEventListener("click", () => {
      getAdventureState().activeList = button.dataset.listTab;
      saveState();
      renderChecklist();
    }));

    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);
    window.addEventListener("focus", () => { renderCountdown(); renderNextDay(); });
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) { renderCountdown(); renderNextDay(); }
    });
  }

  function init() {
    bindEvents();
    initInstallPrompt();
    registerServiceWorker();
    renderAll();
    const requested = location.hash.replace("#", "");
    setView(VALID_VIEWS.includes(requested) ? requested : "home", { keepScroll: true });
    setTripTab(activeTripTab);
  }

  init();
})();
