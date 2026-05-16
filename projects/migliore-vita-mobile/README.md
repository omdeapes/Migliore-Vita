# Migliore Vita Mobile App
## Flutter Photographer App — Offline-First POS

**Tech Stack:** Flutter 3.22 + Dart 3.4 + Realm 1.0 + Provider 6.2 + Dio 5.3  
**Target:** iOS (iPhone 12+) + Android (Samsung Galaxy A50+)

---

## Getting Started

### Prerequisites
- Flutter 3.22.0 (`flutter --version`)
- Dart 3.4.0
- Android Studio OR Xcode (for simulator)

### Setup
```bash
# Install dependencies
flutter pub get

# Generate Realm schemas
dart run build_runner build

# Run on simulator
flutter run

# Run tests
flutter test
```

### Configuration
Copy `assets/config.example.json` → `assets/config.json` and fill in:
- API base URL (dev: `http://localhost:3000/v1`)
- Device API key (get from admin)

---

## Architecture

```
lib/
├── config/          # App config, router, themes
├── models/          # Realm models (offline database schemas)
├── services/        # Business logic (API, sync, camera)
├── providers/       # State management (Provider)
├── screens/         # UI screens
│   ├── auth/        # Login
│   ├── trips/       # Trip list + detail
│   ├── invoices/    # Invoice list, create, detail
│   ├── media/       # Camera + file picker
│   └── settings/    # App settings
├── widgets/         # Reusable UI components
└── utils/           # Helpers
```

## Key Features
- ✅ **Offline-first**: Works without internet (Realm local DB)
- ✅ **Invoice creation**: Offline, instant serial number generation
- ✅ **Media capture**: Camera + file picker
- ✅ **Manual sync**: One-button upload when WiFi available
- ✅ **Zero data loss**: SyncQueue ensures all data eventually syncs

## Serial Number Format
```
TRIP-{DATE}-PHOTO-{ID}-{SEQUENCE}
Example: TRIP-20260511-PHOTO-001-0025
```

---

## Development Workflow
1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes, write tests
3. Run tests: `flutter test`
4. Push PR → Mohammed reviews → merge

## Sprint 1 (Week 1) Checklist
- [x] Flutter project structure created
- [x] Realm schemas (Invoice, Trip, Media, SyncQueue)
- [x] Provider state management
- [x] Navigation (go_router)
- [ ] Run on device/simulator
- [ ] Connect to backend
