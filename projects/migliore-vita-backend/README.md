# MiglioreVita Backend

## Setup
1. Install Node.js (v18+).
2. Run `npm install` (debug dependencies separately).
3. Start server: `node src/app.js`.

## Structure
```
/src
  ├── app.js            # Express server
  ├── routes/          # API endpoints
  ├── controllers/     # Business logic
  ├── models/          # Data models
  ├── services/        # Sync/DB services
  └── config/          # Environment configs
```

## API Endpoints
- `GET /products`      # List products
- `POST /sales`        # Create sale
- `POST /sync`         # Mobile sync

## Database Changes

### Manual Updates
- **2026-05-18**: Added `photographer_id` column to the `invoices` table to resolve a backend error:
  ```sql
  ALTER TABLE invoices ADD COLUMN photographer_id INTEGER;
  ```
  This change was applied manually to the PostgreSQL database. The corresponding migration (`migrations/20260517234558-add-photographer-id-to-invoices.js`) was created but not executed due to authentication issues.