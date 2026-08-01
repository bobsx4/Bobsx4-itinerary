(() => {
  "use strict";

  const CONFIG = window.BOBSX4_SYNC_CONFIG;
  const bridge = window.Bobsx4RoadCompanion;
  const SDK = window.Bobsx4Supabase;
  const STORAGE_KEY = "bobsx4-road-companion-sync-v1";
  const viewerToken = new URLSearchParams(window.location.search).get("view")?.trim() || "";
  const $ = (selector) => document.querySelector(selector);
  const nowIso = () => new Date().toISOString();
  const PROGRESS_FIELD_CLOCKS = "_fieldUpdatedAt";
  const PROGRESS_FIELDS = ["missions", "missionResponses", "factResponses", "sightings", "journal", "photoDone", "badgeClaimed"];

  let client = null;
  let channel = null;
  let syncPromise = null;
  let detectTimer = null;
  let syncState = loadSyncState();
  let ownerRoster = { loaded: false, members: [], invites: [], error: "" };

  function emptySyncState() {
    return {
      version: 1,
      tripId: "",
      tripName: "",
      role: "",
      snapshot: {},
      catalog: {},
      meta: {},
      outbox: {},
      lastSyncedAt: "",
      lastError: ""
    };
  }

  function loadSyncState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return { ...emptySyncState(), ...(saved && typeof saved === "object" ? saved : {}) };
    } catch {
      return emptySyncState();
    }
  }

  function saveSyncState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(syncState));
  }

  function canonical(value) {
    if (Array.isArray(value)) return value.map(canonical);
    if (!value || typeof value !== "object") return value;
    return Object.keys(value).sort().reduce((result, key) => {
      result[key] = canonical(value[key]);
      return result;
    }, {});
  }

  function signature(record) {
    return JSON.stringify(canonical({
      recordType: record.recordType,
      visibility: record.visibility,
      profileId: record.profileId || "",
      payload: record.payload
    }));
  }

  function clone(value) {
    return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
  }

  function valuesEqual(left, right) {
    return JSON.stringify(canonical(left)) === JSON.stringify(canonical(right));
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function isPlainObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  function meaningfulProgressValue(value) {
    if (typeof value === "string") return Boolean(value.trim());
    if (typeof value === "number") return Number.isFinite(value) && value !== 0;
    if (typeof value === "boolean") return value;
    if (Array.isArray(value)) return value.length > 0;
    if (isPlainObject(value)) return Object.values(value).some(meaningfulProgressValue);
    return value !== null && value !== undefined;
  }

  function progressClock(progress, path, value) {
    const explicit = validTimestamp(progress?.[PROGRESS_FIELD_CLOCKS]?.[path], "");
    if (explicit) return explicit;
    if (!meaningfulProgressValue(value)) return "";
    return validTimestamp(progress?.updatedAt || progress?.createdAt, "");
  }

  function mergeProgressLeaf(localProgress, remoteProgress, path, localValue, remoteValue) {
    const localClock = progressClock(localProgress, path, localValue);
    const remoteClock = progressClock(remoteProgress, path, remoteValue);
    const localTime = Date.parse(localClock || "") || 0;
    const remoteTime = Date.parse(remoteClock || "") || 0;
    let useLocal = false;
    if (localTime !== remoteTime) {
      useLocal = localTime > remoteTime;
    } else if (!valuesEqual(localValue, remoteValue)) {
      const localMeaningful = meaningfulProgressValue(localValue);
      const remoteMeaningful = meaningfulProgressValue(remoteValue);
      if (localMeaningful !== remoteMeaningful) useLocal = localMeaningful;
      else {
        const localRecordTime = Date.parse(localProgress?.updatedAt || localProgress?.createdAt || "") || 0;
        const remoteRecordTime = Date.parse(remoteProgress?.updatedAt || remoteProgress?.createdAt || "") || 0;
        useLocal = localRecordTime > remoteRecordTime;
      }
    }
    return {
      value: clone(useLocal ? localValue : remoteValue),
      clock: useLocal ? localClock : remoteClock
    };
  }

  function mergeProgressBranch(localProgress, remoteProgress, path, localValue, remoteValue, clocks) {
    if (isPlainObject(localValue) || isPlainObject(remoteValue)) {
      const result = {};
      const keys = new Set([
        ...Object.keys(isPlainObject(localValue) ? localValue : {}),
        ...Object.keys(isPlainObject(remoteValue) ? remoteValue : {})
      ]);
      keys.forEach((key) => {
        const childPath = path ? `${path}.${key}` : key;
        result[key] = mergeProgressBranch(
          localProgress,
          remoteProgress,
          childPath,
          isPlainObject(localValue) ? localValue[key] : undefined,
          isPlainObject(remoteValue) ? remoteValue[key] : undefined,
          clocks
        );
      });
      return result;
    }
    const merged = mergeProgressLeaf(localProgress, remoteProgress, path, localValue, remoteValue);
    if (merged.clock) clocks[path] = merged.clock;
    return merged.value;
  }

  function mergeProgressSyncRecord(localRecord, remoteRecord) {
    const localProgress = localRecord?.payload?.progress || {};
    const remoteProgress = remoteRecord?.payload?.progress || {};
    const mergedProgress = {
      ...clone(remoteProgress),
      ...clone(localProgress)
    };
    const clocks = {};
    PROGRESS_FIELDS.forEach((field) => {
      mergedProgress[field] = mergeProgressBranch(
        localProgress,
        remoteProgress,
        field,
        localProgress[field],
        remoteProgress[field],
        clocks
      );
    });
    mergedProgress[PROGRESS_FIELD_CLOCKS] = clocks;
    const localUpdated = validTimestamp(localProgress.updatedAt || localProgress.createdAt, "");
    const remoteUpdated = validTimestamp(remoteProgress.updatedAt || remoteProgress.createdAt, "");
    mergedProgress.updatedAt = (Date.parse(localUpdated || "") || 0) > (Date.parse(remoteUpdated || "") || 0)
      ? localUpdated
      : remoteUpdated || localUpdated || nowIso();
    mergedProgress.createdAt = localProgress.createdAt || remoteProgress.createdAt || mergedProgress.updatedAt;
    mergedProgress.recordId = localProgress.recordId || remoteProgress.recordId || "";
    mergedProgress.tripId = localProgress.tripId || remoteProgress.tripId || "";
    mergedProgress.profileId = localProgress.profileId || remoteProgress.profileId || remoteRecord.profileId || "";
    mergedProgress.originDeviceId = localProgress.originDeviceId || remoteProgress.originDeviceId || remoteRecord.originDeviceId || "";
    return {
      ...remoteRecord,
      payload: {
        ...clone(remoteRecord.payload || {}),
        dayId: remoteRecord.payload?.dayId || localRecord.payload?.dayId,
        progress: mergedProgress
      }
    };
  }

  function queueMergedRepairs(recordIds) {
    if (!recordIds.size) return;
    const current = currentRecordMap();
    recordIds.forEach((recordId) => {
      const record = current.get(recordId);
      if (!record) return;
      const updatedAt = nowIso();
      syncState.meta[recordId] = { ...(syncState.meta[recordId] || {}), clientUpdatedAt: updatedAt };
      syncState.outbox[recordId] = outboxRecord(record, updatedAt, false);
    });
  }

  function currentRecordMap() {
    const bundle = bridge.getSyncRecords();
    return new Map(bundle.records.map((record) => [record.recordId, record]));
  }

  function validTimestamp(value, fallback = "") {
    const time = Date.parse(value || "");
    return Number.isFinite(time) ? new Date(time).toISOString() : fallback;
  }

  function baselineCurrentRecords() {
    const current = currentRecordMap();
    syncState.snapshot = {};
    syncState.catalog = {};
    current.forEach((record, recordId) => {
      syncState.snapshot[recordId] = signature(record);
      syncState.catalog[recordId] = {
        recordType: record.recordType,
        visibility: record.visibility,
        profileId: record.profileId || "",
        originDeviceId: record.originDeviceId
      };
    });
    saveSyncState();
  }

  function outboxRecord(record, clientUpdatedAt = nowIso(), isDeleted = false) {
    return {
      recordId: record.recordId,
      recordType: record.recordType,
      visibility: record.visibility,
      profileId: record.profileId || "",
      payload: isDeleted ? {} : record.payload,
      clientUpdatedAt,
      originDeviceId: record.originDeviceId || bridge.getSyncRecords().deviceId,
      isDeleted
    };
  }

  function detectLocalChanges() {
    if (viewerToken) return;
    const current = currentRecordMap();
    const nextSnapshot = {};
    const nextCatalog = {};
    current.forEach((record, recordId) => {
      const nextSignature = signature(record);
      nextSnapshot[recordId] = nextSignature;
      nextCatalog[recordId] = {
        recordType: record.recordType,
        visibility: record.visibility,
        profileId: record.profileId || "",
        originDeviceId: record.originDeviceId
      };
      if (syncState.tripId && syncState.snapshot[recordId] !== nextSignature) {
        const updatedAt = nowIso();
        syncState.meta[recordId] = { ...(syncState.meta[recordId] || {}), clientUpdatedAt: updatedAt };
        syncState.outbox[recordId] = outboxRecord(record, updatedAt, false);
      }
    });

    if (syncState.tripId) {
      Object.keys(syncState.snapshot).forEach((recordId) => {
        if (nextSnapshot[recordId] !== undefined) return;
        const catalog = syncState.catalog[recordId];
        if (!catalog) return;
        const updatedAt = nowIso();
        syncState.outbox[recordId] = outboxRecord({ recordId, ...catalog, payload: {} }, updatedAt, true);
        syncState.meta[recordId] = { ...(syncState.meta[recordId] || {}), clientUpdatedAt: updatedAt };
      });
    }

    syncState.snapshot = nextSnapshot;
    syncState.catalog = nextCatalog;
    saveSyncState();
    renderSyncUi();
    if (syncState.tripId && navigator.onLine && Object.keys(syncState.outbox).length) scheduleSync(350);
  }

  function scheduleDetect() {
    clearTimeout(detectTimer);
    detectTimer = setTimeout(detectLocalChanges, 80);
  }

  function handleStateSaved(event) {
    if (event?.detail?.reason === "local-replace") {
      baselineCurrentRecords();
      if (syncState.tripId && navigator.onLine) scheduleSync(120);
      return;
    }
    scheduleDetect();
  }

  function queueAllCurrentRecords() {
    const current = currentRecordMap();
    current.forEach((record, recordId) => {
      const updatedAt = validTimestamp(record.sourceUpdatedAt, nowIso());
      syncState.meta[recordId] = { ...(syncState.meta[recordId] || {}), clientUpdatedAt: updatedAt };
      syncState.outbox[recordId] = outboxRecord(record, updatedAt, false);
    });
    baselineCurrentRecords();
    saveSyncState();
  }

  function initializeClient() {
    if (!CONFIG?.enabled || !CONFIG.url || !CONFIG.publishableKey || !SDK?.createClient) return null;
    if (!client) {
      client = SDK.createClient(CONFIG.url, CONFIG.publishableKey, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
        realtime: { params: { eventsPerSecond: 4 } }
      });
    }
    return client;
  }

  async function ensureAnonymousSession() {
    const activeClient = initializeClient();
    if (!activeClient) throw new Error("The sync client did not load.");
    const { data: sessionData, error: sessionError } = await activeClient.auth.getSession();
    if (sessionError) throw sessionError;
    if (sessionData.session) return sessionData.session;
    const { data, error } = await activeClient.auth.signInAnonymously();
    if (error) throw error;
    return data.session;
  }

  function friendlyError(error) {
    const message = String(error?.message || error || "Unknown sync error");
    if (/anonymous sign-ins/i.test(message) || /anonymous provider/i.test(message)) {
      return "Anonymous Sign-Ins must be enabled in Supabase Authentication settings.";
    }
    if (/function .* does not exist|could not find the function|schema cache/i.test(message)) {
      return "The Supabase setup script has not been run yet, or its schema cache is still refreshing.";
    }
    if (/row-level security|permission denied|not authorized|jwt/i.test(message)) {
      return "This device is not authorized for the shared trip. Rejoin with a fresh family code.";
    }
    return message.slice(0, 220);
  }

  async function startSharedTrip() {
    const activeClient = initializeClient();
    if (!activeClient) return showFailure("The sync client did not load.");
    setBusy(true, "Creating the private trip…");
    try {
      await ensureAnonymousSession();
      const adventure = bridge.getAdventure();
      const profile = bridge.getActiveProfile();
      const { data, error } = await activeClient.rpc("rc_create_trip", {
        p_adventure_key: adventure.id,
        p_name: adventure.title,
        p_display_name: profile.name
      });
      if (error) throw error;
      syncState.tripId = data;
      syncState.tripName = adventure.title;
      syncState.role = "owner";
      syncState.lastError = "";
      queueAllCurrentRecords();
      await syncNow({ force: true });
      await loadOwnerRoster();
      bridge.showToast("Shared Trip started. This device is the owner.");
    } catch (error) {
      showFailure(friendlyError(error));
    } finally {
      setBusy(false);
      renderSyncUi();
    }
  }

  async function joinSharedTrip() {
    const token = $("#sync-join-code")?.value.trim();
    if (!token) return bridge.showToast("Enter the family invitation code.");
    setBusy(true, "Joining the shared trip…");
    try {
      const activeClient = initializeClient();
      await ensureAnonymousSession();
      const profile = bridge.getActiveProfile();
      const { data, error } = await activeClient.rpc("rc_redeem_family_invite", {
        p_token: token,
        p_display_name: profile.name
      });
      if (error) throw error;
      const joined = Array.isArray(data) ? data[0] : data;
      syncState.tripId = joined.trip_id;
      syncState.tripName = joined.trip_name;
      syncState.role = joined.role || "family";
      syncState.lastError = "";
      await initialFamilyMerge();
      $("#sync-join-code").value = "";
      await subscribeRealtime();
      bridge.showToast("Joined the family trip. Records were merged, not replaced.");
    } catch (error) {
      showFailure(friendlyError(error));
    } finally {
      setBusy(false);
      renderSyncUi();
    }
  }

  function normalizeRemoteRow(row) {
    return {
      recordId: row.record_id,
      recordType: row.record_type,
      visibility: row.visibility,
      profileId: row.profile_id || "",
      payload: row.payload || {},
      clientUpdatedAt: row.client_updated_at,
      originDeviceId: row.origin_device_id,
      isDeleted: Boolean(row.is_deleted),
      version: Number(row.version) || 1,
      serverUpdatedAt: row.server_updated_at
    };
  }

  async function fetchRemoteRecords() {
    const { data, error } = await client
      .from("rc_records")
      .select("trip_id,record_id,record_type,visibility,profile_id,payload,client_updated_at,origin_device_id,is_deleted,version,server_updated_at")
      .eq("trip_id", syncState.tripId)
      .order("server_updated_at", { ascending: true });
    if (error) throw error;
    return (data || []).map(normalizeRemoteRow);
  }

  async function initialFamilyMerge() {
    const remoteRecords = await fetchRemoteRecords();
    const remoteMap = new Map(remoteRecords.map((record) => [record.recordId, record]));
    const localMap = currentRecordMap();
    const apply = [];
    const repairRemote = new Set();

    remoteRecords.forEach((remote) => {
      const local = localMap.get(remote.recordId);
      const localTime = Date.parse(local?.sourceUpdatedAt || "") || 0;
      const remoteTime = Date.parse(remote.clientUpdatedAt || "") || 0;
      if (local && remote.recordType === "progress" && !remote.isDeleted) {
        const merged = mergeProgressSyncRecord(local, remote);
        if (signature(merged) !== signature(local)) apply.push(merged);
        if (signature(merged) !== signature(remote)) repairRemote.add(remote.recordId);
      } else if (!local || remote.isDeleted || remoteTime >= localTime) {
        apply.push(remote);
      } else {
        syncState.outbox[local.recordId] = outboxRecord(local, validTimestamp(local.sourceUpdatedAt, nowIso()), false);
      }
      syncState.meta[remote.recordId] = {
        clientUpdatedAt: remote.clientUpdatedAt,
        remoteVersion: remote.version,
        serverUpdatedAt: remote.serverUpdatedAt
      };
    });

    if (apply.length) bridge.applyRemoteSyncRecords(apply);
    baselineCurrentRecords();
    queueMergedRepairs(repairRemote);
    currentRecordMap().forEach((local) => {
      if (remoteMap.has(local.recordId) || syncState.outbox[local.recordId]) return;
      const updatedAt = validTimestamp(local.sourceUpdatedAt, nowIso());
      syncState.outbox[local.recordId] = outboxRecord(local, updatedAt, false);
      syncState.meta[local.recordId] = { ...(syncState.meta[local.recordId] || {}), clientUpdatedAt: updatedAt };
    });
    saveSyncState();
    await syncNow({ force: true });
  }

  function remoteRow(outboxItem) {
    return {
      trip_id: syncState.tripId,
      record_id: outboxItem.recordId,
      record_type: outboxItem.recordType,
      visibility: outboxItem.visibility,
      profile_id: outboxItem.profileId || null,
      payload: outboxItem.payload || {},
      client_updated_at: outboxItem.clientUpdatedAt,
      origin_device_id: outboxItem.originDeviceId,
      is_deleted: Boolean(outboxItem.isDeleted)
    };
  }

  async function pushOutbox() {
    const pending = Object.values(syncState.outbox);
    if (!pending.length) return;
    for (let index = 0; index < pending.length; index += 50) {
      const batch = pending.slice(index, index + 50);
      const sentById = new Map(batch.map((item) => [item.recordId, item]));
      const { data, error } = await client
        .from("rc_records")
        .upsert(batch.map(remoteRow), { onConflict: "trip_id,record_id" })
        .select("record_id,client_updated_at,version,server_updated_at");
      if (error) throw error;
      (data || []).forEach((saved) => {
        const queued = syncState.outbox[saved.record_id];
        const sent = sentById.get(saved.record_id);
        // PostgreSQL may serialize the same timestamp with +00:00 while the
        // browser queued it with Z. Compare against the exact item sent so a
        // successful save drains the outbox without discarding a newer edit.
        if (queued?.clientUpdatedAt === sent?.clientUpdatedAt) delete syncState.outbox[saved.record_id];
        syncState.meta[saved.record_id] = {
          clientUpdatedAt: saved.client_updated_at,
          remoteVersion: Number(saved.version) || 1,
          serverUpdatedAt: saved.server_updated_at
        };
      });
      saveSyncState();
    }
  }

  async function pullRemoteRecords() {
    const remote = await fetchRemoteRecords();
    const apply = [];
    const localMap = currentRecordMap();
    const repairRemote = new Set();
    remote.forEach((record) => {
      if (syncState.outbox[record.recordId]) return;
      const previous = syncState.meta[record.recordId];
      const isNewerVersion = !previous?.remoteVersion || record.version > previous.remoteVersion;
      const isNewerTime = (Date.parse(record.clientUpdatedAt || "") || 0) >= (Date.parse(previous?.clientUpdatedAt || "") || 0);
      if (isNewerVersion || isNewerTime) {
        const local = localMap.get(record.recordId);
        if (local && record.recordType === "progress" && !record.isDeleted) {
          const merged = mergeProgressSyncRecord(local, record);
          if (signature(merged) !== signature(local)) apply.push(merged);
          if (signature(merged) !== signature(record)) repairRemote.add(record.recordId);
        } else {
          apply.push(record);
        }
      }
      syncState.meta[record.recordId] = {
        clientUpdatedAt: record.clientUpdatedAt,
        remoteVersion: record.version,
        serverUpdatedAt: record.serverUpdatedAt
      };
    });
    if (apply.length) bridge.applyRemoteSyncRecords(apply);
    baselineCurrentRecords();
    queueMergedRepairs(repairRemote);
    saveSyncState();
    if (repairRemote.size) scheduleSync(120);
  }

  async function syncNow({ force = false } = {}) {
    if (viewerToken || !syncState.tripId) return;
    if (!navigator.onLine && !force) {
      renderSyncUi();
      return;
    }
    if (syncPromise) return syncPromise;
    syncPromise = (async () => {
      setBusy(true, "Syncing family records…");
      try {
        const activeClient = initializeClient();
        if (!activeClient) throw new Error("The sync client did not load.");
        const { data } = await activeClient.auth.getSession();
        if (!data.session) throw new Error("This device's private sync session is missing. Rejoin with a fresh family code.");
        detectLocalChanges();
        await pushOutbox();
        await pullRemoteRecords();
        syncState.lastSyncedAt = nowIso();
        syncState.lastError = "";
        saveSyncState();
        await subscribeRealtime();
      } catch (error) {
        syncState.lastError = friendlyError(error);
        saveSyncState();
      } finally {
        syncPromise = null;
        setBusy(false);
        renderSyncUi();
      }
    })();
    return syncPromise;
  }

  function scheduleSync(delay = 250) {
    setTimeout(() => syncNow(), delay);
  }

  async function subscribeRealtime() {
    if (!client || !syncState.tripId || channel) return;
    channel = client
      .channel(`road-companion-${syncState.tripId}`)
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "rc_records",
        filter: `trip_id=eq.${syncState.tripId}`
      }, () => scheduleSync(120))
      .subscribe();
  }

  async function createInvite(role) {
    if (syncState.role !== "owner") return;
    setBusy(true, role === "viewer" ? "Creating viewer link…" : "Creating family code…");
    try {
      const { data, error } = await client.rpc("rc_create_invite", {
        p_trip_id: syncState.tripId,
        p_role: role,
        p_expires_in_days: role === "viewer" ? 90 : 30,
        p_max_uses: 1
      });
      if (error) throw error;
      const invite = Array.isArray(data) ? data[0] : data;
      const value = role === "viewer"
        ? `${window.location.origin}${window.location.pathname}?view=${encodeURIComponent(invite.token)}#home`
        : invite.token;
      const output = $("#sync-share-output");
      output.value = value;
      output.dataset.shareRole = role;
      $("#sync-share-label").textContent = role === "viewer" ? "Read-only viewer link" : "One-use family code";
      $("#sync-share-wrap").hidden = false;
      await loadOwnerRoster();
      bridge.showToast(role === "viewer" ? "Viewer link created." : "One-use family code created.");
    } catch (error) {
      showFailure(friendlyError(error));
    } finally {
      setBusy(false);
    }
  }

  async function copyShareOutput() {
    const value = $("#sync-share-output")?.value;
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      bridge.showToast("Copied.");
    } catch {
      $("#sync-share-output").select();
      bridge.showToast("Select and copy the highlighted value.");
    }
  }

  async function shareOutput() {
    const value = $("#sync-share-output")?.value;
    if (!value) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: $("#sync-share-output").dataset.shareRole === "viewer" ? "Road Companion viewer link" : "Road Companion family invitation",
          text: value
        });
        return;
      } catch (error) {
        if (error?.name === "AbortError") return;
      }
    }
    await copyShareOutput();
  }

  function relativeSyncTime(value) {
    const elapsed = Date.now() - Date.parse(value || "");
    if (!Number.isFinite(elapsed) || elapsed < 0) return "Not synced yet";
    const minutes = Math.floor(elapsed / 60000);
    if (minutes < 1) return "Synced just now";
    if (minutes < 60) return `Synced ${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    return `Synced ${hours} h ago`;
  }

  function rosterDate(value) {
    const date = new Date(value || "");
    if (!Number.isFinite(date.getTime())) return "Date unavailable";
    return new Intl.DateTimeFormat("en-CA", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(date);
  }

  function inviteIsActive(invite) {
    if (!invite || invite.revoked_at) return false;
    if ((Date.parse(invite.expires_at || "") || 0) <= Date.now()) return false;
    return invite.max_uses === null || invite.max_uses === undefined || Number(invite.use_count || 0) < Number(invite.max_uses);
  }

  function rosterCounts() {
    const family = ownerRoster.members.filter((member) => member.role === "family").length;
    const viewerLinks = ownerRoster.invites.filter((invite) => invite.role === "viewer" && inviteIsActive(invite)).length;
    const pendingFamily = ownerRoster.invites.filter((invite) => invite.role === "family" && inviteIsActive(invite)).length;
    return { family, viewerLinks, pendingFamily };
  }

  function renderOwnerRoster() {
    const list = $("#sync-people-list");
    const compact = $("#sync-people-summary");
    if (!list || !compact) return;
    if (syncState.role !== "owner") {
      compact.textContent = "";
      return;
    }
    if (!ownerRoster.loaded) {
      compact.textContent = "Loading people…";
      list.innerHTML = '<p class="supporting-copy">Loading people…</p>';
      return;
    }
    const counts = rosterCounts();
    compact.textContent = [
      `${counts.family} contributor${counts.family === 1 ? "" : "s"} connected`,
      `${counts.viewerLinks} viewer link${counts.viewerLinks === 1 ? "" : "s"}`
    ].join(" · ");
    if (ownerRoster.error) {
      list.innerHTML = `<p class="sync-error">${escapeHtml(ownerRoster.error)}</p>`;
      return;
    }
    const members = [...ownerRoster.members].sort((left, right) => {
      if (left.role !== right.role) return left.role === "owner" ? -1 : 1;
      return String(left.joined_at || "").localeCompare(String(right.joined_at || ""));
    });
    const memberRows = members.map((member) => `
      <div class="sync-person-row">
        <span class="sync-person-copy"><strong>${escapeHtml(member.display_name || "Traveller")}</strong><small>${member.role === "owner" ? "Trip owner" : `Family contributor · joined ${escapeHtml(rosterDate(member.joined_at))}`}</small></span>
        <span class="sync-person-state">${member.role === "owner" ? "Owner" : "Connected"}</span>
      </div>`).join("");
    const pendingFamily = ownerRoster.invites.filter((invite) => invite.role === "family" && inviteIsActive(invite));
    const viewerLinks = ownerRoster.invites.filter((invite) => invite.role === "viewer" && inviteIsActive(invite));
    const inviteRow = (invite, label) => `
      <div class="sync-person-row">
        <span class="sync-person-copy"><strong>${escapeHtml(label)} · …${escapeHtml(invite.token_hint || "")}</strong><small>Created ${escapeHtml(rosterDate(invite.created_at))} · expires ${escapeHtml(rosterDate(invite.expires_at))}</small></span>
        <button class="text-button" type="button" data-revoke-invite-id="${escapeHtml(invite.id)}">Revoke</button>
      </div>`;
    list.innerHTML = `
      <div class="sync-people-group"><h4>Family</h4>${memberRows || '<p class="supporting-copy">No connected family devices.</p>'}${pendingFamily.map((invite) => inviteRow(invite, "Pending family code")).join("")}</div>
      <div class="sync-people-group"><h4>Viewers</h4>${viewerLinks.length ? viewerLinks.map((invite) => inviteRow(invite, "Active viewer link")).join("") : '<p class="supporting-copy">No active viewer links.</p>'}</div>`;
  }

  async function loadOwnerRoster() {
    if (syncState.role !== "owner" || !syncState.tripId || !client) return;
    try {
      const [memberResult, inviteResult] = await Promise.all([
        client.from("rc_trip_members")
          .select("user_id,role,display_name,traveller_profile_id,joined_at")
          .eq("trip_id", syncState.tripId)
          .order("joined_at", { ascending: true }),
        client.from("rc_trip_invites")
          .select("id,role,token_hint,created_at,expires_at,max_uses,use_count,revoked_at")
          .eq("trip_id", syncState.tripId)
          .order("created_at", { ascending: false })
      ]);
      if (memberResult.error) throw memberResult.error;
      if (inviteResult.error) throw inviteResult.error;
      ownerRoster = {
        loaded: true,
        members: Array.isArray(memberResult.data) ? memberResult.data : [],
        invites: Array.isArray(inviteResult.data) ? inviteResult.data : [],
        error: ""
      };
    } catch (error) {
      ownerRoster = { ...ownerRoster, loaded: true, error: friendlyError(error) };
    }
    renderOwnerRoster();
  }

  async function revokeRosterInvite(inviteId) {
    if (!inviteId || syncState.role !== "owner") return;
    try {
      const { error } = await client.rpc("rc_revoke_invite", { p_invite_id: inviteId });
      if (error) throw error;
      await loadOwnerRoster();
      bridge.showToast("Invitation revoked.");
    } catch (error) {
      showFailure(friendlyError(error));
    }
  }

  function renderSyncUi() {
    const card = $("#shared-sync-card");
    if (!card) return;
    const pending = Object.keys(syncState.outbox).length;
    const connected = Boolean(syncState.tripId);
    $("#sync-disconnected").hidden = connected;
    $("#sync-connected").hidden = !connected;
    $("#sync-owner-tools").hidden = syncState.role !== "owner";
    $("#sync-role-label").textContent = syncState.role === "owner" ? "Owner" : "Family contributor";
    $("#sync-trip-name").textContent = syncState.tripName || bridge.getAdventure().title;
    const summary = !navigator.onLine
      ? `${pending || "No"} change${pending === 1 ? "" : "s"} waiting · offline`
      : pending
        ? `${pending} change${pending === 1 ? "" : "s"} waiting`
        : relativeSyncTime(syncState.lastSyncedAt);
    $("#sync-summary").textContent = summary;
    $("#sync-error").textContent = syncState.lastError || "";
    $("#sync-error").hidden = !syncState.lastError;
    renderOwnerRoster();
    const header = $("#header-sync-status");
    if (header) {
      header.textContent = connected ? (pending ? `${pending} waiting` : navigator.onLine ? "Synced" : "Sync offline") : "Not synced";
      header.dataset.state = !connected ? "off" : pending ? "waiting" : navigator.onLine ? "synced" : "offline";
    }
  }

  function setBusy(busy, message = "") {
    document.body.classList.toggle("sync-busy", busy);
    ["#sync-start-button", "#sync-join-button", "#sync-now-button", "#sync-family-invite-button", "#sync-viewer-link-button", "#sync-people-refresh-button"]
      .forEach((selector) => { if ($(selector)) $(selector).disabled = busy; });
    if (message && $("#sync-activity")) $("#sync-activity").textContent = message;
    else if (!busy && $("#sync-activity")) $("#sync-activity").textContent = "";
  }

  function showFailure(message) {
    syncState.lastError = message;
    saveSyncState();
    renderSyncUi();
    bridge.showToast(message, 6000);
  }

  async function loadViewerFeed() {
    document.body.classList.add("viewer-mode");
    const header = $("#header-sync-status");
    if (header) {
      header.textContent = "View only";
      header.dataset.state = "viewer";
    }
    try {
      const activeClient = initializeClient();
      if (!activeClient) throw new Error("The viewer feed could not load.");
      const { data, error } = await activeClient.rpc("rc_get_public_trip_feed", { p_token: viewerToken });
      if (error) throw error;
      if (!data) throw new Error("This viewer link is invalid, expired, or revoked.");
      bridge.setViewerFeed(data);
    } catch (error) {
      const message = friendlyError(error);
      const viewerError = $("#viewer-error");
      if (viewerError) {
        viewerError.textContent = message;
        viewerError.hidden = false;
      }
    }
  }

  function bindSyncUi() {
    $("#sync-start-button")?.addEventListener("click", startSharedTrip);
    $("#sync-join-button")?.addEventListener("click", joinSharedTrip);
    $("#sync-now-button")?.addEventListener("click", () => syncNow({ force: true }));
    $("#header-sync-status")?.addEventListener("click", () => {
      if (syncState.tripId) syncNow({ force: true });
    });
    $("#sync-family-invite-button")?.addEventListener("click", () => createInvite("family"));
    $("#sync-viewer-link-button")?.addEventListener("click", () => createInvite("viewer"));
    $("#sync-copy-button")?.addEventListener("click", copyShareOutput);
    $("#sync-share-button")?.addEventListener("click", shareOutput);
    $("#sync-people-refresh-button")?.addEventListener("click", loadOwnerRoster);
    $("#sync-people-list")?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-revoke-invite-id]");
      if (button) revokeRosterInvite(button.dataset.revokeInviteId);
    });
    window.addEventListener("bobsx4:state-saved", handleStateSaved);
    window.addEventListener("online", () => { renderSyncUi(); scheduleSync(100); });
    window.addEventListener("offline", renderSyncUi);
    window.addEventListener("focus", () => { if (syncState.tripId) scheduleSync(80); });
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && syncState.tripId) scheduleSync(80);
    });
  }

  async function init() {
    bindSyncUi();
    initializeClient();
    if (viewerToken) {
      await loadViewerFeed();
      return;
    }
    if (!Object.keys(syncState.snapshot).length) baselineCurrentRecords();
    else detectLocalChanges();
    renderSyncUi();
    if (syncState.tripId) {
      await syncNow();
      if (syncState.role === "owner") await loadOwnerRoster();
      setInterval(() => { if (!document.hidden) syncNow(); }, 30000);
    }
  }

  init();
})();
