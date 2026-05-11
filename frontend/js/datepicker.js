const PRICE_PER_NIGHT = 2026;

const checkInInput = document.getElementById('checkin');
const checkOutInput = document.getElementById('checkout');
const statusBox = document.getElementById('status-box');
const pricePerNight = document.getElementById('price-per-night');
const totalPriceEl = document.getElementById('total-price');

const hiddenInput = document.getElementById('rangePicker');

const picker = new HotelDatepicker(hiddenInput, {
  minNights    : 1,
  selectForward: true,
  format       : 'MMM D, YYYY',
  startDate    : new Date(),       // ← only this line added

  onSelectRange: function() {
    const range = hiddenInput.value;
    if (!range) return;

    const dates    = range.split(' - ');
    const checkIn  = dates[0];
    const checkOut = dates[1];

    checkInInput.value  = checkIn;
    checkOutInput.value = checkOut;

    const start  = new Date(checkIn);
    const end    = new Date(checkOut);
    const nights = Math.round((end - start) / (1000 * 60 * 60 * 24));
    const total  = nights * PRICE_PER_NIGHT;

    pricePerNight.textContent = 'USD $' + PRICE_PER_NIGHT.toLocaleString('en-US');
    totalPriceEl.textContent  = 'USD $' + total.toLocaleString('en-US');
    statusBox.style.display   = 'flex';
  }
});

checkInInput.addEventListener('click', () => {
  hiddenInput.click();
});

checkOutInput.addEventListener('click', () => {
  hiddenInput.click();
});