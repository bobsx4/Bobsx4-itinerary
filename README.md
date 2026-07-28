--- a/index.html
+++ b/index.html
@@ -11,10 +11,23 @@
   <link rel="manifest" href="manifest.webmanifest">
   <link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
   <link rel="icon" type="image/png" sizes="32x32" href="icons/favicon-32.png">
-  <link rel="stylesheet" href="styles.css?v=0.3.0-rc2">
+  <link rel="stylesheet" href="styles.css?v=0.3.0-rc3-1">
+  <style id="road-companion-critical-fallback">
+    [hidden] { display: none !important; }
+    .asset-diagnostic {
+      box-sizing: border-box; position: sticky; top: 0; z-index: 99999;
+      margin: 0; padding: 12px 16px; background: #7a211b; color: #fff;
+      font: 600 15px/1.35 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
+      text-align: center; box-shadow: 0 2px 12px rgba(0,0,0,.25);
+    }
+    body.asset-failure { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
+  </style>
   <title>Bobsx4 Road Companion</title>
 </head>
 <body>
+  <div id="asset-diagnostic" class="asset-diagnostic" role="alert" hidden>
+    Road Companion could not load <strong>styles.css</strong>. Upload the RC3.1 runtime files to the repository root, wait for Pages to deploy, then refresh.
+  </div>
   <a class="skip-link" href="#main-content">Skip to content</a>
 
   <div class="app-shell">
@@ -38,7 +51,7 @@
           <span id="profile-initials" class="profile-initials">N</span>
           <span id="profile-name" class="profile-name">Navigator</span>
         </button>
-        <span class="version-badge" aria-label="App version">v<span id="header-version">0.3.0 RC2</span></span>
+        <span class="version-badge" aria-label="App version">v<span id="header-version">0.3.0 RC3.1</span></span>
         <span id="network-status" class="status-pill" aria-live="polite">Checking</span>
         <button id="refresh-button" class="icon-button refresh-button" type="button" data-action="refresh-app" aria-label="Refresh app" title="Refresh app">
           <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 7v5h-5M4 17v-5h5M6.1 8.4A7 7 0 0 1 18.5 7M17.9 15.6A7 7 0 0 1 5.5 17" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"></path></svg>
@@ -282,7 +295,7 @@
               <button class="primary-button" type="button" data-action="refresh-app">Refresh app now</button>
               <button class="secondary-button" type="button" data-action="check-update">Check for update</button>
             </div>
-            <p class="version-line">Version <strong id="app-version">0.3.0 RC2</strong> · built <span id="build-date">2026-07-27</span></p>
+            <p class="version-line">Version <strong id="app-version">0.3.0 RC3.1</strong> · built <span id="build-date">2026-07-28</span></p>
           </section>
 
           <section class="section-card" aria-labelledby="backup-title">
@@ -377,7 +390,18 @@
 
   <div id="toast" class="toast" role="status" aria-live="polite" aria-atomic="true"></div>
 
-  <script src="road-data.js?v=0.3.0-rc2"></script>
-  <script src="app.js?v=0.3.0-rc2"></script>
+  <script>
+    window.addEventListener("DOMContentLoaded", function () {
+      var loaded = getComputedStyle(document.documentElement)
+        .getPropertyValue("--road-companion-css-loaded").trim() === "1";
+      if (!loaded) {
+        document.body.classList.add("asset-failure");
+        var diagnostic = document.getElementById("asset-diagnostic");
+        if (diagnostic) diagnostic.hidden = false;
+      }
+    });
+  </script>
+  <script src="road-data.js?v=0.3.0-rc3-1"></script>
+  <script src="app.js?v=0.3.0-rc3-1"></script>
 </body>
 </html>
--- a/styles.css
+++ b/styles.css
@@ -1,4 +1,5 @@
 :root {
+  --road-companion-css-loaded: 1;
   color-scheme: light;
   --ink: #172433;
   --muted: #627080;
@@ -449,10 +450,11 @@
 .adventure-grid { display: grid; gap: 14px; }
 .adventure-column { display: grid; align-content: start; gap: 14px; }
 .mission-list { display: grid; gap: 9px; }
-.mission-item { display: grid; grid-template-columns: 28px 1fr; gap: 10px; align-items: start; padding: 11px; border: 1px solid var(--line); border-radius: 13px; background: var(--soft-2); }
-.mission-item input { width: 21px; height: 21px; margin-top: 1px; accent-color: var(--teal); }
-.mission-item span { font-size: 13px; line-height: 1.38; }
-.mission-item.complete span { color: var(--muted); text-decoration: line-through; }
+.mission-item { display: block; padding: 11px; border: 1px solid var(--line); border-radius: 13px; background: var(--soft-2); }
+.mission-check { display: grid; grid-template-columns: 28px 1fr; gap: 10px; align-items: start; cursor: pointer; }
+.mission-check input[type="checkbox"] { width: 21px; height: 21px; margin-top: 1px; accent-color: var(--teal); }
+.mission-check span { font-size: 13px; line-height: 1.38; }
+.mission-item.complete .mission-copy { color: var(--muted); text-decoration: line-through; }
 .fact-list { display: grid; gap: 11px; }
 .fact-card { padding: 14px; border-radius: 14px; background: linear-gradient(135deg, var(--soft-2), #eef5f6); border: 1px solid var(--line); }
 .fact-card h3 { font-size: 15px; }
@@ -782,10 +784,12 @@
 }
 #view-adventure .progress-track span { background: var(--mode-accent); }
 #view-adventure .mission-item {
-  grid-template-columns: 22px 28px minmax(0, 1fr);
   background: var(--mode-panel);
 }
-#view-adventure .mission-item input {
+#view-adventure .mission-check {
+  grid-template-columns: 22px 28px minmax(0, 1fr);
+}
+#view-adventure .mission-check input[type="checkbox"] {
   width: 20px;
   height: 20px;
   accent-color: var(--mode-accent);
@@ -890,3 +894,114 @@
   #view-adventure[data-experience="explorer"] .spotting-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
   #view-adventure[data-experience="navigator"] .spotting-grid { grid-template-columns: 1fr; }
 }
+
+
+/* RC3 — inline assignment and question responses */
+.mission-response {
+  margin: 10px 0 0 50px;
+  padding-top: 9px;
+  border-top: 1px dashed color-mix(in srgb, var(--mode-accent) 24%, var(--line));
+}
+.mission-response summary {
+  display: flex;
+  align-items: center;
+  justify-content: space-between;
+  gap: 10px;
+  min-height: 34px;
+  color: var(--mode-ink);
+  cursor: pointer;
+  font-size: 12px;
+  font-weight: 850;
+  list-style: none;
+}
+.mission-response summary::-webkit-details-marker { display: none; }
+.mission-response summary::before {
+  content: "+";
+  width: 22px;
+  height: 22px;
+  display: inline-grid;
+  place-items: center;
+  flex: 0 0 auto;
+  border-radius: 8px;
+  background: var(--mode-accent-soft);
+  color: var(--mode-ink);
+  font-size: 16px;
+  line-height: 1;
+}
+.mission-response[open] summary::before { content: "−"; }
+.mission-response summary > span { flex: 1 1 auto; }
+.mission-response summary small { color: var(--success); font-size: 10px; font-weight: 750; text-align: right; }
+.mission-response-grid {
+  display: grid;
+  grid-template-columns: minmax(0, 1fr);
+  gap: 9px;
+  padding: 10px 0 2px;
+}
+.mission-response-field {
+  display: grid;
+  gap: 5px;
+  min-width: 0;
+  color: #344556;
+  font-size: 11px;
+  font-weight: 800;
+}
+.mission-response-field input,
+.mission-response-field textarea,
+.mission-response-field select,
+.fact-answer textarea {
+  width: 100%;
+  min-height: 42px;
+  border: 1px solid color-mix(in srgb, var(--mode-accent) 22%, #cfd9df);
+  border-radius: 11px;
+  background: #fff;
+  color: var(--ink);
+  padding: 10px 11px;
+  font: inherit;
+  font-size: 13px;
+}
+.mission-response-field textarea,
+.fact-answer textarea { resize: vertical; line-height: 1.45; }
+.mission-response-note { margin: 6px 0 0 !important; color: var(--muted) !important; font-size: 10px !important; }
+.fact-answer {
+  display: grid;
+  gap: 6px;
+  margin-top: 10px;
+  color: #344556;
+  font-size: 11px;
+  font-weight: 800;
+}
+.fact-answer small { min-height: 13px; color: var(--success); font-size: 10px; font-weight: 750; }
+.memory-response-group {
+  display: grid;
+  gap: 8px;
+  margin-top: 3px;
+  padding-top: 10px;
+  border-top: 1px dashed var(--line);
+}
+.memory-response-group h4 {
+  margin: 0;
+  color: var(--brand-2);
+  font-size: 12px;
+  text-transform: uppercase;
+  letter-spacing: .06em;
+}
+.memory-response {
+  display: grid;
+  gap: 3px;
+  padding: 9px 10px;
+  border-radius: 11px;
+  background: var(--soft-2);
+  font-size: 11px;
+}
+.memory-response strong { color: var(--ink); }
+.memory-response span { color: #465565; white-space: pre-wrap; }
+
+@media (min-width: 700px) {
+  .mission-response-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
+  .mission-response-field-wide { grid-column: 1 / -1; }
+}
+
+@media (max-width: 520px) {
+  .mission-response { margin-left: 0; }
+  .mission-response summary small { max-width: 110px; }
+}
--- a/app.js
+++ b/app.js
@@ -287,7 +287,12 @@
         journalIntro: "Fast answers now make much better memories later.",
         ratingPrompt: "How good was today?",
         badgeKicker: "Adventure badge",
-        badgeClaimed: "Badge added to Memories"
+        badgeClaimed: "Badge added to Memories",
+        recordAnswer: "Add your answer",
+        editAnswer: "Edit your answer",
+        responseSaved: "Saved on this device",
+        factAnswerLabel: "My answer",
+        factAnswerPlaceholder: "Write what you noticed or decided..."
       };
     }
     return {
@@ -311,7 +316,12 @@
       journalIntro: "Record what worked, what changed, and what future-you should know.",
       ratingPrompt: "How strong was today’s route and experience?",
       badgeKicker: "Navigator credential",
-      badgeClaimed: "Credential added to Memories"
+      badgeClaimed: "Credential added to Memories",
+      recordAnswer: "Record field response",
+      editAnswer: "Edit field response",
+      responseSaved: "Saved on this device",
+      factAnswerLabel: "Field response",
+      factAnswerPlaceholder: "Record the answer, comparison, or observation..."
     };
   }
 
