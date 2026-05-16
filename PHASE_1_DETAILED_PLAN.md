# Phase 1: MVP — Digital Invoices + Media Delivery
## Detailed Development Plan (REFINED - Ready for Implementation)

**Project:** Migliore Vita Smart Media POS System  
**Phase:** 1 of 4  
**Status:** REFINED & APPROVED ✅  
**Last Updated:** May 10, 2026 (Refinements Applied)

---

## 1. PHASE DEFINITION

### 1.1 Goal
Replace paper invoicing with a fully digital, offline-capable system that automates media delivery to guests.

### 1.2 Scope (In / Out)

**✅ IN SCOPE (Phase 1):**
- Photographer Flutter app (offline invoice creation)
- Trip data sync (admin creates trips, photographers receive them)
- Invoice creation on-site (offline, no internet required)
- Media capture & tagging (photo/video organized by invoice)
- Automatic media upload to Google Drive (when WiFi available)
- Guest delivery notification (Manual buttons for WhatsApp/Telegram, Automatic for Email)
- Admin web dashboard (view trips, invoices, media status)
- **Role-based access control** (Admin, Accountant roles)
- Basic sync engine (photographer app ↔ cloud)
- Realm local database (photographer device)
- PostgreSQL cloud database (server)

**❌ OUT OF SCOPE (Phase 1):**
- Payment split calculations (Phase 2)
- Facial recognition (Phase 3)
- Advanced reporting (Phase 2)
- Expense tracking detail (Phase 2)
- Multi-site support (Phase 4)
- Mobile payment integration (Phase 4)
- Guest chatbot (Phase 4 - separate project)
- Social media optimization (separate project)

### 1.3 Duration & Timeline

| Week | Deliverable | Status |
|---|---|---|
| 1-2 | Infrastructure setup, dev environment | Planned |
| 3-4 | Photographer app MVP (invoice creation, offline) | Planned |
| 5-6 | Backend API + admin dashboard (role-based access) | Planned |
| 7 | Staging deployment, 2 live training sessions | Planned |
| 8 | Production launch, monitoring | Planned |

**Total:** 8 weeks  
**Start:** Week of May 13, 2026 (ASAP)  
**Buffer:** Included in timeline (realistic estimates)

### 1.4 Team

| Role | Person | Responsibility |
|---|---|---|
| Lead Backend + Full-Stack | Mohammed Othman | API, database, sync engine, backend architecture |
| Lead Mobile + Full-Stack + UI/UX (Dev Phase) | Coding Agent | Flutter app, offline sync, UI/UX design implementation |
| UI/UX Refinement | TBD (Hire after dev) | Design polish, animations, UX refinement (post-Phase 1) |
| QA/Tester | Shared (both devs) | Testing, bug fixes, integration testing |
| DevOps | Mohammed | AWS setup, CI/CD, monitoring |

**Start Date:** ASAP (Week of May 13, 2026)

### 1.5 Success Metrics

| Metric | Target | Verification |
|---|---|---|
| **Invoices created digitally** | 100% (zero paper) | Check database for invoice count |
| **Offline functionality** | 100% (works with no internet) | Test photographer app offline for 3 days |
| **Sync reliability** | <0.1% failure rate | Monitor sync logs, test with 1000+ invoices |
| **Media delivery time** | <24 hours avg | Track timestamps: invoice created → link sent |
| **App crash rate** | <0.5% | Monitor Crashlytics, target <1 crash per 1000 launches |
| **Admin dashboard performance** | Load in <3 seconds | Load test, measure page load time |
| **Sync conflict resolution** | 0 data loss incidents | Test two photographers syncing simultaneously |

---

## 2. TECH STACK INVENTORY (UPDATED WITH FLUTTER)

### 2.1 Mobile (Photographer App) — Flutter 3.22

