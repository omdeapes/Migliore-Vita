# Migliore Vita Smart Media POS & Automation System
## System Design Document v1.0

**Project:** Smart Media POS + Automation System for Migliore Vita Photographer Service  
**Location:** Nabq, Desert Safari Service Center  
**Date:** May 2026  
**Status:** Design Phase

---

## 1. EXECUTIVE SUMMARY

Migliore Vita needs a **hybrid offline-first POS system** that digitizes the entire photographer workflow while maintaining operational continuity in areas with unreliable connectivity. The system will:

- ✅ Replace paper invoices with digital tracking
- ✅ Automate media delivery to guests (Google Drive + WhatsApp/Telegram/Email)
- ✅ Handle complex payment splits (dynamic per guide/center/photographer)
- ✅ Track trip expenses in real-time
- ✅ Generate comprehensive financial & operational reports
- ✅ Integrate facial recognition for intelligent media organization & guest attribution
- ✅ Minimize long-term operational costs through automation

**Core Insight:** The system must work offline (safari trips = no connectivity) but sync seamlessly when reconnected. Photographers need to capture invoices on-site; admin needs real-time dashboards in the downtown office.

---

## 2. CURRENT PAIN POINTS

| Pain Point | Impact | Solution Area |
|---|---|---|
| Paper invoices | Manual tracking, lost data, reconciliation errors | Digital invoice system |
| Manual media delivery | Slow, inefficient, no tracking | Automated delivery pipeline |
| Disconnected photographers | Silent failures, data loss, sync conflicts | Offline-first architecture |
| Manual payment splits | Time-consuming, error-prone, audit nightmare | Automated calculation engine |
| No expense tracking | Lost money, no accountability | Digital expense logging |
| Manual Google Drive uploads | Bottleneck, photographer time-sink | Automated batch processing |
| No guest attribution | Can't cross-sell, no insights | Facial recognition + metadata |
| No reporting | Flying blind on performance/profitability | Analytics dashboard |

---

## 3. SYSTEM ARCHITECTURE

### 3.1 High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         MIGLIORE VITA SYSTEM                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐         ┌──────────────────┐             │
│  │  FIELD LAYER     │         │  ADMIN LAYER     │             │
│  │  (Photographers) │         │  (Downtown)      │             │
│  ├──────────────────┤         ├──────────────────┤             │
│  │ Offline-First POS│         │ Dashboard        │             │
│  │ Invoice Creation │ ◄──────► Report Engine    │             │
│  │ Expense Logging  │         │ Payment Manager  │             │
│  │ Media Capture    │         │ Sync Orchestrator│             │
│  └────────┬─────────┘         └────────┬─────────┘             │
│           │                            │                       │
│           └────────────┬───────────────┘                       │
│                        │                                       │
│           ┌────────────▼──────────────┐                        │
│           │   SYNC ENGINE             │                        │
│           │  (Mobile ↔ Server)        │                        │
│           └────────────┬──────────────┘                        │
│                        │                                       │
│    ┌───────────────────┼───────────────────┐                  │
│    │                   │                   │                  │
│    ▼                   ▼                   ▼                  │
│ ┌──────────┐      ┌──────────┐      ┌──────────────┐        │
│ │ DATABASE │      │ MEDIA    │      │ EXTERNAL     │        │
│ │ (Core    │      │ SERVICE  │      │ INTEGRATIONS │        │
│ │ Data)    │      │ (Upload) │      │ (GDrive,     │        │
│ │          │      │          │      │  WhatsApp,   │        │
│ └──────────┘      └──────────┘      │  Telegram)   │        │
│                                      └──────────────┘        │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │         AI/ML LAYER                                     │ │
│  │  - Facial Recognition (guest/photographer attribution) │ │
│  │  - Automated media categorization                      │ │
│  │  - Anomaly detection (pricing, expenses)               │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Tech Stack (Cost-Optimized for Egypt)

**Frontend (Field):**
- React Native / Flutter (cross-platform iOS/Android)
- SQLite (embedded database for offline-first)
- Realm (mobile sync framework)

**Frontend (Admin):**
- React / Vue.js (web dashboard)
- Tailwind CSS (styling)
- Chart.js or D3.js (reporting/analytics)

**Backend:**
- Node.js + Express or Python + FastAPI (lightweight, low hosting cost)
- PostgreSQL (primary database)
- Redis (caching, job queue for batch processing)

