# Coding Agent Handoff Brief
## Phase 1: MVP Development

**Project:** Migliore Vita Smart Media POS System  
**Duration:** 8 weeks (May 13 - July 5, 2026)  
**Your Role:** Lead mobile (Flutter) + frontend (React) development + UI/UX design (development phase)  
**Supervisor:** Mohammed Othman (reviews, approves, makes decisions)  
**Collaboration:** Mohammed handles backend + DevOps

---

## 🎯 Your Mission (In Plain English)

Build a photographer's app that:
1. Works **100% offline** (no internet required)
2. Creates invoices for photo sales
3. Uploads media to Google Drive when WiFi available
4. Shows admin dashboard (web) for viewing/managing invoices

**Output:** Working MVP ready for 5 photographers to use by June 10.

---

## 📋 Your Responsibilities

### Mobile App (Flutter)
- Create beautiful, easy-to-use photographer app
- Offline-first (invoices saved locally, sync when internet returns)
- Camera integration (capture photos/videos)
- Data persistence (Realm database)
- Manual sync button (photographer clicks to upload)

### Admin Dashboard (React)
- Login page
- View trips, invoices, media
- Filters & search
- Role-based access (only show what user should see)
- Responsive design (works on desktop, tablet, mobile)

### UI/UX Design (Development Phase)
- Make screens look good (Material Design 3 for Flutter)
- Use Tailwind CSS for web (fast, consistent)
- No custom animations yet (save that for Phase 1 refinement)
- User testing feedback → iterate

### Code Quality
- Write clean, readable code
- Self-document with comments
- 80%+ unit test coverage
- Push PRs for Mohammed to review

---

## 🛠️ Tech Stack (Locked In)

**Mobile:**
- Flutter 3.22 + Dart 3.4
- Realm 1.0 (local database, offline sync)
- Provider 6.2 (state management)
- Dio 5.3 (HTTP requests)
- Material Design 3

**Admin Dashboard:**
- React 18.2 + Vite 5.0
- TailwindCSS 3.3 (styling)
- React Router 6.20 (routing)
- Zustand 4.4 (state)
- React Query 4.36 (data fetching)

**Backend (Mohammed handles, you consume via APIs):**
- Node.js 20 + Express 4.18
- PostgreSQL 15
- Sequelize (ORM)

---

## 📅 Timeline (You Should Know)

| Week | Phase | Your Work |
|---|---|---|
| 1-2 | Foundation | Setup Flutter + React, create boilerplates |
| 3-4 | Core Features | Invoice creation, offline sync, media upload |
| 5-6 | Integration | Google Drive, WhatsApp delivery, admin UI |
| 7 | Testing | Staging, bug fixes, training prep |
| 8 | Launch | Production release |

**Daily Standup:** 10 AM Cairo time (15 min, WhatsApp video)

---

## 🔑 Key Features (Phase 1)

### Mobile App (What Photographers Use)
1. **Login** → Use device ID + API key (no username)
2. **View Trips** → List of today's/this week's safari trips
3. **Create Invoice** → Fill form (guest name, phone, hotel, amount)
4. **Add Photos/Videos** → Camera or file picker
5. **Manual Sync** → Button to upload pending invoices when WiFi available
6. **Offline Mode** → Works completely without internet

### Admin Dashboard (What Mohammed Uses)
1. **Login** → Email + password (JWT)
2. **Dashboard** → Overview (trips, invoices, pending deliveries)
3. **Trips** → Create trips, assign photographers
4. **Invoices** → View all, filter, see details
5. **Media** → View photos/videos, resend delivery links
6. **Settings** → (Future: manage users, roles)

---

## 💾 Database Models (You Need to Know)

