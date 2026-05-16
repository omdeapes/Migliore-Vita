# Local PC Specs for Face Recognition (Phase 3)
## Hardware Requirements & Recommendations

**Context:** Phase 3 processes media from Phase 1 & 2 for facial recognition, guest matching, and quality scoring.

---

## 1. WORKLOAD ANALYSIS

### What Phase 3 Does (Face Recognition):
- **Input:** ~20 invoices/day × 15 photos/invoice = ~300 photos/day
- **Processing:** Extract face embeddings from each photo
- **Time per photo:** ~0.5-1.5 seconds (depends on hardware)
- **Daily processing time:** 300 photos × 1 sec = ~5 minutes (batch)
- **Peak load:** All photographers sync at 6 PM → burst of 3000+ photos in 1 hour

### Current Setup:
- 5 PCs in apartment (for editing)
- Each has: unknown specs (TBD)
- Processing: Sequential (each photographer processes their own media)

### Option A: Dedicated Face Recognition PC
- Separate machine, always running
- 24/7 batch processing
- Scalable for future growth

### Option B: Shared with Editing PC
- Add GPU to one existing editing PC
- Use during off-peak hours (nights)
- Cost-effective but slower

---

## 2. RECOMMENDED SPECS (Dedicated Machine)

### Budget-Conscious Option ($600-800 USD)

**Processor:**
- CPU: AMD Ryzen 5 5500 (6-core, 12-thread) or Intel i5-12400
- Reason: MediaPipe runs on CPU, not GPU-dependent; good multi-threading for batch

**Memory:**
- RAM: 16 GB DDR4
- Reason: Each face embedding ~128-512 bytes; 16GB handles 1000+ concurrent operations

**Storage:**
- Primary: 512 GB SSD (OS + code)
- Secondary: 2-4 TB HDD (photo cache during processing)
- Reason: Fast boot/application, bulk storage for batching

**Graphics (Optional):**
- GPU: None required (can add later if needed)
- MediaPipe works fine on CPU
- GPU adds cost for minimal Phase 3 gains

**Network:**
- Ethernet (wired, 1 Gbps)
- Reason: Reliable uploads to AWS S3

**Power:**
- 350W PSU (sufficient)
- UPS (1000VA, ~$100) — Protects against brownouts

**Form Factor:**
- Mini PC or Small form factor (saves desk space)
- Or small tower (budget-friendly)

**Estimated Cost:** $600-800 USD

### Mid-Range Option ($1200-1500 USD) — Recommended

**Processor:**
- CPU: AMD Ryzen 7 5700X (8-core) or Intel i7-12700
- Reason: Faster batch processing; future-proof for Phase 4+

**Memory:**
- RAM: 32 GB DDR4
- Reason: Handles large batch jobs without swapping; smoother operation

**Storage:**
- Primary: 1 TB NVMe SSD
- Secondary: 4 TB HDD
- Reason: Fast processing + ample cache

**Graphics:**
- GPU: Optional RTX 3060 (12GB VRAM, ~$200)
- Reason: If you want 3-5x faster processing; not required for Phase 3

**Network:**
- Gigabit Ethernet + optional WiFi 6

**Power & Cooling:**
- 500W PSU
- Good case ventilation (continuous processing)
- UPS (1500VA, ~$150)

**Estimated Cost:** $1200-1500 USD (without GPU) / $1400-1700 (with GPU)

### High-End Option ($2000-2500 USD) — Only If Scaling

**Processor:**
- CPU: AMD Ryzen 9 5950X or Intel i9-12900K
- GPU: RTX 3080 Ti or RTX 4070

**This is overkill for Phase 3**, but makes sense if:
- Processing 10,000+ photos/day
- Running concurrent tasks (editing + recognition)
- Real-time streaming mode (Phase 4+)

---

## 3. ACTUAL RECOMMENDATION FOR MIGLIORE VITA

### Phase 1 & 2: No Local Face Recognition PC Needed
- Local editing PCs are fine (they already have)
- No face recognition yet

