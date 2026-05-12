// ─── Nearby Properties Section ────────────────────────────────────────────────
// Fetches properties from backend API based on selected sort option.
// Limit is determined by screen size: desktop=6, mobile=4

let lastFetchedItems = [];
const API_BASE_URL = 'http://localhost:3000/api';
const IMG_BASE_URL = 'https://beta.imgservice.rentbyowner.com/640x300/';

// ── DOM References ──
const sortSelect = document.getElementById('sort-select');
const propertyGrid = document.getElementById('property-grid');

// ── Booking platform logos ──
const LOGOS = {
    vrbo: 'assests/logo/vrbo.png',
    booking: 'assests/logo/booking.png',
    expedia: 'assests/logo/expedia.png',
};

const LOGO_ALTS = {
    vrbo: 'Book on Vrbo',
    booking: 'Book on Booking.com',
    expedia: 'Book on Expedia',
};

const LOGO_KEYS = ['vrbo', 'booking', 'expedia'];

// ── Get limit based on screen size ──
function getLimit() {
    return window.matchMedia('(max-width: 768px)').matches ? 4 : 6;
}

// ── Build API URL based on sort option and screen limit ──
function buildApiUrl(sortOption) {
    const limit = getLimit();
    return `${API_BASE_URL}/get-property?${sortOption}=true&limit=${limit}`;
}

// ── Format price as USD string ──
function formatPrice(price) {
    return '$' + Number(price).toLocaleString('en-US');
}

// ── Build single property card HTML ──
function buildPropertyCard(item, index) {
    const logoKey = LOGO_KEYS[index % LOGO_KEYS.length];

    // ── Extract fields from nested JSON structure ──
    const property = item.Property;
    const geoInfo = item.GeoInfo;
    const partner = item.Partner;

    const propertyId = item.ID;
    const name = property.PropertyName || 'Property Name';
    const type = property.PropertyType || 'Villa';
    const price = property.Price || property.CachePrice || null;
    const rating = property.ReviewScore || '5.0';
    const reviews = property.Counts?.Reviews || '0';
    const location = geoInfo.Display || '';
    const featureImg = property.FeatureImage || '';
    const bookingUrl = partner.CacheURL || '#';
    const imageUrl = `${IMG_BASE_URL}${featureImg}`;

    const amenities = property.TopAmenities
        ? property.TopAmenities.map(a => a.Name).join(' · ')
        : 'Air Conditioner · Balcony/Terrace';

    // ── Check if already favourited from localStorage ──
    const favourited = isFavourite(propertyId);

    return `
    <article class="property-card" data-id="${propertyId}">
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

          <!-- Heart / Favourite button -->
          <button
            type="button"
            class="favourite-btn ${favourited ? 'active' : ''}"
            aria-label="${favourited ? 'Remove from favourites' : 'Add to favourites'}"
            aria-pressed="${favourited}"
            data-property-id="${propertyId}"
          >
            <i class="${favourited ? 'fas' : 'far'} fa-heart"></i>
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
          <a
            href="${bookingUrl}"
            class="btn-availability"
            target="_blank"
            rel="noopener noreferrer"
          >
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
        const url = buildApiUrl(sortOption);
        const response = await fetch(url);

        if (!response.ok) throw new Error(`Server error: ${response.status}`);

        const data = await response.json();
        const items = data.items;

        jslastFetchedItems = items;

        if (!items || items.length === 0) {
            propertyGrid.innerHTML = '<p class="properties-error">No properties found.</p>';
            return;
        }

        // Render property cards
        propertyGrid.innerHTML = items
            .map((item, index) => buildPropertyCard(item, index))
            .join('');

        // Add markers — map may still be initializing
        if (typeof addMarkers === 'function') {
            addMarkers(items);
        }

        // Attach hover events
        attachCardHoverEvents(items);

    } catch (err) {
        console.error('Failed to fetch properties:', err);
        showError();
    }
}

// ── Attach hover events to property cards for marker highlighting ──
function attachCardHoverEvents(items) {
    items.forEach(item => {
        const propertyId = item.ID;
        const card = document.querySelector(
            `.property-card[data-id="${propertyId}"]`
        );

        if (!card) return;

        // Hover over card → highlight marker
        card.addEventListener('mouseenter', () => {
            if (typeof highlightMarker === 'function') {
                highlightMarker(propertyId);
            }
        });

        // Mouse leaves card → reset markers
        card.addEventListener('mouseleave', () => {
            if (typeof resetMarkers === 'function') {
                resetMarkers();
            }
        });
    });
}

// ── Sort dropdown change handler ──
sortSelect.addEventListener('change', () => {
    fetchProperties(sortSelect.value);
});

// ── Load Most Popular on page load ──
fetchProperties('most-popular');

// ── Listen for viewport size changes and re-fetch if breakpoint is crossed ──
const mediaQuery = window.matchMedia('(max-width: 768px)');
mediaQuery.addEventListener('change', () => {
    fetchProperties(sortSelect.value);
});

// ── Favourite button click handler (event delegation) ──
// Using delegation so it works even after cards are re-rendered
propertyGrid.addEventListener('click', (e) => {

    const btn = e.target.closest('.favourite-btn');
    if (!btn) return;

    const propertyId = btn.dataset.propertyId;
    const isNowFavourited = toggleFavourite(propertyId);
    const icon = btn.querySelector('i');

    if (isNowFavourited) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        btn.setAttribute('aria-label', 'Remove from favourites');
        icon.className = 'fas fa-heart'; // solid red heart
    } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
        btn.setAttribute('aria-label', 'Add to favourites');
        icon.className = 'far fa-heart'; // outline heart
    }

});