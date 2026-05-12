// ─── Favourites Manager ───────────────────────────────────────────────────────
// Handles storing, retrieving, and toggling favourite properties.
// Uses localStorage for persistence across page reloads.
// Storage key: 'favouriteProperties' → Array of property IDs

const STORAGE_KEY = 'favouriteProperties';

// ── Get all favourites from localStorage ──
function getFavourites() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

// ── Save favourites array to localStorage ──
function saveFavourites(favourites) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
}

// ── Check if a property is favourited ──
function isFavourite(propertyId) {
  return getFavourites().includes(propertyId);
}

// ── Add a property to favourites ──
function addFavourite(propertyId) {
  const favourites = getFavourites();
  if (!favourites.includes(propertyId)) {
    favourites.push(propertyId);
    saveFavourites(favourites);
  }
}

// ── Remove a property from favourites ──
function removeFavourite(propertyId) {
  const favourites = getFavourites().filter(id => id !== propertyId);
  saveFavourites(favourites);
}

// ── Toggle favourite state ──
function toggleFavourite(propertyId) {
  if (isFavourite(propertyId)) {
    removeFavourite(propertyId);
    return false; // removed
  } else {
    addFavourite(propertyId);
    return true;  // added
  }
}