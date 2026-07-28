# v0.3.0 RC3 Testing Checklist

RC3's main acceptance question is: **can each traveller record an answer at the moment an assignment or fact asks for one, and find it later in Memories?**

| Area | Test | Expected result | Status |
|---|---|---|---|
| Version | Check header and Settings | Both show `v0.3.0 RC3` | To test |
| Refresh | Tap the circular Refresh button after Pages deployment | RC3 reloads without reinstalling the Home Screen app | To test |
| Navigator assignment | Open July 31 and expand “Record one clear change caused by elevation” | A multiline field appears directly below the assignment | To test |
| Automatic save | Type an elevation observation, leave the day, then return | The response remains and the panel reopens | To test |
| Multiple fields | Open July 30 arrival comparison or August 4 ferry queue estimate | Related fields appear together and save independently | To test |
| Input types | Test a time, number, select, short-text, and long-text response | Each control accepts and retains the appropriate value | To test |
| Fact answer | Answer a “Consider” or “Try this” question | The answer remains beneath the fact card | To test |
| Explorer response | Open an Explorer mission such as favourite viewpoint or favourite animal | Explorer receives age-appropriate answer fields | To test |
| Profile separation | Enter different answers in Navigator and Explorer | Each profile retains only its own responses | To test |
| Memories | Open Memories after entering an assignment response | The response appears under Assignment records or Mission answers | To test |
| Question memories | Answer a fact prompt, then open Memories | The answer appears under the mode-specific question-response heading | To test |
| Existing data | Check Stays, journals, tallies, and names after update | Existing local RC2 data remains present | To test |
| Badge logic | Answer an assignment but do not check it complete | The answer is saved, but mission completion still requires the checkbox | To test |
| iPhone keyboard | Enter responses in phone portrait | Fields remain visible and usable above the keyboard | To test |
| iPad layout | Open July 31 in portrait and landscape | Assignment responses fit the two-column layout cleanly | To test |
| Bottom navigation | Scroll a long answered Adventure page on iPhone | Menu stays fixed at the bottom | To test |
| Offline | Load once online, disable connection, enter and revisit a response | Core app and local answers remain usable offline | To test |

## Suggested first test

Use **Navigator → July 31**:

1. Expand **Record one clear change caused by elevation**.
2. Enter a note such as “The air became colder and tall trees gave way to low alpine plants near Logan Pass.”
3. Answer one Route Intelligence question.
4. Switch to Explorer and confirm those answers are not visible.
5. Return to Navigator and confirm both answers remain.
6. Open Memories and verify both records appear in the July 31 scrapbook card.