```yaml
Runtime:
  flutter: "3.22.0"
  dart: "3.4.0"

UI Framework:
  flutter: "3.22.0"
  material_design: "3.x"

Navigation:
  go_router: "12.1.0"

State Management:
  provider: "6.2.0"

Local Database:
  realm: "1.0.0"          # Primary (offline-first sync)
  hive: "2.2.3"           # Secondary (local cache for emergencies)

File Handling:
  path_provider: "2.1.1"
  file_picker: "5.5.0"

HTTP Client:
  dio: "5.3.1"            # Better offline handling than http package

Networking:
  connectivity_plus: "5.0.0"

Camera:
  camera: "0.10.5"
  image_picker: "0.8.7"

Notifications:
  flutter_local_notifications: "17.1.0"

Logging:
  logger: "2.2.0"

Testing:
  flutter_test: "latest"
  mockito: "5.4.4"
```

**Why Flutter:**
- ✅ Cross-platform (iOS + Android from single codebase)
- ✅ Excellent offline-first support (Realm + Hive)
- ✅ Superior performance vs React Native
- ✅ Hot reload for faster development
- ✅ Strong type safety (Dart)
- ✅ Material Design 3 built-in (beautiful UI out of box)
- ✅ Easier deployment via Fastlane/Codemagic
- ✅ Better for UI/UX polish without external designer

### 2.2 Backend (Node.js API Server) — No Changes

```yaml
Runtime:
  node: "20 LTS"
  npm: "10.x"

Framework:
  express: "4.18.2"
  cors: "2.8.5"
  helmet: "7.1.0"

Database:
  postgres: "15.x"
  pg: "8.11.1"
  sequelize: "6.35.0"

Caching:
  redis: "7.x"
  redis-npm: "4.6.11"

Authentication:
  jsonwebtoken: "9.1.2"
  bcryptjs: "2.4.3"

Validation:
  joi: "17.11.0"

File Storage:
  aws-sdk: "2.1524.0"
  multer: "1.4.5-lts.1"

External APIs:
  twilio: "3.99.0"         # WhatsApp + SMS
  googleapis: "118.0.0"    # Google Drive

Logging:
  winston: "3.11.0"
  morgan: "1.10.0"

Testing:
  jest: "29.7.0"
  supertest: "6.3.3"

Utilities:
  dotenv: "16.3.1"
  uuid: "9.0.1"
  moment: "2.29.4"
```

### 2.3 Frontend (Admin Dashboard) — No Changes

```yaml
Runtime:
  node: "20 LTS"
  npm: "10.x"

Framework:
  react: "18.2.0"
  react-dom: "18.2.0"
  react-router-dom: "6.20.0"

Styling:
  tailwindcss: "3.3.6"
  postcss: "8.4.32"

HTTP Client:
  axios: "1.6.2"

Data Fetching:
  "@tanstack/react-query": "4.36.0"

State Management:
  zustand: "4.4.2"

UI Components:
  headlessui/react: "1.7.16"

Forms:
  react-hook-form: "7.48.0"

Charts (for future reporting):
  recharts: "2.10.3"

Testing:
  vitest: "1.1.0"
  "@testing-library/react": "14.1.2"

Build:
  vite: "5.0.8"
```

---

## 3. DEPENDENCY CONFLICT ANALYSIS (UPDATED FOR FLUTTER)

### 3.1 Mobile (Flutter) Conflict Matrix

| Package A | Package B | Status | Notes | Severity |
|---|---|---|---|---|
| Flutter 3.22 | Dart 3.4 | ✅ COMPATIBLE | Official pairing | — |
| go_router 12.1 | Flutter 3.22 | ✅ COMPATIBLE | Stable navigation | — |
| Provider 6.2 | Riverpod 2.4 | ⚠️ CAUTION | Both are state management | Low |
| Realm 1.0 | Hive 2.2 | ✅ COMPATIBLE | Different purposes, no conflict | — |
| Realm 1.0 | Provider 6.2 | ✅ COMPATIBLE | DB vs state management | — |
| Dio 5.3 | connectivity_plus 5.0 | ✅ COMPATIBLE | HTTP + network detection | — |
| camera 0.10.5 | image_picker 0.8.7 | ✅ COMPATIBLE | Different workflows | — |

