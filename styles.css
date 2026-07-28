:root {
  --road-companion-css-loaded: 1;
  color-scheme: light;
  --ink: #172433;
  --muted: #627080;
  --soft: #eef3f6;
  --soft-2: #f7f9fa;
  --line: #d8e1e7;
  --surface: #ffffff;
  --surface-glass: rgba(255, 255, 255, 0.94);
  --brand: #16324a;
  --brand-2: #245b78;
  --accent: #d98545;
  --accent-soft: #fff0e4;
  --teal: #1f776f;
  --teal-soft: #e6f5f2;
  --indigo: #4b58a7;
  --indigo-soft: #eceefe;
  --success: #2f7a4f;
  --success-soft: #e7f5ec;
  --warning: #9a6519;
  --warning-soft: #fff5da;
  --danger: #a64141;
  --danger-soft: #ffeded;
  --shadow-sm: 0 6px 18px rgba(21, 47, 69, 0.08);
  --shadow-md: 0 16px 45px rgba(21, 47, 69, 0.14);
  --radius-sm: 12px;
  --radius: 18px;
  --radius-lg: 26px;
  --topbar-h: 68px;
  --bottom-nav-h: 74px;
  --content-max: 1220px;
  --safe-top: env(safe-area-inset-top, 0px);
  --safe-right: env(safe-area-inset-right, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);
  --safe-left: env(safe-area-inset-left, 0px);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

* { box-sizing: border-box; }
html { min-height: 100%; background: #e9eff3; scroll-behavior: smooth; }
body {
  margin: 0;
  min-width: 320px;
  min-height: 100%;
  background:
    radial-gradient(circle at 10% -10%, rgba(217, 133, 69, 0.16), transparent 34rem),
    linear-gradient(180deg, #eef4f6 0%, #f7f9fa 42%, #edf2f5 100%);
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
  overscroll-behavior-y: none;
}
button, input, textarea, select { font: inherit; }
button { cursor: pointer; }
button:focus-visible, input:focus-visible, textarea:focus-visible, a:focus-visible {
  outline: 3px solid rgba(36, 91, 120, 0.34);
  outline-offset: 3px;
}
a { color: var(--brand-2); }
img, svg { display: block; max-width: 100%; }
.hidden { display: none !important; }
.sr-only {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}
.skip-link {
  position: fixed;
  top: 8px;
  left: 8px;
  z-index: 9999;
  transform: translateY(-160%);
  background: var(--brand);
  color: white;
  padding: 10px 14px;
  border-radius: 10px;
}
.skip-link:focus { transform: none; }

.app-shell { min-height: 100dvh; }
.topbar {
  position: sticky;
  top: 0;
  z-index: 100;
  height: calc(var(--topbar-h) + var(--safe-top));
  padding: var(--safe-top) max(12px, var(--safe-right)) 0 max(12px, var(--safe-left));
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  background: var(--surface-glass);
  border-bottom: 1px solid rgba(216, 225, 231, 0.92);
  backdrop-filter: blur(18px) saturate(1.18);
  -webkit-backdrop-filter: blur(18px) saturate(1.18);
}
.brand-button {
  min-width: 0;
  border: 0;
  background: transparent;
  color: var(--brand);
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 6px;
  border-radius: 14px;
}
.brand-mark { width: 38px; height: 38px; flex: 0 0 auto; }
.topbar-title { min-width: 0; display: grid; line-height: 1.04; text-align: left; }
.topbar-title .eyebrow { font-size: 10px; letter-spacing: .13em; text-transform: uppercase; color: var(--muted); font-weight: 750; }
.topbar-title strong { font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.topbar-actions { display: flex; align-items: center; justify-content: flex-end; gap: 6px; min-width: 0; }
.icon-button {
  width: 42px;
  height: 42px;
  border-radius: 13px;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--brand);
  display: grid;
  place-items: center;
  box-shadow: 0 2px 8px rgba(21, 47, 69, .05);
}
.icon-button svg { width: 22px; height: 22px; }
.refresh-button.loading svg { animation: spin .85s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.status-pill, .version-badge {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 5px 8px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--soft-2);
  color: var(--muted);
  font-size: 11px;
  font-weight: 750;
  white-space: nowrap;
}
.status-pill.online { background: var(--success-soft); color: var(--success); border-color: #cbe5d5; }
.status-pill.offline { background: var(--warning-soft); color: var(--warning); border-color: #eddcae; }
.version-badge { display: none; }
.profile-pill {
  min-width: 42px;
  height: 42px;
  max-width: 150px;
  padding: 4px 9px 4px 4px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--surface);
  color: var(--ink);
  display: flex;
  align-items: center;
  gap: 7px;
}
.profile-initials {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--indigo-soft);
  color: var(--indigo);
  font-weight: 850;
  flex: 0 0 auto;
}
.profile-name { display: none; font-size: 12px; font-weight: 750; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

main {
  width: min(100%, var(--content-max));
  margin: 0 auto;
  padding: 18px 14px calc(var(--bottom-nav-h) + var(--safe-bottom) + 28px);
}
.view { display: none; animation: viewIn .22s ease-out; }
.view.active { display: block; }
@keyframes viewIn { from { opacity: .35; transform: translateY(5px); } to { opacity: 1; transform: none; } }

h1, h2, h3, p { margin-top: 0; }
h1 { font-size: clamp(28px, 7vw, 46px); line-height: 1.02; letter-spacing: -.035em; margin-bottom: 10px; }
h2 { font-size: clamp(19px, 4.6vw, 26px); line-height: 1.12; letter-spacing: -.02em; margin-bottom: 0; }
h3 { font-size: 17px; margin-bottom: 6px; }
p { line-height: 1.55; }
.eyebrow, .section-kicker, .hero-kicker {
  display: inline-block;
  font-size: 11px;
  line-height: 1.2;
  font-weight: 800;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--brand-2);
}
.page-intro { padding: 8px 2px 16px; }
.page-intro p { max-width: 720px; color: var(--muted); margin-bottom: 0; }
.supporting-copy, .fine-print { color: var(--muted); }
.fine-print { font-size: 12px; line-height: 1.45; }

.hero-card {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, #16324a 0%, #224f68 55%, #2a6a7a 100%);
  color: white;
  padding: 24px 20px 18px;
  box-shadow: var(--shadow-md);
  isolation: isolate;
}
.hero-card::before {
  content: "";
  position: absolute;
  inset: auto -10% -35% 30%;
  height: 75%;
  background: rgba(255, 255, 255, .07);
  transform: rotate(-10deg);
  border-radius: 50%;
  z-index: -1;
}
.hero-copy { position: relative; z-index: 2; max-width: 730px; }
.hero-copy h1 { margin-top: 7px; }
.hero-copy p { color: rgba(255,255,255,.78); max-width: 580px; }
.hero-card .hero-kicker { color: #ffd3b0; }
.hero-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px; }
.hero-art { position: absolute; right: -38px; top: 4px; width: 190px; height: 150px; opacity: .44; pointer-events: none; }
.hero-sun { position: absolute; width: 76px; height: 76px; border-radius: 50%; background: #f8b46f; top: 4px; right: 44px; box-shadow: 0 0 0 24px rgba(248,180,111,.12); }
.hero-road { position: absolute; width: 150px; height: 180px; border: 7px solid rgba(255,255,255,.55); border-top: 0; border-bottom: 0; border-radius: 50% 50% 0 0; transform: rotate(20deg); right: 20px; top: 72px; }
.stats-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin-top: 22px; position: relative; z-index: 2; }
.stat-item { padding: 11px 12px; border: 1px solid rgba(255,255,255,.16); background: rgba(255,255,255,.08); border-radius: 14px; backdrop-filter: blur(8px); }
.stat-item strong { display: block; font-size: 21px; line-height: 1; }
.stat-item span { display: block; color: rgba(255,255,255,.68); font-size: 11px; margin-top: 5px; }

.primary-button, .secondary-button, .danger-button, .text-button, .chip {
  min-height: 44px;
  border-radius: 13px;
  border: 1px solid transparent;
  padding: 10px 14px;
  font-weight: 750;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  text-decoration: none;
}
.primary-button { color: white; background: var(--accent); border-color: rgba(0,0,0,.04); box-shadow: 0 8px 18px rgba(217,133,69,.25); }
.hero-card .primary-button { background: #f5a65f; color: #2a1d13; }
.secondary-button { color: var(--brand); background: var(--surface); border-color: var(--line); }
.hero-card .secondary-button { color: white; background: rgba(255,255,255,.09); border-color: rgba(255,255,255,.28); }
.danger-button { color: var(--danger); background: var(--danger-soft); border-color: #f2caca; }
.text-button { min-height: 36px; padding: 6px 8px; color: var(--brand-2); background: transparent; }
.full-width { width: 100%; }
.button-stack { display: grid; gap: 10px; }
.file-button { cursor: pointer; }

.countdown-card {
  margin-top: 14px;
  padding: 16px;
  border-radius: var(--radius);
  background: var(--surface);
  border: 1px solid var(--line);
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: var(--shadow-sm);
}
.countdown-number { min-width: 62px; height: 62px; border-radius: 18px; display: grid; place-items: center; background: var(--accent-soft); color: #9d5624; font-weight: 900; font-size: 28px; }
.countdown-copy { display: grid; gap: 3px; }
.countdown-copy strong { font-size: 16px; }
.countdown-copy span { color: var(--muted); font-size: 13px; line-height: 1.35; }

.dashboard-grid { display: grid; gap: 14px; margin-top: 14px; }
.section-card, .section-block {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 17px;
  box-shadow: var(--shadow-sm);
}
.section-block { margin-top: 15px; }
.section-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; margin-bottom: 14px; }
.progress-label { color: var(--brand-2); font-size: 13px; font-weight: 800; white-space: nowrap; }
.progress-track { height: 9px; border-radius: 999px; background: var(--soft); overflow: hidden; }
.progress-track.compact { height: 7px; margin: -5px 0 14px; }
.progress-track span { display: block; height: 100%; width: 0; border-radius: inherit; background: linear-gradient(90deg, var(--teal), var(--accent)); transition: width .25s ease; }
.compact-list { display: grid; gap: 10px; margin-top: 14px; }
.compact-item { display: flex; align-items: flex-start; gap: 10px; font-size: 13px; line-height: 1.35; }
.compact-item .dot { width: 8px; height: 8px; margin-top: 5px; border-radius: 50%; background: var(--accent); flex: 0 0 auto; }
.quick-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 10px; }
.quick-card { min-height: 80px; border: 1px solid var(--line); border-radius: 15px; background: var(--soft-2); color: var(--ink); display: grid; place-items: center; align-content: center; gap: 7px; font-weight: 750; }
.quick-icon { font-size: 22px; color: var(--brand-2); }

.next-day {
  border-radius: 16px;
  background: linear-gradient(135deg, #f7fafb, #eef4f6);
  border: 1px solid var(--line);
  padding: 15px;
}
.next-day-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.next-day-date { min-width: 56px; padding: 8px; border-radius: 13px; background: var(--brand); color: white; text-align: center; }
.next-day-date strong { display: block; font-size: 22px; }
.next-day-date span { font-size: 10px; text-transform: uppercase; letter-spacing: .1em; }
.next-day h3 { margin: 0; font-size: 18px; }
.next-day p { color: var(--muted); font-size: 13px; margin: 9px 0 0; }
.route-meta { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 12px; }
.meta-pill { display: inline-flex; align-items: center; min-height: 28px; padding: 5px 8px; border-radius: 999px; background: white; border: 1px solid var(--line); color: var(--muted); font-size: 11px; font-weight: 700; }
.profile-progress-card { display: grid; grid-template-columns: auto 1fr; gap: 12px; align-items: center; }
.profile-progress-avatar { width: 54px; height: 54px; border-radius: 18px; display: grid; place-items: center; background: var(--indigo-soft); color: var(--indigo); font-size: 23px; font-weight: 900; }
.profile-progress-copy strong { display: block; }
.profile-progress-copy span { display: block; color: var(--muted); font-size: 12px; margin-top: 3px; }
.mini-progress { height: 6px; background: var(--soft); border-radius: 99px; overflow: hidden; margin-top: 9px; }
.mini-progress i { display: block; height: 100%; background: var(--indigo); border-radius: inherit; }

.section-tabs {
  position: sticky;
  top: calc(var(--topbar-h) + var(--safe-top) + 6px);
  z-index: 40;
  display: grid;
  grid-template-columns: repeat(4, minmax(0,1fr));
  gap: 4px;
  padding: 5px;
  border-radius: 15px;
  background: rgba(232, 239, 243, .95);
  border: 1px solid var(--line);
  backdrop-filter: blur(12px);
  margin-bottom: 14px;
}
.section-tabs button, .segmented-control button {
  min-height: 42px;
  border: 0;
  background: transparent;
  color: var(--muted);
  border-radius: 11px;
  font-weight: 750;
  padding: 7px 8px;
}
.section-tabs button[aria-selected="true"], .segmented-control button[aria-selected="true"] { background: var(--surface); color: var(--brand); box-shadow: 0 3px 10px rgba(21,47,69,.09); }
.trip-pane { display: none; }
.trip-pane.active { display: block; animation: viewIn .18s ease-out; }
.pane-heading { margin-top: 2px; }
.toolbar { display: flex; flex-wrap: wrap; gap: 8px; margin: 4px 0 14px; }
.chip { min-height: 38px; padding: 7px 11px; border-color: var(--line); background: var(--surface); color: var(--muted); font-size: 12px; }
.chip.active { color: white; background: var(--brand-2); border-color: var(--brand-2); }

.itinerary-list { display: grid; gap: 12px; }
.day-card { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); box-shadow: var(--shadow-sm); overflow: hidden; }
.day-card.current { border-color: #b6d5d1; box-shadow: 0 0 0 3px rgba(31,119,111,.08), var(--shadow-sm); }
.day-card.complete { background: #fbfdfc; }
.day-summary { width: 100%; border: 0; background: transparent; color: inherit; display: grid; grid-template-columns: 58px 1fr auto; gap: 12px; align-items: center; text-align: left; padding: 15px; }
.day-date-tile { width: 58px; min-height: 61px; border-radius: 14px; background: var(--soft); display: grid; place-items: center; align-content: center; }
.day-date-tile span { font-size: 10px; color: var(--muted); text-transform: uppercase; font-weight: 800; letter-spacing: .08em; }
.day-date-tile strong { font-size: 23px; line-height: 1; }
.day-summary-copy { min-width: 0; }
.day-summary-copy h3 { margin: 0; font-size: 16px; }
.day-summary-copy p { margin: 5px 0 0; font-size: 12px; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.day-distance { text-align: right; color: var(--brand-2); font-weight: 850; font-size: 14px; }
.day-distance small { display: block; color: var(--muted); font-weight: 600; margin-top: 3px; font-size: 10px; }
.day-details { display: none; border-top: 1px solid var(--line); padding: 0 15px 17px; }
.day-card.expanded .day-details { display: block; }
.detail-section { padding-top: 15px; }
.detail-section h4 { margin: 0 0 9px; font-size: 13px; text-transform: uppercase; letter-spacing: .08em; color: var(--brand-2); }
.timeline-list { display: grid; gap: 11px; }
.timeline-row { display: grid; grid-template-columns: 74px 1fr; gap: 10px; }
.timeline-row time { font-size: 11px; color: var(--muted); font-weight: 750; }
.timeline-row strong { display: block; font-size: 13px; }
.timeline-row p { margin: 3px 0 0; font-size: 12px; color: var(--muted); }
.check-bullets { margin: 0; padding: 0; list-style: none; display: grid; gap: 8px; }
.check-bullets li { display: grid; grid-template-columns: 20px 1fr; gap: 8px; font-size: 13px; line-height: 1.42; }
.check-bullets li::before { content: "✓"; color: var(--success); font-weight: 900; }
.alert-box { padding: 12px; border-radius: 13px; background: var(--warning-soft); color: #6d4b16; font-size: 12px; line-height: 1.45; margin-top: 10px; }
.day-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 15px; }
.day-actions button, .day-actions a { min-height: 39px; padding: 8px 11px; border-radius: 11px; border: 1px solid var(--line); background: var(--surface); color: var(--brand); font-weight: 750; font-size: 12px; text-decoration: none; display: inline-flex; align-items: center; }
.day-complete-label { margin-left: auto; display: inline-flex; align-items: center; gap: 7px; font-size: 12px; color: var(--muted); }
.day-complete-label input { width: 20px; height: 20px; accent-color: var(--success); }

.map-card { border: 1px solid var(--line); background: var(--surface); border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow-sm); }
.route-map { min-height: 330px; background: linear-gradient(180deg, #e9f1f4, #f7fafb); }
.route-map svg { width: 100%; min-height: 330px; }
.map-legend { display: flex; flex-wrap: wrap; gap: 12px; padding: 12px 14px; border-top: 1px solid var(--line); color: var(--muted); font-size: 11px; }
.legend-dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 4px; }
.legend-dot.start { background: var(--teal); }
.legend-dot.overnight { background: var(--brand-2); }
.legend-dot.highlight { background: var(--accent); }
.legend-dot.home { background: var(--success); }
.route-overview-actions { display: grid; gap: 9px; margin: 13px 0 16px; }
.route-day-list { display: grid; gap: 10px; }
.route-day-card { padding: 14px; background: var(--surface); border: 1px solid var(--line); border-radius: 15px; display: grid; gap: 10px; }
.route-day-head { display: flex; justify-content: space-between; gap: 10px; }
.route-day-head strong { font-size: 14px; }
.route-day-head span { color: var(--muted); font-size: 11px; }
.route-day-links { display: flex; flex-wrap: wrap; gap: 7px; }
.route-day-links a { padding: 7px 9px; border: 1px solid var(--line); border-radius: 10px; text-decoration: none; font-size: 11px; font-weight: 750; background: var(--soft-2); }

.hotel-list { display: grid; gap: 11px; }
.hotel-card { border: 1px solid var(--line); border-radius: 16px; background: var(--surface); padding: 15px; box-shadow: var(--shadow-sm); }
.hotel-card-head { display: flex; justify-content: space-between; gap: 12px; }
.hotel-date { color: var(--brand-2); font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: .07em; }
.hotel-card h3 { margin: 4px 0 3px; }
.hotel-city { color: var(--muted); font-size: 12px; }
.hotel-details { display: grid; gap: 5px; margin-top: 11px; font-size: 12px; }
.hotel-details span { color: var(--muted); }
.hotel-actions { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 12px; }
.hotel-actions button, .hotel-actions a { min-height: 38px; padding: 7px 10px; border: 1px solid var(--line); border-radius: 10px; background: var(--soft-2); color: var(--brand); text-decoration: none; font-size: 11px; font-weight: 750; }

.segmented-control { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 4px; padding: 5px; border: 1px solid var(--line); border-radius: 15px; background: var(--soft); margin-bottom: 13px; }
.list-progress-wrap { margin-bottom: 12px; }
.checklist-group { background: var(--surface); border: 1px solid var(--line); border-radius: 16px; overflow: hidden; margin-bottom: 11px; }
.checklist-group h3 { padding: 13px 14px; margin: 0; background: var(--soft-2); border-bottom: 1px solid var(--line); font-size: 14px; }
.checklist-row { display: grid; grid-template-columns: 24px 1fr auto; gap: 10px; align-items: center; min-height: 48px; padding: 9px 13px; border-bottom: 1px solid #edf1f3; }
.checklist-row:last-child { border-bottom: 0; }
.checklist-row input { width: 20px; height: 20px; accent-color: var(--success); }
.checklist-row span { font-size: 13px; }
.checklist-row.checked span { color: var(--muted); text-decoration: line-through; }
.delete-item { width: 33px; height: 33px; border: 0; border-radius: 9px; background: transparent; color: var(--danger); }
.add-item-form { display: grid; grid-template-columns: 1fr auto; gap: 8px; margin-top: 12px; }
.add-item-form input { min-width: 0; }
.add-item-form button { border: 0; border-radius: 12px; background: var(--brand-2); color: white; font-weight: 750; padding: 0 15px; }

.adventure-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; padding: 6px 2px 12px; }
.adventure-header h1 { margin: 5px 0 4px; }
.adventure-header p { margin: 0; color: var(--muted); font-size: 13px; }
.day-stepper { display: grid; grid-template-columns: 42px auto 42px; gap: 5px; flex: 0 0 auto; }
.day-stepper button { min-height: 42px; border: 1px solid var(--line); border-radius: 12px; background: var(--surface); color: var(--brand); font-weight: 850; }
.day-stepper button:first-child, .day-stepper button:last-child { font-size: 24px; }
.adventure-day-strip { display: flex; gap: 8px; overflow-x: auto; padding: 3px 2px 10px; scrollbar-width: none; scroll-snap-type: x proximity; }
.adventure-day-strip::-webkit-scrollbar { display: none; }
.adventure-day-button { flex: 0 0 auto; min-width: 62px; padding: 9px 8px; border: 1px solid var(--line); border-radius: 13px; background: var(--surface); color: var(--muted); scroll-snap-align: center; }
.adventure-day-button span { display: block; font-size: 10px; text-transform: uppercase; font-weight: 800; }
.adventure-day-button strong { display: block; font-size: 18px; color: var(--ink); }
.adventure-day-button.active { background: var(--brand); color: rgba(255,255,255,.72); border-color: var(--brand); }
.adventure-day-button.active strong { color: white; }
.adventure-day-button.has-memory::after { content: ""; display: block; width: 6px; height: 6px; margin: 5px auto 0; border-radius: 50%; background: var(--accent); }
.mission-briefing {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-lg);
  padding: 21px;
  color: white;
  background: linear-gradient(135deg, #273d71, #255f70 66%, #2b7a70);
  box-shadow: var(--shadow-md);
  margin-bottom: 14px;
}
.mission-briefing::after { content: ""; position: absolute; width: 180px; height: 180px; border: 30px solid rgba(255,255,255,.07); border-radius: 50%; right: -65px; bottom: -85px; }
.mission-briefing .brief-date { color: #d7eef0; font-size: 11px; text-transform: uppercase; font-weight: 800; letter-spacing: .1em; }
.mission-briefing h2 { margin: 7px 0 8px; font-size: clamp(24px, 6vw, 36px); }
.mission-briefing p { position: relative; z-index: 1; color: rgba(255,255,255,.83); margin-bottom: 13px; max-width: 780px; }
.mission-route { display: flex; flex-wrap: wrap; gap: 7px; position: relative; z-index: 1; }
.mission-route span { padding: 6px 9px; border-radius: 999px; background: rgba(255,255,255,.10); border: 1px solid rgba(255,255,255,.18); font-size: 11px; font-weight: 700; }
.adventure-grid { display: grid; gap: 14px; }
.adventure-column { display: grid; align-content: start; gap: 14px; }
.mission-list { display: grid; gap: 9px; }
.mission-item { display: block; padding: 11px; border: 1px solid var(--line); border-radius: 13px; background: var(--soft-2); }
.mission-check { display: grid; grid-template-columns: 28px 1fr; gap: 10px; align-items: start; cursor: pointer; }
.mission-check input[type="checkbox"] { width: 21px; height: 21px; margin-top: 1px; accent-color: var(--teal); }
.mission-check span { font-size: 13px; line-height: 1.38; }
.mission-item.complete .mission-copy { color: var(--muted); text-decoration: line-through; }
.fact-list { display: grid; gap: 11px; }
.fact-card { padding: 14px; border-radius: 14px; background: linear-gradient(135deg, var(--soft-2), #eef5f6); border: 1px solid var(--line); }
.fact-card h3 { font-size: 15px; }
.fact-card p { margin-bottom: 8px; color: #435364; font-size: 13px; }
.fact-prompt { display: block; padding-top: 8px; border-top: 1px dashed #cad6dd; color: var(--brand-2); font-size: 12px; font-weight: 700; }
.fact-source { display: inline-flex; margin-top: 9px; font-size: 11px; }
.photo-mission-card p { margin-bottom: 12px; }
.photo-check { display: inline-flex; align-items: center; gap: 9px; padding: 10px 12px; border-radius: 12px; background: var(--soft-2); border: 1px solid var(--line); font-size: 13px; font-weight: 700; }
.photo-check input { width: 20px; height: 20px; accent-color: var(--teal); }
.honour-note { margin: -3px 0 12px; font-size: 12px; color: var(--muted); }
.spotting-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 9px; }
.spot-card { min-width: 0; padding: 11px; border: 1px solid var(--line); border-radius: 14px; background: var(--soft-2); }
.spot-card-head { display: grid; grid-template-columns: 36px 1fr; gap: 8px; align-items: center; }
.spot-icon { width: 36px; height: 36px; border-radius: 11px; display: grid; place-items: center; background: var(--teal-soft); color: var(--teal); font-weight: 900; font-size: 15px; }
.spot-label { min-width: 0; }
.spot-label strong { display: block; font-size: 12px; line-height: 1.2; }
.spot-label span { display: block; color: var(--muted); font-size: 10px; margin-top: 3px; }
.counter-control { display: grid; grid-template-columns: 36px 1fr 36px; gap: 5px; align-items: center; margin-top: 10px; }
.counter-control button { height: 36px; border: 1px solid var(--line); border-radius: 10px; background: white; color: var(--brand); font-size: 20px; font-weight: 700; }
.counter-value { text-align: center; font-size: 20px; font-weight: 900; }
.sighting-total { color: var(--teal); font-size: 12px; font-weight: 850; white-space: nowrap; }
.rating-control { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 13px; }
.rating-button { width: 45px; height: 43px; border: 1px solid var(--line); border-radius: 12px; background: var(--soft-2); color: #a0a8ad; font-size: 22px; }
.rating-button.active { color: #b16a1f; background: var(--warning-soft); border-color: #ebd49a; }
.journal-fields { display: grid; gap: 11px; }
.journal-fields label, .form-grid label, .field-label { display: grid; gap: 6px; color: #344556; font-size: 12px; font-weight: 750; }
.journal-fields input, .journal-fields textarea, .form-grid input, .form-grid textarea, #general-notes, .add-item-form input {
  width: 100%;
  border: 1px solid #cfd9df;
  border-radius: 12px;
  background: white;
  color: var(--ink);
  padding: 11px 12px;
  min-height: 44px;
}
.journal-fields textarea, .form-grid textarea, #general-notes { resize: vertical; line-height: 1.45; }
.save-status { color: var(--success); font-size: 11px; min-height: 15px; }
.badge-claim-card { position: relative; overflow: hidden; }
.badge-layout { display: grid; grid-template-columns: 58px 1fr; gap: 12px; align-items: center; }
.badge-symbol { width: 58px; height: 58px; border-radius: 18px; display: grid; place-items: center; background: var(--accent-soft); color: #a75b25; font-size: 25px; font-weight: 900; }
.badge-layout h2 { font-size: 19px; }
.badge-layout p { color: var(--muted); font-size: 12px; margin: 6px 0 0; }
.badge-state { margin-top: 13px; }
.badge-state button { width: 100%; }
.badge-earned { display: flex; align-items: center; gap: 9px; padding: 11px 12px; border-radius: 12px; background: var(--success-soft); color: var(--success); font-weight: 800; font-size: 13px; }
.tomorrow-teaser {
  margin-top: 16px;
  border-radius: var(--radius-lg);
  padding: 22px;
  background: linear-gradient(135deg, #1f2734, #33485a);
  color: white;
  box-shadow: var(--shadow-md);
}
.tomorrow-teaser .section-kicker { color: #ffd4ac; }
.tomorrow-teaser h2 { margin: 7px 0 8px; }
.tomorrow-teaser p { color: rgba(255,255,255,.78); margin-bottom: 0; max-width: 780px; }

.memories-intro { padding-bottom: 10px; }
.memory-stats { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 10px; }
.memory-stat { padding: 14px; border-radius: 15px; background: var(--surface); border: 1px solid var(--line); box-shadow: var(--shadow-sm); }
.memory-stat strong { display: block; font-size: 24px; }
.memory-stat span { color: var(--muted); font-size: 11px; }
.badge-gallery { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 10px; }
.badge-card { min-height: 146px; padding: 14px; border-radius: 16px; border: 1px solid var(--line); background: var(--surface); display: grid; align-content: start; gap: 8px; }
.badge-card.locked { filter: grayscale(.85); opacity: .52; }
.badge-card .badge-symbol { width: 46px; height: 46px; border-radius: 14px; font-size: 20px; }
.badge-card strong { font-size: 13px; }
.badge-card p { margin: 0; color: var(--muted); font-size: 11px; line-height: 1.4; }
.badge-card small { color: var(--success); font-weight: 800; }
.scrapbook-list { display: grid; gap: 12px; }
.scrapbook-card { border: 1px solid var(--line); border-radius: 18px; background: var(--surface); overflow: hidden; box-shadow: var(--shadow-sm); }
.scrapbook-head { display: grid; grid-template-columns: 58px 1fr auto; gap: 11px; align-items: center; padding: 14px; background: linear-gradient(135deg, #f8fafb, #edf3f5); }
.scrapbook-head h3 { margin: 0; font-size: 15px; }
.scrapbook-head p { margin: 4px 0 0; color: var(--muted); font-size: 11px; }
.scrapbook-rating { color: #b16a1f; letter-spacing: 1px; font-size: 13px; }
.scrapbook-body { padding: 14px; display: grid; gap: 11px; }
.memory-line { display: grid; grid-template-columns: 90px 1fr; gap: 9px; font-size: 12px; }
.memory-line strong { color: var(--brand-2); }
.memory-line span { color: #465565; }
.empty-memory { color: var(--muted); font-size: 12px; font-style: italic; }
.sighting-summary { display: flex; flex-wrap: wrap; gap: 6px; }
.sighting-chip { padding: 5px 7px; border-radius: 999px; background: var(--teal-soft); color: var(--teal); font-size: 10px; font-weight: 800; }

.settings-grid { display: grid; gap: 14px; }
.profile-list, .profile-picker-list { display: grid; gap: 10px; }
.profile-card { display: grid; grid-template-columns: 48px 1fr auto; gap: 10px; align-items: center; padding: 11px; border: 1px solid var(--line); border-radius: 14px; background: var(--soft-2); }
.profile-card.active { border-color: #b6c0ed; box-shadow: 0 0 0 3px rgba(75,88,167,.08); }
.profile-avatar { width: 48px; height: 48px; border-radius: 15px; display: grid; place-items: center; background: var(--indigo-soft); color: var(--indigo); font-weight: 900; font-size: 19px; }
.profile-card[data-experience="explorer"] .profile-avatar { background: var(--teal-soft); color: var(--teal); }
.profile-card strong { display: block; }
.profile-card span { display: block; color: var(--muted); font-size: 11px; margin-top: 3px; }
.profile-card-actions { display: flex; gap: 5px; }
.profile-card-actions button { min-width: 38px; min-height: 38px; border: 1px solid var(--line); background: white; border-radius: 10px; color: var(--brand); font-size: 11px; font-weight: 750; }
.live-checks-list { display: grid; gap: 9px; }
.live-check { display: grid; grid-template-columns: 1fr auto; gap: 10px; align-items: center; padding: 11px; border: 1px solid var(--line); border-radius: 13px; background: var(--soft-2); }
.live-check strong { display: block; font-size: 13px; }
.live-check span { display: block; color: var(--muted); font-size: 11px; margin-top: 3px; }
.live-check a { min-height: 36px; padding: 7px 9px; border: 1px solid var(--line); background: white; border-radius: 10px; text-decoration: none; font-size: 11px; font-weight: 750; }
.version-line { color: var(--muted); font-size: 12px; margin: 12px 0 0; }
.privacy-note { border-radius: var(--radius); padding: 17px; background: #152f45; color: white; }
.privacy-note p { margin: 6px 0 0; color: rgba(255,255,255,.72); font-size: 12px; }

.bottom-nav {
  position: fixed;
  z-index: 200;
  left: 0;
  right: 0;
  bottom: 0;
  height: calc(var(--bottom-nav-h) + var(--safe-bottom));
  padding: 7px max(8px, var(--safe-right)) var(--safe-bottom) max(8px, var(--safe-left));
  display: grid;
  grid-template-columns: repeat(5, minmax(0,1fr));
  align-items: stretch;
  gap: 3px;
  background: rgba(255,255,255,.96);
  border-top: 1px solid rgba(216,225,231,.95);
  box-shadow: 0 -12px 30px rgba(21,47,69,.09);
  backdrop-filter: blur(18px) saturate(1.16);
  -webkit-backdrop-filter: blur(18px) saturate(1.16);
  transform: translateZ(0);
}
.nav-button { border: 0; background: transparent; color: #788592; border-radius: 13px; display: grid; place-items: center; align-content: center; gap: 3px; min-width: 0; min-height: 56px; padding: 4px 2px; }
.nav-button .nav-icon { height: 23px; display: grid; place-items: center; font-size: 20px; line-height: 1; font-weight: 800; }
.nav-button span:last-child { font-size: 10px; font-weight: 750; }
.nav-button.active { background: var(--soft); color: var(--brand); }

.modal-dialog {
  width: min(92vw, 620px);
  max-height: min(88dvh, 800px);
  border: 0;
  border-radius: 22px;
  padding: 0;
  background: var(--surface);
  color: var(--ink);
  box-shadow: 0 30px 90px rgba(12,29,42,.3);
  overflow: auto;
}
.modal-dialog::backdrop { background: rgba(10,25,36,.58); backdrop-filter: blur(4px); }
.modal-dialog form, .modal-dialog > .dialog-header, .modal-dialog > .profile-picker-list { padding-left: 18px; padding-right: 18px; }
.modal-dialog form { padding-top: 18px; padding-bottom: 18px; }
.compact-dialog { width: min(92vw, 480px); }
.dialog-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding-top: 18px; }
.dialog-header h2 { margin-top: 4px; }
.dialog-header .icon-button { flex: 0 0 auto; font-size: 24px; }
.form-grid { display: grid; gap: 12px; margin-top: 15px; }
.two-column-fields { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 10px; }
.dialog-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 18px; }
.experience-fieldset { border: 0; padding: 0; margin: 0; display: grid; gap: 8px; }
.experience-fieldset legend { font-size: 12px; font-weight: 750; color: #344556; margin-bottom: 6px; }
.choice-card { grid-template-columns: 22px 1fr !important; align-items: start; padding: 11px; border: 1px solid var(--line); border-radius: 13px; background: var(--soft-2); }
.choice-card input { width: 19px; height: 19px; padding: 0; min-height: 0; margin-top: 2px; accent-color: var(--indigo); }
.choice-card strong { display: block; }
.choice-card small { display: block; color: var(--muted); font-weight: 500; margin-top: 3px; line-height: 1.4; }
.profile-picker-list { padding-top: 12px; padding-bottom: 18px; }
.profile-pick-button { width: 100%; border: 1px solid var(--line); border-radius: 15px; background: var(--soft-2); padding: 12px; text-align: left; display: grid; grid-template-columns: 48px 1fr; gap: 11px; align-items: center; }
.profile-pick-button strong { display: block; }
.profile-pick-button span { color: var(--muted); font-size: 11px; }

.toast {
  position: fixed;
  z-index: 999;
  left: 50%;
  bottom: calc(var(--bottom-nav-h) + var(--safe-bottom) + 16px);
  transform: translate(-50%, 18px);
  width: min(calc(100vw - 30px), 460px);
  padding: 12px 14px;
  border-radius: 13px;
  background: #172433;
  color: white;
  text-align: center;
  font-size: 12px;
  box-shadow: var(--shadow-md);
  opacity: 0;
  pointer-events: none;
  transition: opacity .18s ease, transform .18s ease;
}
.toast.show { opacity: 1; transform: translate(-50%, 0); }

@media (min-width: 560px) {
  main { padding-left: 22px; padding-right: 22px; }
  .profile-name, .version-badge { display: inline; }
  .stats-grid { grid-template-columns: repeat(4, minmax(0,1fr)); }
  .quick-grid { grid-template-columns: repeat(4, minmax(0,1fr)); }
  .route-overview-actions { grid-template-columns: repeat(2, minmax(0,1fr)); }
  .memory-stats { grid-template-columns: repeat(4, minmax(0,1fr)); }
  .badge-gallery { grid-template-columns: repeat(3, minmax(0,1fr)); }
  .spotting-grid { grid-template-columns: repeat(3, minmax(0,1fr)); }
}

@media (min-width: 760px) {
  main { padding-top: 24px; }
  .hero-card { padding: 30px 28px 22px; }
  .hero-art { width: 270px; height: 190px; right: 0; }
  .dashboard-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
  .dashboard-primary { grid-column: 1 / -1; }
  .adventure-grid { grid-template-columns: repeat(2, minmax(0,1fr)); align-items: start; }
  .section-card, .section-block { padding: 20px; }
  .itinerary-list { grid-template-columns: repeat(2, minmax(0,1fr)); align-items: start; }
  .day-card.expanded { grid-column: 1 / -1; }
  .hotel-list { grid-template-columns: repeat(2, minmax(0,1fr)); }
  .route-day-list { grid-template-columns: repeat(2, minmax(0,1fr)); }
  .settings-grid { grid-template-columns: repeat(2, minmax(0,1fr)); align-items: start; }
  .privacy-note { grid-column: 1 / -1; }
  .scrapbook-list { grid-template-columns: repeat(2, minmax(0,1fr)); align-items: start; }
  .profile-name { max-width: 92px; }
}

@media (min-width: 1000px) and (min-height: 600px) {
  :root { --side-nav-w: 112px; }
  .topbar { padding-left: calc(var(--side-nav-w) + 22px); }
  main { padding-bottom: 40px; padding-left: calc(var(--side-nav-w) + 24px); width: min(100%, calc(var(--content-max) + var(--side-nav-w))); }
  .bottom-nav {
    top: calc(var(--topbar-h) + var(--safe-top));
    bottom: 0;
    right: auto;
    width: var(--side-nav-w);
    height: auto;
    padding: 18px 10px max(18px, var(--safe-bottom)) max(10px, var(--safe-left));
    grid-template-columns: 1fr;
    grid-template-rows: repeat(5, minmax(74px, auto));
    align-content: start;
    border-top: 0;
    border-right: 1px solid var(--line);
    box-shadow: 10px 0 28px rgba(21,47,69,.06);
  }
  .nav-button { min-height: 72px; }
  .nav-button .nav-icon { font-size: 24px; }
  .nav-button span:last-child { font-size: 11px; }
  .toast { bottom: 24px; }
  .dashboard-grid { grid-template-columns: 1.35fr 1fr 1fr; }
  .dashboard-primary { grid-column: span 2; }
  .dashboard-grid .section-card:last-child { grid-column: span 1; }
  .badge-gallery { grid-template-columns: repeat(4, minmax(0,1fr)); }
  .spotting-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { scroll-behavior: auto !important; animation-duration: .001ms !important; animation-iteration-count: 1 !important; transition-duration: .001ms !important; }
}

@media print {
  .topbar, .bottom-nav, .section-tabs, .toolbar, .day-actions, .hero-actions, .refresh-button { display: none !important; }
  body { background: white; }
  main { width: 100%; padding: 0; }
  .view { display: none !important; }
  #view-trip { display: block !important; }
  #trip-pane-days { display: block !important; }
  .day-card { break-inside: avoid; box-shadow: none; }
  .day-details { display: block !important; }
}

/* v0.3.0 RC2: clearly differentiated Navigator and Explorer experiences */
#view-adventure[data-experience="navigator"] {
  --mode-accent: #4b58a7;
  --mode-accent-soft: #eceefe;
  --mode-ink: #26336f;
  --mode-panel: #f7f8fd;
}
#view-adventure[data-experience="explorer"] {
  --mode-accent: #1f776f;
  --mode-accent-soft: #e6f5f2;
  --mode-ink: #155b55;
  --mode-panel: #f4fbf9;
}
#view-adventure .mode-card {
  border-top: 3px solid var(--mode-accent);
}
#view-adventure .section-intro {
  margin: 5px 0 0;
  max-width: 560px;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.4;
  font-weight: 500;
}
.brief-mode-row {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 13px;
  padding: 8px 11px;
  border: 1px solid rgba(255,255,255,.22);
  border-radius: 14px;
  background: rgba(255,255,255,.10);
}
.brief-mode-icon {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 11px;
  background: rgba(255,255,255,.14);
  font-size: 18px;
  font-weight: 900;
}
.brief-mode-row span:last-child { display: grid; gap: 2px; }
.brief-mode-row strong { font-size: 12px; }
.brief-mode-row small { color: rgba(255,255,255,.72); font-size: 9px; letter-spacing: .12em; font-weight: 850; }
.mission-briefing.mode-navigator {
  background:
    linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px),
    linear-gradient(135deg, #242e5f, #344b83 58%, #315d72);
  background-size: 28px 28px, 28px 28px, auto;
}
.mission-briefing.mode-explorer {
  background: linear-gradient(135deg, #17665f, #248678 58%, #b96f39);
}
#view-adventure[data-experience="navigator"] .mission-briefing::after {
  border-radius: 18px;
  transform: rotate(18deg);
}
#view-adventure[data-experience="explorer"] .mission-briefing::after {
  border-width: 24px;
}
#view-adventure[data-experience="navigator"] .section-kicker,
#view-adventure[data-experience="navigator"] .progress-label,
#view-adventure[data-experience="navigator"] .sighting-total {
  color: var(--mode-accent);
}
#view-adventure[data-experience="explorer"] .section-kicker,
#view-adventure[data-experience="explorer"] .progress-label,
#view-adventure[data-experience="explorer"] .sighting-total {
  color: var(--mode-accent);
}
#view-adventure .progress-track span { background: var(--mode-accent); }
#view-adventure .mission-item {
  background: var(--mode-panel);
}
#view-adventure .mission-check {
  grid-template-columns: 22px 28px minmax(0, 1fr);
}
#view-adventure .mission-check input[type="checkbox"] {
  width: 20px;
  height: 20px;
  accent-color: var(--mode-accent);
}
#view-adventure .mission-sequence {
  width: 25px;
  height: 25px;
  display: grid;
  place-items: center;
  border-radius: 9px;
  background: var(--mode-accent-soft);
  color: var(--mode-ink);
  font-size: 11px;
  font-weight: 900;
  text-decoration: none !important;
}
#view-adventure .mission-copy { min-width: 0; }
#view-adventure[data-experience="navigator"] .mission-item {
  border-left: 4px solid var(--mode-accent);
  border-radius: 10px;
}
#view-adventure[data-experience="explorer"] .mission-item {
  border-radius: 17px;
}
#view-adventure[data-experience="explorer"] .mission-sequence {
  border-radius: 50%;
}
#view-adventure .fact-card {
  background: linear-gradient(135deg, var(--mode-panel), #ffffff);
  border-color: color-mix(in srgb, var(--mode-accent) 20%, var(--line));
}
#view-adventure .fact-prompt { color: var(--mode-ink); }
#view-adventure .photo-check input { accent-color: var(--mode-accent); }
#view-adventure .spot-card {
  background: var(--mode-panel);
  border-color: color-mix(in srgb, var(--mode-accent) 18%, var(--line));
}
#view-adventure .spot-icon {
  background: var(--mode-accent-soft);
  color: var(--mode-ink);
}
#view-adventure[data-experience="navigator"] .spot-card {
  border-radius: 10px;
  border-left: 3px solid var(--mode-accent);
}
#view-adventure[data-experience="navigator"] .spot-icon {
  border-radius: 8px;
}
#view-adventure[data-experience="explorer"] .spot-card {
  border-radius: 18px;
}
#view-adventure[data-experience="explorer"] .spot-icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  font-size: 16px;
}
#view-adventure[data-experience="explorer"] .spot-card-head {
  grid-template-columns: 42px 1fr;
}
#view-adventure .counter-control button { color: var(--mode-ink); }
.rating-prompt {
  margin: 0 0 8px;
  color: var(--mode-ink);
  font-size: 12px;
  font-weight: 800;
}
#day-badge-card[data-experience="navigator"] .badge-symbol {
  background: var(--indigo-soft);
  color: var(--indigo);
  border-radius: 12px;
}
#day-badge-card[data-experience="explorer"] .badge-symbol {
  background: var(--teal-soft);
  color: var(--teal);
  border-radius: 50%;
}
.tomorrow-teaser.mode-navigator {
  background:
    linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px),
    linear-gradient(135deg, #20283f, #33476f);
  background-size: 26px 26px, 26px 26px, auto;
}
.tomorrow-teaser.mode-explorer {
  background: linear-gradient(135deg, #203f40, #236c66 62%, #8c5837);
}
.profile-pick-button small,
.profile-card small {
  display: block;
  margin-top: 3px;
  color: var(--muted);
  font-size: 10px;
  line-height: 1.35;
}
.profile-card[data-experience="navigator"] { border-left: 4px solid var(--indigo); }
.profile-card[data-experience="explorer"] { border-left: 4px solid var(--teal); }
.profile-pill[data-experience="navigator"] { box-shadow: inset 0 0 0 1px rgba(75,88,167,.22); }
.profile-pill[data-experience="explorer"] { box-shadow: inset 0 0 0 1px rgba(31,119,111,.22); }

@media (max-width: 759px) {
  #view-adventure[data-experience="explorer"] .spotting-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
  #view-adventure[data-experience="navigator"] .spotting-grid { grid-template-columns: 1fr; }
}


/* RC3 — inline assignment and question responses */
.mission-response {
  margin: 10px 0 0 50px;
  padding-top: 9px;
  border-top: 1px dashed color-mix(in srgb, var(--mode-accent) 24%, var(--line));
}
.mission-response summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-height: 34px;
  color: var(--mode-ink);
  cursor: pointer;
  font-size: 12px;
  font-weight: 850;
  list-style: none;
}
.mission-response summary::-webkit-details-marker { display: none; }
.mission-response summary::before {
  content: "+";
  width: 22px;
  height: 22px;
  display: inline-grid;
  place-items: center;
  flex: 0 0 auto;
  border-radius: 8px;
  background: var(--mode-accent-soft);
  color: var(--mode-ink);
  font-size: 16px;
  line-height: 1;
}
.mission-response[open] summary::before { content: "−"; }
.mission-response summary > span { flex: 1 1 auto; }
.mission-response summary small { color: var(--success); font-size: 10px; font-weight: 750; text-align: right; }
.mission-response-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 9px;
  padding: 10px 0 2px;
}
.mission-response-field {
  display: grid;
  gap: 5px;
  min-width: 0;
  color: #344556;
  font-size: 11px;
  font-weight: 800;
}
.mission-response-field input,
.mission-response-field textarea,
.mission-response-field select,
.fact-answer textarea {
  width: 100%;
  min-height: 42px;
  border: 1px solid color-mix(in srgb, var(--mode-accent) 22%, #cfd9df);
  border-radius: 11px;
  background: #fff;
  color: var(--ink);
  padding: 10px 11px;
  font: inherit;
  font-size: 13px;
}
.mission-response-field textarea,
.fact-answer textarea { resize: vertical; line-height: 1.45; }
.mission-response-note { margin: 6px 0 0 !important; color: var(--muted) !important; font-size: 10px !important; }
.fact-answer {
  display: grid;
  gap: 6px;
  margin-top: 10px;
  color: #344556;
  font-size: 11px;
  font-weight: 800;
}
.fact-answer small { min-height: 13px; color: var(--success); font-size: 10px; font-weight: 750; }
.memory-response-group {
  display: grid;
  gap: 8px;
  margin-top: 3px;
  padding-top: 10px;
  border-top: 1px dashed var(--line);
}
.memory-response-group h4 {
  margin: 0;
  color: var(--brand-2);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: .06em;
}
.memory-response {
  display: grid;
  gap: 3px;
  padding: 9px 10px;
  border-radius: 11px;
  background: var(--soft-2);
  font-size: 11px;
}
.memory-response strong { color: var(--ink); }
.memory-response span { color: #465565; white-space: pre-wrap; }

@media (min-width: 700px) {
  .mission-response-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .mission-response-field-wide { grid-column: 1 / -1; }
}

@media (max-width: 520px) {
  .mission-response { margin-left: 0; }
  .mission-response summary small { max-width: 110px; }
}
