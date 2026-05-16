const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');

const { requireAuth, requireRole } = require('../middleware/auth');
const Invoice = require('../models/invoice');
const Trip = require('../models/trip');
const Media = require('../models/media');
const logger = require('../config/logger');

// All admin routes require auth
router.use(requireAuth);

// ── Dashboard ──────────────────────────────────────────────────────────────

// GET /v1/admin/dashboard/stats
router.get('/dashboard/stats', requireRole('admin', 'accountant', 'support'), async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      tripsToday,
      tripsActive,
      invoicesToday,
      invoicesPending,
      mediaPending,
    ] = await Promise.all([
      Trip.count({ where: { tripDate: today } }),
      Trip.count({ where: { status: 'in_progress' } }),
      Invoice.count({ where: { createdAt: { [Op.between]: [today, tomorrow] } } }),
      Invoice.count({ where: { status: 'draft' } }),
      Media.count({ where: { uploadStatus: 'pending' } }),
    ]);

    // Revenue today
    const revenueResult = await Invoice.sum('totalAmount', {
      where: { createdAt: { [Op.between]: [today, tomorrow] } },
    });

    // Recent invoices
    const recentInvoices = await Invoice.findAll({
      order: [['createdAt', 'DESC']],
      limit: 10,
    });

    res.json({
      tripsToday,
      tripsActive,
      invoicesToday,
      invoicesPending,
      mediaPending,
      revenueToday: revenueResult || 0,
      recentInvoices,
    });
  } catch (err) {
    next(err);
  }
});

// ── Trips ──────────────────────────────────────────────────────────────────

// GET /v1/admin/trips
router.get('/trips', requireRole('admin', 'accountant', 'support'), async (req, res, next) => {
  try {
    const { status, date_from, date_to } = req.query;
    const where = {};

    if (status) where.status = status;
    if (date_from || date_to) {
      where.tripDate = {};
      if (date_from) where.tripDate[Op.gte] = date_from;
      if (date_to) where.tripDate[Op.lte] = date_to;
    }

    const trips = await Trip.findAll({
      where,
      order: [['tripDate', 'DESC']],
    });

    res.json({ trips });
  } catch (err) {
    next(err);
  }
});

// POST /v1/admin/trips — Create new trip (admin only)
router.post('/trips', requireRole('admin'), async (req, res, next) => {
  try {
    const { trip_date, safari_center, guide_id, guide_name, notes } = req.body;

    if (!trip_date || !safari_center) {
      return res.status(400).json({ error: 'trip_date and safari_center are required' });
    }

    const trip = await Trip.create({
      tripDate: trip_date,
      safariCenter: safari_center,
      guideId: guide_id,
      guideName: guide_name,
      notes,
      createdByAdminId: req.user.user_id,
    });

    logger.info(`Trip created: ${trip.id} for ${trip_date}`);
    res.status(201).json({ trip });
  } catch (err) {
    next(err);
  }
});

// GET /v1/admin/trips/:id
router.get('/trips/:id', requireRole('admin', 'accountant', 'support'), async (req, res, next) => {
  try {
    const trip = await Trip.findByPk(req.params.id, {
      include: [{ model: Invoice }],
    });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.json({ trip });
  } catch (err) {
    next(err);
  }
});

// ── Invoices ───────────────────────────────────────────────────────────────

// GET /v1/admin/invoices
router.get('/invoices', requireRole('admin', 'accountant', 'support'), async (req, res, next) => {
  try {
    const {
      status,
      photographer_id,
      date_from,
      date_to,
      search,
      page = 1,
      limit = 25,
    } = req.query;

    const where = {};
    const offset = (parseInt(page) - 1) * parseInt(limit);

    if (status) where.status = status;
    if (photographer_id) where.photographerId = photographer_id;

    if (date_from || date_to) {
      where.createdAt = {};
      if (date_from) where.createdAt[Op.gte] = new Date(date_from);
      if (date_to) where.createdAt[Op.lte] = new Date(date_to + 'T23:59:59');
    }

    if (search) {
      where[Op.or] = [
        { guestName: { [Op.iLike]: `%${search}%` } },
        { serialNumber: { [Op.iLike]: `%${search}%` } },
        { guestContact: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows: invoices } = await Invoice.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    res.json({
      invoices,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit)),
    });
  } catch (err) {
    next(err);
  }
});

// GET /v1/admin/invoices/:id
router.get('/invoices/:id', requireRole('admin', 'accountant', 'support'), async (req, res, next) => {
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

// POST /v1/admin/invoices/:id/deliver — Manually resend delivery
router.post('/invoices/:id/deliver', requireRole('admin', 'support'), async (req, res, next) => {
  try {
    const { channel } = req.body; // whatsapp, telegram, email
    const invoice = await Invoice.findByPk(req.params.id, {
      include: [{ model: Media }],
    });

    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

    // TODO: Trigger actual delivery (Sprint 5-6)
    logger.info(`Manual delivery triggered: ${invoice.serialNumber} via ${channel} by ${req.user.email}`);

    res.json({
      message: `Delivery queued via ${channel}`,
      invoice_id: invoice.id,
      channel,
    });
  } catch (err) {
    next(err);
  }
});

// ── Media ──────────────────────────────────────────────────────────────────

// GET /v1/admin/media
router.get('/media', requireRole('admin', 'support'), async (req, res, next) => {
  try {
    const { status, invoice_id, limit = 50, page = 1 } = req.query;
    const where = {};
    if (status) where.uploadStatus = status;
    if (invoice_id) where.invoiceId = invoice_id;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows: media } = await Media.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    res.json({ media, total: count });
  } catch (err) {
    next(err);
  }
});

// POST /v1/admin/media/:id/deliver
router.post('/media/:id/deliver', requireRole('admin', 'support'), async (req, res, next) => {
  try {
    const media = await Media.findByPk(req.params.id, {
      include: [{ model: Invoice }],
    });

    if (!media) return res.status(404).json({ error: 'Media not found' });

    // TODO: Re-trigger Google Drive share + notification
    logger.info(`Media re-delivery: ${media.id}`);
    res.json({ message: 'Re-delivery queued', media_id: media.id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