**Resolution for ⚠️ CAUTION (Provider vs Riverpod):**
- **Decision:** Use **Provider 6.2 ONLY** (simpler, more straightforward for MVP)
- **Reason:** Riverpod adds complexity we don't need in Phase 1
- **Remove:** Riverpod from dependencies

**Conflicts Found:** NONE CRITICAL ✅

### 3.2 Backend (Node.js) Conflict Matrix
✅ **No changes** — All compatible (previously validated)

### 3.3 Frontend (React) Conflict Matrix
✅ **No changes** — All compatible (previously validated)

### 3.4 Cross-Platform Conflict Check (Flutter ↔ Backend ↔ Frontend)

| Layer 1 | Layer 2 | Status | Notes |
|---|---|---|---|
| Flutter (3.22) | Express (4.18) | ✅ OK | Different environments, different protocols |
| Dio (mobile) | Express (backend) | ✅ OK | Standard HTTP client-server |
| Realm (mobile) | Sequelize (backend) | ✅ OK | Different databases, different purposes |
| Provider (mobile) | Zustand (frontend) | ✅ OK | Different apps, different tools |

**Summary:** ✅ **ZERO CRITICAL CONFLICTS** — All packages are compatible.

---

## 4. INVOICE SERIAL NUMBER STRATEGY (IMPORTANT FIX)

### Problem with Pre-Printed Serials
- Paper books run out
- Printing delays
- Sync conflicts when photographers offline

### Solution: Digital Serial Generation

**Format:** `{TRIP_ID}-{PHOTOGRAPHER_ID}-{INVOICE_NUMBER}`

**Example:** `TRIP-20260511-PHOTO-001-0001`

**Components:**
1. `TRIP-20260511` = Trip date (ensures daily uniqueness)
2. `PHOTO-001` = Photographer ID (2-3 digits, assigned at onboarding)
3. `0001` = Invoice number sequence for this photographer on this day

