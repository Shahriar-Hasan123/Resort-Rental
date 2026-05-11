const fs   = require('fs');
const path = require('path');

// GET /api/images 
// Reads all files from the images/ directory and returns their URLs as an array
const getImages = (req, res) => {

  const imageDir = path.join(__dirname, '..', 'images');

  // 1. Read all files from the images directory
  let files;
  try {
    files = fs.readdirSync(imageDir);
  } catch (err) {
    return res.status(500).json({
      error: 'Could not read images directory'
    });
  }

  // 2. Filter only image files (jpg, jpeg, png, webp)
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return allowedExtensions.includes(ext);
  });

  // 3. Build full URL path for each image
  const protocol = req.protocol;           // http or https
  const host     = req.get('host');        // localhost:3000

  const imageUrls = imageFiles.map(file => {
    return `${protocol}://${host}/images/${file}`;
  });

  // 4. Send response
  return res.status(200).json({
    count: imageUrls.length,
    images: imageUrls
  });

};

module.exports = { getImages };