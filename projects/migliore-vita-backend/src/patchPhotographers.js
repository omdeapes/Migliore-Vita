const fs = require('fs');
const path = require('path');
const adminPath = path.join(__dirname, 'routes', 'admin.js');
let content = fs.readFileSync(adminPath, 'utf8');

if (!content.includes("router.get('/photographers'")) {
  const patchRoutes = `
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
// -------------------------
`;

  // Find module.exports = router; and insert right above it
  const markerIndex = content.lastIndexOf('module.exports = router;');
  if (markerIndex !== -1) {
    content = content.slice(0, markerIndex) + patchRoutes + '\n' + content.slice(markerIndex);
    fs.writeFileSync(adminPath, content);
    console.log("Photographers CRUD injected successfully.");
  }
} else {
  console.log("Photographer routes already exist.");
}