@@ -324,6 +334,8 @@
   function emptyDayProgress() {
     return {
       missions: {},
+      missionResponses: {},
+      factResponses: {},
       sightings: {},
       journal: { rating: 0, favorite: "", ate: "", bought: "", surprise: "", note: "" },
       photoDone: false,
@@ -336,6 +348,8 @@
     if (!profileProgress.days[dayId] && create) profileProgress.days[dayId] = emptyDayProgress();
     const progress = profileProgress.days[dayId] || emptyDayProgress();
     if (!progress.missions || typeof progress.missions !== "object") progress.missions = {};
+    if (!progress.missionResponses || typeof progress.missionResponses !== "object") progress.missionResponses = {};
+    if (!progress.factResponses || typeof progress.factResponses !== "object") progress.factResponses = {};
     if (!progress.sightings || typeof progress.sightings !== "object") progress.sightings = {};
     if (!progress.journal || typeof progress.journal !== "object") progress.journal = emptyDayProgress().journal;
     JOURNAL_FIELDS.forEach((field) => {
@@ -856,6 +870,64 @@
     return Number(journal.rating) > 0 || JOURNAL_FIELDS.some((field) => String(journal[field] || "").trim());
   }
 
+  function missionResponseFields(mission) {
+    return Array.isArray(mission?.responseFields) ? mission.responseFields : [];
+  }
+
+  function missionResponseValues(progress, missionId) {
+    const values = progress.missionResponses?.[missionId];
+    return values && typeof values === "object" ? values : {};
+  }
+
+  function responseValueHasContent(value) {
+    return String(value ?? "").trim().length > 0;
+  }
+
+  function missionResponseHasContent(progress, mission) {
+    const values = missionResponseValues(progress, mission.id);
+    return missionResponseFields(mission).some((field) => responseValueHasContent(values[field.id]));
+  }
+
+  function anyMissionResponseHasContent(progress) {
+    return Object.values(progress.missionResponses || {}).some((values) => values && typeof values === "object" && Object.values(values).some(responseValueHasContent));
+  }
+
+  function anyFactResponseHasContent(progress) {
+    return Object.values(progress.factResponses || {}).some(responseValueHasContent);
+  }
+
+  function renderMissionResponseField(mission, field, value) {
+    const common = `data-mission-response-id="${escapeHtml(mission.id)}" data-mission-field-id="${escapeHtml(field.id)}"`;
+    const label = escapeHtml(field.label || "Response");
+    const placeholder = escapeHtml(field.placeholder || "");
+    const safeValue = escapeHtml(value || "");
+    if (field.type === "textarea") {
+      return `<label class="mission-response-field mission-response-field-wide"><span>${label}</span><textarea rows="${Math.max(2, Number(field.rows) || 3)}" maxlength="800" placeholder="${placeholder}" ${common}>${safeValue}</textarea></label>`;
+    }
+    if (field.type === "select") {
+      const options = (field.options || []).map((option) => `<option value="${escapeHtml(option)}" ${String(value || "") === String(option) ? "selected" : ""}>${escapeHtml(option)}</option>`).join("");
+      return `<label class="mission-response-field"><span>${label}</span><select ${common}><option value="">Choose...</option>${options}</select></label>`;
+    }
+    const type = ["time", "number"].includes(field.type) ? field.type : "text";
+    const min = field.min !== undefined ? ` min="${escapeHtml(field.min)}"` : "";
+    const max = field.max !== undefined ? ` max="${escapeHtml(field.max)}"` : "";
+    const inputMode = field.inputMode ? ` inputmode="${escapeHtml(field.inputMode)}"` : "";
+    const maxLength = type === "text" ? ` maxlength="240"` : "";
+    return `<label class="mission-response-field"><span>${label}</span><input type="${type}" value="${safeValue}" placeholder="${placeholder}"${min}${max}${inputMode}${maxLength} ${common}></label>`;
+  }
+
+  function renderMissionResponse(mission, progress, labels) {
+    const fields = missionResponseFields(mission);
+    if (!fields.length) return "";
+    const values = missionResponseValues(progress, mission.id);
+    const answered = missionResponseHasContent(progress, mission);
+    return `<details class="mission-response" ${answered ? "open" : ""}><summary><span>${escapeHtml(answered ? labels.editAnswer : labels.recordAnswer)}</span><small data-response-status-for="${escapeHtml(mission.id)}">${answered ? escapeHtml(labels.responseSaved) : ""}</small></summary><div class="mission-response-grid">${fields.map((field) => renderMissionResponseField(mission, field, values[field.id])).join("")}</div><p class="mission-response-note">Answers save automatically on this device and appear in Memories.</p></details>`;
+  }
+
+  function factResponseId(fact, index) {
+    return fact.id || `fact-${index + 1}`;
+  }
+
   function renderAdventure() {
     const day = getSelectedAdventureDay();
     const profile = getProfile();
@@ -900,10 +972,14 @@
     $("#mission-progress-bar").style.width = `${missionPercent}%`;
     $("#mission-list").innerHTML = missions.map((mission, index) => {
       const complete = Boolean(progress.missions[mission.id]);
-      return `<label class="mission-item ${complete ? "complete" : ""}"><input type="checkbox" data-mission-id="${escapeHtml(mission.id)}" ${complete ? "checked" : ""}><span class="mission-sequence" aria-hidden="true">${index + 1}</span><span class="mission-copy">${escapeHtml(mission.label)}</span></label>`;
+      return `<article class="mission-item ${complete ? "complete" : ""}"><label class="mission-check"><input type="checkbox" data-mission-id="${escapeHtml(mission.id)}" ${complete ? "checked" : ""}><span class="mission-sequence" aria-hidden="true">${index + 1}</span><span class="mission-copy">${escapeHtml(mission.label)}</span></label>${renderMissionResponse(mission, progress, labels)}</article>`;
     }).join("");
 
-    $("#fact-list").innerHTML = content.facts.map((fact) => `<article class="fact-card"><h3>${escapeHtml(fact.title)}</h3><p>${escapeHtml(fact.text)}</p>${fact.prompt ? `<span class="fact-prompt">${content.experience === "navigator" ? "Consider" : "Try this"}: ${escapeHtml(fact.prompt)}</span>` : ""}${fact.sourceUrl ? `<a class="fact-source" href="${escapeHtml(fact.sourceUrl)}" target="_blank" rel="noopener">Source: ${escapeHtml(fact.sourceLabel || "Official information")}</a>` : ""}</article>`).join("") || `<p class="supporting-copy">No field notes for this day yet.</p>`;
+    $("#fact-list").innerHTML = content.facts.map((fact, index) => {
+      const responseId = factResponseId(fact, index);
+      const response = progress.factResponses?.[responseId] || "";
+      return `<article class="fact-card"><h3>${escapeHtml(fact.title)}</h3><p>${escapeHtml(fact.text)}</p>${fact.prompt ? `<span class="fact-prompt">${content.experience === "navigator" ? "Consider" : "Try this"}: ${escapeHtml(fact.prompt)}</span><label class="fact-answer"><span>${escapeHtml(labels.factAnswerLabel)}</span><textarea rows="2" maxlength="600" placeholder="${escapeHtml(labels.factAnswerPlaceholder)}" data-fact-response-id="${escapeHtml(responseId)}">${escapeHtml(response)}</textarea><small>${responseValueHasContent(response) ? escapeHtml(labels.responseSaved) : ""}</small></label>` : ""}${fact.sourceUrl ? `<a class="fact-source" href="${escapeHtml(fact.sourceUrl)}" target="_blank" rel="noopener">Source: ${escapeHtml(fact.sourceLabel || "Official information")}</a>` : ""}</article>`;
+    }).join("") || `<p class="supporting-copy">No field notes for this day yet.</p>`;
 
     $("#photo-mission-text").textContent = content.photoMission;
     $("#photo-mission-check").checked = Boolean(progress.photoDone);
@@ -998,7 +1074,7 @@
   }
 
   function dayHasMemory(progress) {
-    return Boolean(progress.badgeClaimed || progress.photoDone || journalHasContent(progress.journal) || totalSightings(progress) || Object.values(progress.missions || {}).some(Boolean));
+    return Boolean(progress.badgeClaimed || progress.photoDone || journalHasContent(progress.journal) || totalSightings(progress) || Object.values(progress.missions || {}).some(Boolean) || anyMissionResponseHasContent(progress) || anyFactResponseHasContent(progress));
   }
 
   function renderMemories() {
@@ -1030,7 +1106,15 @@
     const spots = content.spotting.map((spot) => ({ label: spot.label, count: Number(progress.sightings[spot.id]) || 0 })).filter((spot) => spot.count > 0);
     const rating = Math.max(0, Math.min(5, Number(journal.rating) || 0));
     const labelText = (field) => labels[field]?.label || field;
-    return `<article class="scrapbook-card"><div class="scrapbook-head"><span class="day-date-tile"><span>${escapeHtml(parts.month)}</span><strong>${escapeHtml(parts.day)}</strong></span><div><h3>${escapeHtml(day.title)}</h3><p>${escapeHtml(day.start)} → ${escapeHtml(day.end)}</p></div><span class="scrapbook-rating">${rating ? "★".repeat(rating) : ""}</span></div><div class="scrapbook-body">${hasMemory ? `${journal.favorite ? `<div class="memory-line"><strong>${escapeHtml(labelText("favorite"))}</strong><span>${escapeHtml(journal.favorite)}</span></div>` : ""}${journal.ate ? `<div class="memory-line"><strong>${escapeHtml(labelText("ate"))}</strong><span>${escapeHtml(journal.ate)}</span></div>` : ""}${journal.bought ? `<div class="memory-line"><strong>${escapeHtml(labelText("bought"))}</strong><span>${escapeHtml(journal.bought)}</span></div>` : ""}${journal.surprise ? `<div class="memory-line"><strong>${escapeHtml(labelText("surprise"))}</strong><span>${escapeHtml(journal.surprise)}</span></div>` : ""}${journal.note ? `<div class="memory-line"><strong>${escapeHtml(labelText("note"))}</strong><span>${escapeHtml(journal.note)}</span></div>` : ""}${spots.length ? `<div class="sighting-summary">${spots.map((spot) => `<span class="sighting-chip">${escapeHtml(spot.label)} × ${spot.count}</span>`).join("")}</div>` : ""}${progress.photoDone ? `<span class="sighting-chip">${profile.experience === "navigator" ? "Photo brief" : "Photo challenge"} complete</span>` : ""}${progress.badgeClaimed && content.badge ? `<span class="sighting-chip">Badge: ${escapeHtml(content.badge.name)}</span>` : ""}` : `<p class="empty-memory">No entry yet. Open this day in Adventure Mode to add ${profile.experience === "navigator" ? "field notes" : "memories"}.</p>`}</div></article>`;
+    const assignmentAnswers = content.missions.flatMap((mission) => {
+      const values = missionResponseValues(progress, mission.id);
+      const answers = missionResponseFields(mission).filter((field) => responseValueHasContent(values[field.id])).map((field) => `${field.label}: ${values[field.id]}`);
+      return answers.length ? [{ label: mission.label, answers }] : [];
+    });
+    const factAnswers = content.facts.map((fact, index) => ({ label: fact.prompt || fact.title, value: progress.factResponses?.[factResponseId(fact, index)] || "" })).filter((item) => responseValueHasContent(item.value));
+    const assignmentHtml = assignmentAnswers.length ? `<div class="memory-response-group"><h4>${profile.experience === "navigator" ? "Assignment records" : "Mission answers"}</h4>${assignmentAnswers.map((item) => `<div class="memory-response"><strong>${escapeHtml(item.label)}</strong><span>${item.answers.map((answer) => escapeHtml(answer)).join(" · ")}</span></div>`).join("")}</div>` : "";
+    const factHtml = factAnswers.length ? `<div class="memory-response-group"><h4>${profile.experience === "navigator" ? "Route-intelligence responses" : "Things I figured out"}</h4>${factAnswers.map((item) => `<div class="memory-response"><strong>${escapeHtml(item.label)}</strong><span>${escapeHtml(item.value)}</span></div>`).join("")}</div>` : "";
+    return `<article class="scrapbook-card"><div class="scrapbook-head"><span class="day-date-tile"><span>${escapeHtml(parts.month)}</span><strong>${escapeHtml(parts.day)}</strong></span><div><h3>${escapeHtml(day.title)}</h3><p>${escapeHtml(day.start)} → ${escapeHtml(day.end)}</p></div><span class="scrapbook-rating">${rating ? "★".repeat(rating) : ""}</span></div><div class="scrapbook-body">${hasMemory ? `${journal.favorite ? `<div class="memory-line"><strong>${escapeHtml(labelText("favorite"))}</strong><span>${escapeHtml(journal.favorite)}</span></div>` : ""}${journal.ate ? `<div class="memory-line"><strong>${escapeHtml(labelText("ate"))}</strong><span>${escapeHtml(journal.ate)}</span></div>` : ""}${journal.bought ? `<div class="memory-line"><strong>${escapeHtml(labelText("bought"))}</strong><span>${escapeHtml(journal.bought)}</span></div>` : ""}${journal.surprise ? `<div class="memory-line"><strong>${escapeHtml(labelText("surprise"))}</strong><span>${escapeHtml(journal.surprise)}</span></div>` : ""}${journal.note ? `<div class="memory-line"><strong>${escapeHtml(labelText("note"))}</strong><span>${escapeHtml(journal.note)}</span></div>` : ""}${assignmentHtml}${factHtml}${spots.length ? `<div class="sighting-summary">${spots.map((spot) => `<span class="sighting-chip">${escapeHtml(spot.label)} × ${spot.count}</span>`).join("")}</div>` : ""}${progress.photoDone ? `<span class="sighting-chip">${profile.experience === "navigator" ? "Photo brief" : "Photo challenge"} complete</span>` : ""}${progress.badgeClaimed && content.badge ? `<span class="sighting-chip">Badge: ${escapeHtml(content.badge.name)}</span>` : ""}` : `<p class="empty-memory">No entry yet. Open this day in Adventure Mode to add ${profile.experience === "navigator" ? "field notes" : "memories"}.</p>`}</div></article>`;
   }
 
   function renderSettings() {
@@ -1167,6 +1251,26 @@
     renderMemories();
   }
 
+  function setMissionResponse(missionId, fieldId, value) {
+    const day = getSelectedAdventureDay();
+    const progress = getDayProgress(day.id);
+    if (!progress.missionResponses[missionId] || typeof progress.missionResponses[missionId] !== "object") progress.missionResponses[missionId] = {};
+    progress.missionResponses[missionId][fieldId] = value;
+    saveState();
+    const status = document.querySelector(`[data-response-status-for="${CSS.escape(missionId)}"]`);
+    if (status) status.textContent = experienceLabels(experienceContent(day).experience).responseSaved;
+  }
+
+  function setFactResponse(factId, value) {
+    const day = getSelectedAdventureDay();
+    const progress = getDayProgress(day.id);
+    progress.factResponses[factId] = value;
+    saveState();
+    const field = document.querySelector(`[data-fact-response-id="${CSS.escape(factId)}"]`);
+    const status = field?.parentElement?.querySelector("small");
+    if (status) status.textContent = experienceLabels(experienceContent(day).experience).responseSaved;
+  }
+
   function setJournalField(field, value) {
     if (!JOURNAL_FIELDS.includes(field)) return;
     const day = getSelectedAdventureDay();
@@ -1460,6 +1564,14 @@
 
     document.addEventListener("input", (event) => {
       const target = event.target;
+      if (target.matches("[data-mission-response-id][data-mission-field-id]")) {
+        setMissionResponse(target.dataset.missionResponseId, target.dataset.missionFieldId, target.value);
+        return;
+      }
+      if (target.matches("[data-fact-response-id]")) {
+        setFactResponse(target.dataset.factResponseId, target.value);
+        return;
+      }
       if (target.matches("[data-journal-field]")) {
         setJournalField(target.dataset.journalField, target.value);
         return;
--- a/road-data.js
+++ b/road-data.js
@@ -3,9 +3,9 @@
     "id": "bobsx4-road-companion",
     "name": "Bobsx4 Road Companion",
     "shortName": "Road Companion",
-    "version": "0.3.0 RC2",
-    "versionCode": "0.3.0-rc2",
-    "buildDate": "2026-07-27",
+    "version": "0.3.0 RC3.1",
+    "versionCode": "0.3.0-rc3.1",
+    "buildDate": "2026-07-28",
     "dataSchema": 3,
     "tagline": "Adventure is where you are going. Road Companion is how you will remember it."
   },
@@ -319,17 +319,45 @@
                   {
                     "id": "nav-arrival-prediction",
                     "label": "Predict the Lethbridge arrival time before leaving Edmonton",
-                    "audience": "navigator"
+                    "audience": "navigator",
+                    "responseFields": [
+                      {
+                        "id": "predictedTime",
+                        "label": "Predicted arrival time",
+                        "type": "time"
+                      }
+                    ]
                   },
                   {
                     "id": "nav-efficient-stop",
                     "label": "Choose one fuel or food stop that adds no more than about 10 minutes",
-                    "audience": "navigator"
+                    "audience": "navigator",
+                    "responseFields": [
+                      {
+                        "id": "chosenStop",
+                        "label": "Chosen stop",
+                        "type": "text",
+                        "placeholder": "Town, restaurant, fuel station, or rest area"
+                      }
+                    ]
                   },
                   {
                     "id": "nav-arrival-variance",
                     "label": "Compare the actual hotel arrival with your prediction",
-                    "audience": "navigator"
+                    "audience": "navigator",
+                    "responseFields": [
+                      {
+                        "id": "actualTime",
+                        "label": "Actual hotel arrival time",
+                        "type": "time"
+                      },
+                      {
+                        "id": "difference",
+                        "label": "Difference from the prediction",
+                        "type": "text",
+                        "placeholder": "For example: 12 minutes late or 8 minutes early"
+                      }
+                    ]
                   },
                   {
                     "id": "nav-morning-stage",
@@ -373,12 +401,14 @@
                   {
                     "title": "Route rhythm",
                     "text": "A good first-night route is less about sightseeing and more about protecting tomorrow. One efficient stop is usually better than several short ones.",
-                    "prompt": "Which stop saved the most time without making the drive less comfortable?"
+                    "prompt": "Which stop saved the most time without making the drive less comfortable?",
+                    "id": "day-1-navigator-fact-1"
                   },
                   {
                     "title": "ETA accuracy",
                     "text": "Arrival estimates improve when you include the time spent leaving the city, taking breaks, and checking in—not only the highway travel time.",
-                    "prompt": "How many minutes early or late was your prediction?"
+                    "prompt": "How many minutes early or late was your prediction?",
+                    "id": "day-1-navigator-fact-2"
                   }
                 ],
                 "photoMission": "Take one image that clearly shows the transition from city travel to the open road.",
@@ -399,12 +429,28 @@
                   {
                     "id": "exp-launch-song",
                     "label": "Choose the first official road-trip song",
-                    "audience": "explorer"
+                    "audience": "explorer",
+                    "responseFields": [
+                      {
+                        "id": "song",
+                        "label": "Official first road-trip song",
+                        "type": "text",
+                        "placeholder": "Song and artist"
+                      }
+                    ]
                   },
                   {
                     "id": "exp-first-elevator",
                     "label": "Be the first to spot a grain elevator",
-                    "audience": "explorer"
+                    "audience": "explorer",
+                    "responseFields": [
+                      {
+                        "id": "where",
+                        "label": "Where did you spot it?",
+                        "type": "text",
+                        "placeholder": "Town, highway, or nearby landmark"
+                      }
+                    ]
                   },
                   {
                     "id": "exp-map-lethbridge",
@@ -453,12 +499,14 @@
                   {
                     "title": "Prairie transition",
                     "text": "The drive south crosses broad farm country before dropping toward the Oldman River valley near Lethbridge.",
-                    "prompt": "Watch for the moment the land stops feeling completely flat."
+                    "prompt": "Watch for the moment the land stops feeling completely flat.",
+                    "id": "day-1-explorer-fact-1"
                   },
                   {
                     "title": "First-night mission",
                     "text": "Tonight is mostly about getting into road-trip mode. The big mountain scenery begins tomorrow.",
-                    "prompt": "What was the first thing that made the trip feel real?"
+                    "prompt": "What was the first thing that made the trip feel real?",
+                    "id": "day-1-explorer-fact-2"
                   }
                 ],
                 "photoMission": "Capture the best sunset colour or first “we are really on vacation” moment.",
@@ -653,22 +701,68 @@
                   {
                     "id": "nav-logan-estimate",
                     "label": "Estimate the time from the border to Logan Pass, then compare it later",
-                    "audience": "navigator"
+                    "audience": "navigator",
+                    "responseFields": [
+                      {
+                        "id": "estimatedDuration",
+                        "label": "Estimated border-to-Logan Pass time",
+                        "type": "text",
+                        "placeholder": "For example: 2 hr 15 min"
+                      },
+                      {
+                        "id": "actualDuration",
+                        "label": "Actual border-to-Logan Pass time",
+                        "type": "text",
+                        "placeholder": "For example: 2 hr 42 min"
+                      }
+                    ]
                   },
                   {
                     "id": "nav-elevation-change",
                     "label": "Record one clear change caused by elevation: temperature, plants, snow, or cloud",
-                    "audience": "navigator"
+                    "audience": "navigator",
+                    "responseFields": [
+                      {
+                        "id": "observation",
+                        "label": "What changed with elevation?",
+                        "type": "textarea",
+                        "placeholder": "Temperature, plants, snow, cloud, wind, or another clear change—and where you noticed it",
+                        "rows": 4
+                      }
+                    ]
                   },
                   {
                     "id": "nav-park-priority",
                     "label": "Identify the one park stop that added the most value to the day",
-                    "audience": "navigator"
+                    "audience": "navigator",
+                    "responseFields": [
+                      {
+                        "id": "bestStop",
+                        "label": "Most valuable park stop",
+                        "type": "textarea",
+                        "placeholder": "Name the stop and explain why it added the most value",
+                        "rows": 3
+                      }
+                    ]
                   },
                   {
                     "id": "nav-kalispell-arrival",
                     "label": "Note the actual Kalispell arrival time and the biggest delay",
-                    "audience": "navigator"
+                    "audience": "navigator",
+                    "responseFields": [
+                      {
+                        "id": "arrivalTime",
+                        "label": "Actual Kalispell arrival time",
+                        "type": "time"
+                      },
+                      {
+                        "id": "biggestDelay",
+                        "label": "Biggest delay",
+                        "type": "textarea",
+                        "placeholder": "Traffic, border, parking, weather, viewpoint stop, or something else",
+                        "rows": 2
+                      }
+                    ]
                   }
                 ],
                 "spotting": [
@@ -713,12 +807,14 @@
                   {
                     "title": "The Continental Divide",
                     "text": "At Logan Pass, water on opposite sides of the divide ultimately drains toward different ocean systems.",
-                    "prompt": "Which side of the pass looked wetter or greener today?"
+                    "prompt": "Which side of the pass looked wetter or greener today?",
+                    "id": "day-2-navigator-fact-1"
                   },
                   {
                     "title": "Road design as scenery",
                     "text": "Going-to-the-Sun Road is part transportation and part engineering solution, using retaining walls, curves, and narrow ledges to cross alpine terrain.",
-                    "prompt": "Which road feature looked hardest to build?"
+                    "prompt": "Which road feature looked hardest to build?",
+                    "id": "day-2-navigator-fact-2"
                   }
                 ],
                 "photoMission": "Photograph one detail that explains elevation—snow, alpine plants, cloud, exposed rock, or the road itself.",
@@ -754,12 +850,28 @@
                   {
                     "id": "exp-favourite-view",
                     "label": "Choose your favourite viewpoint before leaving the park",
-                    "audience": "explorer"
+                    "audience": "explorer",
+                    "responseFields": [
+                      {
+                        "id": "view",
+                        "label": "Favourite viewpoint",
+                        "type": "text",
+                        "placeholder": "Name or describe it"
+                      }
+                    ]
                   },
                   {
                     "id": "exp-animal-id",
                     "label": "Identify at least one wild animal correctly",
-                    "audience": "explorer"
+                    "audience": "explorer",
+                    "responseFields": [
+                      {
+                        "id": "animal",
+                        "label": "Animal identified",
+                        "type": "text",
+                        "placeholder": "Animal name and where you saw it"
+                      }
+                    ]
                   }
                 ],
                 "spotting": [
@@ -804,12 +916,14 @@
                   {
                     "title": "High country in summer",
                     "text": "Even in late July, alpine areas can hold snow and feel much colder than the valleys below.",
-                    "prompt": "What changed first as the road climbed—temperature, plants, or snow?"
+                    "prompt": "What changed first as the road climbed—temperature, plants, or snow?",
+                    "id": "day-2-explorer-fact-1"
                   },
                   {
                     "title": "Two sides of one mountain",
                     "text": "The east and west sides of Glacier can look surprisingly different because wind, elevation, and moisture shape the landscape.",
-                    "prompt": "Which side did you like better?"
+                    "prompt": "Which side did you like better?",
+                    "id": "day-2-explorer-fact-2"
                   }
                 ],
                 "photoMission": "Take a photo that includes mountains, sky, and water in the same frame.",
@@ -969,27 +1083,83 @@
                   {
                     "id": "nav-time-change",
                     "label": "Record when the phone changes from Mountain to Pacific Time",
-                    "audience": "navigator"
+                    "audience": "navigator",
+                    "responseFields": [
+                      {
+                        "id": "changeTime",
+                        "label": "Time shown when the phone changed",
+                        "type": "time"
+                      },
+                      {
+                        "id": "changeLocation",
+                        "label": "Where were you?",
+                        "type": "text",
+                        "placeholder": "Town, highway, or nearby landmark"
+                      }
+                    ]
                   },
                   {
                     "id": "nav-arrival-with-gain",
                     "label": "Estimate the arrival twice: once by elapsed time and once by local clock time",
-                    "audience": "navigator"
+                    "audience": "navigator",
+                    "responseFields": [
+                      {
+                        "id": "elapsedEstimate",
+                        "label": "Estimated elapsed travel time",
+                        "type": "text",
+                        "placeholder": "For example: 3 hr 45 min"
+                      },
+                      {
+                        "id": "localArrivalEstimate",
+                        "label": "Estimated local-clock arrival",
+                        "type": "time"
+                      },
+                      {
+                        "id": "actualArrival",
+                        "label": "Actual local-clock arrival",
+                        "type": "time"
+                      }
+                    ]
                   },
                   {
                     "id": "nav-lunch-choice",
                     "label": "Choose a lunch stop that does not create a large detour",
-                    "audience": "navigator"
+                    "audience": "navigator",
+                    "responseFields": [
+                      {
+                        "id": "lunchStop",
+                        "label": "Chosen lunch stop",
+                        "type": "text",
+                        "placeholder": "Where and why it worked"
+                      }
+                    ]
                   },
                   {
                     "id": "nav-route-transition",
                     "label": "Describe where the route begins to feel more like northern Idaho",
-                    "audience": "navigator"
+                    "audience": "navigator",
+                    "responseFields": [
+                      {
+                        "id": "transition",
+                        "label": "Where did the route begin to feel like northern Idaho?",
+                        "type": "textarea",
+                        "placeholder": "Describe the landscape, road, vegetation, buildings, or weather change",
+                        "rows": 3
+                      }
+                    ]
                   },
                   {
                     "id": "nav-cda-window",
                     "label": "Protect at least one useful hour in Coeur d’Alene before dinner",
-                    "audience": "navigator"
+                    "audience": "navigator",
+                    "responseFields": [
+                      {
+                        "id": "usefulHour",
+                        "label": "How was the useful hour spent?",
+                        "type": "text",
+                        "placeholder": "Downtown, lakefront, dinner, hotel, shopping, or something else"
+                      }
+                    ]
                   }
                 ],
                 "spotting": [
@@ -1034,12 +1204,14 @@
                   {
                     "title": "A useful hour",
                     "text": "Crossing into Pacific Time makes the clock look earlier even though the actual travel time does not change.",
-                    "prompt": "How much did the time-zone change improve the evening?"
+                    "prompt": "How much did the time-zone change improve the evening?",
+                    "id": "day-3-navigator-fact-1"
                   },
                   {
                     "title": "Place-setting photo",
                     "text": "A strong travel record includes one image that clearly establishes where the family arrived—not only close-ups and food photos.",
-                    "prompt": "What single scene says “Coeur d’Alene” today?"
+                    "prompt": "What single scene says “Coeur d’Alene” today?",
+                    "id": "day-3-navigator-fact-2"
                   }
                 ],
                 "photoMission": "Create one clean place-setting image that clearly says Coeur d’Alene without needing a caption.",
@@ -1060,7 +1232,20 @@
                   {
                     "id": "exp-time-change",
                     "label": "Notice when the phone changes to Pacific Time",
-                    "audience": "explorer"
+                    "audience": "explorer",
+                    "responseFields": [
+                      {
+                        "id": "changeTime",
+                        "label": "When did the time change?",
+                        "type": "time"
+                      },
+                      {
+                        "id": "changeLocation",
+                        "label": "Where were you?",
+                        "type": "text",
+                        "placeholder": "Town or highway"
+                      }
+                    ]
                   },
                   {
                     "id": "exp-idaho-sign",
@@ -1075,12 +1260,28 @@
                   {
                     "id": "exp-road-snack",
                     "label": "Choose one road snack for the drive",
-                    "audience": "explorer"
+                    "audience": "explorer",
+                    "responseFields": [
+                      {
+                        "id": "snack",
+                        "label": "Chosen road snack",
+                        "type": "text",
+                        "placeholder": "What did you pick?"
+                      }
+                    ]
                   },
                   {
                     "id": "exp-first-cda",
                     "label": "Pick the first thing you want to see in Coeur d’Alene",
-                    "audience": "explorer"
+                    "audience": "explorer",
+                    "responseFields": [
+                      {
+                        "id": "firstThing",
+                        "label": "First thing to see in Coeur d’Alene",
+                        "type": "text",
+                        "placeholder": "What did you choose?"
+                      }
+                    ]
                   }
                 ],
                 "spotting": [
@@ -1125,12 +1326,14 @@
                   {
                     "title": "The clock moves backward",
                     "text": "Northern Idaho is in Pacific Time, so the local clock becomes one hour earlier during the drive.",
-                    "prompt": "Did the extra clock hour make the day feel longer?"
+                    "prompt": "Did the extra clock hour make the day feel longer?",
+                    "id": "day-3-explorer-fact-1"
                   },
                   {
                     "title": "Lake beside the city",
                     "text": "Coeur d’Alene is built around a large lake, marina, parks, and a walkable downtown.",
-                    "prompt": "What was the first thing that made it feel like a lake city?"
+                    "prompt": "What was the first thing that made it feel like a lake city?",
+                    "id": "day-3-explorer-fact-2"
                   }
                 ],
                 "photoMission": "Take a first-arrival photo that makes Coeur d’Alene look exciting.",
@@ -1297,27 +1500,79 @@
                   {
                     "id": "nav-opening-strategy",
                     "label": "Choose the first attraction based on location and expected queue",
-                    "audience": "navigator"
+                    "audience": "navigator",
+                    "responseFields": [
+                      {
+                        "id": "strategy",
+                        "label": "First-attraction strategy",
+                        "type": "textarea",
+                        "placeholder": "Which attraction, and why was it the best opening move?",
+                        "rows": 3
+                      }
+                    ]
                   },
                   {
                     "id": "nav-wait-log",
                     "label": "Record the longest posted or experienced wait of the day",
-                    "audience": "navigator"
+                    "audience": "navigator",
+                    "responseFields": [
+                      {
+                        "id": "attraction",
+                        "label": "Attraction with the longest wait",
+                        "type": "text",
+                        "placeholder": "Ride, slide, food line, or other queue"
+                      },
+                      {
+                        "id": "minutes",
+                        "label": "Wait time in minutes",
+                        "type": "number",
+                        "placeholder": "0",
+                        "inputMode": "numeric",
+                        "min": 0,
+                        "max": 300
+                      }
+                    ]
                   },
                   {
                     "id": "nav-top-three",
                     "label": "Rank the top three attractions and give one reason for each",
-                    "audience": "navigator"
+                    "audience": "navigator",
+                    "responseFields": [
+                      {
+                        "id": "ranking",
+                        "label": "Top three attractions",
+                        "type": "textarea",
+                        "placeholder": "1. Attraction — reason\n2. Attraction — reason\n3. Attraction — reason",
+                        "rows": 5
+                      }
+                    ]
                   },
                   {
                     "id": "nav-efficiency",
                     "label": "Identify one decision that saved the family time",
-                    "audience": "navigator"
+                    "audience": "navigator",
+                    "responseFields": [
+                      {
+                        "id": "decision",
+                        "label": "Decision that saved time",
+                        "type": "textarea",
+                        "placeholder": "What was the decision, and how did it help?",
+                        "rows": 3
+                      }
+                    ]
                   },
                   {
                     "id": "nav-comfort-zone",
                     "label": "Try one attraction outside your usual comfort zone",
-                    "audience": "navigator"
+                    "audience": "navigator",
+                    "responseFields": [
+                      {
+                        "id": "attraction",
+                        "label": "Attraction outside your comfort zone",
+                        "type": "text",
+                        "placeholder": "What did you try?"
+                      }
+                    ]
                   }
                 ],
                 "spotting": [
@@ -1362,12 +1617,14 @@
                   {
                     "title": "Park origin",
                     "text": "Silverwood grew from an airfield and aviation attraction into a combined theme park and water park.",
-                    "prompt": "Can you still spot clues that aviation is part of the park’s identity?"
+                    "prompt": "Can you still spot clues that aviation is part of the park’s identity?",
+                    "id": "day-4-navigator-fact-1"
                   },
                   {
                     "title": "The best ride is not always the biggest",
                     "text": "Queue, comfort, repeatability, and the people you rode with can matter as much as height or speed.",
-                    "prompt": "What makes your number-one choice better than the others?"
+                    "prompt": "What makes your number-one choice better than the others?",
+                    "id": "day-4-navigator-fact-2"
                   }
                 ],
                 "photoMission": "Take one dynamic image that communicates motion without relying on an on-ride camera.",
@@ -1388,12 +1645,28 @@
                   {
                     "id": "exp-new-ride",
                     "label": "Try one ride or slide you have never done before",
-                    "audience": "explorer"
+                    "audience": "explorer",
+                    "responseFields": [
+                      {
+                        "id": "ride",
+                        "label": "New ride or slide",
+                        "type": "text",
+                        "placeholder": "What did you try?"
+                      }
+                    ]
                   },
                   {
                     "id": "exp-favourite-ride",
                     "label": "Choose your number-one ride before leaving",
-                    "audience": "explorer"
+                    "audience": "explorer",
+                    "responseFields": [
+                      {
+                        "id": "ride",
+                        "label": "Number-one ride",
+                        "type": "text",
+                        "placeholder": "Which ride won?"
+                      }
+                    ]
                   },
                   {
                     "id": "exp-get-soaked",
@@ -1408,7 +1681,15 @@
                   {
                     "id": "exp-meeting-point",
                     "label": "Remember the family meeting point without asking again",
-                    "audience": "explorer"
+                    "audience": "explorer",
+                    "responseFields": [
+                      {
+                        "id": "meetingPoint",
+                        "label": "Family meeting point",
+                        "type": "text",
+                        "placeholder": "Where was it?"
+                      }
+                    ]
                   }
                 ],
                 "spotting": [
@@ -1453,12 +1734,14 @@
                   {
                     "title": "More than coasters",
                     "text": "Silverwood includes a theme park, a water park, a train, shows, and attractions with very different thrill levels.",
-                    "prompt": "Which part of the park surprised you most?"
+                    "prompt": "Which part of the park surprised you most?",
+                    "id": "day-4-explorer-fact-1"
                   },
                   {
                     "title": "Your own thrill scale",
                     "text": "A ride can be scary before it starts and fantastic afterward—or the opposite.",
-                    "prompt": "Which ride changed your mind the most?"
+                    "prompt": "Which ride changed your mind the most?",
+                    "id": "day-4-explorer-fact-2"
                   }
                 ],
                 "photoMission": "Capture the funniest wet-hair, post-ride, or victory reaction of the day.",
@@ -1626,12 +1909,33 @@
                   {
                     "id": "nav-store-order",
                     "label": "Put the priority stores in an efficient travel order",
-                    "audience": "navigator"
+                    "audience": "navigator",
+                    "responseFields": [
+                      {
+                        "id": "storeOrder",
+                        "label": "Efficient store order",
+                        "type": "textarea",
+                        "placeholder": "List the priority stores in the order you planned to visit them",
+                        "rows": 4
+                      }
+                    ]
                   },
                   {
                     "id": "nav-departure-target",
                     "label": "Set a target departure time from the Spokane area",
-                    "audience": "navigator"
+                    "audience": "navigator",
+                    "responseFields": [
+                      {
+                        "id": "targetTime",
+                        "label": "Target departure time",
+                        "type": "time"
+                      },
+                      {
+                        "id": "actualTime",
+                        "label": "Actual departure time",
+                        "type": "time"
+                      }
+                    ]
                   },
                   {
                     "id": "nav-receipt-control",
@@ -1641,12 +1945,34 @@
                   {
                     "id": "nav-worth-it",
                     "label": "Choose the one stop or purchase that was most worth the time",
-                    "audience": "navigator"
+                    "audience": "navigator",
+                    "responseFields": [
+                      {
+                        "id": "bestValue",
+                        "label": "Stop or purchase most worth the time",
+                        "type": "textarea",
+                        "placeholder": "What was it, and why did it deserve the time?",
+                        "rows": 3
+                      }
+                    ]
                   },
                   {
                     "id": "nav-sandpoint-buffer",
                     "label": "Protect enough time for dinner or a short downtown browse in Sandpoint",
-                    "audience": "navigator"
+                    "audience": "navigator",
+                    "responseFields": [
+                      {
+                        "id": "arrivalTime",
+                        "label": "Sandpoint arrival time",
+                        "type": "time"
+                      },
+                      {
+                        "id": "bufferUse",
+                        "label": "What fit into the remaining time?",
+                        "type": "text",
+                        "placeholder": "Dinner, downtown browse, dessert, rest, or something else"
+                      }
+                    ]
                   }
                 ],
                 "spotting": [
@@ -1691,12 +2017,14 @@
                   {
                     "title": "A shopping day still has a route",
                     "text": "Spokane Valley, Spokane, and the northbound road to Sandpoint can create backtracking if stores are chosen only by name.",
-                    "prompt": "Which stop order worked best, and which one should move next time?"
+                    "prompt": "Which stop order worked best, and which one should move next time?",
+                    "id": "day-5-navigator-fact-1"
                   },
                   {
                     "title": "Receipt control",
                     "text": "Cross-border shopping is easier when receipts stay together and purchases are easy to describe.",
-                    "prompt": "Who became the official receipt keeper today?"
+                    "prompt": "Who became the official receipt keeper today?",
+                    "id": "day-5-navigator-fact-2"
                   }
                 ],
                 "photoMission": "Take a street-level image that presents Sandpoint as a town—not only as a lake destination.",
@@ -1722,7 +2050,15 @@
                   {
                     "id": "exp-new-snack",
                     "label": "Find one snack or item not normally seen at home",
-                    "audience": "explorer"
+                    "audience": "explorer",
+                    "responseFields": [
+                      {
+                        "id": "find",
+                        "label": "New snack or item",
+                        "type": "text",
+                        "placeholder": "What did you find?"
+                      }
+                    ]
                   },
                   {
                     "id": "exp-receipts",
@@ -1732,12 +2068,28 @@
                   {
                     "id": "exp-best-find",
                     "label": "Choose the best find of the day—even if you did not buy it",
-                    "audience": "explorer"
+                    "audience": "explorer",
+                    "responseFields": [
+                      {
+                        "id": "bestFind",
+                        "label": "Best find of the day",
+                        "type": "text",
+                        "placeholder": "Bought or not bought"
+                      }
+                    ]
                   },
                   {
                     "id": "exp-sandpoint-treat",
                     "label": "Pick one dinner, dessert, or downtown treat for Sandpoint",
-                    "audience": "explorer"
+                    "audience": "explorer",
+                    "responseFields": [
+                      {
+                        "id": "treat",
+                        "label": "Sandpoint treat",
+                        "type": "text",
+                        "placeholder": "Dinner, dessert, or downtown treat"
+                      }
+                    ]
                   }
                 ],
                 "spotting": [
@@ -1782,12 +2134,14 @@
                   {
                     "title": "Downtown beside the water",
                     "text": "Sandpoint’s compact downtown sits close to the lake, marina, rail corridor, shops, and restaurants.",
-                    "prompt": "What makes it feel different from the Spokane shopping area?"
+                    "prompt": "What makes it feel different from the Spokane shopping area?",
+                    "id": "day-5-explorer-fact-1"
                   },
                   {
                     "title": "Best find, not biggest bag",
                     "text": "The most memorable discovery might be a snack, a strange product, a bargain, or something funny you never expected to see.",
-                    "prompt": "What was your best find?"
+                    "prompt": "What was your best find?",
+                    "id": "day-5-explorer-fact-2"
                   }
                 ],
                 "photoMission": "Photograph the strangest, funniest, or most surprising thing found in a store today.",
@@ -1989,22 +2343,70 @@
                   {
                     "id": "nav-ferry-check",
                     "label": "Check the ferry status or schedule before leaving Creston",
-                    "audience": "navigator"
+                    "audience": "navigator",
+                    "responseFields": [
+                      {
+                        "id": "status",
+                        "label": "Ferry status or sailing information",
+                        "type": "text",
+                        "placeholder": "What did the check show?"
+                      }
+                    ]
                   },
                   {
                     "id": "nav-queue-estimate",
                     "label": "Estimate the ferry wait, then compare it with the actual queue",
-                    "audience": "navigator"
+                    "audience": "navigator",
+                    "responseFields": [
+                      {
+                        "id": "estimatedMinutes",
+                        "label": "Estimated wait in minutes",
+                        "type": "number",
+                        "placeholder": "0",
+                        "inputMode": "numeric",
+                        "min": 0,
+                        "max": 240
+                      },
+                      {
+                        "id": "actualMinutes",
+                        "label": "Actual wait in minutes",
+                        "type": "number",
+                        "placeholder": "0",
+                        "inputMode": "numeric",
+                        "min": 0,
+                        "max": 240
+                      }
+                    ]
                   },
                   {
                     "id": "nav-crossing-log",
                     "label": "Record the approximate ferry departure and arrival times",
-                    "audience": "navigator"
+                    "audience": "navigator",
+                    "responseFields": [
+                      {
+                        "id": "departureTime",
+                        "label": "Approximate ferry departure",
+                        "type": "time"
+                      },
+                      {
+                        "id": "arrivalTime",
+                        "label": "Approximate ferry arrival",
+                        "type": "time"
+                      }
+                    ]
                   },
                   {
                     "id": "nav-photo-sequence",
                     "label": "Create an approach–crossing–arrival photo sequence",
-                    "audience": "navigator"
+                    "audience": "navigator",
+                    "responseFields": [
+                      {
+                        "id": "bestFrame",
+                        "label": "Best frame in the sequence",
+                        "type": "text",
+                        "placeholder": "Approach, crossing, or arrival—and why"
+                      }
+                    ]
                   }
                 ],
                 "spotting": [
@@ -2049,12 +2451,14 @@
                   {
                     "title": "The ferry is the highway",
                     "text": "The Kootenay Lake Ferry is not merely a sightseeing cruise; it carries Highway 3A traffic across the lake.",
-                    "prompt": "How did loading and unloading compare with your expectation?"
+                    "prompt": "How did loading and unloading compare with your expectation?",
+                    "id": "day-6-navigator-fact-1"
                   },
                   {
                     "title": "Schedule versus reality",
                     "text": "A published sailing time does not include every summer queue. Good planning leaves room for one missed sailing.",
-                    "prompt": "How much buffer did the family actually use?"
+                    "prompt": "How much buffer did the family actually use?",
+                    "id": "day-6-navigator-fact-2"
                   }
                 ],
                 "photoMission": "Build a three-image sequence: approach, crossing, and arrival.",
@@ -2080,7 +2484,15 @@
                   {
                     "id": "exp-handmade",
                     "label": "Find one handmade object or working studio in Crawford Bay",
-                    "audience": "explorer"
+                    "audience": "explorer",
+                    "responseFields": [
+                      {
+                        "id": "object",
+                        "label": "Handmade object or studio",
+                        "type": "text",
+                        "placeholder": "What did you find?"
+                      }
+                    ]
                   },
                   {
                     "id": "exp-deck",
@@ -2095,7 +2507,15 @@
                   {
                     "id": "exp-lake-bird",
                     "label": "Spot an osprey, eagle, or other large bird over the lake",
-                    "audience": "explorer"
+                    "audience": "explorer",
+                    "responseFields": [
+                      {
+                        "id": "bird",
+                        "label": "Large bird spotted",
+                        "type": "text",
+                        "placeholder": "What kind, or what did it look like?"
+                      }
+                    ]
                   }
                 ],
                 "spotting": [
@@ -2140,12 +2560,14 @@
                   {
                     "title": "A road that becomes a boat ride",
                     "text": "The ferry carries vehicles and passengers across Kootenay Lake as part of the public highway route.",
-                    "prompt": "What felt strangest about driving onto a boat?"
+                    "prompt": "What felt strangest about driving onto a boat?",
+                    "id": "day-6-explorer-fact-1"
                   },
                   {
                     "title": "Nelson at the end",
                     "text": "Nelson is known for a historic downtown, old buildings, shops, restaurants, and streets that climb above the lake.",
-                    "prompt": "Which building or storefront catches your eye first?"
+                    "prompt": "Which building or storefront catches your eye first?",
+                    "id": "day-6-explorer-fact-2"
                   }
                 ],
                 "photoMission": "Take a photo from the ferry that proves the car is travelling by boat.",
@@ -2308,27 +2730,86 @@
                   {
                     "id": "nav-meetup-confirm",
                     "label": "Confirm the Penticton meetup time before leaving Nelson",
-                    "audience": "navigator"
+                    "audience": "navigator",
+                    "responseFields": [
+                      {
+                        "id": "meetupTime",
+                        "label": "Confirmed meetup time",
+                        "type": "time"
+                      }
+                    ]
                   },
                   {
                     "id": "nav-stop-value",
                     "label": "Choose one route stop worth the time and explain why",
-                    "audience": "navigator"
+                    "audience": "navigator",
+                    "responseFields": [
+                      {
+                        "id": "stop",
+                        "label": "Route stop worth the time",
+                        "type": "textarea",
+                        "placeholder": "Name the stop and explain why it earned the time",
+                        "rows": 3
+                      }
+                    ]
                   },
                   {
                     "id": "nav-midday-check",
                     "label": "Compare actual progress with the planned midpoint time",
-                    "audience": "navigator"
+                    "audience": "navigator",
+                    "responseFields": [
+                      {
+                        "id": "plannedMidpoint",
+                        "label": "Planned midpoint time",
+                        "type": "time"
+                      },
+                      {
+                        "id": "actualMidpoint",
+                        "label": "Actual midpoint time",
+                        "type": "time"
+                      },
+                      {
+                        "id": "location",
+                        "label": "Where were you at the actual midpoint?",
+                        "type": "text",
+                        "placeholder": "Town or route landmark"
+                      }
+                    ]
                   },
                   {
                     "id": "nav-landscape-shift",
                     "label": "Record the clearest change from Kootenay to Okanagan landscape",
-                    "audience": "navigator"
+                    "audience": "navigator",
+                    "responseFields": [
+                      {
+                        "id": "shift",
+                        "label": "Clearest Kootenay-to-Okanagan change",
+                        "type": "textarea",
+                        "placeholder": "Describe what changed and roughly where",
+                        "rows": 4
+                      }
+                    ]
                   },
                   {
                     "id": "nav-arrival-buffer",
                     "label": "Reach Penticton with the planned meetup buffer intact",
-                    "audience": "navigator"
+                    "audience": "navigator",
+                    "responseFields": [
+                      {
+                        "id": "arrivalTime",
+                        "label": "Actual Penticton arrival",
+                        "type": "time"
+                      },
+                      {
+                        "id": "bufferMinutes",
+                        "label": "Meetup buffer remaining in minutes",
+                        "type": "number",
+                        "placeholder": "0",
+                        "inputMode": "numeric",
+                        "min": -240,
+                        "max": 480
+                      }
+                    ]
                   }
                 ],
                 "spotting": [
@@ -2373,12 +2854,14 @@
                   {
                     "title": "Scenic does not mean quick",
                     "text": "Highway 3 crosses varied terrain and communities, so the best stop is the one that adds value without threatening the meetup.",
-                    "prompt": "Which possible stop did you deliberately skip, and was that the right call?"
+                    "prompt": "Which possible stop did you deliberately skip, and was that the right call?",
+                    "id": "day-7-navigator-fact-1"
                   },
                   {
                     "title": "Two-lake arrival",
                     "text": "Penticton sits between Okanagan Lake and Skaha Lake, creating two waterfronts with very different directions and views.",
-                    "prompt": "Which lake did you notice first?"
+                    "prompt": "Which lake did you notice first?",
+                    "id": "day-7-navigator-fact-2"
                   }
                 ],
                 "photoMission": "Take one image that shows the visual change from Kootenay mountains to Okanagan landscape.",
