require('dotenv').config();

const express        = require('express');
const cors           = require('cors');
const path           = require('path');
const propertyRoutes = require('./routes/property.route');
const imageRoutes    = require('./routes/image.route');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware 
app.use(cors());
app.use(express.json());

// ─── Serve Static Image Files 
app.use('/images', express.static(path.join(__dirname, 'images')));

// ─── Connect Routes 
app.use('/api', propertyRoutes);
app.use('/api', imageRoutes);

// ─── Start Server 
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});