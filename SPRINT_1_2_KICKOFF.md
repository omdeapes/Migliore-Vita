# Sprint 1-2 Kickoff Document
## Weeks 1-2 (May 13-27, 2026)

**Goal:** Infrastructure ready, development environment setup, project skeletons created  
**Team:** Mohammed (backend/DevOps) + Coding Agent (mobile/frontend)  
**Daily Standup:** 10 AM Cairo time (15 min, WhatsApp video)  
**Sprint Review:** Friday 4 PM  

---

## SPRINT 1: Infrastructure & Setup (Week 1: May 13-19)

### Monday, May 13 — Kickoff & Planning

**Morning Standup (10 AM):**
- Review Phase 1 goals (30 min)
- Confirm everyone has access (AWS, GitHub, repos)
- Clarify questions

**Mohammed's Tasks (Today):**
- [ ] Start AWS EC2 provisioning (t3.small)
- [ ] Create GitHub organization: `migliore-vita`
- [ ] Create 3 repositories (mobile, backend, frontend)
- [ ] Configure branch protection + secrets
- [ ] Setup PostgreSQL database on EC2
- [ ] Create S3 bucket for media
- [ ] Document AWS endpoints + credentials (share securely)

**Coding Agent's Tasks (Today):**
- [ ] Clone Flutter SDK, verify installation
- [ ] Clone Node.js 20 LTS, verify
- [ ] Setup local development environment
- [ ] Create local PostgreSQL for dev (Docker optional)
- [ ] Verify Postman, Git installed

**End of Day Deliverable:**
- GitHub org + repos ready
- Both devs have access
- AWS infrastructure running
- Development environments verified

---

### Tuesday, May 14 — Database & Backend Boilerplate

**Mohammed's Tasks:**
- [ ] Create PostgreSQL schema (all tables from PHASE_1_DETAILED_PLAN)
- [ ] Setup migration scripts (Sequelize migrations)
- [ ] Create `.env.example` template
- [ ] Document database connection string
- [ ] Create initial database backup

**Coding Agent's Tasks:**
- [ ] Create Express boilerplate (package.json, src/index.js)
- [ ] Setup middleware (CORS, Helmet, error handler)
- [ ] Create database connection file (Sequelize ORM)
- [ ] Make first test endpoint: `GET /health` (returns 200 OK)
- [ ] Push to `develop` branch (PR → Mohammed reviews → merge)

**End of Day Deliverable:**
- PostgreSQL tables created
- Express server running locally (port 3000)
- `/health` endpoint working
- CI/CD tests passing

---

### Wednesday, May 15 — API Structure & Authentication

**Mohammed's Tasks:**
- [ ] Review Coding Agent's Express setup (code review)
- [ ] Create JWT authentication middleware
- [ ] Setup bcrypt for password hashing
- [ ] Create admin user in database (username: admin@aten.eg, temp password)
- [ ] Test JWT token generation locally

**Coding Agent's Tasks:**
- [ ] Create `/api/admin/login` endpoint (POST)
  - Takes email + password
  - Returns JWT token
  - Test with admin user
- [ ] Create `/api/admin/logout` endpoint (POST)
- [ ] Create role-checking middleware
- [ ] Create test endpoints for each role:
  - `GET /api/admin/trips` (admin only)
  - `GET /api/admin/invoices` (admin + accountant)
- [ ] Push PR, await review

**End of Day Deliverable:**
- Admin login working
- JWT tokens being generated/validated
- Role-based middleware tested
- 4 API endpoints working

---

### Thursday, May 16 — Flutter App Boilerplate

**Mohammed's Tasks:**
- [ ] Review API endpoints (code review)
- [ ] Merge PRs to `develop`
- [ ] Update API documentation

**Coding Agent's Tasks:**
- [ ] Create Flutter project (clean structure)
- [ ] Add dependencies to pubspec.yaml:
  - `go_router` (navigation)
  - `provider` (state management)
  - `realm` (local database)
  - `dio` (HTTP client)
  - `connectivity_plus` (network detection)
- [ ] Create app config file (API base URL, app constants)
- [ ] Create Realm schemas:
  - Trip schema (local)
  - Invoice schema (local)
  - SyncQueue schema (tracking pending changes)
- [ ] Create basic app structure (main.dart, home screen)
- [ ] Test app launches on simulator (no crashes)