**Why This Works:**
- ✅ Globally unique (no collisions even if offline)
- ✅ Photographer-scoped (photographer 001 can't conflict with 002)
- ✅ Human-readable (date + photographer + sequence)
- ✅ Database-queryable (tripid-photographerid index)
- ✅ Offline-safe (no backend dependency for generation)

**Generation Logic (On Photographer Device):**
```dart
String generateSerialNumber(String tripId, String photographerId, int invoiceNumber) {
  final date = DateTime.now().toString().split(' ')[0].replaceAll('-', '');
  final paddedInvoice = invoiceNumber.toString().padLeft(4, '0');
  return '$tripId-$photographerId-$paddedInvoice';
}
// Example: TRIP-20260511-PHOTO-001-0025
```

**Database Constraints:**
- Unique constraint on (trip_id, photographer_id, invoice_number)
- No NULL values allowed
- Indexed for fast lookups

---

## 5. DELIVERY MESSAGE TEMPLATES

### 5.1 WhatsApp (Manual Button)

**Template 1: Standard Delivery**
```
📸 Hi {GUEST_NAME}!

Your photos from today's safari adventure are ready! 🌅

🔗 Download here:
{GOOGLE_DRIVE_LINK}

Questions? Reply to this message.

— Migliore Vita Photographer Service 📷
```

**Template 2: Video Included**
```
🎥 Your safari memories are ready!

📷 Photos + 🎬 Videos available:
{GOOGLE_DRIVE_LINK}

Enjoy! Questions? Just reply.

— Migliore Vita 📸
```

**Template 3: High-Quality Album**
```
✨ Premium Edition Ready!

Your high-resolution photos + edited videos:
{GOOGLE_DRIVE_LINK}

👉 Download today (expires in 14 days)

Thanks for choosing us! 📸
— Migliore Vita
```

### 5.2 Telegram (Manual Button)

**Template 1: Standard**
```
📸 Your photos are ready!

🔗 Download: {GOOGLE_DRIVE_LINK}

Questions? Message us anytime.

— Migliore Vita Photographer Service
```

**Template 2: Casual**
```
🎉 Your safari pics are here!

📷 Check them out: {GOOGLE_DRIVE_LINK}

Enjoy your memories! ✨
```

### 5.3 Email (Automatic)

**Subject Line:**
`✨ Your Migliore Vita Photos Are Ready! [Expires in 14 Days]`

**Body:**
```
Dear {GUEST_NAME},

We're excited to share your professional safari photos with you!

📸 Your Photos & Videos: {GOOGLE_DRIVE_LINK}

💡 Quick Tips:
  • Download today for best quality
  • Link expires in 14 days
  • Files available for re-download anytime by messaging us

Have questions? Reply to this email or contact us:
  📞 WhatsApp: +20 XXX XXX XXXX
  📧 Email: support@migliore-vita.eg
  💬 Telegram: @MiglioreVitaPhotos

Thank you for choosing Migliore Vita Photographer Service!

Best regards,
Migliore Vita Team 📸

---
Invoice #: {INVOICE_ID}
Date: {INVOICE_DATE}
Photographer: {PHOTOGRAPHER_NAME}
```

**Technical Details:**
- Auto-send: Triggered when media uploaded to Google Drive (no delay)
- From: noreply@migliore-vita.eg
- Authenticated: SPF + DKIM + DMARC
- Tracking: Open rate + click rate monitoring (admin dashboard)

---

## 6. ROLE-BASED ACCESS CONTROL (ADMIN DASHBOARD)

### 6.1 Roles & Permissions

| Permission | Admin | Accountant | Support | Photographer |
|---|---|---|---|---|
| **View all trips** | ✅ | ✅ | ❌ | ✅ (own) |
| **Create trip** | ✅ | ❌ | ❌ | ❌ |
| **Edit trip** | ✅ | ❌ | ❌ | ❌ |
| **View all invoices** | ✅ | ✅ | ✅ | ✅ (own) |
| **Edit invoice** | ✅ | ❌ | ❌ | ✅ (own) |
| **View payments/splits** | ✅ | ✅ | ❌ | ❌ |
| **Generate settlement** | ✅ | ✅ | ❌ | ❌ |
| **Send media link** | ✅ | ❌ | ✅ | ❌ |
| **View reports** | ✅ | ✅ | ❌ | ❌ |
| **Manage users** | ✅ | ❌ | ❌ | ❌ |
| **System settings** | ✅ | ❌ | ❌ | ❌ |

### 6.2 Role Definitions

**Admin (Mohammed)**
- Full system access
- Create/edit trips
- Manage photographers & guides
- View financial data
- Generate settlements & reports
- User management
- System configuration

**Accountant**
- View trips & invoices (read-only)
- View payment data & settlements
- Generate financial reports
- Audit logs
- NO ability to edit or delete

**Support**
- View invoices & media status
- Resend delivery links to guests
- View guest inquiries
- NO access to financial data

**Photographer**
- View own trips
- Create/edit own invoices
- View own media
- Track own deliveries

### 6.3 Implementation (JWT + Database)

**JWT Payload:**
```json
{
  "user_id": "admin-001",
  "email": "mohammed@aten.eg",
  "role": "admin",
  "permissions": ["view_trips", "create_trip", "view_invoices", ...],
  "iat": 1715418000,
  "exp": 1715504400
}
```

**Database Schema:**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL, -- admin, accountant, support, photographer
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);

