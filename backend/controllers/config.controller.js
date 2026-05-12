// ─── Config Controller ────────────────────────────────────────────────────────
// Serves sensitive config values from .env to the frontend.
// Never expose .env directly — always serve through an endpoint.

const getMapsKey = (req, res) => {

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: 'Google Maps API key is not configured'
    });
  }

  return res.status(200).json({ apiKey });
};

module.exports = { getMapsKey };