@@ -2399,7 +2882,15 @@
                   {
                     "id": "exp-fruit-stop",
                     "label": "Find a BC fruit stand or orchard product",
-                    "audience": "explorer"
+                    "audience": "explorer",
+                    "responseFields": [
+                      {
+                        "id": "fruitStop",
+                        "label": "Fruit stand or orchard product",
+                        "type": "text",
+                        "placeholder": "What and where?"
+                      }
+                    ]
                   },
                   {
                     "id": "exp-two-lakes",
@@ -2409,12 +2900,29 @@
                   {
                     "id": "exp-fruit-choice",
                     "label": "Choose one local fruit, drink, or snack to try",
-                    "audience": "explorer"
+                    "audience": "explorer",
+                    "responseFields": [
+                      {
+                        "id": "fruitChoice",
+                        "label": "Local fruit, drink, or snack",
+                        "type": "text",
+                        "placeholder": "What did you try?"
+                      }
+                    ]
                   },
                   {
                     "id": "exp-warm-change",
                     "label": "Spot the moment the landscape starts looking warmer and drier",
-                    "audience": "explorer"
+                    "audience": "explorer",
+                    "responseFields": [
+                      {
+                        "id": "change",
+                        "label": "When did it start looking warmer and drier?",
+                        "type": "textarea",
+                        "placeholder": "Describe what you noticed and where",
+                        "rows": 3
+                      }
+                    ]
                   },
                   {
                     "id": "exp-meetup-photo",
@@ -2464,12 +2972,14 @@
                   {
                     "title": "Between two lakes",
                     "text": "Penticton is squeezed between Okanagan Lake to the north and Skaha Lake to the south.",
-                    "prompt": "Which waterfront would you choose for an evening walk?"
+                    "prompt": "Which waterfront would you choose for an evening walk?",
+                    "id": "day-7-explorer-fact-1"
                   },
                   {
                     "title": "Orchard country",
                     "text": "The warmer Okanagan climate supports orchards, vineyards, roadside produce, and long summer evenings.",
-                    "prompt": "Which fruit looked best today?"
+                    "prompt": "Which fruit looked best today?",
+                    "id": "day-7-explorer-fact-2"
                   }
                 ],
                 "photoMission": "Photograph the brightest fruit, most colourful stand, or best first view of Penticton.",
@@ -2651,27 +3161,72 @@
                   {
                     "id": "nav-farm-arrival",
                     "label": "Arrive at Kangaroo Creek Farm with enough time for a relaxed visit",
-                    "audience": "navigator"
+                    "audience": "navigator",
+                    "responseFields": [
+                      {
+                        "id": "arrivalTime",
+                        "label": "Farm arrival time",
+                        "type": "time"
+                      }
+                    ]
                   },
                   {
                     "id": "nav-behaviour-note",
                     "label": "Document one animal behaviour rather than only naming the species",
-                    "audience": "navigator"
+                    "audience": "navigator",
+                    "responseFields": [
+                      {
+                        "id": "behaviour",
+                        "label": "Animal behaviour observed",
+                        "type": "textarea",
+                        "placeholder": "What was the animal doing, and what made it interesting?",
+                        "rows": 4
+                      }
+                    ]
                   },
                   {
                     "id": "nav-departure-plan",
                     "label": "Choose a farm departure time and help the family keep it",
-                    "audience": "navigator"
+                    "audience": "navigator",
+                    "responseFields": [
+                      {
+                        "id": "targetTime",
+                        "label": "Planned farm departure",
+                        "type": "time"
+                      },
+                      {
+                        "id": "actualTime",
+                        "label": "Actual farm departure",
+                        "type": "time"
+                      }
+                    ]
                   },
                   {
                     "id": "nav-fuel-lunch",
                     "label": "Identify an efficient lunch or fuel stop for the northbound drive",
-                    "audience": "navigator"
+                    "audience": "navigator",
+                    "responseFields": [
+                      {
+                        "id": "stop",
+                        "label": "Efficient lunch or fuel stop",
+                        "type": "text",
+                        "placeholder": "Where did you stop, or what did you choose?"
+                      }
+                    ]
                   },
                   {
                     "id": "nav-terrain-shift",
                     "label": "Record where the route stops feeling like the Okanagan",
-                    "audience": "navigator"
+                    "audience": "navigator",
+                    "responseFields": [
+                      {
+                        "id": "shift",
+                        "label": "Where did the route stop feeling like the Okanagan?",
+                        "type": "textarea",
+                        "placeholder": "Describe the change and approximate location",
+                        "rows": 3
+                      }
+                    ]
                   }
                 ],
                 "spotting": [
@@ -2716,12 +3271,14 @@
                   {
                     "title": "Behaviour tells the story",
                     "text": "A useful animal portrait records what the animal is doing—resting, eating, watching, moving, or interacting—not only what species it is.",
-                    "prompt": "Which behaviour best revealed an animal’s personality?"
+                    "prompt": "Which behaviour best revealed an animal’s personality?",
+                    "id": "day-8-navigator-fact-1"
                   },
                   {
                     "title": "The schedule matters",
                     "text": "The farm visit is only the first part of a long travel day. A planned departure protects the Clearwater arrival.",
-                    "prompt": "Did the family leave within 15 minutes of the target?"
+                    "prompt": "Did the family leave within 15 minutes of the target?",
+                    "id": "day-8-navigator-fact-2"
                   }
                 ],
                 "photoMission": "Create an animal portrait that shows behaviour or personality, not only the enclosure.",