**Infrastructure:**
- AWS EC2 (t3.small - ~$10/month) or DigitalOcean ($6-12/month)
- AWS S3 or MinIO (media storage)
- Nginx (web server)

**AI/ML:**
- MediaPipe Face Detection (open-source, on-device)
- OpenCV (local processing, no cloud cost)
- Optional: AWS Rekognition (fallback for complex scenarios, pay-per-use)

**External Integrations:**
- Google Drive API (free tier sufficient)
- Twilio WhatsApp/SMS (pay-as-you-go)
- Telegram Bot API (free)
- Email service (SendGrid free tier or Mailgun)

**DevOps:**
- Docker (containerization)
- GitHub (free private repos)
- GitHub Actions (free CI/CD)

**Estimated Monthly Cost:**
- Hosting: $10-15
- Database: $0 (PostgreSQL on EC2)
- WhatsApp/SMS: $50-200 (depends on volume)
- Storage: $5-20
- **Total: $65-235/month** (scales with guest volume)

---

## 4. CORE DATA MODEL

### 4.1 Entity Relationships

```
TRIPS
  ├─ trip_id (PK)
  ├─ trip_date
  ├─ safari_center (foreign key)
  ├─ guide_id (foreign key) 
  ├─ created_by_admin (datetime)
  ├─ status (pending/in_progress/completed)
  └─ notes

INVOICES
  ├─ invoice_id (PK)
  ├─ trip_id (FK)
  ├─ photographer_id (FK)
  ├─ serial_number (pre-printed)
  ├─ guest_contact (phone/email/telegram)
  ├─ guest_name (optional)
  ├─ guest_hotel (room number)
  ├─ created_at (on-site, may be offline)
  ├─ synced_at (when uploaded to server)
  ├─ total_amount
  ├─ currency
  ├─ status (draft/finalized/paid)
  └─ media_count (photos + videos)

INVOICE_SPLITS (for payment calculation)
  ├─ split_id (PK)
  ├─ invoice_id (FK)
  ├─ guide_id (FK) → percentage
  ├─ safari_center_id (FK) → percentage
  ├─ photographer_id (FK) → percentage
  ├─ migliore_vita → percentage
  ├─ expenses_total
  └─ split_version (for historical tracking)

EXPENSES
  ├─ expense_id (PK)
  ├─ invoice_id (FK)
  ├─ category (motorcycle_rental / buggy_rental / tip / other)
  ├─ amount
  ├─ description
  ├─ added_by (photographer / admin)
  └─ timestamp

MEDIA
  ├─ media_id (PK)
  ├─ invoice_id (FK)
  ├─ file_path (local cache)
  ├─ file_size
  ├─ media_type (photo / video)
  ├─ upload_status (pending / uploaded / delivered)
  ├─ google_drive_id
  ├─ guest_contact_sent_at
  ├─ face_metadata (JSON: face IDs detected)
  └─ created_at

PHOTOGRAPHERS
  ├─ photographer_id (PK)
  ├─ name
  ├─ phone
  ├─ assigned_device (device_id for sync)
  ├─ base_split_percentage
  ├─ is_active
  └─ apartment_location (which PC/apartment)

GUIDES
  ├─ guide_id (PK)
  ├─ name
  ├─ phone
  ├─ safari_center_id (FK)
  ├─ base_split_percentage
  ├─ is_active
  └─ notes

SPLIT_HISTORY (audit trail for percentage changes)
  ├─ history_id (PK)
  ├─ guide_id / center_id / photographer_id
  ├─ old_percentage
  ├─ new_percentage
  ├─ effective_date
  ├─ changed_by_admin
  └─ reason

GUESTS (optional, for repeat customer insights)
  ├─ guest_id (PK)
  ├─ phone / email / telegram
  ├─ name
  ├─ face_embedding (from facial recognition)
  ├─ visit_count
  ├─ total_spent
  └─ last_visit

REPORTS_CACHE
  ├─ report_id (PK)
  ├─ report_type (daily / weekly / photographer_performance / guide_earnings)
  ├─ period (date range)
  ├─ data (JSON)
  ├─ generated_at
  └─ expires_at
```

---

## 5. WORKFLOW DESIGN

### 5.1 Trip Creation (Admin, Night Before)

