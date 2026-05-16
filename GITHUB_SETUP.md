# GitHub Organization & Repositories Setup
## Migliore Vita Project Structure

**Organization:** Migliore Vita  
**Repositories:** 3 (mobile, backend, frontend)  
**Visibility:** Private (client project)  

---

## Repository Structure

### 1. migliore-vita-mobile
**Type:** Flutter mobile app (Photographer app)  
**Language:** Dart  
**Maintainer:** Coding Agent (primary)  

```
migliore-vita-mobile/
├── README.md
├── pubspec.yaml                    # Flutter dependencies
├── android/                        # Android build config
├── ios/                            # iOS build config
├── lib/
│   ├── main.dart
│   ├── config/
│   │   ├── app_config.dart
│   │   └── api_client.dart
│   ├── models/
│   │   ├── invoice.dart
│   │   ├── trip.dart
│   │   ├── media.dart
│   │   └── photographer.dart
│   ├── services/
│   │   ├── realm_service.dart
│   │   ├── sync_service.dart
│   │   ├── api_service.dart
│   │   └── camera_service.dart
│   ├── providers/
│   │   ├── app_state.dart
│   │   └── sync_provider.dart
│   ├── screens/
│   │   ├── auth/
│   │   ├── trips/
│   │   ├── invoices/
│   │   ├── media/
│   │   └── settings/
│   ├── widgets/
│   │   └── reusable components
│   └── utils/
├── test/
├── .github/workflows/
│   ├── build.yml                   # Android build
│   ├── ios-build.yml               # iOS build
│   └── test.yml                    # Unit tests
└── .gitignore
```

**GitHub Settings:**
- Main branch: `main` (production)
- Dev branch: `develop` (staging)
- PR required: Yes (Mohammed reviews)
- Status checks: Tests must pass

---

### 2. migliore-vita-backend
**Type:** Node.js + Express API  
**Language:** JavaScript/TypeScript  
**Maintainer:** Mohammed (primary) + Coding Agent (support)  

```
migliore-vita-backend/
├── README.md
├── package.json
├── .env.example
├── src/
│   ├── index.js                    # Entry point
│   ├── config/
│   │   ├── database.js
│   │   ├── redis.js
│   │   └── aws.js
│   ├── models/                     # Sequelize ORM
│   │   ├── trip.js
│   │   ├── invoice.js
│   │   ├── media.js
│   │   ├── photographer.js
│   │   ├── guide.js
│   │   └── user.js
│   ├── routes/
│   │   ├── photographer.js         # /api/invoices, /api/sync, etc
│   │   ├── admin.js                # /api/admin/*, role-based
│   │   └── health.js               # /health, /status
│   ├── controllers/
│   │   ├── invoiceController.js
│   │   ├── syncController.js
│   │   ├── mediaController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js                 # JWT verification
│   │   ├── roleCheck.js            # Role-based access
│   │   ├── errorHandler.js
│   │   └── logger.js
│   ├── services/
│   │   ├── invoiceService.js
│   │   ├── syncService.js
│   │   ├── googleDriveService.js
│   │   ├── twilioService.js        # WhatsApp/SMS
│   │   └── s3Service.js
│   ├── utils/
│   │   ├── validators.js
│   │   └── helpers.js
│   └── migrations/
│       └── (Sequelize migrations)
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .github/workflows/
│   ├── test.yml
│   ├── deploy-staging.yml
│   └── deploy-prod.yml
└── .gitignore
```

**GitHub Settings:**
- Main branch: `main` (production)
- Dev branch: `develop` (staging)
- PR required: Yes (Mohammed reviews)
- Status checks: Tests + lint must pass
- Secrets: AWS_KEY, DB_PASSWORD, TWILIO_KEY, etc.

---

### 3. migliore-vita-frontend
**Type:** React admin dashboard  
**Language:** JavaScript/TypeScript  
**Maintainer:** Coding Agent (primary)  