CREATE TABLE role_permissions (
  id SERIAL PRIMARY KEY,
  role VARCHAR(50) NOT NULL,
  permission VARCHAR(100) NOT NULL,
  UNIQUE(role, permission)
);
```

---

## 7. BACKUP & RECOVERY STRATEGY (UPDATED)

### 7.1 Backup Schedule

**Daily Backups (Monday-Friday):**
- Time: 2:00 AM Cairo time (off-peak)
- Retention: 5 days
- Scope: Full database + media metadata

**Weekly Backup (Friday):**
- Time: 2:00 AM Cairo time
- Retention: 4 weeks (1 month)
- Scope: Full database snapshot
- Storage: Separate S3 bucket (immutable)

**Monthly Backups:**
- Date: 14th & 28th of each month
- Time: 2:00 AM Cairo time
- Retention: 12 months (1 year)
- Scope: Full database + media archive list
- Storage: Glacier (long-term, cheap)

**Total Retention Timeline:**
```
Mon Daily (5 days) → Fri Weekly (4 weeks) → Monthly (12 months)
```

### 7.2 Backup Implementation

**PostgreSQL Backups:**
```bash
# Daily automated backup script (cron)
0 2 * * 1-5 /usr/local/bin/backup-daily.sh

# Weekly script (Friday)
0 2 * * 5 /usr/local/bin/backup-weekly.sh

# Monthly script (14th & 28th)
0 2 14,28 * * /usr/local/bin/backup-monthly.sh
```

**Backup Scripts:**
```bash
#!/bin/bash
# backup-daily.sh

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_NAME="migliore_vita"
BACKUP_FILE="$HOME/backups/daily/pg_backup_${TIMESTAMP}.sql.gz"

pg_dump $DB_NAME | gzip > $BACKUP_FILE
aws s3 cp $BACKUP_FILE s3://migliore-vita-backups-daily/