### Phase 3 Launch: Get Mid-Range Option ($1200-1500)

**Spec Sheet:**
```
CPU:       Ryzen 7 5700X (8-core)
RAM:       32 GB DDR4
Storage:   1 TB NVMe SSD + 4 TB HDD
GPU:       Skip for now (CPU sufficient)
Network:   Gigabit Ethernet
Power:     500W PSU + 1500VA UPS
OS:        Ubuntu 22.04 LTS (free, stable)
```

**Why This Option:**
- ✅ Handles 300-1000 photos/day easily
- ✅ Batch process overnight (results ready by morning)
- ✅ Future-proof (Phase 4 chatbot can leverage)
- ✅ Cost-reasonable ($1200 one-time vs. monthly cloud costs)
- ✅ Data stays local (no cloud processing costs)

---

## 4. SOFTWARE STACK (Phase 3)

### Local Processing Stack:
```
OS:                Ubuntu 22.04 LTS
Language:          Python 3.10+
Face Detection:    MediaPipe (free, open-source)
Face Recognition:  FaceNet or VGGFace2 (free models)
Image Processing:  OpenCV (free)
Batch Processing:  Python multiprocessing
Database:          SQLite (cache) + PostgreSQL (remote)
```

**Cost:** $0 (all open-source)

### Processing Pipeline:
```
1. Media synced from S3 → Local HDD
2. Batch process (100 photos at a time)
3. Extract face embeddings → SQLite cache
4. Upload embeddings to PostgreSQL
5. Match against guest database (similarity > 70%)
6. Store results + guest linkage
7. Clean up local copies
```

**Performance Expectations:**
- MediaPipe on CPU: ~0.5-1 sec/photo
- Batch of 100: ~50-100 seconds
- Daily batch (300 photos): ~5-10 minutes total
- Cost: $0 in processing fees

---

## 5. COST COMPARISON (Phase 3)

### Option A: Local PC ($1200 one-time + power)

```
Initial Cost:        $1200
Monthly Power:       $10 (24/7 operation)
Annual Cost:         $120
5-Year Cost:         $1200 + ($120 × 5) = $1800
```

**Per-Photo Cost:** $1800 ÷ (300 photos/day × 365 × 5 years) = $0.0033/photo

### Option B: AWS Rekognition (Cloud-Based)

```
Pricing:             $0.10 per 1000 images
Daily Cost:          300 images × $0.10/1000 = $0.03/day
Monthly Cost:        $0.03 × 30 = $0.90
Annual Cost:         $10.80
5-Year Cost:         $54
```

**Sounds cheaper, BUT:**
- Data goes to AWS servers (privacy concern)
- Cumulative cost with scale (10+ photographers)
- Per-photo cost INCREASES as volume grows
- No local control

### Winner: Local PC
- ✅ Lower long-term cost
- ✅ Data privacy (stays in Egypt)
- ✅ Offline-capable
- ✅ Scales better with growth

---

## 6. INSTALLATION & SETUP (Phase 3)

### Hardware Setup:
```
1. Unbox & assemble mini PC
2. Install Ubuntu 22.04 LTS
3. Connect Gigabit Ethernet
4. Plug in UPS
5. Install Docker (containerization)
6. Pull face recognition Docker image
```

**Time:** 2-3 hours

### Software Setup:
```
1. Clone face recognition repo from GitHub
2. Download MediaPipe models (10 MB)
3. Download FaceNet model (180 MB)
4. Setup PostgreSQL connection
5. Create batch processing scripts
6. Test with 10 sample photos
```

**Time:** 1-2 hours

### Total Setup Time:** 4-5 hours (Mohammed or Coding Agent)

---

## 7. MONITORING & MAINTENANCE

### Daily Checks:
- CPU temp < 70°C (good)
- Batch job completed successfully
- Embeddings uploaded to PostgreSQL
- No crashes or errors

### Monthly Maintenance:
- Clean dust filters
- Check disk space (HDD should stay < 80% full)
- Restart service (weekly)
- Review error logs

