require('dotenv').config();

const express        = require('express');
const cors           = require('cors');
const path           = require('path');
const propertyRoutes = require('./routes/property.route');
const imageRoutes    = require('./routes/image.route');
const configRoutes   = require('./routes/config.route');   

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware 
app.use(cors());
app.use(express.json());

// ─── Static Files 
app.use('/images', express.static(path.join(__dirname, 'images')));

// ─── Routes
app.use('/api', propertyRoutes);
app.use('/api', imageRoutes);
app.use('/api', configRoutes);                             

// ─── Start Server 
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});