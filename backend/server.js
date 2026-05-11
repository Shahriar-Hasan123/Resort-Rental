require('dotenv').config();

const express        = require('express');
const propertyRoutes = require('./routes/property.route');
const imageRoutes    = require('./routes/image.route');

const app  = express();
const PORT = process.env.PORT || 3000;

// Serve Static Image Files
// Makes files in /images folder accessible via http://localhost:3000/images/image1.jpg
app.use('/images', express.static('images'));

// Connect Routes
app.use('/api', propertyRoutes);
app.use('/api', imageRoutes);

// Start Server 
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});