```
Downtown Admin Office:
  1. Opens Web Dashboard
  2. Clicks "New Trip" for tomorrow
  3. Enters:
     - Safari center
     - Expected photographer(s)
     - Guide name/ID (auto-filled from DB)
     - Trip type/duration
  4. System assigns pre-printed serial numbers
  5. Creates "Trip Package" that syncs to photographer devices
  
Photographer Device (Morning of Trip):
  1. App syncs trip package overnight (WiFi)
  2. Photographer sees assigned trip with pre-filled data
  3. Offline app ready to go
```

### 5.2 Invoice Creation (On-Site, Offline)

```
During Safari Trip:
  1. Photographer opens "New Invoice" in app
  2. App auto-fills:
     - Trip ID
     - Trip date
     - Last-known guide info
     - Serial number (next in sequence)
  3. Photographer enters:
     - Guest name
     - Guest contact (phone/email/telegram)
     - Hotel & room number
  4. Photographer can add expenses as trip progresses
  5. All stored locally (SQLite)
  
Post-Trip (Still On-Site):
  1. Photographer finishes trip
  2. Marks invoice as "ready"
  3. App queues for sync when WiFi/mobile available
```

### 5.3 Media Capture & Organization

```
Photographer Captures:
  1. Photos/videos tagged with invoice_id (automatically)
  2. Optional: Manual face tagging in field (for key shots)
  3. Media stored locally initially
  
Back at Apartment:
  1. Sync engine detects new media
  2. Runs facial recognition on photos/videos:
     - Detects guest faces (primary subject)
     - Detects photographer faces
     - Detects guide faces (optional)
  3. Creates media index:
     {
       "media_id": "...",
       "invoice_id": "...",
       "faces": [
         {"type": "guest", "confidence": 0.95, "embedding": [...] },
         {"type": "guide", "confidence": 0.87, "embedding": [...] }
       ],
       "scene_type": "group_photo", // ML prediction
       "quality_score": 0.92
     }
  4. Automatically organizes by invoice & quality
  5. Flags low-quality shots for photographer review
```

### 5.4 Media Delivery Pipeline

```
Photographer Home Apartment:
  1. Sync engine detects finalized invoices
  2. For each invoice:
     a. Compress media (80% JPEG for photos, H.264 for video)
     b. Upload to Google Drive (automation, batch)
     c. Generate shareable link
     d. Store link in database
  3. Send delivery notification:
     - WhatsApp: "Your photos are ready! Download here: [link]"
     - OR Telegram: Same
     - OR Email: Same (with high-res option)
  4. Track delivery status
  5. Archive local copy after 60 days (configurable)
  
Downtown Admin:
  - Sees delivery status in dashboard
  - Can resend links if guest requests
  - Can track which photographers are bottlenecks
```

### 5.5 Payment Calculation & Settlement

```
Daily Settlement (Admin Dashboard):
  1. Admin selects date range (e.g., last 7 days)
  2. System queries finalized invoices
  3. For each invoice:
     a. Fetch payment split percentages (as of invoice date)
     b. Calculate totals:
        - Guide gets: total × guide_pct - expenses × guide_pct_of_expenses
        - Safari center gets: total × center_pct - expenses × center_pct_of_expenses
        - Photographer gets: total × photo_pct - expenses × photo_pct_of_expenses
        - Migliore Vita gets: total × mv_pct - expenses × mv_pct_of_expenses
     c. Subtract expenses from respective parties (configurable)
  4. Generate settlement report:
     - Summary by party (guide/center/photographer)
     - Invoice-by-invoice breakdown
     - Expense details
     - Variance from expected splits (anomaly detection)
  5. Mark invoices as "paid" or "pending payment"
  
Historical Accuracy:
  - If guide split changes from 40% → 35% effective today,
    all past invoices keep 40% (SPLIT_HISTORY table)
  - Reports always accurate to date of transaction
```

---

## 6. FACIAL RECOGNITION INTEGRATION

### 6.1 Why Facial Recognition?

1. **Guest Attribution:** Automatically link photos to invoice guests (confirm identity)
2. **Quality Filtering:** Prioritize photos where guest is clearly visible
3. **Repeat Customer Recognition:** Identify returning guests for upsell
4. **Photographer Performance:** Track which photographer captures best guest satisfaction shots
5. **Duplicate Detection:** Avoid sending same shot twice