```
migliore-vita-frontend/
├── README.md
├── package.json
├── vite.config.js
├── index.html
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── config/
│   │   ├── api.js
│   │   └── auth.js
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Trips.jsx
│   │   ├── Invoices.jsx
│   │   ├── Media.jsx
│   │   ├── Reports.jsx
│   │   └── Settings.jsx
│   ├── components/
│   │   ├── TripTable.jsx
│   │   ├── InvoiceCard.jsx
│   │   ├── MediaGallery.jsx
│   │   ├── RoleGuard.jsx
│   │   └── reusables/
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useFetch.js
│   ├── services/
│   │   ├── api.js
│   │   └── auth.js
│   ├── store/
│   │   └── app.js                  # Zustand store
│   ├── utils/
│   │   └── helpers.js
│   └── styles/
│       └── tailwind config
├── tests/
├── .github/workflows/
│   ├── test.yml
│   └── deploy.yml
└── .gitignore
```

**GitHub Settings:**
- Main branch: `main` (production)
- Dev branch: `develop` (staging)
- PR required: Yes (Mohammed reviews)
- Status checks: Tests + lint must pass

---

## 4. Shared Documentation Repo (Optional)

**migliore-vita-docs**
```
├── README.md
├── ARCHITECTURE.md
├── API_REFERENCE.md
├── DEPLOYMENT.md
├── TROUBLESHOOTING.md
└── ONBOARDING.md
```

**Purpose:** Shared knowledge base (optional, can live in main repos)

---

## GitHub Organization Settings

**Organization Name:** `migliore-vita`

**Team Structure:**
- **Owners:** Mohammed Othman
- **Developers:** Coding Agent (write access), Mohammed (admin)
- **Permissions:** Private repos, PR reviews required

**Branch Protection Rules (All 3 Repos):**
- ✅ Require PR reviews (1 reviewer minimum)
- ✅ Require status checks (tests pass)
- ✅ Require branches up to date
- ✅ Dismiss stale reviews when new commits pushed
- ✅ Restrict push to admins only

**Secrets (Store in Organization):**
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `DB_HOST`
- `DB_PASSWORD`
- `TWILIO_AUTH_TOKEN`
- `GOOGLE_DRIVE_API_KEY`
- `JWT_SECRET`

---

## Initial Commits (Day 1)

### migliore-vita-mobile
```bash
# Branch: develop
# Commit 1: Initial Flutter project setup
# Files: pubspec.yaml, basic structure, README
# Message: "Initial Flutter app setup - Phase 1 MVP"
```

### migliore-vita-backend
```bash
# Branch: develop
# Commit 1: Express boilerplate + database schema
# Files: package.json, src/index.js, db schema, README
# Message: "Initial Express API setup - Phase 1 MVP"
```

### migliore-vita-frontend
```bash
# Branch: develop
# Commit 1: React + Vite boilerplate
# Files: package.json, vite.config.js, basic pages, README
# Message: "Initial React dashboard setup - Phase 1 MVP"
```

---

## Access Instructions

**For Mohammed (Admin):**
1. Create GitHub account (or use existing)
2. Create organization: `migliore-vita`
3. Create 3 repositories (as above)
4. Configure branch protection
5. Add secrets

**For Coding Agent:**
1. Mohammed adds as developer
2. Clone repos locally
3. Create develop branches
4. Start Sprint 1-2 tasks

---

## CI/CD Pipeline Structure (GitHub Actions)

**Workflow: On PR to `develop`**
```
1. Run tests (Jest, Flutter test)
2. Run linter (ESLint, Dart analyzer)
3. Check code coverage
4. Deploy to staging (on merge)
```

**Workflow: On PR to `main`**
```
1. Run all tests
2. Run security checks
3. Build production artifacts
4. Deploy to production (manual approval)
```

---

## First Day Setup Checklist

- [ ] GitHub organization created
- [ ] 3 repositories created
- [ ] Branch protection rules enabled
- [ ] Secrets configured
- [ ] Coding Agent added as developer
- [ ] Initial commits made to develop branches
- [ ] CI/CD workflows tested
- [ ] README files populated
- [ ] .env.example files created
- [ ] .gitignore files in place

---

**Status:** Ready to create (awaiting Mohammed's go-ahead)