@@ -2747,17 +3304,49 @@
                   {
                     "id": "exp-favourite-animal",
                     "label": "Pick a favourite animal and explain why",
-                    "audience": "explorer"
+                    "audience": "explorer",
+                    "responseFields": [
+                      {
+                        "id": "animal",
+                        "label": "Favourite animal",
+                        "type": "text",
+                        "placeholder": "Which animal?"
+                      },
+                      {
+                        "id": "why",
+                        "label": "Why was it your favourite?",
+                        "type": "textarea",
+                        "placeholder": "What made it stand out?",
+                        "rows": 2
+                      }
+                    ]
                   },
                   {
                     "id": "exp-animal-fact",
                     "label": "Learn one animal fact you did not know before",
-                    "audience": "explorer"
+                    "audience": "explorer",
+                    "responseFields": [
+                      {
+                        "id": "fact",
+                        "label": "New animal fact",
+                        "type": "textarea",
+                        "placeholder": "What did you learn?",
+                        "rows": 2
+                      }
+                    ]
                   },
                   {
                     "id": "exp-four-species",
                     "label": "Spot at least four different animal species",
-                    "audience": "explorer"
+                    "audience": "explorer",
+                    "responseFields": [
+                      {
+                        "id": "species",
+                        "label": "Four species spotted",
+                        "type": "text",
+                        "placeholder": "List them, separated by commas"
+                      }
+                    ]
                   },
                   {
                     "id": "exp-find-clearwater",
@@ -2807,12 +3396,14 @@
                   {
                     "title": "More than kangaroos",
                     "text": "The farm includes several kinds of animals, so the best discovery may not be the animal in its name.",
-                    "prompt": "Which animal surprised you most?"
+                    "prompt": "Which animal surprised you most?",
+                    "id": "day-8-explorer-fact-1"
                   },
                   {
                     "title": "Capybara fact",
                     "text": "Capybaras are the world’s largest living rodents and are strongly associated with water.",
-                    "prompt": "What did the capybaras spend most of their time doing?"
+                    "prompt": "What did the capybaras spend most of their time doing?",
+                    "id": "day-8-explorer-fact-2"
                   }
                 ],
                 "photoMission": "Take a respectful close-up of your favourite animal.",
