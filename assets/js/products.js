/* ---------- CART ---------- */
const addToCart = (name, price) => {
  const cart = JSON.parse(localStorage.getItem('mcCart') || '[]');
  cart.push({ name, price, qty: 1 });
  localStorage.setItem('mcCart', JSON.stringify(cart));
  updateCartBadge();
  /* tiny haptic + toast could go here */
};

const updateCartBadge = () => {
  const badge = document.querySelector('.cart-badge');
  const qty   = JSON.parse(localStorage.getItem('mcCart') || '[]').length;
  if (badge) badge.textContent = qty || '';
};
/* init on load */
updateCartBadge();

/* ---------- OFFER COUNTDOWN ---------- */
document.querySelectorAll('.offer-timer').forEach(el => {
  const dur = 2 * 60 * 60 * 1000; // 2 hrs demo
  const end = Date.now() + dur;
  const tick = () => {
    const rem = Math.max(0, end - Date.now());
    if (rem === 0) { el.textContent = 'Expired'; return; }
    const h = String(Math.floor(rem / 3600000)).padStart(2, '0');
    const m = String(Math.floor((rem % 3600000) / 60000)).padStart(2, '0');
    const s = String(Math.floor((rem % 60000) / 1000)).padStart(2, '0');
    el.textContent = `⏰ ${h}:${m}:${s}`;
    requestAnimationFrame(tick);
  };
  tick();
});