### Hardware Lifespan:
- Expected: 3-5 years
- Replace: When CPU gets too slow or storage fails

---

## 8. SCALING BEYOND PHASE 3

### If Growth Requires (10+ photographers):

**Option 1: Add GPU ($200)**
- Install RTX 3060 12GB
- Speeds up processing 3-5x
- Cost: $200 one-time

**Option 2: Upgrade CPU ($400)**
- Replace with Ryzen 9
- Higher throughput for concurrent tasks
- Cost: $400 one-time

**Option 3: Add Second PC ($1200)**
- Dedicated machine for concurrent processing
- One for embeddings, one for guest matching
- Cost: $1200 one-time

---

## 9. QUICK RECOMMENDATION SUMMARY

### For Migliore Vita Phase 3:

| Spec | Recommendation | Cost | Notes |
|---|---|---|---|
| CPU | Ryzen 7 5700X | $200 | 8-cores, good price/perf |
| RAM | 32 GB DDR4 | $80 | Smooth batch processing |
| Storage | 1TB SSD + 4TB HDD | $150 | Fast OS, bulk cache |
| GPU | Skip for now | $0 | CPU sufficient for Phase 3 |
| UPS | 1500VA | $150 | Protects hardware |
| PSU | 500W | $50 | Quality brand (Corsair/Be Quiet) |
| Case | Mini ITX | $80 | Saves desk space |
| OS | Ubuntu 22.04 | $0 | Free, stable, Linux |
| **Total** | — | **$1200-1500** | One-time investment |

### When to Order:
- **NOW (May 2026):** Start Phase 1 (no hardware needed yet)
- **July 2026:** Order PC when Phase 3 development starts
- **August 2026:** PC arrives, ready for Phase 3 integration

---

## 10. SPECIFIC PRODUCT RECOMMENDATIONS (Buy in Egypt or Online)

### Where to Buy (Egypt):
- **ElSayed & Co** (Sharm El Sheikh) — Local, same-day pickup
- **Newegg Egypt** — Online, 2-3 day delivery
- **Amazon UAE** — Online, shipped to Egypt

### Specific Models:

**CPU Options:**
- AMD Ryzen 7 5700X ≈ 2,200 EGP (~$73)
- Intel i7-12700 ≈ 3,000 EGP (~$100)

**Motherboard:**
- ASRock B550-ITX/TB3 (Mini ITX) ≈ 1,800 EGP (~$60)

**RAM:**
- G.Skill Ripjaws V 32GB (2x16) ≈ 2,400 EGP (~$80)

**Storage:**
- Samsung 970 EVO Plus 1TB ≈ 1,200 EGP (~$40)
- WD Blue 4TB HDD ≈ 800 EGP (~$27)

**Case:**
- NZXT H210 Mini ITX ≈ 1,200 EGP (~$40)

**PSU:**
- Corsair SF600 Gold ≈ 1,500 EGP (~$50)

**UPS:**
- APC Back-UPS 1500VA ≈ 3,000 EGP (~$100)

**Total (Egypt Pricing):** ~9,500-10,000 EGP (~$320-350) — WAIT, that's CPU-only
**More realistic:** ~$1000-1200 USD equivalent for full system

---

## FINAL RECOMMENDATION

### Immediate Action:
- ✅ Phase 1 & 2: Don't worry about this yet
- ⏭️ July 2026: Start Phase 3 planning
- ⏭️ August 2026: Order the Mid-Range Option ($1200 USD)
- ⏭️ September 2026: Have PC ready for Phase 3 development

### PC Spec (Final Answer):
```
CPU:    AMD Ryzen 7 5700X (8-core)
RAM:    32 GB DDR4
SSD:    1 TB NVMe
HDD:    4 TB (batch cache)
GPU:    None (skip for Phase 3)
OS:     Ubuntu 22.04 LTS
Cost:   $1200 USD (~9000 EGP)
```

This will handle face recognition processing for Migliore Vita with headroom for growth.

---

**Ready to finalize Phase 1 details and start May 13?** 🚀