@@ -2987,27 +3578,84 @@
                   {
                     "id": "nav-waterfall-choice",
                     "label": "Choose the waterfall stop that best fits the day’s timing",
-                    "audience": "navigator"
+                    "audience": "navigator",
+                    "responseFields": [
+                      {
+                        "id": "choice",
+                        "label": "Chosen waterfall stop",
+                        "type": "textarea",
+                        "placeholder": "Which waterfall, and why did it best fit the timing?",
+                        "rows": 3
+                      }
+                    ]
                   },
                   {
                     "id": "nav-departure-log",
                     "label": "Record the actual Clearwater departure time",
-                    "audience": "navigator"
+                    "audience": "navigator",
+                    "responseFields": [
+                      {
+                        "id": "departureTime",
+                        "label": "Actual Clearwater departure",
+                        "type": "time"
+                      }
+                    ]
                   },
                   {
                     "id": "nav-time-zone",
                     "label": "Account for the one-hour change back to Mountain Time",
-                    "audience": "navigator"
+                    "audience": "navigator",
+                    "responseFields": [
+                      {
+                        "id": "changeTime",
+                        "label": "When did the clock change?",
+                        "type": "time"
+                      },
+                      {
+                        "id": "changeLocation",
+                        "label": "Where were you?",
+                        "type": "text",
+                        "placeholder": "Town, highway, or landmark"
+                      }
+                    ]
                   },
                   {
                     "id": "nav-robson-visibility",
                     "label": "Record whether Mount Robson’s summit is visible",
-                    "audience": "navigator"
+                    "audience": "navigator",
+                    "responseFields": [
+                      {
+                        "id": "visibility",
+                        "label": "Mount Robson summit",
+                        "type": "select",
+                        "options": [
+                          "Clearly visible",
+                          "Partly visible",
+                          "Hidden by cloud",
+                          "Not checked"
+                        ]
+                      },
+                      {
+                        "id": "note",
+                        "label": "Visibility note",
+                        "type": "text",
+                        "placeholder": "Cloud, haze, weather, or viewpoint"
+                      }
+                    ]
                   },
                   {
                     "id": "nav-delay-cause",
                     "label": "Identify the day’s largest delay before reaching Hinton",
-                    "audience": "navigator"
+                    "audience": "navigator",
+                    "responseFields": [
+                      {
+                        "id": "delay",
+                        "label": "Largest delay of the day",
+                        "type": "textarea",
+                        "placeholder": "What caused it, and about how much time did it add?",
+                        "rows": 3
+                      }
+                    ]
                   }
                 ],
                 "spotting": [
@@ -3052,12 +3700,14 @@
                   {
                     "title": "Waterfall selection",
                     "text": "Helmcken is the signature waterfall, while a shorter stop can protect the long drive. The correct choice depends on the real departure time.",
-                    "prompt": "Did the chosen waterfall justify the time it used?"
+                    "prompt": "Did the chosen waterfall justify the time it used?",
+                    "id": "day-9-navigator-fact-1"
                   },
                   {
                     "title": "A clock-hour disappears",
                     "text": "Returning to Mountain Time makes the local clock jump one hour forward during the eastbound route.",
-                    "prompt": "How did the time change affect the Hinton arrival?"
+                    "prompt": "How did the time change affect the Hinton arrival?",
+                    "id": "day-9-navigator-fact-2"
                   }
                 ],
                 "photoMission": "Use foreground, middle distance, and background in one waterfall or mountain landscape.",
