# Migliore Vita - Complete Development Plan

## 1. Project Vision
Migliore Vita is building a **hybrid offline-first POS system** to digitize photographer workflows in Nabq’s Desert Safari. The system will:
- Replace paper invoices with digital tracking.
- Automate media delivery (Google Drive + WhatsApp/Telegram/Email).
- Handle dynamic payment splits (guides, centers, photographers, Migliore Vita).
- Track trip expenses in real-time.
- Generate financial and operational reports.
- Use **facial recognition** for intelligent media organization and guest attribution.
- Work **offline-first** (critical for safari trips) and sync seamlessly when reconnected.

**Core Insight:** Photographers capture invoices on-site (no connectivity), while admins need real-time dashboards in the downtown office.

---

## 2. System Architecture
The system is split into **three layers**:
1. **Field Layer (Photographers):**
   - Offline-first mobile app (React Native/Flutter).
   - SQLite for local storage.
   - Realm for sync.
   - Facial recognition (MediaPipe/OpenCV) for guest attribution.

2. **Admin Layer (Downtown Office):**
   - Web dashboard (React/Vue.js + Tailwind CSS).
   - Real-time reporting (Chart.js/D3.js).
   - Sync orchestrator for offline data.

3. **Backend Layer:**
   - Node.js + Express (or Python + FastAPI).
   - PostgreSQL (primary database).
   - Redis (caching, job queue).
   - AWS EC2/S3 (hosting/media storage).

**AI/ML Layer:**
- Facial recognition (guest/photographer/guide attribution).
- Quality scoring (sharpness, lighting, composition).
- Anomaly detection (unusual invoice amounts, expenses).

---

## 3. Core Features & Workflows

### A. Trip Creation (Admin)
- Admin creates trips in the web dashboard.
- Assigns photographers, guides, and safari centers.
- Pre-prints serial numbers for invoices.
- Syncs trip packages to photographer devices overnight.

### B. Invoice Creation (Photographer, Offline)
- Photographers create invoices on-site (no connectivity).
- App auto-fills trip details, serial numbers, and guide info.
- Photographers enter guest contact (phone/email/Telegram) and hotel details.
- Expenses logged in real-time.
- Invoices stored locally (SQLite) and synced later.

### C. Media Capture & Organization
- Photos/videos tagged with `invoice_id`.
- Facial recognition runs locally (MediaPipe/OpenCV):
  - Detects guest faces (primary subject).
  - Detects photographer/guide faces.
  - Flags low-quality shots for review.
- Media stored locally until sync.

### D. Media Delivery Pipeline
- Sync engine detects finalized invoices.
- Compresses media (80% JPEG, H.264 video).
- Uploads to Google Drive (batch processing).
- Generates shareable links.
- Sends notifications via WhatsApp/Telegram/Email.
- Tracks delivery status.

### E. Payment Calculation & Settlement
- Admin selects date range (e.g., last 7 days).
- System queries finalized invoices.
- Calculates splits dynamically:
  - Guide: `total × guide_pct - expenses × guide_pct_of_expenses`.
  - Safari center: `total × center_pct - expenses × center_pct_of_expenses`.
  - Photographer: `total × photo_pct - expenses × photo_pct_of_expenses`.
  - Migliore Vita: `total × mv_pct - expenses × mv_pct_of_expenses`.
- Generates settlement reports (PDF/CSV/JSON).
- Marks invoices as "paid" or "pending payment".

### F. Reporting & Analytics
- **Real-Time Dashboard:**
  - Active trips, pending invoices, payment status.
  - Revenue (daily/weekly/monthly).
- **Photographer Performance:**
  - Invoices created, media delivery time, quality score.
- **Guide Performance:**
  - Trips assigned, revenue earned, repeat guest frequency.
- **Financial Reports:**
  - Daily settlement, weekly revenue breakdown.
  - Expense analysis, margin analysis.
- **Operational Insights:**
  - Trip capacity, delivery bottlenecks, sync failure rate.

---

## 4. Implementation Phases

### Phase 1: MVP (Weeks 1-8)
**Goal:** Replace paper invoices, automate media delivery.
- [x] Photographer app (offline invoice + media tagging).
- [x] Admin dashboard (trip creation, invoice viewing).
- [x] Sync engine (invoices + media).
- [x] Google Drive integration (auto-upload).
- [x] WhatsApp notification (link delivery).
- [ ] Basic reporting (daily settlement).

**Deliverables:**
- Android/iOS app on photographer devices.
- Web dashboard for admin.
- End-to-end workflow: Invoice → Media → Delivery → Payment calc.

