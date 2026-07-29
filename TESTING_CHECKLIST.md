# v0.3.0 RC3.3 Testing Checklist

| Area | Test | Expected result | Status |
|---|---|---|---|
| Version | Check header and Settings | Both show `v0.3.0 RC3.3` | To test |
| Clean styling | Open live site after Pages deployment | Full styled interface; no red diagnostic banner | To test |
| Refresh | Tap Refresh after deployment | RC3.3 reloads without reinstalling | To test |
| Adventure scroll: observation | Scroll to Observe and Verify / Road Quest and use `+` or `−` | Count changes and page remains at the same vertical position | To test |
| Adventure scroll: mission | Scroll down and check/uncheck a mission | Completion changes and page does not jump to the top | To test |
| Adventure scroll: rating/photo/badge | Use each available action low on the page | Action succeeds without vertical scroll jump | To test |
| Other-view navigation | Open Home, Trip, Memories, or Settings | Newly opened view retains existing top-of-page behaviour | To test |
| Live Check event day | View a check on its `activeThrough` date | Check remains in the main list | Automated |
| Live Check next day | Advance device date one day after an event for testing, then reload | Check moves under collapsed Past checks at the bottom | Automated |
| Assignment answer | Day 2 Navigator elevation task | Enter observation, reopen, and confirm it remains | To test |
| Structured fields | Day 1 Navigator arrival task | Time and text fields accept and retain values | To test |
| Fact answer | Answer a Route Intelligence question | Answer saves and remains after reopening | To test |
| Profile separation | Enter Navigator answer, switch to Explorer | Explorer does not show Navigator response | To test |
| Memories | Save assignment and fact answers | Responses appear under correct profile headings | To test |
| Completion separation | Enter answer without checking task | Answer saves but assignment remains incomplete | To test |
| iPhone portrait | Type into long Adventure page | Keyboard and fixed navigation remain usable | To test |
| iPhone landscape | Rotate and enter response | No clipped fields or navigation overlap | To test |
| iPad portrait | Review both modes | Two-column layout and fields remain readable | To test |
| iPad landscape | Review both modes | Side navigation and response panels remain stable | To test |
| Local migration | Open Stays and profiles after update | Existing local details and names remain | To test |
| Offline | Load online once, close, go offline, reopen | Core app and saved answers reopen | To test |
| Backup | Export and restore on a test browser | Assignment and fact responses are preserved | To test |
