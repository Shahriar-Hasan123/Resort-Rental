// ─── Google Maps Integration ──────────────────────────────────────────────────

const MAP_API_URL = 'http://localhost:3000/api/config/maps-key';

let map        = null;
let markers    = {};
let activeCard = null;
let activeMarker = null;

const DEFAULT_CENTER = { lat: 18.5063, lng: -68.3297 };
const DEFAULT_ZOOM   = 10;

// ── Default marker icon (green pin) ──
function getDefaultIcon() {
  return {
    url        : 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
    scaledSize : new google.maps.Size(32, 32),
    anchor     : new google.maps.Point(16, 32),
  };
}

// ── Active marker icon (orange pin — bigger) ──
function getActiveIcon() {
  return {
    url        : 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png',
    scaledSize : new google.maps.Size(44, 44),
    anchor     : new google.maps.Point(22, 44),
  };
}

// ── Initialize Google Map ──
function initMap() {
  const mapEl = document.getElementById('nearby-map');
  if (!mapEl) return;

  map = new google.maps.Map(mapEl, {
    center           : { lat: 37.0902, lng: -95.7129 },
    zoom             : 4,
    mapTypeControl   : false,
    streetViewControl: false,
    fullscreenControl: true,
  });

  // If properties already fetched before map initialized, add markers now
  if (typeof lastFetchedItems !== 'undefined' && lastFetchedItems.length > 0) {
    addMarkers(lastFetchedItems);
  }

}

// ── Clear all existing markers ──
function clearMarkers() {
  Object.values(markers).forEach(marker => marker.setMap(null));
  markers = {};
}

// ── Add markers for all fetched properties ──
function addMarkers(items) {
  if (!map) {
    console.warn('Map not initialized yet — retrying in 500ms');
    setTimeout(() => addMarkers(items), 500);
    return;
  }

  clearMarkers();

  const bounds    = new google.maps.LatLngBounds();
  let   validCount = 0;

  items.forEach(item => {
    const propertyId = item.ID;
    const lat        = parseFloat(item.GeoInfo?.Lat);
    const lng        = parseFloat(item.GeoInfo?.Lng);
    const name       = item.Property?.PropertyName || 'Property';

    if (isNaN(lat) || isNaN(lng)) {
      console.warn(`Skipping ${propertyId} — no valid coordinates`);
      return;
    }

    const position   = { lat, lng };
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="font-family:Arial,sans-serif;padding:4px 8px;">
          <strong style="font-size:13px;">${name}</strong>
        </div>
      `,
    });

    const marker = new google.maps.Marker({
      position,
      map,
      title: name,
      icon : getDefaultIcon(),
    });

    // Clicking marker → highlight marker + highlight card (toggle on second click)
    marker.addListener('click', () => {
      // If clicking the same marker again, deselect it
      if (activeMarker === marker) {
        marker.setIcon(getDefaultIcon());
        marker.setZIndex(null);
        activeMarker = null;
        clearCardHighlight();
        infoWindow.close();
        return;
      }

      // Reset previous active marker
      if (activeMarker) {
        activeMarker.setIcon(getDefaultIcon());
        activeMarker.setZIndex(null);
      }

      // Set this marker as active
      marker.setIcon(getActiveIcon());
      marker.setZIndex(999);
      activeMarker = marker;

      highlightCard(propertyId);
      infoWindow.open(map, marker);
    });

    markers[propertyId] = marker;
    bounds.extend(position);
    validCount++;
  });


  // Auto fit map to show all markers
  if (validCount > 0) {
    map.fitBounds(bounds);

    // Prevent too much zoom on single marker
    const listener = map.addListener('idle', () => {
      if (map.getZoom() > 14) map.setZoom(14);
      google.maps.event.removeListener(listener);
    });
  }
}

// ── Highlight marker on card hover ──
function highlightMarker(propertyId) {
  // Reset all to default
  Object.values(markers).forEach(m => {
    m.setIcon(getDefaultIcon());
    m.setZIndex(null);
  });

  // Highlight hovered marker
  if (markers[propertyId]) {
    markers[propertyId].setIcon(getActiveIcon());
    markers[propertyId].setZIndex(999);
  }
}

// ── Reset all markers to default ──
function resetMarkers() {
  Object.values(markers).forEach(m => {
    m.setIcon(getDefaultIcon());
    m.setZIndex(null);
  });
}

// ── Highlight property card on marker click ──
function highlightCard(propertyId) {
  if (activeCard) {
    activeCard.classList.remove('card-highlighted');
  }

  const card = document.querySelector(`.property-card[data-id="${propertyId}"]`);

  if (card) {
    card.classList.add('card-highlighted');
    activeCard = card;
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// ── Clear card highlight ──
function clearCardHighlight() {
  if (activeCard) {
    activeCard.classList.remove('card-highlighted');
    activeCard = null;
  }
}

// ── Load Google Maps API key from backend then inject script ──
async function loadGoogleMaps() {
  try {
    const response = await fetch(MAP_API_URL);

    if (!response.ok) throw new Error(`API key fetch failed: ${response.status}`);

    const { apiKey } = await response.json();

    if (!apiKey) throw new Error('API key is empty');

    // Inject Google Maps script dynamically
    const script    = document.createElement('script');
    script.src      = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&loading=async`;
    script.async    = true;
    script.defer    = true;
    script.onerror  = () => {
      console.error('Google Maps script failed to load — check your API key');
      document.getElementById('nearby-map').innerHTML =
        '<p style="padding:20px;text-align:center;color:#666;">Map unavailable</p>';
    };

    document.head.appendChild(script);

  } catch (err) {
    console.error('loadGoogleMaps error:', err);
    document.getElementById('nearby-map').innerHTML =
      '<p style="padding:20px;text-align:center;color:#666;">Map unavailable</p>';
  }
}

// ── Make initMap globally available (required by Google Maps callback) ──
window.initMap = initMap;

// ── Start ──
loadGoogleMaps();