@@ -3083,12 +3733,38 @@
                   {
                     "id": "exp-robson",
                     "label": "Look for Mount Robson and decide whether the summit is visible",
-                    "audience": "explorer"
+                    "audience": "explorer",
+                    "responseFields": [
+                      {
+                        "id": "visibility",
+                        "label": "Was the summit visible?",
+                        "type": "select",
+                        "options": [
+                          "Yes—clearly",
+                          "Partly",
+                          "No—hidden",
+                          "We did not check"
+                        ]
+                      }
+                    ]
                   },
                   {
                     "id": "exp-time-change",
                     "label": "Notice the one-hour change back to Mountain Time",
-                    "audience": "explorer"
+                    "audience": "explorer",
+                    "responseFields": [
+                      {
+                        "id": "changeTime",
+                        "label": "When did the time change?",
+                        "type": "time"
+                      },
+                      {
+                        "id": "changeLocation",
+                        "label": "Where were you?",
+                        "type": "text",
+                        "placeholder": "Town or highway"
+                      }
+                    ]
                   },
                   {
                     "id": "exp-safe-wildlife",
@@ -3098,7 +3774,15 @@
                   {
                     "id": "exp-best-mountain",
                     "label": "Choose the best mountain view of the day",
-                    "audience": "explorer"
+                    "audience": "explorer",
+                    "responseFields": [
+                      {
+                        "id": "view",
+                        "label": "Best mountain view",
+                        "type": "text",
+                        "placeholder": "Where was it?"
+                      }
+                    ]
                   }
                 ],
                 "spotting": [
@@ -3143,12 +3827,14 @@
                   {
                     "title": "Waterfall country",
                     "text": "Wells Gray is known for dramatic waterfalls, volcanic landforms, rivers, and deep forest.",
-                    "prompt": "Which sound was stronger—the water, wind, or people at the viewpoint?"
+                    "prompt": "Which sound was stronger—the water, wind, or people at the viewpoint?",
+                    "id": "day-9-explorer-fact-1"
                   },
                   {
                     "title": "Mount Robson test",
                     "text": "Cloud often hides part or all of Mount Robson, so seeing the full summit is never guaranteed.",
-                    "prompt": "How much of the mountain could you see today?"
+                    "prompt": "How much of the mountain could you see today?",
+                    "id": "day-9-explorer-fact-2"
                   }
                 ],
                 "photoMission": "Take a photo that shows how small people or trees look beside a waterfall or mountain.",
