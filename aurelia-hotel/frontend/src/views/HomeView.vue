<template>
  <div class="home">

    <!-- ─── HERO ─── -->
    <section class="hero" aria-label="Hero section">
      <div class="hero-bg" aria-hidden="true"></div>
      <div class="hero-overlay" aria-hidden="true"></div>
      <div class="container hero-content">
        <div class="hero-eyebrow animate-fade">
          <span class="hero-star">✦</span>
          <span>Melbourne's Finest Luxury Hotel</span>
          <span class="hero-star">✦</span>
        </div>
        <h1 class="hero-title animate-fade-delay-1">
          Where Luxury<br />
          <em>Becomes</em> Memory
        </h1>
        <p class="hero-subtitle animate-fade-delay-2">
          Discover unrivalled elegance in the heart of Melbourne. Every room a sanctuary, every moment a masterpiece.
        </p>

        <!-- Search / Quick Book -->
        <div class="hero-search animate-fade-delay-3" role="search" aria-label="Quick room search">
          <div class="search-field">
            <label for="hero-checkin" class="search-label">Check-in</label>
            <input id="hero-checkin" type="date" class="search-input" v-model="heroSearch.checkIn" :min="today" aria-label="Check-in date" />
          </div>
          <div class="search-divider" aria-hidden="true"></div>
          <div class="search-field">
            <label for="hero-checkout" class="search-label">Check-out</label>
            <input id="hero-checkout" type="date" class="search-input" v-model="heroSearch.checkOut" :min="heroSearch.checkIn || today" aria-label="Check-out date" />
          </div>
          <div class="search-divider" aria-hidden="true"></div>
          <div class="search-field">
            <label for="hero-guests" class="search-label">Guests</label>
            <select id="hero-guests" class="search-input" v-model="heroSearch.guests" aria-label="Number of guests">
              <option v-for="n in 6" :key="n" :value="n">{{ n }} {{ n === 1 ? 'Guest' : 'Guests' }}</option>
            </select>
          </div>
          <RouterLink :to="searchRoomsLink" class="btn btn-primary search-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            Search Rooms
          </RouterLink>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="hero-scroll" aria-hidden="true">
        <div class="scroll-line"></div>
      </div>
    </section>

    <!-- ─── TRUST BAR ─── -->
    <section class="trust-bar" aria-label="Hotel highlights">
      <div class="container">
        <div class="trust-grid">
          <div v-for="item in highlights" :key="item.label" class="trust-item">
            <span class="trust-icon" aria-hidden="true">{{ item.icon }}</span>
            <div>
              <p class="trust-title">{{ item.label }}</p>
              <p class="trust-sub">{{ item.sub }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── FEATURED ROOMS ─── -->
    <section class="section featured-section" aria-labelledby="featured-heading">
      <div class="container">
        <div class="section-header">
          <span class="section-label">Our Accommodations</span>
          <h2 id="featured-heading" class="section-title">Exceptional Rooms &amp; Suites</h2>
          <p class="section-desc">Each space has been thoughtfully conceived to deliver the pinnacle of comfort and style.</p>
        </div>

        <div v-if="loadingRooms" class="rooms-loading">
          <div v-for="n in 3" :key="n" class="room-skeleton">
            <div class="skeleton" style="height:220px;border-radius:12px 12px 0 0;"></div>
            <div style="padding:1.5rem;display:flex;flex-direction:column;gap:.75rem;">
              <div class="skeleton" style="height:20px;width:70%;"></div>
              <div class="skeleton" style="height:14px;width:90%;"></div>
              <div class="skeleton" style="height:14px;width:55%;"></div>
            </div>
          </div>
        </div>

        <div v-else class="featured-grid">
          <RoomCard v-for="room in featuredRooms" :key="room.id" :room="room" />
        </div>

        <div class="section-cta">
          <RouterLink to="/rooms" class="btn btn-secondary btn-lg">
            View All Rooms &amp; Suites
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ─── ABOUT / EXPERIENCE ─── -->
    <section class="experience-section" aria-labelledby="experience-heading">
      <div class="container experience-grid">
        <div class="experience-images" aria-hidden="true">
          <div class="exp-img exp-img-1">
            <img src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600" alt="" loading="lazy" />
          </div>
          <div class="exp-img exp-img-2">
            <img src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400" alt="" loading="lazy" />
          </div>
          <div class="exp-badge">
            <span class="exp-badge-num">15+</span>
            <span class="exp-badge-label">Years of Excellence</span>
          </div>
        </div>
        <div class="experience-text">
          <span class="section-label">The Aurelia Grand Story</span>
          <h2 id="experience-heading" class="section-title">A Legacy of<br />Unmatched Luxury</h2>
          <p>For over fifteen years, The Aurelia Grand has stood as Melbourne's most beloved luxury hotel. From intimate romantic escapes to grand family celebrations, we craft experiences that transcend expectation.</p>
          <p>Our team of dedicated professionals are committed to anticipating your every need, ensuring each stay is a masterclass in personalised hospitality.</p>
          <div class="exp-stats">
            <div class="exp-stat" v-for="s in expStats" :key="s.val">
              <span class="exp-stat-val">{{ s.val }}</span>
              <span class="exp-stat-label">{{ s.label }}</span>
            </div>
          </div>
          <RouterLink to="/services" class="btn btn-secondary" style="margin-top:var(--space-4);">Explore Hotel Services</RouterLink>
        </div>
      </div>
    </section>

    <!-- ─── SPECIAL OFFERS ─── -->
    <section class="section offers-section" aria-labelledby="offers-heading">
      <div class="container">
        <div class="section-header">
          <span class="section-label">Exclusive Deals</span>
          <h2 id="offers-heading" class="section-title">Special Offers</h2>
        </div>
        <div class="offers-grid">
          <div v-for="offer in offers" :key="offer.code" class="offer-card">
            <div class="offer-badge">{{ offer.discount_percent }}% OFF</div>
            <h3 class="offer-title">{{ offer.title }}</h3>
            <p class="offer-desc">{{ offer.description }}</p>
            <div class="offer-code">
              Code: <strong>{{ offer.code }}</strong>
            </div>
            <RouterLink to="/booking" class="btn btn-outline-gold btn-sm">Redeem Offer</RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── TESTIMONIALS ─── -->
    <section class="section testimonials-section" aria-labelledby="testimonials-heading">
      <div class="container">
        <div class="section-header">
          <span class="section-label">Guest Reviews</span>
          <h2 id="testimonials-heading" class="section-title light">What Our Guests Say</h2>
        </div>
        <div class="testimonials-grid">
          <blockquote v-for="t in testimonials" :key="t.name" class="testimonial-card">
            <div class="testimonial-stars" aria-label="5 out of 5 stars">
              <span v-for="n in 5" :key="n" aria-hidden="true">★</span>
            </div>
            <p class="testimonial-text">"{{ t.text }}"</p>
            <footer class="testimonial-author">
              <div class="author-avatar" aria-hidden="true">{{ t.name[0] }}</div>
              <div>
                <p class="author-name">{{ t.name }}</p>
                <p class="author-stay">{{ t.stay }}</p>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>
    </section>

    <!-- ─── CTA BANNER ─── -->
    <section class="cta-banner" aria-labelledby="cta-heading">
      <div class="container cta-inner">
        <div>
          <span class="section-label">Begin Your Journey</span>
          <h2 id="cta-heading" class="section-title light">Ready for an Extraordinary Stay?</h2>
          <p style="color:rgba(255,255,255,.65);margin-top:var(--space-3);">Reserve your room today and receive complimentary welcome amenities.</p>
        </div>
        <div class="cta-actions">
          <RouterLink to="/rooms" class="btn btn-outline-gold btn-lg">Explore Rooms</RouterLink>
          <RouterLink to="/booking" class="btn btn-primary btn-lg">Book Now</RouterLink>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import RoomCard from '@/components/ui/RoomCard.vue'
import api from '@/composables/useApi.js'

const featuredRooms = ref([])
const loadingRooms  = ref(true)
const offers = ref([])
const today  = new Date().toISOString().split('T')[0]

const heroSearch = ref({ checkIn: '', checkOut: '', guests: 2 })

const searchRoomsLink = computed(() => {
  const q = new URLSearchParams({ capacity: heroSearch.value.guests })
  return `/rooms?${q}`
})

const highlights = [
  { icon: '🛜', label: 'Complimentary Wi-Fi',  sub: 'High-speed throughout' },
  { icon: '🏊', label: 'Infinity Pool',         sub: 'Rooftop, open year-round' },
  { icon: '💆', label: 'Luxe Spa & Wellness',   sub: 'Full treatments & packages' },
  { icon: '🍽️', label: 'Fine Dining',           sub: '3 award-winning restaurants' },
  { icon: '🚗', label: 'Valet Parking',          sub: 'Complimentary for guests' },
  { icon: '🛎️', label: '24/7 Concierge',        sub: 'Always at your service' },
]

const expStats = [
  { val: '8 000+', label: 'Happy Guests' },
  { val: '98%',    label: 'Satisfaction Rate' },
  { val: '15+',    label: 'Awards Won' },
]

const testimonials = [
  { name: 'Alexandra Chen',  stay: 'Grand Suite, November 2025',   text: 'Absolutely breathtaking. The service was impeccable and the room was beyond anything I could have imagined. We will return every year.' },
  { name: 'Marcus Thornton', stay: 'Ocean View Deluxe, January 2026', text: 'From check-in to check-out, every single detail was perfect. The team remembered our preferences and made us feel truly at home.' },
  { name: 'Sophie Laurent',  stay: 'Junior Suite, December 2025',  text: 'The most romantic hotel I have ever stayed in. The attention to detail is extraordinary. Worth every penny and more.' },
]

onMounted(async () => {
  try {
    const [roomsRes, promosRes] = await Promise.all([
      api.get('/rooms?sort=rating'),
      api.get('/promotions')
    ])
    featuredRooms.value = roomsRes.data.slice(0, 3)
    offers.value = promosRes.data
  } catch (e) {
    console.error(e)
  } finally {
    loadingRooms.value = false
  }
})
</script>

<style scoped>
/* ── Hero ── */
.hero { position:relative;min-height:100vh;display:flex;align-items:center;overflow:hidden;background:var(--color-navy); }
.hero-bg {
  position:absolute;inset:0;
  background-image: url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600');
  background-size:cover;background-position:center;
  opacity:.35;
}
.hero-overlay { position:absolute;inset:0;background:linear-gradient(135deg,rgba(10,22,40,.9) 0%,rgba(10,22,40,.5) 60%,rgba(201,168,76,.08) 100%); }
.hero-content { position:relative;z-index:1;padding-top:var(--nav-height); }
.hero-eyebrow { display:flex;align-items:center;gap:var(--space-3);color:var(--color-gold);font-size:.78rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;margin-bottom:var(--space-5); }
.hero-star { font-size:.6rem;opacity:.7; }
.hero-title { font-family:var(--font-display);font-size:clamp(2.8rem,7vw,5.5rem);font-weight:700;color:var(--color-white);line-height:1.08;margin-bottom:var(--space-6); }
.hero-title em { font-style:italic;color:var(--color-gold-light); }
.hero-subtitle { font-size:1.1rem;color:rgba(255,255,255,.7);max-width:520px;line-height:1.7;margin-bottom:var(--space-10); }

/* Search Bar */
.hero-search {
  display:flex;align-items:stretch;background:rgba(255,255,255,.97);
  border-radius:var(--radius-lg);box-shadow:var(--shadow-xl);
  max-width:780px;overflow:hidden;border:1px solid rgba(201,168,76,.2);
}
.search-field { flex:1;padding:var(--space-4) var(--space-5);display:flex;flex-direction:column;gap:4px; }
.search-label { font-size:.68rem;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:var(--color-muted); }
.search-input { border:none;outline:none;font-size:.95rem;font-weight:500;color:var(--color-navy);background:transparent;padding:0; }
.search-input:focus { outline:none; }
.search-divider { width:1px;background:var(--color-border);margin:var(--space-3) 0; }
.search-btn { border-radius:0;padding:var(--space-4) var(--space-8);white-space:nowrap;flex-shrink:0; }
@media (max-width:768px) {
  .hero-search { flex-direction:column;max-width:480px; }
  .search-divider { width:auto;height:1px;margin:0 var(--space-5); }
  .search-btn { border-radius:0 0 var(--radius-lg) var(--radius-lg); }
}

/* Scroll indicator */
.hero-scroll { position:absolute;bottom:var(--space-8);left:50%;transform:translateX(-50%); }
.scroll-line { width:1px;height:60px;background:linear-gradient(to bottom,transparent,var(--color-gold));margin:0 auto;animation:pulse 2s infinite; }

/* Trust Bar */
.trust-bar { background:var(--color-white);border-bottom:1px solid var(--color-border);padding:var(--space-6) 0; }
.trust-grid { display:grid;grid-template-columns:repeat(6,1fr);gap:var(--space-4); }
@media (max-width:1024px) { .trust-grid { grid-template-columns:repeat(3,1fr); } }
@media (max-width:640px)  { .trust-grid { grid-template-columns:repeat(2,1fr); } }
.trust-item { display:flex;align-items:center;gap:var(--space-3);padding:var(--space-3) var(--space-4);border-radius:var(--radius-md); }
.trust-icon { font-size:1.5rem;flex-shrink:0; }
.trust-title { font-size:.85rem;font-weight:600;color:var(--color-navy); }
.trust-sub   { font-size:.72rem;color:var(--color-muted);margin-top:1px; }

/* Section Header */
.section-header { text-align:center;max-width:600px;margin:0 auto var(--space-12); }
.section-desc { color:var(--color-muted);margin-top:var(--space-3);font-size:.95rem; }

/* Featured Rooms */
.featured-section { background:var(--color-cream); }
.featured-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-6); }
@media (max-width:1024px) { .featured-grid { grid-template-columns:repeat(2,1fr); } }
@media (max-width:640px)  { .featured-grid { grid-template-columns:1fr; } }
.rooms-loading { display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-6); }
@media (max-width:1024px) { .rooms-loading { grid-template-columns:repeat(2,1fr); } }
@media (max-width:640px)  { .rooms-loading { grid-template-columns:1fr; } }
.room-skeleton { background:var(--color-white);border-radius:var(--radius-lg);overflow:hidden; }
.section-cta { text-align:center;margin-top:var(--space-10); }