### 6.2 Implementation Strategy (Cost-Optimized)

**Phase 1: Local Processing (Free)**
- Use MediaPipe or OpenCV locally on photographer devices
- Detect faces, extract embeddings (128-512D vectors)
- Store embeddings with media
- No cloud cost, works offline

**Phase 2: Guest Database (Low Cost)**
- Build local guest face library as system grows
- When new media arrives, compare embeddings to library
- Identify repeat guests (similarity threshold > 0.6)
- Flag new guests for manual tagging

**Phase 3: Advanced Matching (Optional, Pay-per-Use)**
- For ambiguous cases, use AWS Rekognition or similar
- Pay only when confidence < threshold
- Batch process weekly (cheaper than real-time)

**Phase 4: Cross-Photographer Insights**
- Aggregate guest faces across all invoices
- Identify which photographers capture best guest expressions
- Recommend shooting techniques / angles

### 6.3 Privacy & Compliance

- **Face embeddings stored locally** (not raw images to cloud)
- **Guest consent:** Include in terms (photo delivery requires face detection)
- **Data retention:** Embeddings deleted after 1 year
- **No third-party sharing** of face data

---

## 7. REPORTING & ANALYTICS

### 7.1 Admin Dashboard (Key Metrics)

**Real-Time Overview:**
- Active trips (in progress)
- Invoices pending delivery
- Payment status (settled / pending)
- Total revenue (today / this week / this month)

**Photographer Performance:**
- Invoices created & finalized
- Media delivery time (avg, max, min)
- Guest contact delivery rate
- Quality score (from facial recognition)
- Revenue per trip

**Guide Performance:**
- Trips assigned
- Revenue earned
- Repeat guest frequency
- Associate photographer count

**Financial Reports:**
- Daily settlement (splits calculated)
- Weekly revenue breakdown (guide / center / photographer / MV)
- Expense analysis (what categories dominate?)
- Margin analysis (total revenue - expenses - splits)
- Variance alerts (invoice amount unusually high/low)

**Operational Insights:**
- Trip capacity (photographers available vs. trips)
- Delivery bottlenecks (slowest media upload)
- Sync failure rate (offline invoices not synced)
- Device health (which photographer devices are struggling?)

### 7.2 Reports Export

- CSV/Excel (for accountants)
- PDF (for distribution)
- JSON (for external integrations)
- Monthly PDF report (auto-email to partners)

---

## 8. IMPLEMENTATION PHASES

### Phase 1: MVP (Weeks 1-8)
**Goal:** Replace paper invoices, automate media delivery

- [ ] Photographer app (offline invoice + media tagging)
- [ ] Admin dashboard (trip creation, invoice viewing)
- [ ] Basic sync engine (invoices + media)
- [ ] Google Drive integration (auto-upload)
- [ ] WhatsApp notification (simple link delivery)
- [ ] SQLite → PostgreSQL data layer
- [ ] Basic reporting (daily settlement)

**Deliverables:**
- Android/iOS app on photographer devices
- Web dashboard on admin laptop (downtown office)
- Working end-to-end: Invoice → Media → Delivery → Payment calc

### Phase 2: Advanced Features (Weeks 9-16)
**Goal:** Automate payment splits, add reporting depth

- [ ] Dynamic split percentages (guide/center/photographer)
- [ ] Split history & audit trail
- [ ] Expense tracking in app
- [ ] Advanced reporting (weekly, monthly, custom date ranges)
- [ ] Telegram & Email delivery (backup channels)
- [ ] Offline device conflict resolution
- [ ] Payment management (mark as paid, generate payment reports)

**Deliverables:**
- Settlement automation (one-click weekly payment calculation)
- Comprehensive reports (PDF export, email distribution)
- Payment reconciliation (reduce manual effort 90%)

### Phase 3: AI/ML (Weeks 17-24)
**Goal:** Facial recognition, quality optimization, repeat customer insights

- [ ] Facial recognition on media (MediaPipe local)
- [ ] Guest embeddings database
- [ ] Quality scoring (sharpness, lighting, composition)
- [ ] Repeat guest identification
- [ ] Photographer performance ranking (by guest satisfaction)
- [ ] Anomaly detection (unusual invoice amounts, expenses)
- [ ] Predictive analytics (next month forecast)