@@ -3306,22 +3992,61 @@
                   {
                     "id": "nav-home-eta",
                     "label": "Predict the home arrival time before leaving Hinton",
-                    "audience": "navigator"
+                    "audience": "navigator",
+                    "responseFields": [
+                      {
+                        "id": "predictedTime",
+                        "label": "Predicted home arrival",
+                        "type": "time"
+                      },
+                      {
+                        "id": "actualTime",
+                        "label": "Actual home arrival",
+                        "type": "time"
+                      }
+                    ]
                   },
                   {
                     "id": "nav-family-verdicts",
                     "label": "Ask each person for a one-sentence trip verdict",
-                    "audience": "navigator"
+                    "audience": "navigator",
+                    "responseFields": [
+                      {
+                        "id": "verdicts",
+                        "label": "One-sentence family verdicts",
+                        "type": "textarea",
+                        "placeholder": "One line for each person",
+                        "rows": 5
+                      }
+                    ]
                   },
                   {
                     "id": "nav-top-three-days",
                     "label": "Rank the trip’s top three days and record why",
-                    "audience": "navigator"
+                    "audience": "navigator",
+                    "responseFields": [
+                      {
+                        "id": "ranking",
+                        "label": "Top three days and why",
+                        "type": "textarea",
+                        "placeholder": "1. Day — reason\n2. Day — reason\n3. Day — reason",
+                        "rows": 5
+                      }
+                    ]
                   },
                   {
                     "id": "nav-next-time",
                     "label": "Write one route or planning change for the next adventure",
-                    "audience": "navigator"
+                    "audience": "navigator",
+                    "responseFields": [
+                      {
+                        "id": "change",
+                        "label": "One change for the next adventure",
+                        "type": "textarea",
+                        "placeholder": "Route, timing, packing, lodging, activities, or app use",
+                        "rows": 3
+                      }
+                    ]
                   },
                   {
                     "id": "nav-final-journal",
@@ -3371,12 +4096,14 @@
                   {
                     "title": "The debrief matters",
                     "text": "A short note about what worked, what did not, and what the family would repeat is more useful than relying on memory before the next trip.",
-                    "prompt": "What single planning choice improved this adventure the most?"
+                    "prompt": "What single planning choice improved this adventure the most?",
+                    "id": "day-10-navigator-fact-1"
                   },
                   {
                     "title": "End with an image",
                     "text": "The closing photograph should feel like an ending: arrival, luggage, a familiar view, or the family together.",
-                    "prompt": "What image best closes the story?"
+                    "prompt": "What image best closes the story?",
+                    "id": "day-10-navigator-fact-2"
                   }
                 ],
                 "photoMission": "Create the closing image for the scrapbook—something that feels like an ending, not merely a driveway.",
