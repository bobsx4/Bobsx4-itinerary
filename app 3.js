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
  const VALID_EXPERIENCES = ["navigator", "explorer", "roadcrew"];
  const JOURNAL_FIELDS = ["favorite", "ate", "bought", "surprise", "note"];
  const REFRESH_EDIT_NOTICE_KEY = "bobsx4-refresh-preserved-edits";
  const DEPARTURE_SHIFT_SOURCE = "departure-shift";
  const DEPARTURE_SHIFT_FIELDS = ["arrival", "timeline"];
  const ITINERARY_FIELDS = {
    title: { type: "string", inputId: "itinerary-title" },
    start: { type: "string", inputId: "itinerary-start" },
    end: { type: "string", inputId: "itinerary-end" },
    overnight: { type: "string", inputId: "itinerary-overnight" },
    distanceKm: { type: "number", inputId: "itinerary-distance" },
    driveTime: { type: "string", inputId: "itinerary-drive-time" },
    departure: { type: "string", inputId: "itinerary-departure" },
    arrival: { type: "string", inputId: "itinerary-arrival" },
    summary: { type: "string", inputId: "itinerary-summary" },
    timeZoneNote: { type: "string", inputId: "itinerary-time-zone" },
    stops: { type: "lines", inputId: "itinerary-stops" },
    timeline: { type: "timeline", inputId: "itinerary-timeline" },
    mustDo: { type: "lines", inputId: "itinerary-must-do" },
    optional: { type: "lines", inputId: "itinerary-optional" },
    alerts: { type: "lines", inputId: "itinerary-alerts" }
  };
  const STAY_FIELDS = ["name", "address", "confirmation", "phone", "website", "checkin", "checkout", "notes"];
  const STAY_INPUT_IDS = {
    name: "hotel-name",
    address: "hotel-address",
    confirmation: "hotel-confirmation",
    phone: "hotel-phone",
    website: "hotel-website",
    checkin: "hotel-checkin",
    checkout: "hotel-checkout",
    notes: "hotel-notes"
  };

  let state = loadState();
  let itineraryFilter = "all";
  let activeTripTab = "days";
  let deferredInstallPrompt = null;
  let toastTimer = null;
  let journalSaveTimer = null;
  let notesSaveTimer = null;
  let profileDialogMode = "edit";
  const expandedDays = new Set();
  const itineraryEditorTouchedFields = new Set();
  const itineraryEditorAutoFields = new Set();

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function clone(value) {
    return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
  }

  function makeId(prefix = "record") {
    const random = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
    return `${prefix}-${random}`;
  }

  function cleanId(value, fallbackPrefix = "record") {
    const cleaned = String(value || "").trim().replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 120);
    return cleaned || makeId(fallbackPrefix);
  }

  function cleanText(value, maximum = 600) {
    return String(value ?? "").trim().slice(0, maximum);
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function normalizeExperience(value, fallback = "roadcrew") {
    return VALID_EXPERIENCES.includes(value) ? value : fallback;
  }

  function normalizeProfile(profile, fallback = {}) {
    const experience = normalizeExperience(profile?.experience, normalizeExperience(fallback.experience, "roadcrew"));
    const name = cleanText(profile?.name || fallback.name || "Traveller", 30);
    return {
      ...clone(fallback),
      ...(profile && typeof profile === "object" ? clone(profile) : {}),
      id: cleanId(profile?.id || fallback.id, "traveller"),
      name,
      experience,
      roleLabel: cleanText(
        profile?.roleLabel
          || DATA.experienceModes?.[experience]?.role
          || fallback.roleLabel
          || "Traveller",
        80
      ),
      initials: cleanText(profile?.initials || name.slice(0, 1).toUpperCase(), 3),
      accent: cleanText(profile?.accent || fallback.accent || (experience === "roadcrew" ? "amber" : experience === "explorer" ? "teal" : "indigo"), 20)
    };
  }

  function addRecordIdentity(record, { tripId, profileId, deviceId, prefix = "record" }) {
    const next = record && typeof record === "object" ? record : {};
    const timestamp = nowIso();
    next.recordId = cleanId(next.recordId, prefix);
    next.tripId = cleanText(next.tripId || tripId, 120);
    next.profileId = cleanId(next.profileId || profileId, "traveller");
    next.originDeviceId = cleanId(next.originDeviceId || deviceId, "device");
    next.createdAt = cleanText(next.createdAt || timestamp, 40);
    next.updatedAt = cleanText(next.updatedAt || next.createdAt || timestamp, 40);
    return next;
  }

  function touchRecord(record) {
    if (record && typeof record === "object") record.updatedAt = nowIso();
  }

  function owns(object, key) {
    return Boolean(object && Object.prototype.hasOwnProperty.call(object, key));
  }

  function valuesEqual(left, right) {
    return JSON.stringify(left) === JSON.stringify(right);
  }

  function normalizeLines(value) {
    if (!Array.isArray(value)) return [];
    return value
      .map((item) => String(item ?? "").trim())
      .filter(Boolean)
      .slice(0, 60);
  }

  function normalizeTimeline(value) {
    if (!Array.isArray(value)) return [];
    return value
      .map((item) => ({
        time: String(item?.time ?? "").trim(),
        title: String(item?.title ?? "").trim(),
        detail: String(item?.detail ?? "").trim()
      }))
      .filter((item) => item.time || item.title || item.detail)
      .slice(0, 40);
  }

  function parseClockMinutes(value) {
    const match = String(value ?? "").match(/\b(1[0-2]|0?[1-9])(?::([0-5]\d))?\s*([ap])\.?m\.?/i);
    if (!match) return null;
    let hour = Number(match[1]) % 12;
    if (match[3].toLowerCase() === "p") hour += 12;
    return (hour * 60) + Number(match[2] || 0);
  }

  function clockShiftMinutes(publishedDeparture, effectiveDeparture) {
    const published = parseClockMinutes(publishedDeparture);
    const effective = parseClockMinutes(effectiveDeparture);
    if (published === null || effective === null) return null;
    let shift = effective - published;
    if (shift > 720) shift -= 1440;
    if (shift < -720) shift += 1440;
    return shift;
  }

  function formatClockMinutes(value) {
    const normalized = ((value % 1440) + 1440) % 1440;
    const hour24 = Math.floor(normalized / 60);
    const minute = normalized % 60;
    const suffix = hour24 >= 12 ? "PM" : "AM";
    const hour12 = hour24 % 12 || 12;
    return `${hour12}:${String(minute).padStart(2, "0")} ${suffix}`;
  }

  function shiftClockText(value, shift) {
    if (!Number.isFinite(shift) || shift === 0) return String(value ?? "");
    return String(value ?? "").replace(
      /\b(1[0-2]|0?[1-9])(?::([0-5]\d))?\s*([ap])\.?m\.?/gi,
      (match, hourValue, minuteValue, suffixValue) => {
        let minutes = Number(hourValue) % 12;
        if (String(suffixValue).toLowerCase() === "p") minutes += 12;
        minutes = (minutes * 60) + Number(minuteValue || 0);
        return formatClockMinutes(minutes + shift);
      }
    );
  }

  function departureShiftSchedule(publishedDay, effectiveDeparture) {
    if (!publishedDay) return null;
    const shift = clockShiftMinutes(publishedDay.departure, effectiveDeparture);
    if (shift === null) return null;
    return {
      shift,
      arrival: shiftClockText(publishedDay.arrival, shift),
      timeline: normalizeTimeline(publishedDay.timeline).map((item) => ({
        ...item,
        time: shiftClockText(item.time, shift)
      }))
    };
  }

  function normalizeEditableValue(type, value) {
    if (type === "number") {
      const number = Number(value);
      return Number.isFinite(number) && number >= 0 ? number : 0;
    }
    if (type === "lines") return normalizeLines(value);
    if (type === "timeline") return normalizeTimeline(value);
    return String(value ?? "");
  }

  function normalizeOverrideEntry(entry, type, publishedValue) {
    if (entry === undefined || entry === null) return null;
    const structured = typeof entry === "object" && !Array.isArray(entry) && owns(entry, "value");
    const value = normalizeEditableValue(type, structured ? entry.value : entry);
    const published = normalizeEditableValue(type, publishedValue);
    if (valuesEqual(value, published)) return null;
    const base = structured && owns(entry, "base")
      ? normalizeEditableValue(type, entry.base)
      : clone(published);
    const normalized = { value, base };
    if (structured && entry.source === DEPARTURE_SHIFT_SOURCE) normalized.source = DEPARTURE_SHIFT_SOURCE;
    return normalized;
  }

  function normalizeItineraryOverrides(saved, adventure) {
    const normalized = {};
    if (!saved || typeof saved !== "object") return normalized;
    adventure.days.forEach((day) => {
      const savedDay = saved[day.id];
      if (!savedDay || typeof savedDay !== "object") return;
      const fields = {};
      Object.entries(ITINERARY_FIELDS).forEach(([field, definition]) => {
        if (!owns(savedDay, field)) return;
        const entry = normalizeOverrideEntry(savedDay[field], definition.type, day[field]);
        if (entry) fields[field] = entry;
      });
      const departureEntry = fields.departure;
      const shifted = departureEntry ? departureShiftSchedule(day, departureEntry.value) : null;
      DEPARTURE_SHIFT_FIELDS.forEach((field) => {
        const savedEntry = savedDay[field];
        const savedSource = savedEntry && typeof savedEntry === "object" && savedEntry.source;
        if (!departureEntry || !shifted) {
          if (fields[field]?.source === DEPARTURE_SHIFT_SOURCE) delete fields[field];
          return;
        }
        if (owns(savedDay, field)) {
          if (savedSource !== DEPARTURE_SHIFT_SOURCE) return;
          return;
        }
        const definition = ITINERARY_FIELDS[field];
        const value = normalizeEditableValue(definition.type, shifted[field]);
        const published = normalizeEditableValue(definition.type, day[field]);
        if (!valuesEqual(value, published)) {
          fields[field] = {
            value,
            base: clone(published),
            source: DEPARTURE_SHIFT_SOURCE
          };
        }
      });
      if (Object.keys(fields).length) normalized[day.id] = fields;
    });
    return normalized;
  }

  function normalizeStayOverrides(saved, adventure) {
    const normalized = {};
    if (!saved || typeof saved !== "object") return normalized;
    adventure.days.forEach((day) => {
      const savedStay = saved[day.id];
      if (!savedStay || typeof savedStay !== "object") return;
      const published = adventure.reservations?.[day.id] || {};
      const fields = {};
      STAY_FIELDS.forEach((field) => {
        if (!owns(savedStay, field)) return;
        const entry = normalizeOverrideEntry(savedStay[field], "string", published[field] || "");
        if (entry) fields[field] = entry;
      });
      if (Object.keys(fields).length) normalized[day.id] = fields;
    });
    return normalized;
  }

  function migrateLegacyHotels(savedHotels, adventure) {
    const overrides = {};
    if (!savedHotels || typeof savedHotels !== "object") return overrides;
    adventure.days.forEach((day) => {
      const savedStay = savedHotels[day.id];
      if (!savedStay || typeof savedStay !== "object") return;
      const published = adventure.reservations?.[day.id] || {};
      const fields = {};
      STAY_FIELDS.forEach((field) => {
        if (!owns(savedStay, field)) return;
        const value = normalizeEditableValue("string", savedStay[field]);
        const base = normalizeEditableValue("string", published[field] || "");
        if (!valuesEqual(value, base)) fields[field] = { value, base };
      });
      if (Object.keys(fields).length) overrides[day.id] = fields;
    });
    return overrides;
  }

  function mergeOverrideMaps(first, second) {
    const merged = clone(first || {});
    Object.entries(second || {}).forEach(([dayId, fields]) => {
      merged[dayId] = { ...(merged[dayId] || {}), ...clone(fields) };
    });
    return merged;
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
      itineraryOverrides: {},
      stayOverrides: {},
      notes: { general: "", daily: {} },
      customItems: { shopping: [], packing: [], border: [] },
      activeList: "shopping",
      selectedAdventureDayId: null,
      profileProgress,
      driveLog: { stretches: [] }
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
      deviceId: makeId("device"),
      activeAdventureId: DATA.adventures[0].id,
      activeProfileId: DATA.defaultProfiles[0].id,
      profiles,
      adventures
    };
  }

  function normalizeDriveStretch(stretch, adventure, profiles, deviceId) {
    if (!stretch || typeof stretch !== "object") return null;
    const dayId = adventure.days.some((day) => day.id === stretch.dayId)
      ? stretch.dayId
      : adventure.days[0]?.id;
    const profileId = profiles[stretch.profileId || stretch.driverId]
      ? (stretch.profileId || stretch.driverId)
      : Object.values(profiles).find((profile) => profile.experience === "roadcrew")?.id;
    if (!dayId || !profileId) return null;
    const normalized = addRecordIdentity({}, {
      tripId: adventure.id,
      profileId,
      deviceId,
      prefix: "drive"
    });
    normalized.recordId = cleanId(stretch.recordId || stretch.id, "drive");
    normalized.tripId = adventure.id;
    normalized.profileId = profileId;
    normalized.driverId = profileId;
    normalized.originDeviceId = cleanId(stretch.originDeviceId || deviceId, "device");
    normalized.createdAt = cleanText(stretch.createdAt || nowIso(), 40);
    normalized.updatedAt = cleanText(stretch.updatedAt || normalized.createdAt, 40);
    normalized.dayId = dayId;
    normalized.from = cleanText(stretch.from, 100);
    normalized.to = cleanText(stretch.to, 100);
    normalized.startTime = cleanText(stretch.startTime, 10);
    normalized.endTime = cleanText(stretch.endTime, 10);
    const hasStartOdometer = stretch.startOdometer !== "" && stretch.startOdometer !== null && stretch.startOdometer !== undefined;
    const hasEndOdometer = stretch.endOdometer !== "" && stretch.endOdometer !== null && stretch.endOdometer !== undefined;
    const startOdometer = Number(stretch.startOdometer);
    const endOdometer = Number(stretch.endOdometer);
    normalized.startOdometer = hasStartOdometer && Number.isFinite(startOdometer) && startOdometer >= 0 ? startOdometer : "";
    normalized.endOdometer = hasEndOdometer && Number.isFinite(endOdometer) && endOdometer >= 0 ? endOdometer : "";
    normalized.notes = cleanText(stretch.notes, 500);
    return normalized;
  }

  function normalizeDayProgressRecords(savedDays, adventure, profileId, deviceId) {
    if (!savedDays || typeof savedDays !== "object") return {};
    const validDayIds = new Set(adventure.days.map((day) => day.id));
    return Object.fromEntries(Object.entries(savedDays)
      .filter(([dayId, progress]) => validDayIds.has(dayId) && progress && typeof progress === "object")
      .map(([dayId, progress]) => {
        const next = addRecordIdentity(progress, {
          tripId: adventure.id,
          profileId,
          deviceId,
          prefix: "day"
        });
        next.profileId = profileId;
        return [dayId, next];
      }));
  }

  function mergeAdventureState(base, saved, adventure, profiles, deviceId) {
    const next = clone(base);
    if (!saved || typeof saved !== "object") return next;
    next.checks = saved.checks && typeof saved.checks === "object" ? saved.checks : {};
    next.completedDays = saved.completedDays && typeof saved.completedDays === "object" ? saved.completedDays : {};
    next.itineraryOverrides = normalizeItineraryOverrides(saved.itineraryOverrides, adventure);
    next.stayOverrides = mergeOverrideMaps(
      migrateLegacyHotels(saved.hotels, adventure),
      normalizeStayOverrides(saved.stayOverrides, adventure)
    );
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
    Object.keys(profiles).forEach((profileId) => {
      const savedProgress = saved.profileProgress && saved.profileProgress[profileId];
      next.profileProgress[profileId] = {
        days: normalizeDayProgressRecords(savedProgress?.days, adventure, profileId, deviceId)
      };
    });
    const savedStretches = Array.isArray(saved.driveLog?.stretches)
      ? saved.driveLog.stretches
      : Array.isArray(saved.drivingStretches)
        ? saved.drivingStretches
        : [];
    next.driveLog = {
      stretches: savedStretches
        .map((stretch) => normalizeDriveStretch(stretch, adventure, profiles, deviceId))
        .filter(Boolean)
    };
    return next;
  }

  function mergeState(saved) {
    const next = buildDefaultState();
    if (!saved || typeof saved !== "object") return next;
    next.deviceId = cleanId(saved.deviceId || next.deviceId, "device");

    next.activeAdventureId = DATA.adventures.some((adventure) => adventure.id === saved.activeAdventureId)
      ? saved.activeAdventureId
      : next.activeAdventureId;

    next.profiles = {};
    DATA.defaultProfiles.forEach((profile) => {
      const savedProfile = saved.profiles && saved.profiles[profile.id];
      const mergedProfile = normalizeProfile(savedProfile, profile);
      if (profile.id === "navigator" && ["Navigator", ""].includes(cleanText(savedProfile?.name, 30))) mergedProfile.name = "Madi";
      if (profile.id === "explorer" && ["Explorer", ""].includes(cleanText(savedProfile?.name, 30))) mergedProfile.name = "Hallie";
      mergedProfile.id = profile.id;
      next.profiles[profile.id] = mergedProfile;
    });
    Object.entries(saved.profiles || {}).forEach(([profileId, profile]) => {
      if (next.profiles[profileId] || !profile || typeof profile !== "object") return;
      const normalized = normalizeProfile({ ...profile, id: profileId });
      normalized.id = profileId;
      next.profiles[profileId] = normalized;
    });

    next.activeProfileId = next.profiles[saved.activeProfileId]
      ? saved.activeProfileId
      : DATA.defaultProfiles[0].id;

    DATA.adventures.forEach((adventure) => {
      next.adventures[adventure.id] = mergeAdventureState(
        next.adventures[adventure.id],
        saved.adventures && saved.adventures[adventure.id],
        adventure,
        next.profiles,
        next.deviceId
      );
    });

    next.schema = APP.dataSchema;
    return next;
  }

  function migrateLegacyState(legacy) {
    if (!legacy || typeof legacy !== "object") return null;
    const next = buildDefaultState();
    const adventure = DATA.adventures[0];
    const adventureState = next.adventures[adventure.id];
    adventureState.checks = legacy.checks && typeof legacy.checks === "object" ? legacy.checks : {};
    adventureState.completedDays = legacy.completedDays && typeof legacy.completedDays === "object" ? legacy.completedDays : {};
    adventureState.stayOverrides = migrateLegacyHotels(legacy.hotels, adventure);
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
      if (current) {
        const merged = mergeState(current);
        if (Number(current.schema) !== Number(APP.dataSchema)) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        }
        return merged;
      }
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

  function getPublishedAdventure() {
    return DATA.adventures.find((adventure) => adventure.id === state.activeAdventureId) || DATA.adventures[0];
  }

  function getAdventureState() {
    const adventure = getPublishedAdventure();
    if (!state.adventures[adventure.id]) state.adventures[adventure.id] = makeAdventureState(adventure);
    return state.adventures[adventure.id];
  }

  function getPublishedDay(dayId) {
    return getPublishedAdventure().days.find((day) => day.id === dayId) || null;
  }

  function getEffectiveDay(publishedDay) {
    if (!publishedDay) return null;
    const result = { ...publishedDay };
    const overrides = getAdventureState().itineraryOverrides?.[publishedDay.id] || {};
    Object.entries(ITINERARY_FIELDS).forEach(([field, definition]) => {
      const entry = overrides[field];
      if (!entry || !owns(entry, "value")) return;
      result[field] = clone(normalizeEditableValue(definition.type, entry.value));
    });
    return result;
  }

  function getAdventure() {
    const published = getPublishedAdventure();
    return {
      ...published,
      days: published.days.map((day) => getEffectiveDay(day))
    };
  }

  function getPublishedStay(dayId) {
    return clone(getPublishedAdventure().reservations?.[dayId] || {});
  }

  function getEffectiveStay(dayId) {
    const result = Object.fromEntries(STAY_FIELDS.map((field) => [field, String(getPublishedStay(dayId)[field] || "")]));
    const overrides = getAdventureState().stayOverrides?.[dayId] || {};
    STAY_FIELDS.forEach((field) => {
      const entry = overrides[field];
      if (entry && owns(entry, "value")) result[field] = String(entry.value ?? "");
    });
    return result;
  }

  function overrideConflict(entry, publishedValue, type = "string") {
    if (!entry || !owns(entry, "base")) return false;
    return !valuesEqual(
      normalizeEditableValue(type, entry.base),
      normalizeEditableValue(type, publishedValue)
    );
  }

  function dayEditMetrics(dayId) {
    const adventureState = getAdventureState();
    const publishedDay = getPublishedDay(dayId);
    const itinerary = adventureState.itineraryOverrides?.[dayId] || {};
    const stay = adventureState.stayOverrides?.[dayId] || {};
    let itineraryConflicts = 0;
    let stayConflicts = 0;
    Object.entries(itinerary).forEach(([field, entry]) => {
      const definition = ITINERARY_FIELDS[field];
      if (definition && overrideConflict(entry, publishedDay?.[field], definition.type)) itineraryConflicts += 1;
    });
    Object.entries(stay).forEach(([field, entry]) => {
      if (STAY_FIELDS.includes(field) && overrideConflict(entry, getPublishedStay(dayId)[field] || "")) stayConflicts += 1;
    });
    const privateNote = String(adventureState.notes?.daily?.[dayId] || "").trim();
    return {
      itineraryFields: Object.keys(itinerary).length,
      stayFields: Object.keys(stay).length,
      privateNotes: privateNote ? 1 : 0,
      itineraryConflicts,
      stayConflicts,
      conflicts: itineraryConflicts + stayConflicts
    };
  }

  function allEditMetrics() {
    const totals = { itineraryFields: 0, stayFields: 0, privateNotes: 0, conflicts: 0, days: 0 };
    getPublishedAdventure().days.forEach((day) => {
      const metrics = dayEditMetrics(day.id);
      const count = metrics.itineraryFields + metrics.stayFields + metrics.privateNotes;
      if (count) totals.days += 1;
      totals.itineraryFields += metrics.itineraryFields;
      totals.stayFields += metrics.stayFields;
      totals.privateNotes += metrics.privateNotes;
      totals.conflicts += metrics.conflicts;
    });
    totals.fields = totals.itineraryFields + totals.stayFields;
    totals.total = totals.fields + totals.privateNotes;
    return totals;
  }

  function getProfile() {
    return state.profiles[state.activeProfileId] || state.profiles[DATA.defaultProfiles[0].id];
  }

  function experienceDefinition(profile = getProfile()) {
    const experience = normalizeExperience(profile?.experience, "navigator");
    return DATA.experienceModes?.[experience] || {
      name: experience === "roadcrew" ? "Road Crew" : experience === "explorer" ? "Explorer" : "Navigator",
      icon: experience === "roadcrew" ? "↠" : experience === "explorer" ? "◎" : "⌁",
      role: experience === "roadcrew" ? "Driver and journey keeper" : experience === "explorer" ? "Spotter and adventure collector" : "Co-pilot and field reporter",
      verbs: experience === "roadcrew" ? "DRIVE · NOTICE · REMEMBER" : experience === "explorer" ? "SPOT · TRY · COLLECT" : "PLAN · OBSERVE · REPORT",
      description: "A personalised Adventure Mode experience."
    };
  }

  function experienceContent(day, profile = getProfile()) {
    const experience = normalizeExperience(profile?.experience, "navigator");
    const sourceExperience = experience === "roadcrew" ? "navigator" : experience;
    const base = day?.adventure || {};
    const mode = base.modes?.[sourceExperience] || {};
    const legacyMissions = (base.missions || []).filter((mission) => mission.audience === "all" || mission.audience === sourceExperience);
    const legacyPhoto = typeof base.photoMission === "string" ? base.photoMission : base.photoMission?.[sourceExperience];
    return {
      experience,
      definition: experienceDefinition(profile),
      briefing: mode.briefing || base.briefing?.[sourceExperience] || base.briefing?.navigator || day?.summary || "",
      missions: Array.isArray(mode.missions) ? mode.missions : legacyMissions,
      spotting: experience === "roadcrew" ? [] : (Array.isArray(mode.spotting) ? mode.spotting : (base.spotting || [])),
      facts: Array.isArray(mode.facts) ? mode.facts : (base.facts || []),
      photoMission: experience === "roadcrew"
        ? `Passenger or stopped vehicle: ${mode.photoMission || legacyPhoto || "capture one image that helps tell the story of the day."}`
        : mode.photoMission || legacyPhoto || "Capture one image that helps tell the story of the day.",
      badge: experience === "roadcrew" ? null : (mode.badge || base.badge || null),
      teaser: mode.teaser || base.teaser || { title: "Tomorrow", text: "Another travel day is waiting." }
    };
  }

  function experienceLabels(experience) {
    if (experience === "roadcrew") {
      return {
        briefingTitle: "Drive-day briefing",
        missionsKicker: "Before and after the wheel",
        missionsTitle: "Travel-day notes",
        missionsIntro: "Optional route prompts for a passenger or for use while safely stopped.",
        factsKicker: "Route context",
        factsTitle: "Worth knowing today",
        factsIntro: "Useful context for the route, stops, and decisions ahead.",
        photoKicker: "Passenger or parked",
        photoTitle: "Journey photo",
        photoIntro: "Capture the drive only from the passenger seat or while safely stopped.",
        photoComplete: "Journey photo captured",
        roadKicker: "Shared journey",
        roadTitle: "Driving log",
        roadIntro: "Record each driver change and stretch while stopped.",
        roadNote: "The active driver should never enter information while the vehicle is moving.",
        journalKicker: "End of day",
        journalTitle: "Highlights and ratings",
        journalIntro: "A quick adult reflection preserves the details everyone forgets later.",
        ratingPrompt: "How would you rate the day overall?",
        badgeKicker: "Road Crew",
        badgeClaimed: "Saved",
        recordAnswer: "Add a route note",
        editAnswer: "Edit route note",
        responseSaved: "Saved on this device",
        factAnswerLabel: "My note",
        factAnswerPlaceholder: "Record what mattered, once safely stopped..."
      };
    }
    if (experience === "explorer") {
      return {
        briefingTitle: "Today’s adventure",
        missionsKicker: "Get involved",
        missionsTitle: "Today’s missions",
        missionsIntro: "Quick challenges that turn the drive into part of the adventure.",
        factsKicker: "Discover",
        factsTitle: "Cool things to know",
        factsIntro: "Short facts and questions connected to what is outside the window.",
        photoKicker: "Capture it",
        photoTitle: "Photo challenge",
        photoIntro: "One picture that tells today’s story.",
        photoComplete: "Photo challenge completed",
        roadKicker: "I Spy",
        roadTitle: "Road Quest",
        roadIntro: "Count the real things you spot today.",
        roadNote: "Honor system: only count what you really see. Tricky finds deserve a second-person check.",
        journalKicker: "Remember it",
        journalTitle: "My day",
        journalIntro: "Fast answers now make much better memories later.",
        ratingPrompt: "How good was today?",
        badgeKicker: "Adventure badge",
        badgeClaimed: "Badge added to Memories",
        recordAnswer: "Add your answer",
        editAnswer: "Edit your answer",
        responseSaved: "Saved on this device",
        factAnswerLabel: "My answer",
        factAnswerPlaceholder: "Write what you noticed or decided..."
      };
    }
    return {
      briefingTitle: "Navigator briefing",
      missionsKicker: "Co-pilot duties",
      missionsTitle: "Navigator assignments",
      missionsIntro: "Timing, route judgement, and useful observations—not busywork.",
      factsKicker: "Route intelligence",
      factsTitle: "What matters today",
      factsIntro: "Context that helps explain the route, decisions, and landscape.",
      photoKicker: "Document the route",
      photoTitle: "Photo brief",
      photoIntro: "Create one deliberate image for the final travel record.",
      photoComplete: "Photo brief completed",
      roadKicker: "Observe and verify",
      roadTitle: "Field log",
      roadIntro: "Track useful route evidence and patterns rather than random objects.",
      roadNote: "Log confirmed observations only. Accuracy matters more than a high count.",
      journalKicker: "Debrief",
      journalTitle: "Field notes",
      journalIntro: "Record what worked, what changed, and what future-you should know.",
      ratingPrompt: "How strong was today’s route and experience?",
      badgeKicker: "Navigator credential",
      badgeClaimed: "Credential added to Memories",
      recordAnswer: "Record field response",
      editAnswer: "Edit field response",
      responseSaved: "Saved on this device",
      factAnswerLabel: "Field response",
      factAnswerPlaceholder: "Record the answer, comparison, or observation..."
    };
  }

  function ensureProfileProgress(profileId = state.activeProfileId) {
    const adventureState = getAdventureState();
    if (!adventureState.profileProgress[profileId]) adventureState.profileProgress[profileId] = makeProfileProgress();
    return adventureState.profileProgress[profileId];
  }

  function emptyDayProgress(dayId = "", profileId = state.activeProfileId) {
    return addRecordIdentity({
      missions: {},
      missionResponses: {},
      factResponses: {},
      sightings: {},
      journal: { rating: 0, favorite: "", ate: "", bought: "", surprise: "", note: "" },
      photoDone: false,
      badgeClaimed: false
    }, {
      tripId: getPublishedAdventure().id,
      profileId,
      deviceId: state.deviceId,
      prefix: "day"
    });
  }

  function getDayProgress(dayId, profileId = state.activeProfileId, create = true) {
    const profileProgress = ensureProfileProgress(profileId);
    if (!profileProgress.days[dayId] && create) profileProgress.days[dayId] = emptyDayProgress(dayId, profileId);
    const progress = profileProgress.days[dayId] || emptyDayProgress(dayId, profileId);
    addRecordIdentity(progress, {
      tripId: getPublishedAdventure().id,
      profileId,
      deviceId: state.deviceId,
      prefix: "day"
    });
    progress.profileId = profileId;
    if (!progress.missions || typeof progress.missions !== "object") progress.missions = {};
    if (!progress.missionResponses || typeof progress.missionResponses !== "object") progress.missionResponses = {};
    if (!progress.factResponses || typeof progress.factResponses !== "object") progress.factResponses = {};
    if (!progress.sightings || typeof progress.sightings !== "object") progress.sightings = {};
    if (!progress.journal || typeof progress.journal !== "object") progress.journal = emptyDayProgress(dayId, profileId).journal;
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
    return Boolean(hotel && STAY_FIELDS.some((field) => String(hotel[field] || "").trim()));
  }

  function resolveHotel(dayId, visited = new Set()) {
    const adventure = getAdventure();
    const day = adventure.days.find((item) => item.id === dayId);
    if (!day || visited.has(dayId)) return { hotel: null, inherited: false, sourceDayId: null };
    visited.add(dayId);
    const explicit = getEffectiveStay(dayId);
    if (hotelHasContent(explicit)) return { hotel: explicit, inherited: false, sourceDayId: dayId };
    const index = dayIndex(dayId);
    if (index > 0) {
      const previous = adventure.days[index - 1];
      if (previous.overnight === day.overnight) {
        const resolved = resolveHotel(previous.id, visited);
        if (resolved.hotel) return { hotel: resolved.hotel, inherited: true, sourceDayId: resolved.sourceDayId };
      }
    }
    return { hotel: explicit, inherited: false, sourceDayId: dayId };
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

  function combinedDayStops(days, limit = 9) {
    const stops = days.reduce((all, day) => {
      effectiveStops(day).forEach((stop) => {
        if (stop && stop !== all[all.length - 1]) all.push(stop);
      });
      return all;
    }, []);
    if (stops.length <= limit) return stops;
    const result = [stops[0]];
    const interiorCount = limit - 2;
    for (let index = 1; index <= interiorCount; index += 1) {
      const sourceIndex = Math.round((index * (stops.length - 1)) / (interiorCount + 1));
      const stop = stops[sourceIndex];
      if (stop && stop !== result[result.length - 1]) result.push(stop);
    }
    if (stops[stops.length - 1] !== result[result.length - 1]) result.push(stops[stops.length - 1]);
    return result;
  }

  function renderHeader() {
    const profile = getProfile();
    const mode = experienceDefinition(profile);
    document.body.dataset.experience = profile.experience;
    $("#view-adventure").dataset.experience = profile.experience;
    $("#profile-button").dataset.experience = profile.experience;
    $("#header-version").textContent = APP.version;
    $("#app-version").textContent = APP.version;
    $("#build-date").textContent = APP.buildDate;
    $("#profile-name").textContent = profile.name;
    $("#profile-initials").textContent = (profile.name || profile.initials || "?").trim().slice(0, 1).toUpperCase();
    $("#profile-initials").style.background = profile.experience === "roadcrew"
      ? "var(--accent-soft)"
      : profile.experience === "explorer"
        ? "var(--teal-soft)"
        : "var(--indigo-soft)";
    $("#profile-initials").style.color = profile.experience === "roadcrew"
      ? "#98511f"
      : profile.experience === "explorer"
        ? "var(--teal)"
        : "var(--indigo)";
    $("#profile-button").setAttribute("aria-label", `${profile.name}, ${mode.name} mode. Choose Adventure profile`);
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
    const edits = dayEditMetrics(day.id);
    const editCount = edits.itineraryFields + edits.stayFields + edits.privateNotes;
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
        <div class="route-meta"><span class="meta-pill">${escapeHtml(day.distanceKm)} km</span><span class="meta-pill">${escapeHtml(day.driveTime)}</span><span class="meta-pill">Night: ${escapeHtml(day.overnight)}</span>${editCount ? `<span class="meta-pill local-edit-pill">${editCount} local edit${editCount === 1 ? "" : "s"}</span>` : ""}</div>
      </article>`;
  }

  function getDriveLog() {
    const adventureState = getAdventureState();
    if (!adventureState.driveLog || typeof adventureState.driveLog !== "object") {
      adventureState.driveLog = { stretches: [] };
    }
    if (!Array.isArray(adventureState.driveLog.stretches)) adventureState.driveLog.stretches = [];
    return adventureState.driveLog;
  }

  function allDriveStretches() {
    return getDriveLog().stretches
      .filter((stretch) => stretch && typeof stretch === "object")
      .sort((left, right) => {
        const leftDay = dayIndex(left.dayId);
        const rightDay = dayIndex(right.dayId);
        if (leftDay !== rightDay) return leftDay - rightDay;
        return String(left.startTime || left.createdAt).localeCompare(String(right.startTime || right.createdAt));
      });
  }

  function driveStretchDistance(stretch) {
    const start = Number(stretch.startOdometer);
    const end = Number(stretch.endOdometer);
    if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) return 0;
    return end - start;
  }

  function clockMinutes(value) {
    const match = String(value || "").match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return null;
    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    if (hours > 23 || minutes > 59) return null;
    return (hours * 60) + minutes;
  }

  function driveStretchMinutes(stretch) {
    const start = clockMinutes(stretch.startTime);
    const end = clockMinutes(stretch.endTime);
    if (start === null || end === null) return 0;
    return end >= start ? end - start : (24 * 60) - start + end;
  }

  function formatMinutes(value) {
    const minutes = Math.max(0, Math.round(Number(value) || 0));
    const hours = Math.floor(minutes / 60);
    const remainder = minutes % 60;
    if (!hours) return `${remainder} min`;
    return remainder ? `${hours} h ${remainder} min` : `${hours} h`;
  }

  function driveTotals(stretches = allDriveStretches()) {
    const totals = {};
    stretches.forEach((stretch) => {
      const profileId = stretch.driverId || stretch.profileId;
      if (!totals[profileId]) totals[profileId] = { profileId, stretches: 0, kilometres: 0, minutes: 0 };
      totals[profileId].stretches += 1;
      totals[profileId].kilometres += driveStretchDistance(stretch);
      totals[profileId].minutes += driveStretchMinutes(stretch);
    });
    return Object.values(totals);
  }

  function drivingProfiles() {
    const roadCrew = Object.values(state.profiles).filter((profile) => profile.experience === "roadcrew");
    return roadCrew.length ? roadCrew : Object.values(state.profiles);
  }

  function currentClockTime() {
    const date = new Date();
    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  }

  function renderDriveLog(day = getSelectedAdventureDay()) {
    const card = $("#drive-log-card");
    if (!card) return;
    const roadCrew = getProfile().experience === "roadcrew";
    card.hidden = !roadCrew;
    if (!roadCrew) return;
    const stretches = allDriveStretches().filter((stretch) => stretch.dayId === day.id);
    const distance = stretches.reduce((sum, stretch) => sum + driveStretchDistance(stretch), 0);
    const minutes = stretches.reduce((sum, stretch) => sum + driveStretchMinutes(stretch), 0);
    $("#drive-log-day-summary").textContent = stretches.length
      ? `${stretches.length} stretch${stretches.length === 1 ? "" : "es"}${distance ? ` · ${distance.toLocaleString("en-CA")} km` : ""}${minutes ? ` · ${formatMinutes(minutes)}` : ""}`
      : "No driving stretches recorded for this day.";
    $("#drive-log-list").innerHTML = stretches.length
      ? stretches.map((stretch) => {
        const driver = state.profiles[stretch.driverId || stretch.profileId];
        const route = [stretch.from, stretch.to].filter(Boolean).join(" → ") || "Route not entered";
        const timing = [stretch.startTime, stretch.endTime].filter(Boolean).join("–") || "Time not entered";
        const kilometres = driveStretchDistance(stretch);
        return `<article class="drive-stretch">
          <div class="drive-stretch-head"><div><strong>${escapeHtml(driver?.name || "Traveller")}</strong><span>${escapeHtml(timing)}${kilometres ? ` · ${escapeHtml(kilometres.toLocaleString("en-CA"))} km` : ""}</span></div><div class="drive-stretch-actions"><button type="button" data-action="edit-driving-stretch" data-stretch-id="${escapeHtml(stretch.recordId)}">Edit</button><button type="button" data-action="delete-driving-stretch" data-stretch-id="${escapeHtml(stretch.recordId)}" aria-label="Delete driving stretch">×</button></div></div>
          <span class="drive-route">${escapeHtml(route)}</span>
          ${stretch.notes ? `<p>${escapeHtml(stretch.notes)}</p>` : ""}
        </article>`;
      }).join("")
      : `<div class="empty-drive-log"><strong>Start the shared journey record</strong><span>Add a stretch each time the driver changes. Times and odometers are optional.</span></div>`;
    const totals = driveTotals();
    $("#drive-log-totals").innerHTML = totals.length
      ? totals.map((total) => {
        const driver = state.profiles[total.profileId];
        return `<span><strong>${escapeHtml(driver?.name || "Traveller")}</strong>${escapeHtml(`${total.stretches} stretch${total.stretches === 1 ? "" : "es"}${total.kilometres ? ` · ${total.kilometres.toLocaleString("en-CA")} km` : ""}${total.minutes ? ` · ${formatMinutes(total.minutes)}` : ""}`)}</span>`;
      }).join("")
      : "";
  }

  function profileMetrics(profileId = state.activeProfileId) {
    const adventure = getAdventure();
    const profileProgress = ensureProfileProgress(profileId);
    const profile = state.profiles[profileId] || getProfile();
    let sightings = 0;
    let missions = 0;
    let journals = 0;
    let ratings = 0;
    let dayBadges = 0;
    adventure.days.forEach((day) => {
      const progress = getDayProgress(day.id, profileId, false);
      const content = experienceContent(day, profile);
      sightings += totalSightings(progress, content.spotting);
      missions += content.missions.filter((mission) => Boolean(progress.missions?.[mission.id])).length;
      if (journalHasContent(progress.journal)) journals += 1;
      if (Number(progress.journal.rating) > 0) ratings += 1;
      if (progress.badgeClaimed) dayBadges += 1;
    });
    const driverStretches = allDriveStretches().filter((stretch) => (stretch.driverId || stretch.profileId) === profileId);
    const drivenKm = driverStretches.reduce((sum, stretch) => sum + driveStretchDistance(stretch), 0);
    const drivingMinutes = driverStretches.reduce((sum, stretch) => sum + driveStretchMinutes(stretch), 0);
    return { sightings, missions, journals, ratings, dayBadges, driverStretches: driverStretches.length, drivenKm, drivingMinutes, days: profileProgress.days };
  }

  function earnedGlobalBadges(profileId = state.activeProfileId) {
    const metrics = profileMetrics(profileId);
    return DATA.globalBadges.filter((badge) => Number(metrics[badge.type]) >= Number(badge.threshold));
  }

  function renderHomeProfileProgress() {
    const profile = getProfile();
    const metrics = profileMetrics();
    if (profile.experience === "roadcrew") {
      const completedDays = metrics.journals;
      const percent = Math.round((completedDays / Math.max(1, getAdventure().days.length)) * 100);
      $("#profile-progress").innerHTML = `
        <div class="profile-progress-card">
          <div class="profile-progress-avatar roadcrew-avatar">${escapeHtml((profile.name || "?").slice(0,1).toUpperCase())}</div>
          <div class="profile-progress-copy"><strong>${escapeHtml(profile.name)}</strong><span>${escapeHtml(profile.roleLabel || "Driver and journey keeper")}</span><div class="mini-progress roadcrew-progress"><i style="width:${percent}%"></i></div><span>${metrics.journals} reflection day${metrics.journals === 1 ? "" : "s"} · ${metrics.driverStretches} driving stretch${metrics.driverStretches === 1 ? "" : "es"}${metrics.drivenKm ? ` · ${metrics.drivenKm.toLocaleString("en-CA")} km` : ""}</span></div>
        </div>`;
      return;
    }
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
      const edits = dayEditMetrics(day.id);
      const editCount = edits.itineraryFields + edits.stayFields + edits.privateNotes;
      const privateNote = String(adventureState.notes?.daily?.[day.id] || "").trim();
      return `
        <article class="day-card ${status} ${complete ? "complete" : ""} ${expanded ? "expanded" : ""} ${editCount ? "locally-edited" : ""} ${edits.conflicts ? "has-edit-conflict" : ""}" data-day-card="${escapeHtml(day.id)}">
          <button class="day-summary" type="button" data-action="toggle-day" data-day-id="${escapeHtml(day.id)}" aria-expanded="${expanded}">
            <span class="day-date-tile"><span>${escapeHtml(parts.month)}</span><strong>${escapeHtml(parts.day)}</strong></span>
            <span class="day-summary-copy"><h3>${escapeHtml(day.title)}</h3><p>${escapeHtml(day.start)} → ${escapeHtml(day.end)}</p>${editCount ? `<span class="local-edit-badge">${edits.conflicts ? "Review" : "Local"} · ${editCount} edit${editCount === 1 ? "" : "s"}</span>` : ""}</span>
            <span class="day-distance">${escapeHtml(day.distanceKm)} km<small>${escapeHtml(day.driveTime)}</small></span>
          </button>
          <div class="day-details">
            <div class="detail-section"><p>${escapeHtml(day.summary)}</p><div class="route-meta"><span class="meta-pill">Depart: ${escapeHtml(day.departure)}</span><span class="meta-pill">Arrive: ${escapeHtml(day.arrival)}</span><span class="meta-pill">Night: ${escapeHtml(day.overnight)}</span></div></div>
            <div class="detail-section"><h4>Plan</h4><div class="timeline-list">${(day.timeline || []).map((item) => `<div class="timeline-row"><time>${escapeHtml(item.time)}</time><div><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.detail)}</p></div></div>`).join("")}</div></div>
            <div class="detail-section"><h4>Do not forget</h4><ul class="check-bullets">${(day.mustDo || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>
            ${(day.optional || []).length ? `<div class="detail-section"><h4>If time</h4><ul class="check-bullets optional-bullets">${day.optional.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>` : ""}
            ${(day.alerts || []).map((alert) => `<div class="alert-box">${escapeHtml(alert)}</div>`).join("")}
            ${privateNote ? `<div class="private-day-note"><strong>Private note on this device</strong><span>${escapeHtml(privateNote)}</span></div>` : ""}
            <div class="day-actions">
              <a href="${escapeHtml(googleDirections(effectiveStops(day)))}" target="_blank" rel="noopener">Google Maps</a>
              <a href="${escapeHtml(appleDirections(effectiveEndpoints(day).start, effectiveEndpoints(day).end))}" target="_blank" rel="noopener">Apple Maps</a>
              <button type="button" data-action="edit-itinerary-day" data-day-id="${escapeHtml(day.id)}">Edit day</button>
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
      const edits = dayEditMetrics(day.id);
      return `<article class="route-day-card ${edits.itineraryFields ? "locally-edited" : ""}"><div class="route-day-head"><div><strong>${escapeHtml(day.shortDate)} · ${escapeHtml(day.title)}</strong><span>${escapeHtml(day.distanceKm)} km · ${escapeHtml(day.driveTime)}</span></div>${edits.itineraryFields ? `<span class="local-edit-badge">${edits.itineraryFields} local</span>` : ""}</div><div class="route-day-links"><a href="${escapeHtml(googleDirections(effectiveStops(day)))}" target="_blank" rel="noopener">Google route</a><a href="${escapeHtml(appleDirections(endpoints.start, endpoints.end))}" target="_blank" rel="noopener">Apple route</a><button type="button" data-action="edit-itinerary-day" data-day-id="${escapeHtml(day.id)}">Edit day</button></div></article>`;
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
      const edits = dayEditMetrics(day.id);
      const title = hotel.name || `Stay in ${day.overnight}`;
      const mapQuery = hotel.address || day.overnight;
      const website = sanitizeUrl(hotel.website);
      const phone = String(hotel.phone || "").replace(/[^+\d]/g, "");
      return `
        <article class="hotel-card ${edits.stayFields ? "locally-edited" : ""} ${edits.stayConflicts ? "has-edit-conflict" : ""}">
          <div class="hotel-card-head"><div><span class="hotel-date">${escapeHtml(formatDate(day.date, { weekday: "short", month: "short", day: "numeric" }))}</span><h3>${escapeHtml(title)}</h3><span class="hotel-city">${escapeHtml(day.overnight)}${resolved.inherited ? " · same stay as previous night" : ""}</span>${edits.stayFields ? `<span class="local-edit-badge">${edits.stayConflicts ? "Review" : "Local"} · ${edits.stayFields} stay edit${edits.stayFields === 1 ? "" : "s"}</span>` : ""}</div><button class="text-button" type="button" data-action="edit-hotel" data-day-id="${escapeHtml(day.id)}">Edit</button></div>
          <div class="hotel-details">
            ${hotel.address ? `<span>${escapeHtml(hotel.address)}</span>` : `<span>No street address saved yet.</span>`}
            ${hotel.confirmation ? `<span><strong>Confirmation:</strong> ${escapeHtml(hotel.confirmation)}</span>` : ""}
            ${hotel.checkin || hotel.checkout ? `<span><strong>Times:</strong> ${hotel.checkin ? `check-in ${escapeHtml(hotel.checkin)}` : ""}${hotel.checkin && hotel.checkout ? " · " : ""}${hotel.checkout ? `check-out ${escapeHtml(hotel.checkout)}` : ""}</span>` : ""}
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
    return experienceContent(day, profile).missions;
  }

  function visibleSpotting(day, profile = getProfile()) {
    return experienceContent(day, profile).spotting;
  }

  function totalSightings(progress, spotting = null) {
    if (Array.isArray(spotting)) {
      return spotting.reduce((sum, spot) => sum + Math.max(0, Number(progress.sightings?.[spot.id]) || 0), 0);
    }
    return Object.values(progress.sightings || {}).reduce((sum, value) => sum + Math.max(0, Number(value) || 0), 0);
  }

  function arrangeAdventureLayout(experience) {
    const left = $("#adventure-left-column");
    const right = $("#adventure-right-column");
    const cards = {
      missions: $("#missions-card"),
      facts: $("#facts-card"),
      photo: $("#photo-mission-card"),
      road: $("#road-quest-card"),
      journal: $("#journal-card"),
      badge: $("#day-badge-card")
    };
    if (!left || !right || Object.values(cards).some((card) => !card)) return;
    const leftOrder = experience === "explorer"
      ? [cards.missions, cards.road, cards.photo]
      : [cards.missions, cards.facts, cards.photo];
    const rightOrder = experience === "explorer"
      ? [cards.facts, cards.journal, cards.badge]
      : [cards.road, cards.journal, cards.badge];
    leftOrder.forEach((card) => left.appendChild(card));
    rightOrder.forEach((card) => right.appendChild(card));
  }

  function journalHasContent(journal) {
    if (!journal) return false;
    return Number(journal.rating) > 0 || JOURNAL_FIELDS.some((field) => String(journal[field] || "").trim());
  }

  function missionResponseFields(mission) {
    return Array.isArray(mission?.responseFields) ? mission.responseFields : [];
  }

  function missionResponseValues(progress, missionId) {
    const values = progress.missionResponses?.[missionId];
    return values && typeof values === "object" ? values : {};
  }

  function responseValueHasContent(value) {
    return String(value ?? "").trim().length > 0;
  }

  function missionResponseHasContent(progress, mission) {
    const values = missionResponseValues(progress, mission.id);
    return missionResponseFields(mission).some((field) => responseValueHasContent(values[field.id]));
  }

  function anyMissionResponseHasContent(progress) {
    return Object.values(progress.missionResponses || {}).some((values) => values && typeof values === "object" && Object.values(values).some(responseValueHasContent));
  }

  function anyFactResponseHasContent(progress) {
    return Object.values(progress.factResponses || {}).some(responseValueHasContent);
  }

  function renderMissionResponseField(mission, field, value) {
    const common = `data-mission-response-id="${escapeHtml(mission.id)}" data-mission-field-id="${escapeHtml(field.id)}"`;
    const label = escapeHtml(field.label || "Response");
    const placeholder = escapeHtml(field.placeholder || "");
    const safeValue = escapeHtml(value || "");
    if (field.type === "textarea") {
      return `<label class="mission-response-field mission-response-field-wide"><span>${label}</span><textarea rows="${Math.max(2, Number(field.rows) || 3)}" maxlength="800" placeholder="${placeholder}" ${common}>${safeValue}</textarea></label>`;
    }
    if (field.type === "select") {
      const options = (field.options || []).map((option) => `<option value="${escapeHtml(option)}" ${String(value || "") === String(option) ? "selected" : ""}>${escapeHtml(option)}</option>`).join("");
      return `<label class="mission-response-field"><span>${label}</span><select ${common}><option value="">Choose...</option>${options}</select></label>`;
    }
    const type = ["time", "number"].includes(field.type) ? field.type : "text";
    const min = field.min !== undefined ? ` min="${escapeHtml(field.min)}"` : "";
    const max = field.max !== undefined ? ` max="${escapeHtml(field.max)}"` : "";
    const inputMode = field.inputMode ? ` inputmode="${escapeHtml(field.inputMode)}"` : "";
    const maxLength = type === "text" ? ` maxlength="240"` : "";
    return `<label class="mission-response-field"><span>${label}</span><input type="${type}" value="${safeValue}" placeholder="${placeholder}"${min}${max}${inputMode}${maxLength} ${common}></label>`;
  }

  function renderMissionResponse(mission, progress, labels) {
    const fields = missionResponseFields(mission);
    if (!fields.length) return "";
    const values = missionResponseValues(progress, mission.id);
    const answered = missionResponseHasContent(progress, mission);
    return `<details class="mission-response" ${answered ? "open" : ""}><summary><span>${escapeHtml(answered ? labels.editAnswer : labels.recordAnswer)}</span><small data-response-status-for="${escapeHtml(mission.id)}">${answered ? escapeHtml(labels.responseSaved) : ""}</small></summary><div class="mission-response-grid">${fields.map((field) => renderMissionResponseField(mission, field, values[field.id])).join("")}</div><p class="mission-response-note">Answers save automatically on this device and appear in Memories.</p></details>`;
  }

  function factResponseId(fact, index) {
    return fact.id || `fact-${index + 1}`;
  }

  function renderAdventure() {
    const day = getSelectedAdventureDay();
    const profile = getProfile();
    const progress = getDayProgress(day.id);
    const content = experienceContent(day, profile);
    const labels = experienceLabels(content.experience);
    const mode = content.definition;
    const roadCrew = content.experience === "roadcrew";

    $("#view-adventure").dataset.experience = content.experience;
    arrangeAdventureLayout(content.experience);
    $("#road-quest-card").hidden = roadCrew;
    $("#day-badge-card").hidden = roadCrew;
    $("#adventure-profile-label").textContent = `${profile.name} · ${mode.name} · ${mode.role}`;
    $("#adventure-title").textContent = day.title;
    $("#adventure-date-line").textContent = `${formatDate(day.date)} · ${day.distanceKm} km · ${day.driveTime}`;
    renderAdventureDayStrip(day.id);

    $("#mission-briefing").className = `mission-briefing mode-${content.experience}`;
    $("#mission-briefing").innerHTML = `<div class="brief-mode-row"><span class="brief-mode-icon">${escapeHtml(mode.icon)}</span><span><strong>${escapeHtml(mode.name)} mode</strong><small>${escapeHtml(mode.verbs)}</small></span></div><span class="brief-date">${escapeHtml(day.shortDate)} · ${escapeHtml(day.start)} to ${escapeHtml(day.end)}</span><h2 id="mission-briefing-title">${escapeHtml(labels.briefingTitle)}</h2><p>${escapeHtml(content.briefing)}</p><div class="mission-route"><span>${escapeHtml(day.distanceKm)} km planned</span><span>${escapeHtml(day.driveTime)}</span><span>Night: ${escapeHtml(day.overnight)}</span></div>`;

    $("#missions-kicker").textContent = labels.missionsKicker;
    $("#missions-title").textContent = labels.missionsTitle;
    $("#missions-intro").textContent = labels.missionsIntro;
    $("#facts-kicker").textContent = labels.factsKicker;
    $("#facts-title").textContent = labels.factsTitle;
    $("#facts-intro").textContent = labels.factsIntro;
    $("#photo-kicker").textContent = labels.photoKicker;
    $("#photo-mission-title").textContent = labels.photoTitle;
    $("#photo-intro").textContent = labels.photoIntro;
    $("#photo-completion-label").textContent = labels.photoComplete;
    $("#road-quest-kicker").textContent = labels.roadKicker;
    $("#road-quest-title").textContent = labels.roadTitle;
    $("#road-quest-intro").textContent = labels.roadIntro;
    $("#road-quest-note").textContent = labels.roadNote;
    $("#journal-kicker").textContent = labels.journalKicker;
    $("#journal-title").textContent = labels.journalTitle;
    $("#journal-intro").textContent = labels.journalIntro;
    $("#rating-prompt").textContent = labels.ratingPrompt;
    renderDriveLog(day);

    const missions = content.missions;
    const completeMissions = missions.filter((mission) => progress.missions[mission.id]).length;
    const missionPercent = missions.length ? Math.round((completeMissions / missions.length) * 100) : 0;
    $("#mission-progress-label").textContent = `${completeMissions}/${missions.length}`;
    $("#mission-progress-bar").style.width = `${missionPercent}%`;
    $("#mission-list").innerHTML = missions.map((mission, index) => {
      const complete = Boolean(progress.missions[mission.id]);
      return `<article class="mission-item ${complete ? "complete" : ""}"><label class="mission-check"><input type="checkbox" data-mission-id="${escapeHtml(mission.id)}" ${complete ? "checked" : ""}><span class="mission-sequence" aria-hidden="true">${index + 1}</span><span class="mission-copy">${escapeHtml(mission.label)}</span></label>${renderMissionResponse(mission, progress, labels)}</article>`;
    }).join("");

    $("#fact-list").innerHTML = content.facts.map((fact, index) => {
      const responseId = factResponseId(fact, index);
      const response = progress.factResponses?.[responseId] || "";
      return `<article class="fact-card"><h3>${escapeHtml(fact.title)}</h3><p>${escapeHtml(fact.text)}</p>${fact.prompt ? `<span class="fact-prompt">${content.experience === "explorer" ? "Try this" : "Consider"}: ${escapeHtml(fact.prompt)}</span><label class="fact-answer"><span>${escapeHtml(labels.factAnswerLabel)}</span><textarea rows="2" maxlength="600" placeholder="${escapeHtml(labels.factAnswerPlaceholder)}" data-fact-response-id="${escapeHtml(responseId)}">${escapeHtml(response)}</textarea><small>${responseValueHasContent(response) ? escapeHtml(labels.responseSaved) : ""}</small></label>` : ""}${fact.sourceUrl ? `<a class="fact-source" href="${escapeHtml(fact.sourceUrl)}" target="_blank" rel="noopener">Source: ${escapeHtml(fact.sourceLabel || "Official information")}</a>` : ""}</article>`;
    }).join("") || `<p class="supporting-copy">No field notes for this day yet.</p>`;

    $("#photo-mission-text").textContent = content.photoMission;
    $("#photo-mission-check").checked = Boolean(progress.photoDone);

    const sightings = content.spotting;
    const sightTotal = totalSightings(progress, sightings);
    $("#sighting-total").textContent = `${sightTotal} ${content.experience === "navigator" ? "logged" : `find${sightTotal === 1 ? "" : "s"}`}`;
    $("#spotting-grid").innerHTML = sightings.map((spot) => {
      const count = Math.max(0, Number(progress.sightings[spot.id]) || 0);
      const targetText = spot.target ? `${content.experience === "navigator" ? "Field target" : "Quest target"} ${escapeHtml(spot.target)}` : (content.experience === "navigator" ? "Log each confirmed observation" : "Count each real sighting");
      return `<article class="spot-card"><div class="spot-card-head"><span class="spot-icon">${escapeHtml(spot.icon)}</span><span class="spot-label"><strong>${escapeHtml(spot.label)}</strong><span>${targetText}</span></span></div><div class="counter-control"><button type="button" data-action="decrement-sighting" data-spot-id="${escapeHtml(spot.id)}" aria-label="Subtract ${escapeHtml(spot.label)}">−</button><span class="counter-value">${count}</span><button type="button" data-action="increment-sighting" data-spot-id="${escapeHtml(spot.id)}" aria-label="Add ${escapeHtml(spot.label)}">+</button></div></article>`;
    }).join("");

    renderRating(progress.journal.rating);
    renderJournalFields(progress.journal, content.experience);
    if (!roadCrew) renderDayBadge(day, progress, missions, sightings);
    $("#tomorrow-teaser").className = `tomorrow-teaser mode-${content.experience}`;
    $("#tomorrow-teaser").innerHTML = `<span class="section-kicker">${content.experience === "roadcrew" ? "Tomorrow’s road" : content.experience === "navigator" ? "Next dispatch" : "Last look ahead"}</span><h2 id="tomorrow-teaser-title">${escapeHtml(content.teaser.title)}</h2><p>${escapeHtml(content.teaser.text)}</p>`;
  }

  function renderAdventureDayStrip(selectedId) {
    const adventure = getAdventure();
    const strip = $("#adventure-day-strip");
    strip.innerHTML = adventure.days.map((day) => {
      const parts = dateParts(day.date);
      const hasMemory = dayHasMemory(getDayProgress(day.id, state.activeProfileId, false));
      return `<button class="adventure-day-button ${day.id === selectedId ? "active" : ""} ${hasMemory ? "has-memory" : ""}" type="button" data-action="select-adventure-day" data-day-id="${escapeHtml(day.id)}"><span>${escapeHtml(parts.month)}</span><strong>${escapeHtml(parts.day)}</strong></button>`;
    }).join("");
    requestAnimationFrame(() => {
      const active = $(".active", strip);
      if (!active) return;
      const targetLeft = Math.max(0, active.offsetLeft - ((strip.clientWidth - active.offsetWidth) / 2));
      if (typeof strip.scrollTo === "function") strip.scrollTo({ left: targetLeft, behavior: "smooth" });
      else strip.scrollLeft = targetLeft;
    });
  }

  function renderRating(value) {
    const rating = Math.max(0, Math.min(5, Number(value) || 0));
    $("#rating-control").innerHTML = `<span class="sr-only">Rate the day from one to five</span>${[1,2,3,4,5].map((star) => `<button type="button" class="rating-button ${star <= rating ? "active" : ""}" data-action="set-rating" data-rating="${star}" aria-label="Rate ${star} out of 5">★</button>`).join("")}`;
  }

  function journalLabels(experience) {
    if (experience === "roadcrew") {
      return {
        favorite: { label: "Highlight of the day", placeholder: "The moment, view, laugh, or decision that stood out..." },
        ate: { label: "Favourite meal or food stop", placeholder: "Where did you eat, and what was worth remembering?" },
        bought: { label: "Best stop", placeholder: "Attraction, shop, viewpoint, break, or unexpected discovery..." },
        surprise: { label: "Biggest surprise", placeholder: "What went differently—or better—than expected?" },
        note: { label: "Notes for tomorrow or next time", placeholder: "Road conditions, timing, what worked, and what you would change..." }
      };
    }
    if (experience === "explorer") {
      return {
        favorite: { label: "Favourite part of the day", placeholder: "The ride, view, animal, joke, stop..." },
        ate: { label: "Best thing I ate", placeholder: "Meal, snack, dessert, weird road food..." },
        bought: { label: "What I bought or collected", placeholder: "Souvenir, clothes, snack, ticket, free find..." },
        surprise: { label: "Funniest or most surprising thing", placeholder: "What made everyone laugh or caught you off guard?" },
        note: { label: "One more thing I want to remember", placeholder: "A tiny detail future-you might otherwise forget..." }
      };
    }
    return {
      favorite: { label: "Best decision or moment", placeholder: "What most improved the day?" },
      ate: { label: "Food-stop verdict", placeholder: "Where, what, and was it worth repeating?" },
      bought: { label: "Purchase worth remembering", placeholder: "What did you pick up, and was it worth it?" },
      surprise: { label: "What changed from the plan?", placeholder: "Delay, discovery, better route, unexpected stop..." },
      note: { label: "Field note for future me", placeholder: "What should you remember before doing a trip like this again?" }
    };
  }

  function renderJournalFields(journal, experience) {
    const labels = journalLabels(experience);
    $("#journal-fields").innerHTML = JOURNAL_FIELDS.map((field) => {
      const multiline = field === "note" || field === "surprise";
      const value = escapeHtml(journal[field] || "");
      const prompt = labels[field];
      return `<label>${escapeHtml(prompt.label)}${multiline ? `<textarea rows="${field === "note" ? 4 : 3}" maxlength="600" placeholder="${escapeHtml(prompt.placeholder)}" data-journal-field="${field}">${value}</textarea>` : `<input type="text" maxlength="180" value="${value}" placeholder="${escapeHtml(prompt.placeholder)}" data-journal-field="${field}">`}</label>`;
    }).join("");
  }

  function badgeEligibility(day, progress, missions, spotting = visibleSpotting(day)) {
    const completeMissions = missions.filter((mission) => progress.missions[mission.id]).length;
    const sightings = totalSightings(progress, spotting);
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

  function renderDayBadge(day, progress, missions = visibleMissions(day), spotting = visibleSpotting(day)) {
    const content = experienceContent(day);
    const badge = content.badge;
    const labels = experienceLabels(content.experience);
    if (!badge) {
      $("#day-badge-card").innerHTML = `<p>No day badge is defined yet.</p>`;
      return;
    }
    const eligibility = badgeEligibility(day, progress, missions, spotting);
    $("#day-badge-card").dataset.experience = content.experience;
    $("#day-badge-card").innerHTML = `
      <div class="badge-layout"><span class="badge-symbol">${escapeHtml(badge.icon)}</span><div><span class="section-kicker">${escapeHtml(labels.badgeKicker)}</span><h2 id="day-badge-title">${escapeHtml(badge.name)}</h2><p>${escapeHtml(badge.description)}</p></div></div>
      <div class="badge-state">${progress.badgeClaimed ? `<div class="badge-earned">✓ ${escapeHtml(labels.badgeClaimed)}</div>` : `<p class="fine-print">Unlock with at least ${Math.min(2, missions.length)} assignments, 3 real observations, a day rating, and a best/favourite moment.</p><button class="primary-button" type="button" data-action="claim-day-badge" ${eligibility.eligible ? "" : "disabled"}>${eligibility.eligible ? "Claim badge" : "Badge not ready"}</button>`}</div>`;
  }

  function dayHasMemory(progress) {
    return Boolean(progress.badgeClaimed || progress.photoDone || journalHasContent(progress.journal) || totalSightings(progress) || Object.values(progress.missions || {}).some(Boolean) || anyMissionResponseHasContent(progress) || anyFactResponseHasContent(progress));
  }

  function renderMemories() {
    const adventure = getAdventure();
    const profile = getProfile();
    const metrics = profileMetrics();
    const global = earnedGlobalBadges();
    const average = metrics.ratings ? (adventure.days.reduce((sum, day) => sum + (Number(getDayProgress(day.id, state.activeProfileId, false).journal.rating) || 0), 0) / metrics.ratings).toFixed(1) : "—";
    $("#memory-stats").innerHTML = (profile.experience === "roadcrew"
      ? [
        { value: metrics.driverStretches, label: "driving stretches" },
        { value: metrics.drivenKm.toLocaleString("en-CA"), label: "logged kilometres" },
        { value: metrics.journals, label: "reflection days" },
        { value: average, label: "average rating" }
      ]
      : [
        { value: metrics.sightings, label: profile.experience === "navigator" ? "observations" : "sightings" },
        { value: metrics.journals, label: profile.experience === "navigator" ? "field-note days" : "journal days" },
        { value: metrics.dayBadges + global.length, label: "badges" },
        { value: average, label: "average rating" }
      ]).map((stat) => `<div class="memory-stat"><strong>${escapeHtml(stat.value)}</strong><span>${escapeHtml(stat.label)}</span></div>`).join("");

    const dayBadges = adventure.days.map((day) => ({ ...experienceContent(day, profile).badge, earned: getDayProgress(day.id, state.activeProfileId, false).badgeClaimed, source: day.shortDate }));
    const globalBadges = DATA.globalBadges.map((badge) => ({ ...badge, earned: global.some((item) => item.id === badge.id), source: "Adventure" }));
    $("#badge-gallery").innerHTML = profile.experience === "roadcrew"
      ? `<div class="roadcrew-memory-note"><strong>Road Crew record</strong><span>Adult profiles focus on shared driving stretches, personal ratings, highlights, meals, stops, surprises, and notes.</span></div>`
      : [...dayBadges, ...globalBadges].filter((badge) => badge && badge.id).map((badge) => `<article class="badge-card ${badge.earned ? "" : "locked"}"><span class="badge-symbol">${escapeHtml(badge.icon)}</span><strong>${escapeHtml(badge.name)}</strong><p>${escapeHtml(badge.description)}</p><small>${badge.earned ? `Earned · ${escapeHtml(badge.source)}` : "Locked"}</small></article>`).join("");

    $("#scrapbook-list").innerHTML = adventure.days.map((day) => renderScrapbookCard(day, getDayProgress(day.id, state.activeProfileId, false), profile)).join("");
  }

  function renderScrapbookCard(day, progress, profile) {
    const parts = dateParts(day.date);
    const journal = progress.journal || emptyDayProgress().journal;
    const labels = journalLabels(profile.experience);
    const content = experienceContent(day, profile);
    const hasMemory = dayHasMemory(progress);
    const spots = content.spotting.map((spot) => ({ label: spot.label, count: Number(progress.sightings[spot.id]) || 0 })).filter((spot) => spot.count > 0);
    const rating = Math.max(0, Math.min(5, Number(journal.rating) || 0));
    const labelText = (field) => labels[field]?.label || field;
    const assignmentAnswers = content.missions.flatMap((mission) => {
      const values = missionResponseValues(progress, mission.id);
      const answers = missionResponseFields(mission).filter((field) => responseValueHasContent(values[field.id])).map((field) => `${field.label}: ${values[field.id]}`);
      return answers.length ? [{ label: mission.label, answers }] : [];
    });
    const factAnswers = content.facts.map((fact, index) => ({ label: fact.prompt || fact.title, value: progress.factResponses?.[factResponseId(fact, index)] || "" })).filter((item) => responseValueHasContent(item.value));
    const assignmentHtml = assignmentAnswers.length ? `<div class="memory-response-group"><h4>${profile.experience === "roadcrew" ? "Route notes" : profile.experience === "navigator" ? "Assignment records" : "Mission answers"}</h4>${assignmentAnswers.map((item) => `<div class="memory-response"><strong>${escapeHtml(item.label)}</strong><span>${item.answers.map((answer) => escapeHtml(answer)).join(" · ")}</span></div>`).join("")}</div>` : "";
    const factHtml = factAnswers.length ? `<div class="memory-response-group"><h4>${profile.experience === "roadcrew" ? "Travel notes" : profile.experience === "navigator" ? "Route-intelligence responses" : "Things I figured out"}</h4>${factAnswers.map((item) => `<div class="memory-response"><strong>${escapeHtml(item.label)}</strong><span>${escapeHtml(item.value)}</span></div>`).join("")}</div>` : "";
    return `<article class="scrapbook-card"><div class="scrapbook-head"><span class="day-date-tile"><span>${escapeHtml(parts.month)}</span><strong>${escapeHtml(parts.day)}</strong></span><div><h3>${escapeHtml(day.title)}</h3><p>${escapeHtml(day.start)} → ${escapeHtml(day.end)}</p></div><span class="scrapbook-rating">${rating ? "★".repeat(rating) : ""}</span></div><div class="scrapbook-body">${hasMemory ? `${journal.favorite ? `<div class="memory-line"><strong>${escapeHtml(labelText("favorite"))}</strong><span>${escapeHtml(journal.favorite)}</span></div>` : ""}${journal.ate ? `<div class="memory-line"><strong>${escapeHtml(labelText("ate"))}</strong><span>${escapeHtml(journal.ate)}</span></div>` : ""}${journal.bought ? `<div class="memory-line"><strong>${escapeHtml(labelText("bought"))}</strong><span>${escapeHtml(journal.bought)}</span></div>` : ""}${journal.surprise ? `<div class="memory-line"><strong>${escapeHtml(labelText("surprise"))}</strong><span>${escapeHtml(journal.surprise)}</span></div>` : ""}${journal.note ? `<div class="memory-line"><strong>${escapeHtml(labelText("note"))}</strong><span>${escapeHtml(journal.note)}</span></div>` : ""}${assignmentHtml}${factHtml}${spots.length ? `<div class="sighting-summary">${spots.map((spot) => `<span class="sighting-chip">${escapeHtml(spot.label)} × ${spot.count}</span>`).join("")}</div>` : ""}${progress.photoDone ? `<span class="sighting-chip">${profile.experience === "roadcrew" ? "Journey photo" : profile.experience === "navigator" ? "Photo brief" : "Photo challenge"} complete</span>` : ""}${progress.badgeClaimed && content.badge ? `<span class="sighting-chip">Badge: ${escapeHtml(content.badge.name)}</span>` : ""}` : `<p class="empty-memory">No entry yet. Open this day in Adventure Mode to add ${profile.experience === "roadcrew" ? "highlights and ratings" : profile.experience === "navigator" ? "field notes" : "memories"}.</p>`}</div></article>`;
  }

  function renderSettings() {
    renderProfiles();
    renderInstallHelp();
    renderLiveChecks();
    renderItinerarySettings();
    $("#general-notes").value = getAdventureState().notes.general || "";
  }

  function renderItinerarySettings() {
    const metrics = allEditMetrics();
    const summary = $("#itinerary-settings-summary");
    const details = $("#itinerary-settings-details");
    const reset = $("#reset-itinerary-button");
    if (!summary || !details || !reset) return;
    if (!metrics.total) {
      summary.textContent = "No local itinerary edits yet.";
      details.textContent = "Published day plans and stay details are in use.";
      reset.disabled = true;
      return;
    }
    summary.textContent = `${metrics.total} local change${metrics.total === 1 ? "" : "s"} across ${metrics.days} day${metrics.days === 1 ? "" : "s"}.`;
    const parts = [
      metrics.itineraryFields ? `${metrics.itineraryFields} day-plan field${metrics.itineraryFields === 1 ? "" : "s"}` : "",
      metrics.stayFields ? `${metrics.stayFields} stay field${metrics.stayFields === 1 ? "" : "s"}` : "",
      metrics.privateNotes ? `${metrics.privateNotes} private day note${metrics.privateNotes === 1 ? "" : "s"}` : ""
    ].filter(Boolean);
    details.textContent = `${parts.join(" · ")}${metrics.conflicts ? ` · ${metrics.conflicts} need review after a published change` : ""}`;
    reset.disabled = false;
  }

  function renderProfiles() {
    const profiles = Object.values(state.profiles);
    const card = (profile, picker = false) => {
      const mode = experienceDefinition(profile);
      return picker
        ? `<button class="profile-pick-button" type="button" data-action="select-profile" data-profile-id="${escapeHtml(profile.id)}"><span class="profile-avatar">${escapeHtml((profile.name || "?").slice(0,1).toUpperCase())}</span><span><strong>${escapeHtml(profile.name)}</strong><span>${escapeHtml(`${mode.name}: ${mode.role}`)}</span><small>${escapeHtml(mode.description)}</small></span></button>`
        : `<article class="profile-card ${profile.id === state.activeProfileId ? "active" : ""}" data-experience="${escapeHtml(profile.experience)}"><span class="profile-avatar">${escapeHtml((profile.name || "?").slice(0,1).toUpperCase())}</span><div><strong>${escapeHtml(profile.name)}</strong><span>${escapeHtml(`${mode.name} · ${mode.role}`)}</span><small>${escapeHtml(mode.verbs)}</small></div><div class="profile-card-actions"><button type="button" data-action="select-profile" data-profile-id="${escapeHtml(profile.id)}">Use</button><button type="button" data-action="edit-profile" data-profile-id="${escapeHtml(profile.id)}">Edit</button></div></article>`;
    };
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
    const today = todayLocal();
    const archived = (item) => item.activeThrough && today > parseDate(item.activeThrough);
    const currentChecks = checks.filter((item) => !archived(item));
    const pastChecks = checks.filter(archived);
    const checkCard = (item, isPast = false) => {
      const url = sanitizeUrl(item.url);
      const timing = item.activeThrough ? `${isPast ? "Relevant through" : "Needed by"} ${formatDate(item.activeThrough, { month: "short", day: "numeric" })}` : "";
      const meta = [item.verified, timing].filter(Boolean).map(escapeHtml).join(" · ");
      return `<article class="live-check ${isPast ? "past" : ""}"><div><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.note)}${meta ? ` · ${meta}` : ""}</span></div>${url ? `<a href="${escapeHtml(url)}" target="_blank" rel="noopener">Open</a>` : ""}</article>`;
    };
    const currentHtml = currentChecks.length
      ? currentChecks.map((item) => checkCard(item)).join("")
      : `<p class="supporting-copy">No upcoming live checks remain.</p>`;
    const archiveHtml = pastChecks.length
      ? `<details class="live-check-archive"><summary><span>Past checks</span><small>${pastChecks.length}</small></summary><div class="live-check-archive-list">${pastChecks.map((item) => checkCard(item, true)).join("")}</div></details>`
      : "";
    $("#live-checks-list").innerHTML = `${currentHtml}${archiveHtml}`;
  }

  function itineraryValueToText(type, value) {
    if (type === "lines") return normalizeLines(value).join("\n");
    if (type === "timeline") {
      return normalizeTimeline(value)
        .map((item) => {
          if (item.detail) return `${item.time} | ${item.title} | ${item.detail}`;
          if (item.title) return item.time ? `${item.time} | ${item.title}` : item.title;
          return `${item.time} |`;
        })
        .join("\n");
    }
    return String(value ?? "");
  }

  function timelineFromText(value) {
    return String(value || "")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const parts = line.split("|").map((part) => part.trim());
        if (parts.length === 1) return { time: "", title: parts[0], detail: "" };
        return {
          time: parts.shift() || "",
          title: parts.shift() || "",
          detail: parts.join(" | ").trim()
        };
      });
  }

  function itineraryInputValue(field) {
    const definition = ITINERARY_FIELDS[field];
    const input = definition ? $(`#${definition.inputId}`) : null;
    if (!input) return "";
    if (definition.type === "number") return normalizeEditableValue("number", input.value);
    if (definition.type === "lines") return normalizeLines(input.value.split(/\r?\n/));
    if (definition.type === "timeline") return normalizeTimeline(timelineFromText(input.value));
    return String(input.value || "").trim();
  }

  function setItineraryInputValue(field, value) {
    const definition = ITINERARY_FIELDS[field];
    const input = definition ? $(`#${definition.inputId}`) : null;
    if (!input) return;
    input.value = itineraryValueToText(definition.type, value);
  }

  function updateItineraryFieldMarker(field) {
    const definition = ITINERARY_FIELDS[field];
    const dayId = $("#itinerary-day-id")?.value;
    const publishedDay = getPublishedDay(dayId);
    const wrapper = document.querySelector(`[data-editor-field="${field}"]`);
    if (!definition || !publishedDay || !wrapper) return;
    const current = itineraryInputValue(field);
    const published = normalizeEditableValue(definition.type, publishedDay[field]);
    const changed = !valuesEqual(current, published);
    const autoAdjusted = changed && itineraryEditorAutoFields.has(field);
    const entry = getAdventureState().itineraryOverrides?.[dayId]?.[field];
    const conflict = changed && overrideConflict(entry, publishedDay[field], definition.type);
    wrapper.classList.toggle("local-change", changed);
    wrapper.classList.toggle("published-conflict", conflict);
    const marker = $(".edit-field-marker", wrapper);
    const reset = $('[data-action="reset-itinerary-field"]', wrapper);
    if (marker) marker.textContent = conflict
      ? "Published value changed"
      : autoAdjusted
        ? "Adjusted with departure"
        : changed
          ? "Local edit"
          : "Published";
    if (reset) reset.hidden = !changed || autoAdjusted;
  }

  function updateAllItineraryFieldMarkers() {
    Object.keys(ITINERARY_FIELDS).forEach(updateItineraryFieldMarker);
    const dayId = $("#itinerary-day-id")?.value;
    const publishedDay = getPublishedDay(dayId);
    const fields = getAdventureState().itineraryOverrides?.[dayId] || {};
    const conflicts = Object.entries(fields).filter(([field, entry]) => {
      const definition = ITINERARY_FIELDS[field];
      return definition && overrideConflict(entry, publishedDay?.[field], definition.type);
    }).length;
    const warning = $("#itinerary-conflict-warning");
    if (warning) {
      warning.hidden = !conflicts;
      warning.textContent = conflicts
        ? `The published itinerary changed after ${conflicts} local edit${conflicts === 1 ? "" : "s"}. Your local values are still in use. Review the marked fields or choose “Use published.”`
        : "";
    }
  }

  function applyDepartureShiftInEditor() {
    const dayId = $("#itinerary-day-id")?.value;
    const publishedDay = getPublishedDay(dayId);
    if (!publishedDay) return;
    const shifted = departureShiftSchedule(publishedDay, itineraryInputValue("departure"));
    const savedFields = getAdventureState().itineraryOverrides?.[dayId] || {};
    DEPARTURE_SHIFT_FIELDS.forEach((field) => {
      const savedEntry = savedFields[field];
      const canAdjust = itineraryEditorAutoFields.has(field)
        || savedEntry?.source === DEPARTURE_SHIFT_SOURCE
        || (!savedEntry && !itineraryEditorTouchedFields.has(field));
      if (!canAdjust) return;
      const definition = ITINERARY_FIELDS[field];
      const published = normalizeEditableValue(definition.type, publishedDay[field]);
      const value = shifted
        ? normalizeEditableValue(definition.type, shifted[field])
        : clone(published);
      setItineraryInputValue(field, value);
      if (shifted && !valuesEqual(value, published)) itineraryEditorAutoFields.add(field);
      else itineraryEditorAutoFields.delete(field);
      updateItineraryFieldMarker(field);
    });
  }

  function openItineraryDialog(dayId) {
    const publishedDay = getPublishedDay(dayId);
    const day = getAdventure().days.find((item) => item.id === dayId);
    if (!publishedDay || !day) return;
    $("#itinerary-dialog-title").textContent = `${day.shortDate} · Edit day`;
    $("#itinerary-day-id").value = dayId;
    itineraryEditorTouchedFields.clear();
    itineraryEditorAutoFields.clear();
    const savedFields = getAdventureState().itineraryOverrides?.[dayId] || {};
    DEPARTURE_SHIFT_FIELDS.forEach((field) => {
      if (savedFields[field]?.source === DEPARTURE_SHIFT_SOURCE) itineraryEditorAutoFields.add(field);
    });
    Object.keys(ITINERARY_FIELDS).forEach((field) => setItineraryInputValue(field, day[field]));
    $("#itinerary-private-note").value = getAdventureState().notes?.daily?.[dayId] || "";
    $("#itinerary-editor-status").textContent = "Local edits stay on this device and are included in backups. Changing an exact departure time shifts unedited clock times in Arrival and Day plan.";
    updateAllItineraryFieldMarkers();
    $("#itinerary-dialog").showModal();
  }

  function renderPlanningViews() {
    renderHome();
    renderItinerary();
    renderRoute();
    renderHotels();
    renderAdventure();
    renderMemories();
    renderSettings();
  }

  function saveItineraryDay(event) {
    event.preventDefault();
    const dayId = $("#itinerary-day-id").value;
    const publishedDay = getPublishedDay(dayId);
    if (!publishedDay) return;
    const fields = {};
    Object.entries(ITINERARY_FIELDS).forEach(([field, definition]) => {
      const value = itineraryInputValue(field);
      const published = normalizeEditableValue(definition.type, publishedDay[field]);
      if (!valuesEqual(value, published)) {
        fields[field] = { value, base: clone(published) };
        if (itineraryEditorAutoFields.has(field)) fields[field].source = DEPARTURE_SHIFT_SOURCE;
      }
    });
    const adventureState = getAdventureState();
    if (Object.keys(fields).length) adventureState.itineraryOverrides[dayId] = fields;
    else delete adventureState.itineraryOverrides[dayId];
    const privateNote = $("#itinerary-private-note").value.trim();
    if (privateNote) adventureState.notes.daily[dayId] = privateNote;
    else delete adventureState.notes.daily[dayId];
    saveState();
    $("#itinerary-dialog").close();
    renderPlanningViews();
    const count = Object.keys(fields).length + (privateNote ? 1 : 0);
    showToast(count ? `${count} local day change${count === 1 ? "" : "s"} saved.` : "This day now uses the published itinerary.");
  }

  function resetItineraryFieldInDialog(field) {
    const definition = ITINERARY_FIELDS[field];
    const dayId = $("#itinerary-day-id")?.value;
    const publishedDay = getPublishedDay(dayId);
    if (!definition || !publishedDay) return;
    itineraryEditorTouchedFields.add(field);
    itineraryEditorAutoFields.delete(field);
    setItineraryInputValue(field, publishedDay[field]);
    updateItineraryFieldMarker(field);
    if (field === "departure") applyDepartureShiftInEditor();
    showToast("Published value restored in the editor. Save day to apply.");
  }

  function resetDayEdits(dayId) {
    const publishedDay = getPublishedDay(dayId);
    if (!publishedDay) return;
    const metrics = dayEditMetrics(dayId);
    const count = metrics.itineraryFields + metrics.stayFields + metrics.privateNotes;
    if (!count) {
      showToast("This day already uses the published itinerary.");
      return;
    }
    const accepted = window.confirm(
      `Reset ${count} local change${count === 1 ? "" : "s"} for ${publishedDay.shortDate}? This restores the published day plan and stay details, but keeps checklists, profiles, answers, and Memories.`
    );
    if (!accepted) return;
    const adventureState = getAdventureState();
    delete adventureState.itineraryOverrides[dayId];
    delete adventureState.stayOverrides[dayId];
    delete adventureState.notes.daily[dayId];
    saveState();
    [$("#itinerary-dialog"), $("#hotel-dialog")].forEach((dialog) => { if (dialog?.open) dialog.close(); });
    renderPlanningViews();
    showToast(`${publishedDay.shortDate} restored to published values.`);
  }

  function resetAllItineraryEdits() {
    const metrics = allEditMetrics();
    if (!metrics.total) {
      showToast("The itinerary already uses all published values.");
      return;
    }
    const accepted = window.confirm(
      `Reset all ${metrics.total} local itinerary change${metrics.total === 1 ? "" : "s"}? This clears local day-plan edits, stay details, and private day notes. Profiles, checklists, answers, and Memories stay intact.`
    );
    if (!accepted) return;
    const adventureState = getAdventureState();
    adventureState.itineraryOverrides = {};
    adventureState.stayOverrides = {};
    adventureState.notes.daily = {};
    saveState();
    renderPlanningViews();
    showToast("All days now use the published itinerary.");
  }

  function updateStayFieldMarker(field) {
    const dayId = $("#hotel-day-id")?.value;
    const wrapper = document.querySelector(`[data-stay-field="${field}"]`);
    const inputId = STAY_INPUT_IDS[field];
    if (!dayId || !wrapper || !inputId) return;
    const current = String($(`#${inputId}`)?.value || "").trim();
    const published = String(getPublishedStay(dayId)[field] || "");
    const entry = getAdventureState().stayOverrides?.[dayId]?.[field];
    const changed = current !== published;
    const conflict = changed && overrideConflict(entry, published);
    wrapper.classList.toggle("local-change", changed);
    wrapper.classList.toggle("published-conflict", conflict);
    const marker = $(".edit-field-marker", wrapper);
    const reset = $('[data-action="reset-stay-field"]', wrapper);
    if (marker) marker.textContent = conflict ? "Published value changed" : changed ? "Local edit" : "Published";
    if (reset) reset.hidden = !changed;
  }

  function updateAllStayFieldMarkers() {
    STAY_FIELDS.forEach(updateStayFieldMarker);
    const dayId = $("#hotel-day-id")?.value;
    const warning = $("#stay-conflict-warning");
    const fields = getAdventureState().stayOverrides?.[dayId] || {};
    const conflicts = Object.entries(fields).filter(([field, entry]) => overrideConflict(entry, getPublishedStay(dayId)[field] || "")).length;
    if (warning) {
      warning.hidden = !conflicts;
      warning.textContent = conflicts
        ? `Published stay details changed after ${conflicts} local edit${conflicts === 1 ? "" : "s"}. Your local values are still being used.`
        : "";
    }
  }

  function resetStayFieldInDialog(field) {
    const dayId = $("#hotel-day-id")?.value;
    const inputId = STAY_INPUT_IDS[field];
    if (!dayId || !inputId) return;
    $(`#${inputId}`).value = String(getPublishedStay(dayId)[field] || "");
    updateStayFieldMarker(field);
    showToast("Published stay value restored in the editor. Save stay to apply.");
  }

  function resetStayEdits(dayId) {
    const fields = getAdventureState().stayOverrides?.[dayId] || {};
    const count = Object.keys(fields).length;
    if (!count) {
      showToast("This stay already uses published details.");
      return;
    }
    const day = getPublishedDay(dayId);
    const accepted = window.confirm(
      `Reset ${count} local stay change${count === 1 ? "" : "s"} for ${day?.shortDate || "this day"}? Other day-plan edits, profiles, answers, and Memories stay intact.`
    );
    if (!accepted) return;
    delete getAdventureState().stayOverrides[dayId];
    saveState();
    if ($("#hotel-dialog")?.open) $("#hotel-dialog").close();
    renderPlanningViews();
    showToast("Published stay details restored.");
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
    STAY_FIELDS.forEach((field) => {
      $(`#${STAY_INPUT_IDS[field]}`).value = String(hotel[field] || "");
    });
    const inheritance = $("#hotel-inheritance-note");
    if (inheritance) {
      inheritance.hidden = !resolved.inherited;
      inheritance.textContent = resolved.inherited
        ? "These details are inherited from the previous night in the same place. Saving creates day-specific stay details."
        : "";
    }
    updateAllStayFieldMarkers();
    $("#hotel-dialog").showModal();
  }

  function saveHotel(event) {
    event.preventDefault();
    const dayId = $("#hotel-day-id").value;
    if (!dayId) return;
    const published = getPublishedStay(dayId);
    const fields = {};
    STAY_FIELDS.forEach((field) => {
      const value = String($(`#${STAY_INPUT_IDS[field]}`).value || "").trim();
      const base = String(published[field] || "");
      if (value !== base) fields[field] = { value, base };
    });
    const adventureState = getAdventureState();
    if (Object.keys(fields).length) adventureState.stayOverrides[dayId] = fields;
    else delete adventureState.stayOverrides[dayId];
    saveState();
    $("#hotel-dialog").close();
    renderPlanningViews();
    showToast(Object.keys(fields).length ? "Stay saved locally. Route links refreshed." : "This stay now uses published details.");
  }

  function openProfileDialog(profileId) {
    const profile = state.profiles[profileId];
    if (!profile) return;
    profileDialogMode = "edit";
    $("#profile-dialog-title").textContent = `Edit ${profile.name}`;
    $("#profile-id").value = profileId;
    $("#profile-display-name").value = profile.name;
    $$('input[name="experience"]', $("#profile-form")).forEach((input) => { input.checked = input.value === profile.experience; });
    $("#profile-dialog").showModal();
  }

  function openNewProfileDialog() {
    profileDialogMode = "add";
    $("#profile-dialog-title").textContent = "Add traveller";
    $("#profile-id").value = "";
    $("#profile-display-name").value = "";
    $$('input[name="experience"]', $("#profile-form")).forEach((input) => { input.checked = input.value === "roadcrew"; });
    $("#profile-dialog").showModal();
    requestAnimationFrame(() => $("#profile-display-name")?.focus());
  }

  function saveProfile(event) {
    event.preventDefault();
    const name = $("#profile-display-name").value.trim();
    if (!name) {
      showToast("Enter a traveller name.");
      return;
    }
    const requestedExperience = $('input[name="experience"]:checked', $("#profile-form"))?.value || "roadcrew";
    const experience = normalizeExperience(requestedExperience, "roadcrew");
    let profileId = $("#profile-id").value;
    let profile = state.profiles[profileId];
    if (profileDialogMode === "add" || !profile) {
      profileId = makeId("traveller");
      profile = normalizeProfile({
        id: profileId,
        name,
        experience,
        initials: name.slice(0, 1).toUpperCase()
      });
      state.profiles[profileId] = profile;
      Object.values(state.adventures).forEach((adventureState) => {
        if (!adventureState.profileProgress || typeof adventureState.profileProgress !== "object") adventureState.profileProgress = {};
        adventureState.profileProgress[profileId] = makeProfileProgress();
      });
    } else {
      profile.name = name;
      profile.experience = experience;
      profile.initials = name.slice(0, 1).toUpperCase();
    }
    profile.roleLabel = experienceDefinition(profile).role;
    saveState();
    $("#profile-dialog").close();
    renderAll();
    showToast(profileDialogMode === "add" ? `${profile.name} added.` : "Adventure profile updated.");
    profileDialogMode = "edit";
  }

  function findDriveStretch(recordId) {
    return getDriveLog().stretches.find((stretch) => stretch.recordId === recordId) || null;
  }

  function populateDriverOptions(selectedId = "") {
    const select = $("#drive-driver");
    if (!select) return;
    const profiles = drivingProfiles();
    select.innerHTML = profiles.map((profile) => `<option value="${escapeHtml(profile.id)}">${escapeHtml(profile.name)}</option>`).join("");
    const fallback = profiles.some((profile) => profile.id === selectedId)
      ? selectedId
      : profiles.some((profile) => profile.id === state.activeProfileId)
        ? state.activeProfileId
        : profiles[0]?.id || "";
    select.value = fallback;
  }

  function openDriveDialog({ dayId = getSelectedAdventureDay().id, recordId = "", changeDriver = false } = {}) {
    const day = getAdventure().days.find((item) => item.id === dayId) || getSelectedAdventureDay();
    const stretch = recordId ? findDriveStretch(recordId) : null;
    const latest = allDriveStretches().filter((item) => item.dayId === day.id).at(-1);
    $("#drive-dialog-title").textContent = stretch ? "Edit driving stretch" : changeDriver ? "Record driver change" : "Add driving stretch";
    $("#drive-record-id").value = stretch?.recordId || "";
    $("#drive-day-id").value = day.id;
    populateDriverOptions(stretch?.driverId || stretch?.profileId || (changeDriver && latest ? drivingProfiles().find((profile) => profile.id !== (latest.driverId || latest.profileId))?.id : state.activeProfileId));
    $("#drive-from").value = stretch?.from || (changeDriver ? latest?.to || "" : day.start || "");
    $("#drive-to").value = stretch?.to || (changeDriver ? "" : day.end || "");
    $("#drive-start-time").value = stretch?.startTime || (changeDriver ? latest?.endTime || currentClockTime() : "");
    $("#drive-end-time").value = stretch?.endTime || "";
    $("#drive-start-odometer").value = stretch?.startOdometer === "" || stretch?.startOdometer === undefined ? (changeDriver ? latest?.endOdometer || "" : "") : stretch.startOdometer;
    $("#drive-end-odometer").value = stretch?.endOdometer === "" || stretch?.endOdometer === undefined ? "" : stretch.endOdometer;
    $("#drive-notes").value = stretch?.notes || "";
    $("#drive-dialog-status").textContent = changeDriver
      ? "The previous stretch stays intact. Complete or edit it separately if its ending details are missing."
      : "Times and odometers are optional. The log is shared by every profile on this device.";
    $("#drive-dialog").showModal();
  }

  function saveDriveStretch(event) {
    event.preventDefault();
    const recordId = $("#drive-record-id").value;
    const dayId = $("#drive-day-id").value;
    const driverId = $("#drive-driver").value;
    if (!state.profiles[driverId] || !getAdventure().days.some((day) => day.id === dayId)) {
      showToast("Choose a valid driver and travel day.");
      return;
    }
    const startRaw = $("#drive-start-odometer").value.trim();
    const endRaw = $("#drive-end-odometer").value.trim();
    const startOdometer = startRaw === "" ? "" : Number(startRaw);
    const endOdometer = endRaw === "" ? "" : Number(endRaw);
    if ((startRaw !== "" && (!Number.isFinite(startOdometer) || startOdometer < 0))
      || (endRaw !== "" && (!Number.isFinite(endOdometer) || endOdometer < 0))) {
      showToast("Odometer values must be positive numbers.");
      return;
    }
    if (startOdometer !== "" && endOdometer !== "" && endOdometer < startOdometer) {
      showToast("End odometer cannot be less than start odometer.");
      return;
    }
    let stretch = recordId ? findDriveStretch(recordId) : null;
    const created = !stretch;
    if (!stretch) {
      stretch = addRecordIdentity({}, {
        tripId: getPublishedAdventure().id,
        profileId: driverId,
        deviceId: state.deviceId,
        prefix: "drive"
      });
      getDriveLog().stretches.push(stretch);
    }
    stretch.dayId = dayId;
    stretch.driverId = driverId;
    stretch.profileId = driverId;
    stretch.tripId = getPublishedAdventure().id;
    stretch.from = cleanText($("#drive-from").value, 100);
    stretch.to = cleanText($("#drive-to").value, 100);
    stretch.startTime = cleanText($("#drive-start-time").value, 10);
    stretch.endTime = cleanText($("#drive-end-time").value, 10);
    stretch.startOdometer = startOdometer;
    stretch.endOdometer = endOdometer;
    stretch.notes = cleanText($("#drive-notes").value, 500);
    touchRecord(stretch);
    saveState();
    $("#drive-dialog").close();
    renderAdventure();
    renderHomeProfileProgress();
    renderMemories();
    showToast(created ? "Driving stretch added." : "Driving stretch updated.");
  }

  function deleteDriveStretch(recordId) {
    const stretch = findDriveStretch(recordId);
    if (!stretch) return;
    const driver = state.profiles[stretch.driverId || stretch.profileId];
    if (!window.confirm(`Delete ${driver?.name || "this traveller"}’s driving stretch?`)) return;
    getDriveLog().stretches = getDriveLog().stretches.filter((item) => item.recordId !== recordId);
    saveState();
    renderAdventure();
    renderHomeProfileProgress();
    renderMemories();
    showToast("Driving stretch deleted.");
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
    touchRecord(progress);
    saveState();
    renderAdventure();
    renderHomeProfileProgress();
    renderMemories();
  }

  function setMissionResponse(missionId, fieldId, value) {
    const day = getSelectedAdventureDay();
    const progress = getDayProgress(day.id);
    if (!progress.missionResponses[missionId] || typeof progress.missionResponses[missionId] !== "object") progress.missionResponses[missionId] = {};
    progress.missionResponses[missionId][fieldId] = value;
    touchRecord(progress);
    saveState();
    const status = document.querySelector(`[data-response-status-for="${CSS.escape(missionId)}"]`);
    if (status) status.textContent = experienceLabels(experienceContent(day).experience).responseSaved;
  }

  function setFactResponse(factId, value) {
    const day = getSelectedAdventureDay();
    const progress = getDayProgress(day.id);
    progress.factResponses[factId] = value;
    touchRecord(progress);
    saveState();
    const field = document.querySelector(`[data-fact-response-id="${CSS.escape(factId)}"]`);
    const status = field?.parentElement?.querySelector("small");
    if (status) status.textContent = experienceLabels(experienceContent(day).experience).responseSaved;
  }

  function setJournalField(field, value) {
    if (!JOURNAL_FIELDS.includes(field)) return;
    const day = getSelectedAdventureDay();
    const progress = getDayProgress(day.id);
    progress.journal[field] = value;
    touchRecord(progress);
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
    const content = experienceContent(day);
    const missions = content.missions;
    if (!badgeEligibility(day, progress, missions, content.spotting).eligible) return;
    progress.badgeClaimed = true;
    touchRecord(progress);
    saveState();
    renderAdventure();
    renderHomeProfileProgress();
    renderMemories();
    showToast(`${content.badge?.name || "Day badge"} added to Memories.`);
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
        const edits = allEditMetrics().total;
        showToast(`Version ${manifest.version} is published. Tap Refresh app now.${edits ? ` Your ${edits} local itinerary change${edits === 1 ? "" : "s"} will remain in place.` : ""}`, 6200);
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
    const edits = allEditMetrics().total;
    showToast(navigator.onLine ? `Refreshing app files…${edits ? " Local itinerary edits will be preserved." : ""}` : "Reloading saved offline app…");
    if (edits) sessionStorage.setItem(REFRESH_EDIT_NOTICE_KEY, String(edits));
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
      case "edit-itinerary-day": openItineraryDialog(button.dataset.dayId); break;
      case "edit-current-itinerary-day": openItineraryDialog(getCurrentOrNextDay().id); break;
      case "close-itinerary-dialog": $("#itinerary-dialog").close(); break;
      case "reset-itinerary-field": resetItineraryFieldInDialog(button.dataset.field); break;
      case "reset-itinerary-day": resetDayEdits($("#itinerary-day-id").value); break;
      case "reset-itinerary-all": resetAllItineraryEdits(); break;
      case "edit-hotel": openHotelDialog(button.dataset.dayId); break;
      case "close-hotel-dialog": $("#hotel-dialog").close(); break;
      case "reset-stay-field": resetStayFieldInDialog(button.dataset.field); break;
      case "reset-stay-day": resetStayEdits($("#hotel-day-id").value); break;
      case "open-profile-menu": renderProfiles(); $("#profile-picker").showModal(); break;
      case "close-profile-picker": $("#profile-picker").close(); break;
      case "select-profile": selectProfile(button.dataset.profileId); break;
      case "edit-profile": openProfileDialog(button.dataset.profileId); break;
      case "add-profile": openNewProfileDialog(); break;
      case "close-profile-dialog": $("#profile-dialog").close(); break;
      case "add-driving-stretch": openDriveDialog(); break;
      case "change-driver": openDriveDialog({ changeDriver: true }); break;
      case "edit-driving-stretch": openDriveDialog({ recordId: button.dataset.stretchId }); break;
      case "delete-driving-stretch": deleteDriveStretch(button.dataset.stretchId); break;
      case "close-drive-dialog": $("#drive-dialog").close(); break;
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
        window.open(googleDirections(combinedDayStops(days)), "_blank", "noopener");
        break;
      }
      case "open-google-overview-2": {
        const days = getAdventure().days.slice(5);
        window.open(googleDirections(combinedDayStops(days)), "_blank", "noopener");
        break;
      }
      case "export-backup": exportBackup(); break;
      case "reset-data": {
        if (window.confirm("Reset all local Road Companion data on this device? This removes itinerary edits, stay details, private notes, profiles, journals, driving stretches, tallies, badges, and checklists.")) {
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
      if (target.matches("[data-mission-response-id][data-mission-field-id]")) {
        setMissionResponse(target.dataset.missionResponseId, target.dataset.missionFieldId, target.value);
        return;
      }
      if (target.matches("[data-fact-response-id]")) {
        setFactResponse(target.dataset.factResponseId, target.value);
        return;
      }
      if (target.matches("[data-journal-field]")) {
        setJournalField(target.dataset.journalField, target.value);
        return;
      }
      const itineraryField = Object.entries(ITINERARY_FIELDS).find(([, definition]) => definition.inputId === target.id);
      if (itineraryField) {
        const field = itineraryField[0];
        itineraryEditorTouchedFields.add(field);
        if (DEPARTURE_SHIFT_FIELDS.includes(field)) itineraryEditorAutoFields.delete(field);
        updateItineraryFieldMarker(field);
        if (field === "departure") applyDepartureShiftInEditor();
        return;
      }
      const stayField = STAY_FIELDS.find((field) => STAY_INPUT_IDS[field] === target.id);
      if (stayField) {
        updateStayFieldMarker(stayField);
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

    $("#itinerary-form").addEventListener("submit", saveItineraryDay);
    $("#hotel-form").addEventListener("submit", saveHotel);
    $("#profile-form").addEventListener("submit", saveProfile);
    $("#drive-form").addEventListener("submit", saveDriveStretch);
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
    const preserved = Number(sessionStorage.getItem(REFRESH_EDIT_NOTICE_KEY) || 0);
    if (preserved) {
      sessionStorage.removeItem(REFRESH_EDIT_NOTICE_KEY);
      setTimeout(() => showToast(`Refresh complete. ${preserved} local itinerary change${preserved === 1 ? "" : "s"} preserved.`, 4800), 250);
    } else {
      const conflicts = allEditMetrics().conflicts;
      if (conflicts) setTimeout(() => showToast(`${conflicts} local itinerary edit${conflicts === 1 ? "" : "s"} need review after a published change.`, 5200), 250);
    }
  }

  init();
})();
