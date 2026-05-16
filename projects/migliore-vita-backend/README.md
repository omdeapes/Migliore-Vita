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