@@ -3397,17 +4124,42 @@
                   {
                     "id": "exp-final-song",
                     "label": "Choose the final official road-trip song",
-                    "audience": "explorer"
+                    "audience": "explorer",
+                    "responseFields": [
+                      {
+                        "id": "song",
+                        "label": "Final official road-trip song",
+                        "type": "text",
+                        "placeholder": "Song and artist"
+                      }
+                    ]
                   },
                   {
                     "id": "exp-best-moment",
                     "label": "Name the trip’s single best moment",
-                    "audience": "explorer"
+                    "audience": "explorer",
+                    "responseFields": [
+                      {
+                        "id": "moment",
+                        "label": "Single best moment of the trip",
+                        "type": "textarea",
+                        "placeholder": "What happened, and why was it the best?",
+                        "rows": 3
+                      }
+                    ]
                   },
                   {
                     "id": "exp-home-sign",
                     "label": "Spot the first road sign that truly feels like home",
-                    "audience": "explorer"
+                    "audience": "explorer",
+                    "responseFields": [
+                      {
+                        "id": "sign",
+                        "label": "First sign that felt like home",
+                        "type": "text",
+                        "placeholder": "What did it say or show?"
+                      }
+                    ]
                   },
                   {
                     "id": "exp-home-photo",
@@ -3462,12 +4214,14 @@
                   {
                     "title": "The useful final kilometre",
                     "text": "The trip is not finished until the funniest moments, favourite food, best purchase, and top day are written down.",
-                    "prompt": "Which story will you tell first when someone asks about the trip?"
+                    "prompt": "Which story will you tell first when someone asks about the trip?",
+                    "id": "day-10-explorer-fact-1"
                   },
                   {
                     "title": "Adventure becomes memory",
                     "text": "The route disappears behind you, but ratings, photos, sightings, and quick notes can keep the details from blending together.",
-                    "prompt": "What is one tiny detail you do not want to forget?"
+                    "prompt": "What is one tiny detail you do not want to forget?",
+                    "id": "day-10-explorer-fact-2"
                   }
                 ],
                 "photoMission": "Take the official “we made it home” photo.",
--- a/service-worker.js
+++ b/service-worker.js
@@ -1,11 +1,11 @@
 const CACHE_PREFIX = "bobsx4-road-companion";
-const CACHE_NAME = `${CACHE_PREFIX}-v0.3.0-rc2`;
+const CACHE_NAME = `${CACHE_PREFIX}-v0.3.0-rc3-1`;
 const APP_SHELL = [
   "./",
   "./index.html",
-  "./styles.css?v=0.3.0-rc2",
-  "./road-data.js?v=0.3.0-rc2",
-  "./app.js?v=0.3.0-rc2",
+  "./styles.css?v=0.3.0-rc3-1",
+  "./road-data.js?v=0.3.0-rc3-1",
+  "./app.js?v=0.3.0-rc3-1",
   "./manifest.webmanifest",
   "./release-manifest.json",
   "./icons/app-icon.svg",
--- a/release-manifest.json
+++ b/release-manifest.json
@@ -1,8 +1,8 @@
 {
   "app": "Bobsx4 Road Companion",
-  "version": "0.3.0 RC2",
-  "versionCode": "0.3.0-rc2",
-  "buildDate": "2026-07-27",
+  "version": "0.3.0 RC3.1",
+  "versionCode": "0.3.0-rc3.1",
+  "buildDate": "2026-07-28",
   "dataSchema": 3,
   "channel": "release-candidate"
 }
