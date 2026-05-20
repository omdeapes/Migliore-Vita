const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');

const { requireAuth, requireRole } = require('../middleware/auth');
const models = require('../models');
const { Invoice, Trip, Media, User } = models;
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
      order: [['trip_date', 'DESC']]
      // Temporarily removed include clause to test association
    });

    res.json({ trips });
  } catch (err) {
    next(err);
  }
});

// POST /v1/admin/trips — Create new trip (admin only)
router.post('/trips', requireRole('admin', 'accountant', 'support'), async (req, res, next) => {
  try {
    const { v4: uuidv4 } = require('uuid');
    const { trip_date, safari_center, guide_name, status, photographerIds } = req.body;

    console.log('Creating trip with:', { trip_date, safari_center, guide_name, status, photographerIds });

    if (!trip_date || !safari_center) {
      return res.status(400).json({ error: 'trip_date and safari_center are required' });
    }

    const trip = await Trip.create({
      id: uuidv4(),
      tripDate: trip_date,
      safariCenter: safari_center,
      guideName: guide_name || null,
      status: status || 'pending',
    });
    
    if (photographerIds && Array.isArray(photographerIds) && photographerIds.length > 0) {
      await trip.setPhotographers(photographerIds);
    }

    const createdTrip = await Trip.findByPk(trip.id, {
      include: [{ model: User, as: 'photographers', attributes: ['id', 'name'] }]
    });

    console.log('Trip created successfully:', trip.id);
    logger.info(`Trip created: ${trip.id} for ${trip_date}`);
    res.status(201).json({ trip: createdTrip });
  } catch (err) {
    console.error('Error creating trip:', err);
    console.trace('Stack trace:');
    logger.error('Error creating trip:', err);
    next(err);
  }
});

// GET /v1/admin/trips/:id
router.get('/trips/:id', requireRole('admin', 'accountant', 'support'), async (req, res, next) => {
  try {
    const { id } = req.params;
    // Basic UUID validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({ error: 'Invalid UUID format for trip ID' });
    }

    const trip = await Trip.findByPk(id, {
      include: [
        { model: Invoice },
        { model: User, as: 'photographers', attributes: ['id', 'name', 'email'] }
      ],
    });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.json({ trip });
  } catch (err) {
    next(err);
  }
});

router.patch('/trips/:id', requireRole('admin'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({ error: 'Invalid UUID format for trip ID' });
    }

    const trip = await Trip.findByPk(id);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    
    await trip.update({
      tripDate: req.body.tripDate !== undefined ? req.body.tripDate : trip.tripDate,
      safariCenter: req.body.safariCenter !== undefined ? req.body.safariCenter : trip.safariCenter,
      guideName: req.body.guideName !== undefined ? req.body.guideName : trip.guideName,
      status: req.body.status !== undefined ? req.body.status : trip.status,
      participants: req.body.participants !== undefined ? req.body.participants : trip.participants,
      featured: req.body.featured !== undefined ? req.body.featured : trip.featured
    });
    
    if (req.body.photographerIds && Array.isArray(req.body.photographerIds)) {
      await trip.setPhotographers(req.body.photographerIds);
    }
    
    const updatedTrip = await Trip.findByPk(trip.id, {
      include: [{ model: User, as: 'photographers', attributes: ['id', 'name'] }]
    });
    
    res.json(updatedTrip);
  } catch (err) {
    next(err);
  }
});

// DELETE /v1/admin/trips/:id
router.delete('/trips/:id', requireRole('admin'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({ error: 'Invalid UUID format for trip ID' });
    }

    const trip = await Trip.findByPk(id);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    await trip.destroy();
    res.json({ message: 'Trip deleted successfully' });
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


// --- Photographers API ---
router.get('/photographers', requireRole('admin', 'accountant', 'support'), async (req, res, next) => {
  try {
    const users = await User.findAll({ where: { role: 'photographer' } });
    res.json(users);
  } catch (err) { next(err); }
});

router.get('/photographers/:id', requireRole('admin', 'accountant', 'support'), async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user || user.role !== 'photographer') return res.status(404).json({ error: 'Photographer not found' });
    res.json(user);
  } catch (err) { next(err); }
});

router.post('/photographers', requireRole('admin'), async (req, res, next) => {
  try {
    const payload = req.body;
    payload.role = 'photographer';
    const user = await User.create(payload);
    res.status(201).json(user);
  } catch (err) { next(err); }
});

router.patch('/photographers/:id', requireRole('admin'), async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user || user.role !== 'photographer') return res.status(404).json({ error: 'Photographer not found' });
    
    // Prevent role escalation
    delete req.body.role;
    
    await user.update(req.body);
    res.json(user);
  } catch (err) { next(err); }
});

router.delete('/photographers/:id', requireRole('admin'), async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user || user.role !== 'photographer') return res.status(404).json({ error: 'Photographer not found' });
    
    await user.destroy();
    res.json({ message: 'Photographer deleted successfully' });
  } catch (err) { next(err); }
});
// -------------------------

module.exports = router;