**Deliverables:**
- Automatic media categorization
- Guest repeat loyalty tracking
- Performance dashboards (photographer ranking)
- Smart recommendations (which photographer for which trip?)

### Phase 4: Optimization & Scale (Week 25+)
**Goal:** Cost reduction, scale to multiple safari centers

- [ ] Performance tuning (reduce cloud costs 30%)
- [ ] Advanced caching (Redis)
- [ ] Batch job optimization (parallel processing)
- [ ] Multi-site support (different safari centers)
- [ ] Advanced integrations (booking system, marketing automation)
- [ ] Mobile payment integration (instant payout to photographers)

**Deliverables:**
- Ability to handle 10x current volume (same infrastructure cost)
- Multi-center management console
- Recurring revenue automation (monthly reports, settlements)

---

## 9. COST PROJECTIONS

### 9.1 Development Cost

| Phase | Duration | Team | Est. Cost (USD) |
|---|---|---|---|
| Phase 1 (MVP) | 8 weeks | 2 devs + 1 designer | $12,000 |
| Phase 2 (Advanced) | 8 weeks | 1 full-stack + 1 backend | $8,000 |
| Phase 3 (AI/ML) | 8 weeks | 1 ML engineer + 1 backend | $10,000 |
| Phase 4 (Scale) | 4 weeks | 1 full-stack + DevOps | $5,000 |
| **Total** | 28 weeks | 4 people (rotating) | **$35,000** |

### 9.2 Operational Cost (Monthly, After Launch)

| Component | Cost | Notes |
|---|---|---|
| **Hosting** | $12 | EC2 t3.small on AWS (or DigitalOcean $6) |
| **Database** | $0 | PostgreSQL on same EC2 |
| **Storage** | $10 | S3 (500 GB media/month) |
| **WhatsApp/SMS** | $100 | ~1000 messages/month × $0.10 avg |
| **Email** | $0 | Free tier (Mailgun/SendGrid) |
| **Monitoring** | $5 | Datadog free + UptimeRobot free |
| **Domain + SSL** | $2 | Domain renewal, Letsencrypt free SSL |
| **Backup** | $5 | Automated backups to S3 |
| **API/Integrations** | $0 | Google Drive free, Telegram free |
| **Contingency (10%)** | $13 | Buffer for surprises |
| **Total** | **~$147/month** | Scales with guest volume |

### 9.3 Cost Savings vs. Current Manual Process

| Metric | Current | With System | Savings |
|---|---|---|---|
| **Payment calculation time/week** | 8 hours | 5 min (automated) | 7.5 hrs/week = $200/month |
| **Media delivery time/day** | 4 hours manual | 30 min automated | 3.5 hrs/day = $700/month |
| **Invoice reconciliation errors** | ~5%/month | 0.1%/month | ~$2000/month (prevented errors) |
| **Photographer productivity** | 60% on delivery | 95% on capture | More trips, +$5000/month |
| **Infrastructure/systems** | Manual (minimal cost) | $147/month | -$147/month |
| **Net Monthly Benefit** | — | — | **+$7,753/month** |

**Payback Period:** ~5 months (development cost $35k ÷ $7,753/month)

---

## 10. TECHNICAL SPECIFICATIONS (Selected Modules)

### 10.1 Offline-First Sync Architecture

```javascript
// Pseudo-code: Photographer App Sync Engine

class SyncEngine {
  
  // On app launch
  async initialize() {
    const localDB = new SQLite('migliore_vita.db');
    const syncQueue = [];
    
    // Check for pending changes
    const pendingInvoices = await localDB.query(
      "SELECT * FROM invoices WHERE status='pending_sync'"
    );
    const pendingMedia = await localDB.query(
      "SELECT * FROM media WHERE upload_status='pending'"
    );
    
    this.syncQueue = [...pendingInvoices, ...pendingMedia];
  }
  
  // When WiFi/mobile detected
  async syncWhenConnected() {
    const batches = this.chunkArray(this.syncQueue, 10);
    
    for (const batch of batches) {
      try {
        // Upload invoices first
        const invoices = batch.filter(i => i.type === 'invoice');
        await this.uploadInvoices(invoices);
        
        // Then compress & upload media
        const media = batch.filter(i => i.type === 'media');
        await this.compressAndUploadMedia(media);
        
        // On success, mark as synced locally
        await localDB.update('invoices', {
          status: 'synced',
          synced_at: new Date()
        });
        
      } catch (error) {
        // Retry logic with exponential backoff
        this.retryWithBackoff(batch, error);
      }
    }
  }
  
  // Conflict resolution (rare)
  async resolveConflict(localInvoice, remoteInvoice) {
    // Last-write-wins strategy for most fields
    // Exception: payment_splits (use remote, it's the source of truth)
    return {
      ...localInvoice,
      payment_splits: remoteInvoice.payment_splits,
      updated_at: Math.max(local.updated_at, remote.updated_at)
    };
  }
}
```