### Mobile (Local Realm)
```
Trip (synced from server)
  - id, trip_date, safari_center, guide_id, guide_name, status

Invoice (created by photographer)
  - id, trip_id, photographer_id, serial_number
  - guest_name, guest_contact, guest_hotel
  - total_amount, currency, created_at, status
  - synced: boolean

Media (captured on mobile)
  - id, invoice_id, file_path, file_size, media_type
  - upload_status, google_drive_id, created_at

SyncQueue (tracks what needs syncing)
  - id, entity_type, entity_id, action, payload, retry_count
```

### Backend (PostgreSQL) 
Mohammed handles DB schema. You just consume via APIs:
- `POST /invoices` → Create
- `GET /invoices/:id` → Fetch
- `POST /sync` → Upload pending changes
- `GET /admin/invoices` → List invoices

---

## 🌍 APIs You'll Consume

**Base URL:** `https://api.aten.eg/v1` (production)  
**Dev URL:** `http://localhost:3000/v1` (local testing)

### Photographer App APIs:
```
POST   /invoices                   Create invoice
GET    /invoices/:id               Fetch invoice
PATCH  /invoices/:id               Update invoice
GET    /invoices?trip_id=...       List invoices for trip
POST   /sync                       Upload offline changes
POST   /media/upload               Upload photos/videos
GET    /trips                      Get assigned trips
```

### Admin Dashboard APIs:
```
POST   /admin/login                Login (returns JWT)
GET    /admin/trips                List all trips
POST   /admin/trips                Create trip
GET    /admin/invoices             List invoices (filtered)
GET    /admin/invoices/:id         Invoice details
GET    /admin/media                List media
POST   /admin/media/:id/deliver    Resend delivery link
```

---

## 🎨 Design Guidelines

### Flutter Mobile App
- **Color Scheme:** Simple, professional (blues/grays)
- **Font:** Default Flutter fonts (Roboto)
- **Icons:** Flutter Material Icons
- **Layout:** Bottom navigation (3 tabs: Trips, Invoices, Settings)
- **Target:** Works on iPhone 12+ and Samsung Galaxy A50+

### React Admin Dashboard
- **Color Scheme:** Professional (blue primary, gray accents)
- **Font:** TailwindCSS default (Inter)
- **Layout:** Sidebar nav + main content area
- **Target:** Desktop first (Chrome/Firefox/Safari)
- **Responsive:** Bootstrap grid (works on tablet too)

**Design Inspiration:** Look at Invoice/POS systems (Square, Toast, etc.)

---

## 🔄 Workflow & Best Practices

### Git Workflow
```
1. Create branch: git checkout -b feature/invoice-creation
2. Make changes, commit regularly
3. Push branch: git push origin feature/invoice-creation
4. Create PR on GitHub
5. Mohammed reviews, comments
6. Make requested changes
7. Mohammed approves + merges to develop
8. Delete local branch, pull develop
```

### Code Standards
- **Naming:** camelCase for variables, PascalCase for classes/components
- **Comments:** Explain "why", not "what" (code is obvious)
- **Errors:** Log clearly, show user-friendly messages
- **Testing:** Write tests as you code (not after)

### PR Etiquette
- Small PRs (< 500 lines) → easier to review
- Descriptive PR title: "feat: Add invoice creation form"
- Link related issues
- Include test results in description
- Ask for help if stuck > 30 min

---

## 🐛 Common Issues (And Solutions)

| Problem | Solution |
|---|---|
| Realm data not syncing | Check internet connection, verify serial number unique |
| Flutter app crashes on startup | Check pubspec.yaml dependencies, rebuild |
| API 404 errors | Check endpoint URL, verify backend running |
| State not updating in React | Check Zustand store, verify setState called |
| Form validation not working | Check Joi schema, verify error messages |
| Memory leaks (Flutter) | Dispose of controllers, close streams |

---

## 📞 How to Get Help

1. **Stuck on code:** Message Mohammed (WhatsApp)
2. **Design question:** Ask Mohammed (Slack)
3. **API not working:** Test with Postman first, then ask Mohammed
4. **Architecture decision:** Discuss in standup
5. **Bug found:** Create GitHub issue, tag Mohammed

