// ─── Nearby Properties Section ────────────────────────────────────────────────
const API_BASE_URL = 'http://localhost:3000/api';
const IMG_BASE_URL = 'https://beta.imgservice.rentbyowner.com/640x300/';

// ── DOM References ──
const sortSelect   = document.getElementById('sort-select');
const propertyGrid = document.getElementById('property-grid');

// ── Booking platform logos ──
const LOGOS = {
  vrbo    : 'assests/logo/vrbo.png',
  booking : 'assests/logo/booking.png',
  expedia : 'assests/logo/expedia.png',
};

const LOGO_ALTS = {
  vrbo    : 'Book on Vrbo',
  booking : 'Book on Booking.com',
  expedia : 'Book on Expedia',
};

const LOGO_KEYS = ['vrbo', 'booking', 'expedia'];

// ── Get limit based on screen size ──
function getLimit() {
  return window.innerWidth <= 768 ? 4 : 6;
}

// ── Build API URL ──
function buildApiUrl(sortOption) {
  const limit = getLimit();
  return `${API_BASE_URL}/get-property?${sortOption}=true&limit=${limit}`;
}

// ── Format price ──
function formatPrice(price) {
  return '$' + Number(price).toLocaleString('en-US');
}

// ── Build single property card HTML ──
function buildPropertyCard(item, index) {
  const logoKey = LOGO_KEYS[index % LOGO_KEYS.length];

  // ── Correct field names from JSON ──
  const property    = item.Property;
  const geoInfo     = item.GeoInfo;
  const partner     = item.Partner;

  const name        = property.PropertyName   || 'Property Name';
  const type        = property.PropertyType   || 'Villa';
  const price       = property.Price          || property.CachePrice || null;
  const rating      = property.ReviewScore    || '5.0';
  const reviews     = property.Counts?.Reviews || '0';
  const bedrooms    = property.Counts?.Bedroom || '—';
  const bathrooms   = property.Counts?.Bathroom || '—';
  const location    = geoInfo.Display         || '';
  const featureImg  = property.FeatureImage   || '';
  const bookingUrl  = partner.CacheURL        || '#';
  const imageUrl    = `${IMG_BASE_URL}${featureImg}`;

  // Top amenities
  const amenities = property.TopAmenities
    ? property.TopAmenities.map(a => a.Name).join(' · ')
    : 'Air Conditioner · Balcony/Terrace';

  return `
    <article class="property-card">
      <div class="property-img-wrap">
        <img
          src="${imageUrl}"
          alt="${name}"
          width="320"
          height="200"
          loading="lazy"
          onerror="this.src='assests/others/placeholder.jpg'"
        />
        ${price ? `<span class="price-tag">From ${formatPrice(price)}</span>` : ''}
        <div class="card-actions">
          <button type="button" aria-label="Share">
            <i class="fas fa-share-alt"></i>
          </button>
          <button type="button" aria-label="View on map">
            <i class="fas fa-map-marker-alt"></i>
          </button>
          <button type="button" aria-label="Save to wishlist">
            <i class="far fa-heart"></i>
          </button>
        </div>
      </div>
      <div class="property-body">
        <div class="property-meta">
          <span class="property-rating">
            <span class="star-icon">★</span> ${rating} (${reviews} Reviews)
          </span>
          <span class="property-type">${type}</span>
        </div>
        <h3 class="property-name">${name}</h3>
        <p class="property-amenities">${amenities}</p>
        <p class="property-location">${location}</p>
        <div class="property-footer">
          <img
            src="${LOGOS[logoKey]}"
            alt="${LOGO_ALTS[logoKey]}"
            class="booking-logo"
            height="20"
          />
          <a href="${bookingUrl}" class="btn-availability" target="_blank" rel="noopener noreferrer">
            View Availability
          </a>
        </div>
      </div>
    </article>
  `;
}

// ── Show loading state ──
function showLoading() {
  propertyGrid.innerHTML = '<p class="properties-loading">Loading properties...</p>';
}

// ── Show error state ──
function showError() {
  propertyGrid.innerHTML = '<p class="properties-error">Failed to load properties. Please try again.</p>';
}

// ── Fetch and render properties ──
async function fetchProperties(sortOption) {
  showLoading();

  try {
    const url      = buildApiUrl(sortOption);
    const response = await fetch(url);

    if (!response.ok) throw new Error(`Server error: ${response.status}`);

    const data  = await response.json();
    const items = data.items;

    if (!items || items.length === 0) {
      propertyGrid.innerHTML = '<p class="properties-error">No properties found.</p>';
      return;
    }

    propertyGrid.innerHTML = items
      .map((item, index) => buildPropertyCard(item, index))
      .join('');

  } catch (err) {
    console.error('Failed to fetch properties:', err);
    showError();
  }
}

// ── Sort dropdown change ──
sortSelect.addEventListener('change', () => {
  fetchProperties(sortSelect.value);
});

// ── Load Most Popular on page load ──
fetchProperties('most-popular');