/* Experience */
.experience-section { background:var(--color-white);padding:var(--space-20) 0; }
.experience-grid { display:grid;grid-template-columns:1fr 1fr;gap:var(--space-16);align-items:center; }
@media (max-width:900px) { .experience-grid { grid-template-columns:1fr; } .experience-images { display:none; } }
.experience-images { position:relative;height:480px; }
.exp-img { position:absolute;border-radius:var(--radius-xl);overflow:hidden;box-shadow:var(--shadow-xl); }
.exp-img img { width:100%;height:100%;object-fit:cover; }
.exp-img-1 { top:0;left:0;width:75%;height:340px; }
.exp-img-2 { bottom:0;right:0;width:55%;height:260px; }
.exp-badge { position:absolute;bottom:var(--space-6);left:var(--space-6);background:var(--color-gold);color:var(--color-navy);border-radius:var(--radius-lg);padding:var(--space-4) var(--space-5);box-shadow:var(--shadow-gold); }
.exp-badge-num   { display:block;font-family:var(--font-display);font-size:2rem;font-weight:700;line-height:1; }
.exp-badge-label { display:block;font-size:.72rem;font-weight:600;text-transform:uppercase;letter-spacing:.08em;margin-top:2px; }

.experience-text { display:flex;flex-direction:column;gap:var(--space-5); }
.experience-text p { color:var(--color-text-mid);line-height:1.8; }
.exp-stats { display:flex;gap:var(--space-8);margin-top:var(--space-4); }
.exp-stat { display:flex;flex-direction:column;gap:4px; }
.exp-stat-val   { font-family:var(--font-display);font-size:1.8rem;font-weight:700;color:var(--color-navy); }
.exp-stat-label { font-size:.75rem;color:var(--color-muted);text-transform:uppercase;letter-spacing:.06em; }