**End of Day Deliverable:**
- Flutter app compiles & runs
- Realm local database initialized
- App navigation structure ready
- No runtime errors

---

### Friday, May 17 — React Dashboard Boilerplate

**Mohammed's Tasks:**
- [ ] Review Flutter setup
- [ ] Ensure AWS resources stable (check uptime, logs)

**Coding Agent's Tasks:**
- [ ] Create React + Vite project
- [ ] Add dependencies:
  - `react-router-dom` (routing)
  - `tailwindcss` (styling)
  - `zustand` (state)
  - `@tanstack/react-query` (data fetching)
  - `axios` (HTTP client)
- [ ] Create basic routing structure:
  - `/login` page
  - `/dashboard` page
  - `/trips` page
  - `/invoices` page
- [ ] Create role-based page guard component (redirects if no auth)
- [ ] Test app runs on `localhost:5173`
- [ ] No runtime errors

**Sprint 1 Review (4 PM Friday):**
- Mohammed reviews all work completed
- Verify: AWS running, GitHub repos ready, boilerplates for all 3 apps
- Any blockers?
- Plan Sprint 2

**End of Week 1 Deliverable:**
```
✅ GitHub org + 3 repos ready
✅ AWS EC2 + PostgreSQL running
✅ Express API with JWT auth + role checking
✅ Flutter app with Realm + navigation structure
✅ React dashboard with routing + role guard
✅ CI/CD pipelines passing
✅ All boilerplates compile & run (zero crashes)
```

---

## SPRINT 2: Core Features (Week 2: May 20-27)

### Monday, May 20 — Invoice Creation (Mobile)

**Coding Agent's Tasks:**
- [ ] Create invoice creation form (Flutter UI)
  - Fields: guest name, phone, hotel, amount
  - Form validation
  - Material Design 3 styling
- [ ] Create invoice model (in app state)
- [ ] Wire up Realm: Save invoice locally (no sync yet)
- [ ] Add "Create Invoice" button → form → save
- [ ] Test: Create 5 invoices, restart app → data persists

**Mohammed's Tasks:**
- [ ] Create `/api/invoices` endpoint (POST) — backend ready to receive
- [ ] Document API contract
- [ ] Create test data in database

**End of Day:**
- Invoice creation form working
- Data saved to local Realm
- Ready for sync integration

---

### Tuesday, May 21 — Sync Engine (Mobile + Backend)

**Coding Agent's Tasks:**
- [ ] Create sync service (mobile):
  - Detect internet connection (connectivity_plus)
  - Build sync queue from Realm data
  - Upload invoices to `/api/invoices` (POST)
  - Handle responses (success/error)
  - Mark invoices as synced locally
- [ ] Create sync button UI (triggers manual sync)
- [ ] Test offline scenario:
  - Create 3 invoices (no internet)
  - Turn on WiFi
  - Click sync button
  - Verify invoices appear on server

**Mohammed's Tasks:**
- [ ] Review sync logic
- [ ] Test POST `/api/invoices` with sample data
- [ ] Verify database constraints (serial number uniqueness)

**End of Day:**
- Offline invoices created
- Manual sync working
- Invoices appear in database

---

### Wednesday, May 22 — Trip Management (Backend + Admin)

**Mohammed's Tasks:**
- [ ] Create `/api/admin/trips` endpoint (GET) — list all trips
- [ ] Create `/api/admin/trips` endpoint (POST) — create new trip
- [ ] Create `/api/admin/trips/{id}` endpoint (GET) — fetch trip details
- [ ] Test with Postman

**Coding Agent's Tasks:**
- [ ] Create `/api/trips` endpoint (GET) — photographer retrieves assigned trips
  - Trip shows: trip_date, safari_center, guide name, assigned photographers
- [ ] Create TripProvider (state management for trips)
- [ ] Create Trips screen (mobile):
  - List assigned trips
  - Tap trip → details
  - Tap trip → create invoice

**End of Day:**
- Admin can create trips
- Photographers see assigned trips
- Trip data flowing mobile ↔ server

---

### Thursday, May 23 — Admin Dashboard (Invoices View)

**Coding Agent's Tasks:**
- [ ] Create `/api/admin/invoices` endpoint (GET with filters)
  - Query: ?status=draft&photographer_id=...&date_range=...
  - Returns: list of invoices with trip info