**Response Time:** Mohammed typically replies within 1-2 hours

---

## 🎁 What You'll Have at End of Phase 1

### Deliverables
- ✅ Working Flutter app (TestFlight + Firebase Distribution)
- ✅ Working React dashboard (web)
- ✅ 20+ API endpoints
- ✅ Full test suite (80%+ coverage)
- ✅ CI/CD pipelines (automated tests on PR)
- ✅ Documentation (README, API docs, deployment guides)
- ✅ Docker containers (optional, for deployment)

### Codebase Quality
- ✅ Clean, well-commented code
- ✅ No technical debt
- ✅ Scalable architecture (ready for Phase 2-4)
- ✅ Zero crashes in staging
- ✅ Reviewed & approved by Mohammed

---

## 📚 Resources (Bookmark These)

**Flutter:**
- Docs: https://flutter.dev/docs
- Realm: https://www.mongodb.com/docs/realm/sdk/flutter/
- Material Design 3: https://m3.material.io/

**React:**
- Docs: https://react.dev
- React Router: https://reactrouter.com/
- TailwindCSS: https://tailwindcss.com/docs
- Zustand: https://github.com/pmndrs/zustand

**Backend (Reference):**
- Express: https://expressjs.com/
- Sequelize: https://sequelize.org/

**Testing:**
- Flutter: https://flutter.dev/docs/testing
- React: https://testing-library.com/

---

## 🚀 Day 1 Checklist (Monday, May 13)

- [ ] Read this document (all of it)
- [ ] Join standup at 10 AM
- [ ] Setup Flutter SDK (if not done)
- [ ] Setup Node.js 20
- [ ] Clone 3 GitHub repos (Mohammed provides links)
- [ ] Get AWS credentials from Mohammed (securely)
- [ ] Test local development: `flutter run` + `npm run dev`
- [ ] Ask questions about anything unclear

---

## ⚠️ Important Notes

### About Mohammed (Your Supervisor)
- Very technical, details matter
- Code reviews will be thorough (don't take it personally)
- He'll push back if architecture isn't solid (good thing!)
- Expects tests & documentation
- Available for 30-min pair programming if really stuck

### About the Project
- **High visibility:** This is ATEN's flagship client project
- **Portfolio value:** Will showcase to future clients
- **Real users:** Photographers will use this (bugs affect their business)
- **Fast turnaround:** 8 weeks is aggressive but doable
- **Iteration:** We refine as we build (not perfect first time)

### About Expectations
- Code should be production-ready (not prototype)
- Communicate blockers early (don't wait until Friday)
- Learn as you go (you'll grow in this 8 weeks)
- Admit when you don't know something (better than guessing)
- Quality > speed (slow and solid beats fast and broken)

---

## 🎯 Success Definition

**You've succeeded if, by June 10:**

1. ✅ App is crash-free (< 0.5% crash rate)
2. ✅ Offline sync works 100%
3. ✅ Admin dashboard fully functional
4. ✅ All tests passing
5. ✅ Code is clean & well-documented
6. ✅ Mohammed approves without major rewrites
7. ✅ 5 photographers can use it productively
8. ✅ You're proud of the code you wrote

---

## 📝 Before You Start

**Read in Order:**
1. This document (you're reading it)
2. `PHASE_1_DETAILED_PLAN.md` (feature list & specs)
3. `SYSTEM_DESIGN.md` (architecture, data model)
4. `SPRINT_1_2_KICKOFF.md` (day-by-day tasks)

**Questions Before Monday?**
- Ask Mohammed now (don't wait)
- Better to clarify than build wrong thing

---

**You've got this! 💪**

**Start Date:** Monday, May 13, 2026 - 10 AM Cairo Time  
**First Task:** Attend standup, confirm setup  
**Mohammed:** Will send GitHub repo links + AWS creds Sunday evening

Good luck! 🚀