### 10.2 Facial Recognition Pipeline

```python
# Pseudo-code: Media Processing & Face Detection

import mediapipe as mp
import numpy as np
from PIL import Image

class MediaProcessor:
  
  def process_media(self, invoice_id, media_files):
    """
    Process captured media, extract face embeddings,
    identify guests & photographers
    """
    
    mp_face_detection = mp.solutions.face_detection
    mp_face_mesh = mp.solutions.face_mesh
    
    with mp_face_detection.FaceDetection() as face_detection:
      for media_file in media_files:
        
        # Load image/frame
        image = Image.open(media_file)
        results = face_detection.process(cv2.cvtColor(
          image, cv2.COLOR_RGB2BGR))
        
        if not results.detections:
          continue
        
        faces_in_media = []
        
        for detection in results.detections:
          bbox = detection.location_data.relative_bounding_box
          face_crop = self.crop_face(image, bbox)
          
          # Generate embedding (use MediaPipe or VGGFace2)
          embedding = self.generate_embedding(face_crop)
          confidence = detection.score[0]
          
          faces_in_media.append({
            "embedding": embedding.tolist(),
            "confidence": float(confidence),
            "bbox": {
              "x": bbox.xmin,
              "y": bbox.ymin,
              "width": bbox.width,
              "height": bbox.height
            }
          })
        
        # Try to identify faces
        identifications = self.identify_faces(
          faces_in_media,
          invoice_id
        )
        
        # Store metadata
        self.store_face_metadata(
          media_file,
          faces_in_media,
          identifications
        )
  
  def identify_faces(self, faces_in_media, invoice_id):
    """
    Match detected faces against guest/guide database.
    Return identity matches with confidence.
    """
    
    matches = []
    
    # Load guest embeddings for this invoice
    guest_data = self.db.query(
      "SELECT * FROM guests WHERE last_invoice_id = ?",
      [invoice_id]
    )
    
    for face in faces_in_media:
      best_match = None
      best_distance = float('inf')
      
      for guest in guest_data:
        # Compute cosine distance
        distance = self.cosine_distance(
          face['embedding'],
          guest['face_embedding']
        )
        
        if distance < best_distance:
          best_distance = distance
          best_match = {
            "guest_id": guest['id'],
            "confidence": 1 - (distance / 2),  # normalize to 0-1
            "type": "guest"
          }
      
      # Threshold: if confidence > 70%, consider it a match
      if best_match and best_match['confidence'] > 0.7:
        matches.append(best_match)
    
    return matches
  
  def compress_media(self, media_file):
    """
    Compress photos to ~80% JPEG / videos to H.264
    Target: <5MB per photo, <50MB per video
    """
    
    if media_file.endswith(('.jpg', '.jpeg', '.png')):
      img = Image.open(media_file)
      img.save('compressed.jpg', quality=80, optimize=True)
      return 'compressed.jpg'
    
    elif media_file.endswith(('.mp4', '.mov')):
      # Use ffmpeg: 1080p H.264 @ 5Mbps
      cmd = f"""
        ffmpeg -i {media_file} \
          -vcodec libx264 -crf 28 \
          -acodec aac -ab 128k \
          compressed.mp4
      """
      subprocess.run(cmd)
      return 'compressed.mp4'
```

### 10.3 Payment Split Calculation

