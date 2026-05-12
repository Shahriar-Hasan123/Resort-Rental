const path = require('path');
const fs   = require('fs');

const getProperty = (req, res) => {

  const query = req.query;

  // 1. Decide which file to load based on query param
  let fileName = null;

  if (query['most-popular'] === 'true') {
    fileName = 'most_popular.json';
  } else if (query['highest-price'] === 'true') {
    fileName = 'highest_price.json';
  } else if (query['lowest-price'] === 'true') {
    fileName = 'lowest_price.json';
  }

  // 2. If no valid param given, return error
  if (!fileName) {
    return res.status(400).json({
      error: 'Provide one of: most-popular=true, highest-price=true, lowest-price=true'
    });
  }

  // 3. Read the JSON file from disk
  const filePath = path.join(__dirname, '..', 'data', fileName);

  let rawData;
  try {
    rawData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (err) {
    return res.status(404).json({
      error: `Could not read file: ${fileName}`
    });
  }

  // 4. Extract items from nested structure: { Result: { Items: [...] } }
  let items = rawData.Result.Items;

  // 5. Apply limit if provided
  const limit = parseInt(query['limit']);
  if (!isNaN(limit) && limit > 0) {
    items = items.slice(0, limit);
  }

  // 6. Send response
  return res.status(200).json({
    count: items.length,
    items: items
  });

};

module.exports = { getProperty };