### Phase 2: Advanced Features (Weeks 9-16)
**Goal:** Automate payment splits, add reporting depth.
- [ ] Dynamic split percentages (guide/center/photographer).
- [ ] Split history & audit trail.
- [ ] Expense tracking in app.
- [ ] Advanced reporting (weekly, monthly, custom ranges).
- [ ] Telegram & Email delivery (backup channels).
- [ ] Offline device conflict resolution.
- [ ] Payment management (mark as paid, generate reports).

**Deliverables:**
- Settlement automation (one-click weekly payment calculation).
- Comprehensive reports (PDF export, email distribution).
- Payment reconciliation (reduce manual effort 90%).

### Phase 3: AI/ML (Weeks 17-24)
**Goal:** Facial recognition, quality optimization, repeat customer insights.
- [ ] Facial recognition on media (MediaPipe local).
- [ ] Guest embeddings database.
- [ ] Quality scoring (sharpness, lighting, composition).
- [ ] Repeat guest identification.
- [ ] Photographer performance ranking (by guest satisfaction).
- [ ] Anomaly detection (unusual invoice amounts, expenses).
- [ ] Predictive analytics (next month forecast).

**Deliverables:**
- Automatic media categorization.
- Guest repeat loyalty tracking.
- Performance dashboards (photographer ranking).
- Smart recommendations (which photographer for which trip?).

### Phase 4: Optimization & Scale (Week 25+)
**Goal:** Cost reduction, scale to multiple safari centers.
- [ ] Performance tuning (reduce cloud costs 30%).
- [ ] Advanced caching (Redis).
- [ ] Batch job optimization (parallel processing).
- [ ] Multi-site support (different safari centers).
- [ ] Advanced integrations (booking system, marketing automation).
- [ ] Mobile payment integration (instant payout to photographers).

**Deliverables:**
- Handle 10x current volume (same infrastructure cost).
- Multi-center management console.
- Recurring revenue automation (monthly reports, settlements).

---

## 5. Tech Stack
| Layer | Technology |
|-------|------------|
| **Frontend (Field)** | React Native / Flutter, SQLite, Realm |
| **Frontend (Admin)** | React / Vue.js, Tailwind CSS, Chart.js/D3.js |
| **Backend** | Node.js + Express, PostgreSQL, Redis |
| **Infrastructure** | AWS EC2/S3, Nginx, Docker |
| **AI/ML** | MediaPipe, OpenCV, AWS Rekognition (optional) |
| **Integrations** | Google Drive API, Twilio (WhatsApp/SMS), Telegram Bot API |
| **DevOps** | GitHub Actions, Docker, Sentry |

---

## 6. Cost Projections

### Development Cost:
- **Total:** $35,000 (28 weeks, 4 people rotating).

### Operational Cost (Monthly):
| Component | Cost (USD) |
|-----------|------------|
| Hosting | $12 |
| Storage | $10 |
| WhatsApp/SMS | $100 |
| Monitoring | $5 |
| Backup | $5 |
| Contingency | $13 |
| **Total** | **~$147/month** |

### Cost Savings vs. Manual Process:
- **Payment calculation time:** 8 hours → 5 min/week.
- **Media delivery time:** 4 hours → 30 min/day.
- **Invoice reconciliation errors:** 5% → 0.1%.
- **Photographer productivity:** 60% → 95%.
- **Net Monthly Benefit:** **+$7,753/month**.

**Payback Period:** ~5 months.

---

## 7. Current Status (May 16, 2026)
- **Backend:** Running on `http://5.189.160.78:3000/v1/products` (authentication required).
- **Frontend:** Running on `http://5.189.160.78:5173` (Vite + React + Tailwind).
- **Database:** PostgreSQL installed and connected.
- **Repository:** Project successfully imported and tracked at `omdeapes/Migliore-Vita`.

## 8. Immediate Action Items
1. **Backend:**
   - Finalize remaining API endpoints (`/v1/invoices`, `/v1/trips`, `/v1/sync`).
   - Implement authentication middleware (JWT).
   - Add basic reporting endpoints.

2. **Frontend:**
   - Complete routing (`/login`, `/dashboard`, `/trips`, `/invoices`).
   - Implement role-based page guards.
   - Test offline functionality.

3. **Sync Engine:**
   - Implement conflict resolution (last-write-wins for most fields).
   - Test batch processing for media uploads.

4. **Deployment:**
   - Set up staging environment.
   - Onboard 2 photographers for beta testing.