# Keep only 5 days of backups locally
find $HOME/backups/daily -name "*.sql.gz" -mtime +5 -delete
```

**Media Backups:**
- Google Drive: Handled by Google (automatic redundancy)
- S3: AWS handles versioning + replication across AZs
- No separate media backup needed (immutable uploads)

### 7.3 Recovery Procedure

**RTO:** 1 hour (Recovery Time Objective)  
**RPO:** 24 hours (Recovery Point Objective)

**Step 1: Identify Backup (5 min)**
```bash
aws s3 ls s3://migliore-vita-backups-daily/
# Lists: pg_backup_20260511_020000.sql.gz
```

**Step 2: Download & Restore (15 min)**
```bash
aws s3 cp s3://migliore-vita-backups-daily/pg_backup_20260511_020000.sql.gz /tmp/
gunzip /tmp/pg_backup_20260511_020000.sql.gz
psql migliore_vita < /tmp/pg_backup_20260511_020000.sql
```

**Step 3: Verify (5 min)**
```bash
psql -c "SELECT COUNT(*) FROM invoices;"
psql -c "SELECT COUNT(*) FROM media;"
```

**Step 4: Application Restart (5 min)**
```bash
docker restart app-server
# Check health: curl https://api.aten.eg/health
```

**Step 5: Notify Team (10 min)**
- Confirm data integrity
- Communicate with photographers
- Monitor for issues

**Total Time:** ~40 minutes

---

## 8. DATA MODEL (UNCHANGED, REFERENCE ONLY)

### Database Schema (PostgreSQL)

**Key Changes for This Phase:**
- Serial number field changed to `VARCHAR` (generated format, not INT)
- Add `device_id` to track which device created invoice
- Add `created_at_local` (device timestamp, for offline accuracy)

```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id),
  photographer_id UUID NOT NULL REFERENCES photographers(id),
  serial_number VARCHAR(100) NOT NULL UNIQUE,  -- Changed: tripid-photoid-sequence
  serial_sequence INT, -- Counter for this photographer on this day
  guest_name VARCHAR(255),
  guest_contact VARCHAR(255) NOT NULL,
  guest_hotel VARCHAR(255),
  total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'EGP',
  created_at TIMESTAMP DEFAULT NOW(),  -- Server timestamp (when synced)
  created_at_local TIMESTAMP,  -- Device timestamp (from photographer app)
  synced_at TIMESTAMP,
  status VARCHAR(20) DEFAULT 'draft',
  media_count INT DEFAULT 0,
  device_id VARCHAR(255),  -- Which device created this
  
  INDEX idx_invoices_trip_id (trip_id),
  INDEX idx_invoices_photographer_id (photographer_id),
  INDEX idx_invoices_created_at (created_at),
  INDEX idx_invoices_status (status),
  UNIQUE(trip_id, photographer_id, serial_sequence)
);
```

---

## 9. API ENDPOINTS (UNCHANGED)

**Reference:** See PHASE_PLANNING_FRAMEWORK.md for full endpoint specifications.

**Key Endpoints:**
- `POST /invoices` — Create invoice (offline-first)
- `POST /sync` — Sync pending changes
- `GET /admin/invoices` — List invoices (with role filtering)
- `POST /admin/media/{id}/deliver` — Manual delivery (WhatsApp/Telegram/Email)

---

## 10. TRAINING PLAN (2 LIVE SESSIONS)

### Session 1: Photographer App Training
**Duration:** 2-3 hours  
**When:** Week 7 (during staging), Friday morning  
**Who:** All photographers (in-person at office or Zoom)  
**Content:**

1. **Introduction (15 min)**
   - Why digital? Benefits
   - System overview
   - Device setup

2. **App Walkthrough (45 min)**
   - Login flow
   - View assigned trips
   - Create invoice (live demo)
   - Add photos/videos
   - Mark invoice complete

3. **Offline & Sync (30 min)**
   - Turn off WiFi
   - Create invoice offline
   - Sync when WiFi returns
   - What if sync fails?
   - Troubleshooting

4. **Q&A (30 min)**
   - Hands-on practice
   - Mohammed addresses concerns

### Session 2: Admin Dashboard Training
**Duration:** 1-2 hours  
**When:** Week 8 (Monday before production launch)  
**Who:** Mohammed, Sobhy (accountant if hired)  
**Content:**

1. **Dashboard Overview (20 min)**
   - KPIs at a glance
   - Navigation structure

2. **Trip Management (15 min)**
   - Create trip
   - Assign photographers
   - View trip status

3. **Invoice Management (15 min)**
   - View invoices
   - Manual resend links
   - Track deliveries

4. **Monitoring (15 min)**
   - Sync status
   - Error logs
   - Performance metrics

5. **Troubleshooting (15 min)**
   - Common issues & fixes
   - Support contact

**Recording:** All sessions recorded for future reference

---

## 11. DEVELOPMENT SPRINTS

### Sprint 1-2: Foundation (Weeks 1-2)

**Deliverables:**
- [ ] AWS EC2 + PostgreSQL 15 provisioned
- [ ] Database schema created (all tables, indexes)
- [ ] GitHub repos initialized (backend, mobile, frontend)
- [ ] CI/CD pipeline setup (GitHub Actions)
- [ ] Flutter dev environment (Android Studio + Xcode)
- [ ] Photographer app boilerplate (Flutter structure)
- [ ] Backend API boilerplate (Express + PostgreSQL connection)
- [ ] Admin dashboard boilerplate (React + routing)
- [ ] Team trained on development process

**Assignments:**
- Mohammed: AWS setup, database schema, backend boilerplate
- Coding Agent: Flutter setup, app structure, local Realm

### Sprint 3-4: Photographer App MVP (Weeks 3-4)

**Deliverables:**
- [ ] Invoice creation form (offline, local Realm)
- [ ] Trip data display (synced from server)
- [ ] Serial number generation (tripid-photoid-sequence)
- [ ] Media capture (camera + file picker)
- [ ] Manual sync button (upload pending invoices)
- [ ] Offline state handling
- [ ] Basic error messages

**Testing:**
- Create invoice without internet
- Sync when WiFi available
- No data loss

### Sprint 5-6: Backend API + Admin Dashboard (Weeks 5-6)

**Deliverables:**
- [ ] Trip API (GET /trips)
- [ ] Invoice API (POST/GET/PATCH /invoices)
- [ ] Media upload (POST /media/upload)
- [ ] Sync endpoint (POST /sync)
- [ ] Admin login (JWT)
- [ ] Admin dashboard (React UI)
- [ ] Role-based access control (JWT + DB)
- [ ] Dashboard shows trips, invoices, media status

**Testing:**
- API endpoints from Postman
- Role-based permissions working
- Dashboard loads data correctly

### Sprint 7: Staging & Training (Week 7)

**Deliverables:**
- [ ] App deployed to TestFlight (iOS) + Firebase Distribution (Android)
- [ ] API deployed to AWS staging
- [ ] Admin dashboard live
- [ ] Internal testing with 3-5 photographers
- [ ] Training session 1 (photographers)
- [ ] Bug fixes from feedback

**Testing:**
- Real offline invoices created & synced
- Media delivered to test phones
- No crashes

### Sprint 8: Production Launch (Week 8)

**Deliverables:**
- [ ] App released to all photographers
- [ ] API running on production
- [ ] Admin dashboard live
- [ ] Training session 2 (admin)
- [ ] Monitoring alerts configured
- [ ] Support setup

**Launch:**
- Friday morning: App release
- Photographer onboarding calls
- 48-hour live monitoring
- Daily check-ins for first week

---

## 12. SIGN-OFF CHECKLIST

- [ ] **Tech stack approved** — Flutter instead of React Native ✅
- [ ] **Conflict analysis complete** — Zero conflicts ✅
- [ ] **Serial number strategy approved** — tripid-photoid-sequence ✅
- [ ] **Team assigned** — Mohammed + Coding Agent ✅
- [ ] **Start date confirmed** — Week of May 13, 2026 ✅
- [ ] **Budget approved** — $35k dev + $147/month ops ✅
- [ ] **Delivery strategy confirmed** — Manual WhatsApp/Telegram, Auto Email ✅
- [ ] **Role-based access designed** — Admin, Accountant, Support, Photographer ✅
- [ ] **Backup strategy approved** — Daily (5) + Weekly + Monthly ✅
- [ ] **Training plan confirmed** — 2 live sessions ✅
- [ ] **Success metrics agreed** — 100% digital, 0 crashes, <24hr delivery ✅

---

## 13. NEXT STEPS (IMMEDIATE)

1. ✅ **Tech stack finalized** (Flutter + backend + frontend)
2. ✅ **Conflicts resolved** (zero critical conflicts)
3. ⏭️ **AWS infrastructure provisioning** (this week)
4. ⏭️ **GitHub repos created** (this week)
5. ⏭️ **Flutter dev environment setup** (Dev 1 — this week)
6. ⏭️ **PostgreSQL schema created** (Dev 2 — this week)
7. ⏭️ **Sprint 1-2 kickoff** (Monday next week)

---

**STATUS:** ✅ APPROVED & READY FOR IMPLEMENTATION  
**Last Updated:** May 10, 2026 (Refinements Applied)  
**Next Phase:** Phase 2 Planning (after Phase 1 complete)  
**Phase 4 Note:** Guest chatbot via WhatsApp/Telegram scheduled for later phase

---

## Appendix A: Message Template Codes

For easy admin updates:
```
WHATSAPP_STANDARD = "msg_ws_001"
WHATSAPP_VIDEO = "msg_ws_002"
WHATSAPP_PREMIUM = "msg_ws_003"
TELEGRAM_STANDARD = "msg_tg_001"
TELEGRAM_CASUAL = "msg_tg_002"
EMAIL_STANDARD = "msg_em_001"
```

Admin can customize these in dashboard later (Phase 2).

---

## Appendix B: User Roles Reference

Quick lookup for permission checks:
- **Admin:** All permissions
- **Accountant:** Read-only financial + reporting
- **Support:** Resend links + view status
- **Photographer:** Own data only

---

**Ready to start coding? 🚀**