- [ ] Create admin Invoices page (React):
  - Table with columns: Invoice ID, Guest Name, Trip, Amount, Status
  - Filters: Status, Photographer, Date Range
  - Click row → details

**Mohammed's Tasks:**
- [ ] Review admin endpoints
- [ ] Test with sample data

**End of Day:**
- Admin can view all invoices
- Invoices filterable
- Detail view available

---

### Friday, May 24 — Media Upload & Delivery (Backend Ready)

**Coding Agent's Tasks:**
- [ ] Create `/api/media/upload` endpoint (POST, multipart)
  - Takes file + invoice_id
  - Saves to S3
  - Returns media ID + Google Drive link (placeholder for now)
- [ ] Create media upload UI (mobile):
  - Camera button + file picker
  - Select photos/videos
  - Upload to server
  - Progress indicator

**Mohammed's Tasks:**
- [ ] Setup Google Drive API credentials (local, not integrated yet)
- [ ] Verify S3 upload working
- [ ] Test endpoint with Postman

**Sprint 2 Review (4 PM Friday):**
- All core features working end-to-end
- Mohammed reviews code
- Any blockers for Sprint 3?

**End of Week 2 Deliverable:**
```
✅ Mobile: Invoice creation + offline sync
✅ Mobile: Trip assignment + viewing
✅ Mobile: Media capture + upload UI (backend ready)
✅ Backend: Invoice API + Sync + Trip management
✅ Backend: Media upload endpoint
✅ Admin: View invoices + filters
✅ Zero crashes
✅ E2E: Create invoice offline → sync → appears on admin dashboard
```

---

## Communication Protocol

**Daily Standup (10 AM Cairo):**
- What did you finish yesterday?
- What are you working on today?
- Any blockers?
- Format: 15 min, WhatsApp video

**Code Review Process:**
1. Coding Agent pushes to PR (branch → develop)
2. Mohammed reviews on GitHub (comments, approves)
3. Merge to develop
4. Mohammed pulls, tests locally
5. If production-ready → manual PR to main

**Problem Escalation:**
- Stuck > 30 min → message Mohammed immediately
- Bug found → create GitHub issue
- Architecture question → Slack discussion

---

## Definition of Done (For Each Task)

- [ ] Code written
- [ ] Unit tests passing (>80% coverage)
- [ ] PR created + reviewed
- [ ] Merged to develop
- [ ] Tested locally (Mohammed confirms)
- [ ] No crashes on restart
- [ ] Documentation updated

---

## Risks & Mitigations (Sprint 1-2)

| Risk | Mitigation |
|---|---|
| Database schema too slow | Add indexes upfront (done in Sprint 1) |
| Sync conflicts | Test offline scenarios heavily (Sprint 2) |
| Flutter/Dart learning curve | Coding Agent self-learns; Mohammed reviews |
| AWS credentials leak | Store in GitHub secrets only, never commit |
| Productivity slower than estimate | Adjust Sprint 3 scope accordingly |

---

## Success Criteria (End of Sprint 2)

- ✅ Zero critical bugs
- ✅ Zero crashes on device restart
- ✅ E2E workflow: Offline invoice → sync → admin dashboard
- ✅ Code review process working smoothly
- ✅ Ready to move to Sprint 3 (Google Drive integration)

---

## Equipment & Access Needed

**Mohammed:**
- ✅ AWS account access
- ✅ GitHub admin access
- ✅ Macbook/Linux for testing

**Coding Agent:**
- ✅ Flutter SDK (installed Week 1)
- ✅ Node.js 20 LTS (installed Week 1)
- ✅ GitHub developer access
- ✅ Simulator: iOS (Xcode) or Android (Android Studio)

---

## Next Sprints Preview

- **Sprint 3-4 (Weeks 3-4):** Google Drive integration, WhatsApp delivery, advanced UI
- **Sprint 5-6 (Weeks 5-6):** Admin dashboard polish, error handling, staging deployment
- **Sprint 7 (Week 7):** Live testing with photographers, training prep
- **Sprint 8 (Week 8):** Production launch

---

**STATUS:** 🟢 READY TO EXECUTE  
**Start Date:** Monday, May 13, 2026 (10 AM Cairo)  
**Team Lead:** Mohammed (review & oversight)  
**Developer:** Coding Agent