```python
# Pseudo-code: Settlement Engine

class SettlementEngine:
  
  def calculate_settlement(self, invoice_id, override_date=None):
    """
    Calculate payment splits for an invoice.
    Use split percentages as of invoice date (or override).
    """
    
    # Fetch invoice
    invoice = self.db.get('invoices', invoice_id)
    invoice_date = override_date or invoice['created_at']
    
    # Get split percentages as of invoice date
    guide_split = self.get_split_percentage(
      'guide', 
      invoice['guide_id'], 
      invoice_date
    )
    center_split = self.get_split_percentage(
      'safari_center',
      invoice['safari_center_id'],
      invoice_date
    )
    photographer_split = self.get_split_percentage(
      'photographer',
      invoice['photographer_id'],
      invoice_date
    )
    migliore_vita_split = 100 - (
      guide_split + center_split + photographer_split
    )
    
    # Fetch expenses
    expenses = self.db.query(
      "SELECT * FROM expenses WHERE invoice_id = ?",
      [invoice_id]
    )
    total_expenses = sum(e['amount'] for e in expenses)
    
    # Calculate net amount (revenue - expenses)
    invoice_total = invoice['total_amount']
    net_amount = invoice_total - total_expenses
    
    # Split calculations
    splits = {
      'guide': {
        'percentage': guide_split,
        'amount': (net_amount * guide_split) / 100
      },
      'safari_center': {
        'percentage': center_split,
        'amount': (net_amount * center_split) / 100
      },
      'photographer': {
        'percentage': photographer_split,
        'amount': (net_amount * photographer_split) / 100
      },
      'migliore_vita': {
        'percentage': migliore_vita_split,
        'amount': (net_amount * migliore_vita_split) / 100
      },
      'total_revenue': invoice_total,
      'total_expenses': total_expenses,
      'net_amount': net_amount,
      'expense_breakdown': expenses
    }
    
    # Validation
    total_splits = sum(s['amount'] for s in splits.values()
                      if isinstance(s, dict) and 'amount' in s)
    
    assert abs(total_splits - net_amount) < 0.01, \
      f"Split calculation error: {total_splits} != {net_amount}"
    
    return splits
  
  def get_split_percentage(self, entity_type, entity_id, as_of_date):
    """
    Fetch the split percentage for an entity as of a specific date.
    Uses SPLIT_HISTORY table for accuracy.
    """
    
    # Query split history
    historical_split = self.db.query_one(f"""
      SELECT percentage FROM split_history
      WHERE entity_type = ? 
        AND entity_id = ? 
        AND effective_date <= ?
      ORDER BY effective_date DESC
      LIMIT 1
    """, [entity_type, entity_id, as_of_date])
    
    if historical_split:
      return historical_split['percentage']
    
    # Fallback to current percentage (if no history)
    current = self.db.get(f'{entity_type}s', entity_id)
    return current['base_split_percentage']
  
  def generate_settlement_report(self, date_range):
    """
    Generate a comprehensive settlement report for a date range.
    """
    
    invoices = self.db.query(f"""
      SELECT * FROM invoices
      WHERE created_at BETWEEN ? AND ?
      AND status IN ('finalized', 'paid')
    """, [date_range['start'], date_range['end']])
    
    settlement_data = {
      'period': date_range,
      'invoices': [],
      'summary_by_party': {
        'guide': 0,
        'safari_center': 0,
        'photographer': 0,
        'migliore_vita': 0,
        'total_revenue': 0,
        'total_expenses': 0
      },
      'summary_by_guide': {},
      'summary_by_photographer': {}
    }
    
    for invoice in invoices:
      splits = self.calculate_settlement(invoice['id'])
      
      settlement_data['invoices'].append({
        'invoice_id': invoice['id'],
        'invoice_date': invoice['created_at'],
        'splits': splits,
        'photographer_name': self.get_photographer_name(
          invoice['photographer_id']
        ),
        'guide_name': self.get_guide_name(invoice['guide_id'])
      })
      
      # Aggregate by party
      for party in ['guide', 'safari_center', 'photographer', 'migliore_vita']:
        settlement_data['summary_by_party'][party] += splits[party]['amount']
      
      settlement_data['summary_by_party']['total_revenue'] += splits['total_revenue']
      settlement_data['summary_by_party']['total_expenses'] += splits['total_expenses']
      
      # Aggregate by guide
      guide_id = invoice['guide_id']
      if guide_id not in settlement_data['summary_by_guide']:
        settlement_data['summary_by_guide'][guide_id] = {
          'name': self.get_guide_name(guide_id),
          'amount': 0,
          'invoice_count': 0
        }
      
      settlement_data['summary_by_guide'][guide_id]['amount'] += splits['guide']['amount']
      settlement_data['summary_by_guide'][guide_id]['invoice_count'] += 1
      
      # Similar for photographers...
    
    return settlement_data
```

