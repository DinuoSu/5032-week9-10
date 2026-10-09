# SDD ledger — plan: docs/superpowers/plans/2026-10-09-weeks1-8.md

Requirements read from course and existing projects audited. Sources copied into requested workspace; originals preserved.
Pre-flight: HomeView/form consumes sanitized submitted records; router consumes authReady and current role; book service uses firebase/init db. No interface conflicts.
Ruling: Follow user's explicit request to implement directly in current empty folder; no design approval/worktree detour. No push or historical evidence fabrication.
Ruling: Use local demo Firebase project for Weeks 6–8, supported by Week 6 lesson and Firebase documentation. Cloud setup remains a separate future action.

Tasks 1–3 implemented: Week 4 base retained; Week 5 form changes; router/demo login; Firebase emulator registration/sign-in/sign-out/roles; books CRUD and where/orderBy/limit; Firestore server-side permission rules.
Verification: 23 unit tests and 4 real-emulator integration tests passed; production build passed. Red/green checks were run for missing Week 5 behavior and book service/rules before implementation.
Reviewer found integration clearFirestore was targeting persistent application data. Fixed test project to demo-fit5032-test with forced emulator config and separate seed; rerun 4 integration tests passed. Application project remains demo-fit5032.
Browser checks completed: confirmation validation, successful table/card submission, protected About/demo login, Firebase admin login, book create/update, refresh restores admin, sign-out resets user to null, new registration is member and has no edit/delete controls, JSON toggle, empty query, 390px responsive layout without document overflow. Screenshots saved in docs/evidence. Emulator UI displays Auth users and numeric ISBN Firestore documents.
Final verification: npm test 23/23 passed; npm run test:integration 4/4 passed on isolated test project; npm run build exit 0. Reviewer rechecked isolation and reports no blocking issues. Build dependency-size warning and upstream npm audit findings documented. Browser console contains extension connection errors; app workflows passed.
Handoff: app 127.0.0.1:5173 and Emulator UI 127.0.0.1:4000 remain running and tabs preserved. README and coursework checklist describe remaining manual submission evidence. Work complete through Week 8; stop before Week 9.
No commits/push/deployment/Week 9 work performed.

User later authorized Week 9 up to the first screenshot. Added Axios dependency, GetBookCountView, route and navigation. Default local Functions URL is configured, but no function written or deployed. View tests cover zero count, failure clearing stale result and retry recovery. Stop at code screenshot checkpoint; no backend implementation authorized yet.

User captured frontend and route/navigation screenshots, then requested next checkpoint. Added functions/index.js countBooks using v2 onRequest, Admin SDK, CORS, books snapshot.size and try/catch; configured functions source. Scope stops at third code screenshot. No function startup or cloud deployment yet; runtime verification belongs to the next checkpoint.
