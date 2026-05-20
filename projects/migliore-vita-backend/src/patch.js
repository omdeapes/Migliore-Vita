const fs = require('fs');
const path = require('path');
const adminPath = path.join(__dirname, 'routes', 'admin.js');
let content = fs.readFileSync(adminPath, 'utf8');

if (!content.includes("router.patch('/trips/:id'")) {
  const patchRoute = `
router.patch('/trips/:id', requireRole('admin'), async (req, res, next) => {
  try {
    const trip = await Trip.findByPk(req.params.id);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    
    await trip.update({
      name: req.body.name !== undefined ? req.body.name : trip.name,
      description: req.body.description !== undefined ? req.body.description : trip.description,
      location: req.body.location !== undefined ? req.body.location : trip.location,
      isActive: req.body.isActive !== undefined ? req.body.isActive : trip.isActive
    });
    
    res.json(trip);
  } catch (err) {
    next(err);
  }
});
`;

  // Find the end of the GET /trips/:id route to insert after it
  const marker = "router.get('/trips/:id', requireRole('admin', 'accountant', 'support'), async (req, res, next) => {";
  const markerIndex = content.indexOf(marker);
  
  if (markerIndex !== -1) {
    // Find the closing brace of that route
    let braceCount = 0;
    let i = markerIndex;
    let foundStart = false;
    
    while (i < content.length) {
      if (content[i] === '{') {
        braceCount++;
        foundStart = true;
      } else if (content[i] === '}') {
        braceCount--;
      }
      
      if (foundStart && braceCount === 0) {
        // Find the trailing semicolon or newline
        const endOfRoute = content.indexOf('});', i);
        if (endOfRoute !== -1) {
          content = content.slice(0, endOfRoute + 3) + '\n' + patchRoute + content.slice(endOfRoute + 3);
          fs.writeFileSync(adminPath, content);
          console.log("PATCH /trips/:id route injected successfully.");
          break;
        }
      }
      i++;
    }
  }
} else {
  console.log("Route already exists.");
}