---

## 11. SECURITY & DATA INTEGRITY

### 11.1 Security Measures

1. **Authentication:**
   - Each photographer device gets unique API key (stored securely in Keychain/Keystore)
   - Admin portal uses username + password (stored with bcrypt)
   - Optional: 2FA for admin portal

2. **Encryption:**
   - TLS 1.3 for all API communication
   - Database encryption at rest (PostgreSQL pgcrypto)
   - Local SQLite encrypted (SQLCipher)

3. **Authorization:**
   - Role-based access control (RBAC): photographer, guide, admin
   - Photographers can only view their own invoices/media
   - Guides can view their own earnings reports
   - Admins see everything

4. **Audit Trail:**
   - All changes logged to `audit_log` table
   - Who changed what, when, and why
   - Immutable historical records (split changes, expense adjustments)

### 11.2 Data Integrity

1. **Idempotency:**
   - All API endpoints include `idempotency_key` to prevent double-submissions
   - Ensure invoice sync doesn't create duplicates

2. **Validation:**
   - Invoice totals validated against line items
   - Split percentages always sum to 100%
   - Serial numbers enforced as unique

3. **Backup & Recovery:**
   - Daily automated backups (S3)
   - Point-in-time recovery (7-day retention)
   - Regular restoration tests

---

## 12. DEPLOYMENT STRATEGY

### 12.1 Dev → Staging → Production

```
Week 1-2: Setup Infrastructure
  - Provision EC2 / DigitalOcean
  - Setup PostgreSQL, Redis, Docker
  - Configure CI/CD (GitHub Actions)

Week 3-4: Deploy MVP (Staging)
  - Deploy photographer app (staging build)
  - Deploy admin dashboard (staging)
  - Sync engine testing with small team

Week 5-6: Beta Test (Sandbox)
  - Invite 2 photographers + admin
  - Real trips, real invoices
  - Feedback loops

Week 7-8: Production Launch
  - All photographers onboarded
  - Parallel running (paper + digital for 1 week)
  - Fallback procedures documented
```

### 12.2 Monitoring & Alerts

- Uptime monitoring (UptimeRobot)
- Error tracking (Sentry)
- Performance monitoring (Datadog)
- Alert on: sync failures, invoice errors, failed media uploads

---

## 13. SUCCESS METRICS

**By End of Phase 1 (8 weeks):**
- ✅ 100% of invoices digital (zero paper)
- ✅ 0 sync failures (target <0.1%)
- ✅ <1 hour average media delivery time (down from 4 hours)
- ✅ 100% settlement automation (admin time < 5 min/week)

**By End of Phase 2 (16 weeks):**
- ✅ +30% photographer productivity (more time capturing)
- ✅ -20% operational costs (automation)
- ✅ +50% guest satisfaction (faster delivery, fewer errors)

**By End of Phase 3 (24 weeks):**
- ✅ Repeat guest identification (10%+ recognize returning customers)
- ✅ Photographer ranking (data-driven assignments)
- ✅ +200% system reliability (scale to multiple centers)

---

## 14. NEXT STEPS

1. **Approval:** Confirm architecture aligns with Migliore Vita vision
2. **Resource Planning:** Confirm dev team availability
3. **Database Design:** Detailed schema review & optimization
4. **API Specification:** RESTful endpoint design (50+ endpoints)
5. **UI/UX Mockups:** Photographer app & admin dashboard wireframes
6. **Development Sprint 1:** Begin Phase 1 implementation

---

## Appendix

### A. Glossary

- **Invoice:** Paper/digital record of a guest's photo/video purchase
- **Trip:** Safari outing with guide(s) and photographer(s)
- **Split:** Percentage allocation of invoice revenue
- **Settlement:** End-of-period payment calculation to all parties
- **Sync:** Transfer of data between offline app and cloud server
- **Embedding:** Numerical representation of a face (for facial recognition)

### A. Useful Links

- MediaPipe: https://mediapipe.dev
- OpenCV: https://opencv.org
- PostgreSQL: https://www.postgresql.org
- React Native: https://reactnative.dev
- Docker: https://www.docker.com

---

**Document Version:** 1.0  
**Last Updated:** May 10, 2026  
**Author:** Adam (AI Chief Software Developer)  
**Status:** Ready for Review & Implementation