/* Offers */
.offers-section { background:var(--color-cream); }
.offers-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-6); }
@media (max-width:900px)  { .offers-grid { grid-template-columns:repeat(2,1fr); } }
@media (max-width:600px)  { .offers-grid { grid-template-columns:1fr; } }
.offer-card { background:var(--color-white);border-radius:var(--radius-lg);padding:var(--space-8);box-shadow:var(--shadow-sm);border:1px solid var(--color-border);display:flex;flex-direction:column;gap:var(--space-3);transition:box-shadow var(--transition-base); }
.offer-card:hover { box-shadow:var(--shadow-md); }
.offer-badge { display:inline-flex;background:var(--color-navy);color:var(--color-gold);font-size:.72rem;font-weight:700;letter-spacing:.1em;padding:.35rem .8rem;border-radius:var(--radius-full);align-self:flex-start; }
.offer-title { font-family:var(--font-display);font-size:1.2rem;font-weight:600;color:var(--color-navy); }
.offer-desc  { font-size:.88rem;color:var(--color-muted);line-height:1.6; }
.offer-code  { font-size:.82rem;color:var(--color-text-mid);background:var(--color-cream);padding:.4rem .8rem;border-radius:var(--radius-sm);border:1px dashed var(--color-border); }
.offer-code strong { color:var(--color-navy);font-weight:700; }

