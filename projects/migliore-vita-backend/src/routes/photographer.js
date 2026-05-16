const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');

const { requireAuth } = require('../middleware/auth');
const Invoice = require('../models/invoice');
const Trip = require('../models/trip');
const Media = require('../models/media');
const logger = require('../config/logger');

// All photographer routes require auth
router.use(requireAuth);

// ── Trips ─────────────────────────────────────────────────────────────────

// GET /v1/trips — Get assigned trips for this photographer
router.get('/trips', async (req, res, next) => {
  try {
    // TODO: Filter by assigned photographer (from device ID / API key)
    const trips = await Trip.findAll({
      where: { status: ['pending', 'in_progress'] },
      order: [['tripDate', 'DESC']],
      limit: 20,
    });

    res.json({ trips });
  } catch (err) {
    next(err);
  }
});

// ── Invoices ───────────────────────────────────────────────────────────────

const createInvoiceSchema = Joi.object({
  id: Joi.string().uuid().required(),
  trip_id: Joi.string().required(),
  photographer_id: Joi.string().required(),
  serial_number: Joi.string().max(100).required(),
  serial_sequence: Joi.number().integer().optional(),
  guest_name: Joi.string().max(255).required(),
  guest_contact: Joi.string().max(255).required(),
  guest_hotel: Joi.string().max(255).allow('', null),
  guest_room: Joi.string().max(50).allow('', null),
  total_amount: Joi.number().min(0).required(),
  currency: Joi.string().length(3).default('EGP'),
  created_at_local: Joi.string().isoDate().required(),
  device_id: Joi.string().max(255).optional(),
});

// POST /v1/invoices — Create invoice (sync from photographer app)
router.post('/invoices', async (req, res, next) => {
  try {
    const { error, value } = createInvoiceSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check for duplicate serial (idempotent sync)
    const existing = await Invoice.findOne({
      where: { serialNumber: value.serial_number },
    });

    if (existing) {
      logger.info(`Invoice already exists: ${value.serial_number}`);
      return res.status(200).json({
        message: 'Invoice already exists',
        invoice: existing,
      });
    }

    const invoice = await Invoice.create({
      id: value.id,
      tripId: value.trip_id,
      photographerId: value.photographer_id,
      serialNumber: value.serial_number,
      serialSequence: value.serial_sequence,
      guestName: value.guest_name,
      guestContact: value.guest_contact,
      guestHotel: value.guest_hotel,
      guestRoom: value.guest_room,
      totalAmount: value.total_amount,
      currency: value.currency,
      createdAtLocal: value.created_at_local,
      syncedAt: new Date(),
      deviceId: value.device_id,
      status: 'finalized',
    });

    logger.info(`Invoice created: ${invoice.serialNumber}`);
    return res.status(201).json({ invoice });
  } catch (err) {
    next(err);
  }
});

// GET /v1/invoices/:id
router.get('/invoices/:id', async (req, res, next) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id, {
      include: [{ model: Media }],
    });
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.json({ invoice });
  } catch (err) {
    next(err);
  }
});

// ── Media Upload ───────────────────────────────────────────────────────────

const multer = require('multer');
const upload = multer({
  dest: '/tmp/uploads/',
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'video/mp4', 'video/quicktime'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type not allowed: ${file.mimetype}`));
    }
  },
});

// POST /v1/media/upload
router.post('/media/upload', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { invoice_id, media_type } = req.body;
    if (!invoice_id || !media_type) {
      return res.status(400).json({ error: 'invoice_id and media_type required' });
    }

    // TODO: Upload to S3 + Google Drive (Sprint 5-6)
    // For now, store metadata
    const media = await Media.create({
      id: uuidv4(),
      invoiceId: invoice_id,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      mediaType: media_type,
      uploadStatus: 'pending', // Will update after S3 upload
    });

    // Update invoice media count
    await Invoice.increment('mediaCount', { where: { id: invoice_id } });

    logger.info(`Media uploaded: ${media.id} for invoice ${invoice_id}`);
    res.status(201).json({
      media: {
        id: media.id,
        google_drive_id: null, // Will be set after processing
        message: 'Media received, processing...',
      },
    });
  } catch (err) {
    next(err);
  }
});

// ── Sync Endpoint ──────────────────────────────────────────────────────────

// POST /v1/sync — Batch sync multiple items at once
router.post('/sync', async (req, res, next) => {
  try {
    const { invoices = [], media = [] } = req.body;
    const results = {
      invoices: { success: 0, failed: 0, errors: [] },
      media: { success: 0, failed: 0, errors: [] },
    };

    // Process invoices
    for (const inv of invoices) {
      try {
        const existing = await Invoice.findOne({
          where: { serialNumber: inv.serial_number },
        });
        if (!existing) {
          await Invoice.create({
            id: inv.id || uuidv4(),
            tripId: inv.trip_id,
            photographerId: inv.photographer_id,
            serialNumber: inv.serial_number,
            serialSequence: inv.serial_sequence,
            guestName: inv.guest_name,
            guestContact: inv.guest_contact,
            guestHotel: inv.guest_hotel,
            totalAmount: inv.total_amount,
            currency: inv.currency || 'EGP',
            createdAtLocal: inv.created_at_local,
            syncedAt: new Date(),
            status: 'finalized',
          });
        }
        results.invoices.success++;
      } catch (err) {
        results.invoices.failed++;
        results.invoices.errors.push({ id: inv.id, error: err.message });
      }
    }

    logger.info(`Sync complete: ${results.invoices.success} invoices, ${results.media.success} media`);
    res.json({ results });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
