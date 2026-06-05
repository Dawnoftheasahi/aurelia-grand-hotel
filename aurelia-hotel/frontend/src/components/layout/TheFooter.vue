<template>
  <footer class="footer" role="contentinfo">
    <div class="footer-main">
      <div class="container footer-grid">
        <!-- Brand -->
        <div class="footer-brand">
          <div class="footer-logo">
            <span class="logo-mark">✦</span>
            <div>
              <p class="logo-name">The Aurelia Grand</p>
              <p class="logo-tagline">Luxury Collection</p>
            </div>
          </div>
          <p class="footer-desc">An unrivalled sanctuary of elegance and indulgence. Where every detail is crafted to create moments that last a lifetime.</p>
          <div class="footer-social">
            <a href="#" class="social-link" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
            </a>
            <a href="#" class="social-link" aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" class="social-link" aria-label="Twitter">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.43.36a9 9 0 0 1-2.86 1.1A4.52 4.52 0 0 0 16.11 0c-2.5 0-4.52 2.02-4.52 4.52 0 .35.04.7.11 1.03A12.83 12.83 0 0 1 2.1.9a4.52 4.52 0 0 0 1.4 6.03 4.48 4.48 0 0 1-2.04-.57v.06a4.52 4.52 0 0 0 3.62 4.43 4.54 4.54 0 0 1-2.04.08 4.52 4.52 0 0 0 4.22 3.14A9.06 9.06 0 0 1 0 19.54a12.8 12.8 0 0 0 6.93 2.03c8.32 0 12.87-6.9 12.87-12.87 0-.2 0-.39-.01-.58A9.2 9.2 0 0 0 22 5.9a9.04 9.04 0 0 1-2.6.71A4.53 4.53 0 0 0 21.4 3H23z"/></svg>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="footer-col">
          <h4 class="footer-heading">Explore</h4>
          <ul class="footer-links">
            <li><RouterLink to="/rooms">Rooms &amp; Suites</RouterLink></li>
            <li><RouterLink to="/services">Hotel Services</RouterLink></li>
            <li><RouterLink to="/services#dining">Fine Dining</RouterLink></li>
            <li><RouterLink to="/services#spa">Spa &amp; Wellness</RouterLink></li>
            <li><RouterLink to="/services#events">Events</RouterLink></li>
          </ul>
        </div>

        <!-- Guest Services -->
        <div class="footer-col">
          <h4 class="footer-heading">Guest Services</h4>
          <ul class="footer-links">
            <li><RouterLink to="/booking">Make a Reservation</RouterLink></li>
            <li><RouterLink to="/dashboard">Manage Bookings</RouterLink></li>
            <li><RouterLink to="/history">Booking History</RouterLink></li>
            <li><a href="#">Loyalty Programme</a></li>
            <li><a href="#">Special Offers</a></li>
          </ul>
        </div>

        <!-- Contact -->
        <div class="footer-col">
          <h4 class="footer-heading">Contact</h4>
          <ul class="footer-contact">
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>1 Grand Avenue, Melbourne VIC 3000, Australia</span>
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8a16 16 0 0 0 6 6l.93-.93a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 15l.19 1.92z"/></svg>
              <span>+61 3 9000 1234</span>
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <span>reservations@aureliagrand.com</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="container footer-bottom-inner">
        <p>© {{ new Date().getFullYear() }} The Aurelia Grand Hotel. All rights reserved.</p>
        <div class="footer-legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms &amp; Conditions</a>
          <a href="#">Cookie Policy</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup></script>

<style scoped>
.footer { background: var(--color-navy); color: rgba(255,255,255,0.75); }

.footer-main { padding: var(--space-16) 0 var(--space-12); }
.footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: var(--space-10); }
@media (max-width: 1024px) { .footer-grid { grid-template-columns: 1fr 1fr; gap: var(--space-8); } }
@media (max-width: 640px)  { .footer-grid { grid-template-columns: 1fr; gap: var(--space-8); } }

/* Brand */
.footer-logo { display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-4); }
.logo-mark { color: var(--color-gold); font-size: 1.5rem; }
.logo-name { font-family: var(--font-display); font-size: 1.1rem; font-weight: 600; color: var(--color-white); }
.logo-tagline { font-size: 0.62rem; color: var(--color-gold); text-transform: uppercase; letter-spacing: 0.2em; }
.footer-desc { font-size: 0.88rem; line-height: 1.7; color: rgba(255,255,255,0.55); max-width: 280px; }
.footer-social { display: flex; gap: var(--space-3); margin-top: var(--space-5); }
.social-link {
  width: 38px; height: 38px; border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.15);
  display: flex; align-items: center; justify-content: center;
  color: rgba(255,255,255,0.6);
  transition: all var(--transition-base);
}
.social-link:hover { border-color: var(--color-gold); color: var(--color-gold); transform: translateY(-2px); }

/* Columns */
.footer-heading { font-family: var(--font-display); font-size: 1rem; font-weight: 600; color: var(--color-white); margin-bottom: var(--space-5); }
.footer-links { display: flex; flex-direction: column; gap: var(--space-3); }
.footer-links a, .footer-links li { font-size: 0.88rem; color: rgba(255,255,255,0.55); transition: color var(--transition-fast); cursor: pointer; }
.footer-links a:hover { color: var(--color-gold); }

.footer-contact { display: flex; flex-direction: column; gap: var(--space-4); }
.footer-contact li { display: flex; align-items: flex-start; gap: var(--space-3); font-size: 0.85rem; color: rgba(255,255,255,0.55); }
.footer-contact svg { flex-shrink: 0; color: var(--color-gold); margin-top: 2px; }

/* Bottom */
.footer-bottom { border-top: 1px solid rgba(255,255,255,0.08); padding: var(--space-5) 0; }
.footer-bottom-inner { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-4); }
.footer-bottom p { font-size: 0.82rem; color: rgba(255,255,255,0.35); }
.footer-legal { display: flex; gap: var(--space-5); }
.footer-legal a { font-size: 0.82rem; color: rgba(255,255,255,0.35); transition: color var(--transition-fast); }
.footer-legal a:hover { color: var(--color-gold); }
</style>