/* Testimonials */
.testimonials-section { background:var(--color-navy); }
.testimonials-section .section-header .section-desc { color:rgba(255,255,255,.5); }
.testimonials-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-6); }
@media (max-width:1024px) { .testimonials-grid { grid-template-columns:repeat(2,1fr); } }
@media (max-width:640px)  { .testimonials-grid { grid-template-columns:1fr; } }
.testimonial-card { background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);border-radius:var(--radius-lg);padding:var(--space-8);display:flex;flex-direction:column;gap:var(--space-4); }
.testimonial-stars { color:var(--color-gold);font-size:1rem;letter-spacing:2px; }
.testimonial-text  { font-family:var(--font-display);font-style:italic;font-size:1rem;color:rgba(255,255,255,.85);line-height:1.7;flex:1; }
.testimonial-author { display:flex;align-items:center;gap:var(--space-3); }
.author-avatar { width:42px;height:42px;border-radius:50%;background:var(--color-gold);color:var(--color-navy);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.9rem;flex-shrink:0; }
.author-name  { font-weight:600;color:var(--color-white);font-size:.9rem; }
.author-stay  { font-size:.75rem;color:rgba(255,255,255,.4);margin-top:1px; }

/* CTA Banner */
.cta-banner { background:linear-gradient(135deg,var(--color-navy-mid) 0%,var(--color-navy) 100%);padding:var(--space-16) 0;border-top:1px solid rgba(201,168,76,.2); }
.cta-inner { display:flex;align-items:center;justify-content:space-between;gap:var(--space-10);flex-wrap:wrap; }
.cta-actions { display:flex;gap:var(--space-4);flex-wrap:wrap; }
</style>
