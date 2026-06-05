<template>
  <div class="services-page">
    <div class="page-header">
      <div class="container">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <RouterLink to="/">Home</RouterLink><span>/</span><span>Hotel Services</span>
        </nav>
        <h1>Hotel Services</h1>
        <p>An unrivalled collection of amenities crafted to elevate your stay.</p>
      </div>
    </div>

    <!-- Nav Tabs -->
    <div class="services-nav-bar" role="navigation" aria-label="Service categories">
      <div class="container services-nav">
        <a v-for="s in sections" :key="s.id" :href="`#${s.id}`" class="services-nav-link" :aria-label="`Go to ${s.label} section`">
          <span aria-hidden="true">{{ s.icon }}</span> {{ s.label }}
        </a>
      </div>
    </div>

    <!-- ─── DINING ─── -->
    <section id="dining" class="section services-section" aria-labelledby="dining-heading">
      <div class="container">
        <div class="services-section-header">
          <span class="section-label">Culinary Excellence</span>
          <h2 id="dining-heading" class="section-title">Fine Dining</h2>
          <p class="section-desc">Three distinct dining experiences, each a journey in flavour and ambiance.</p>
        </div>
        <div class="services-grid">
          <article v-for="venue in dining" :key="venue.name" class="service-card">
            <div class="service-img-wrap">
              <img :src="venue.img" :alt="venue.name + ' restaurant'" class="service-img" loading="lazy" />
              <div class="service-tag">{{ venue.tag }}</div>
            </div>
            <div class="service-body">
              <h3 class="service-name">{{ venue.name }}</h3>
              <p class="service-cuisine">{{ venue.cuisine }}</p>
              <p class="service-desc">{{ venue.desc }}</p>
              <div class="service-detail-row">
                <span class="service-detail"><strong>Hours:</strong> {{ venue.hours }}</span>
                <span class="service-detail"><strong>Dress:</strong> {{ venue.dress }}</span>
              </div>
              <RouterLink to="/booking" class="btn btn-outline-gold btn-sm" style="align-self:flex-start;margin-top:var(--space-2);">Make a Reservation</RouterLink>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ─── SPA ─── -->
    <section id="spa" class="section services-section alt-bg" aria-labelledby="spa-heading">
      <div class="container">
        <div class="services-section-header">
          <span class="section-label">Wellbeing & Restoration</span>
          <h2 id="spa-heading" class="section-title">Aurelia Spa &amp; Wellness</h2>
          <p class="section-desc">A sanctuary of serenity spanning 2,000m², offering bespoke treatments and therapies.</p>
        </div>
        <div class="spa-layout">
          <div class="spa-image" aria-hidden="true">
            <img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800" alt="" loading="lazy" />
          </div>
          <div class="spa-content">
            <div class="spa-features">
              <div v-for="f in spaFeatures" :key="f.name" class="spa-feature">
                <div class="spa-feature-icon" aria-hidden="true">{{ f.icon }}</div>
                <div>
                  <h4 class="spa-feature-name">{{ f.name }}</h4>
                  <p class="spa-feature-desc">{{ f.desc }}</p>
                </div>
              </div>
            </div>
            <div class="spa-treatments">
              <h3 class="spa-treatments-title">Signature Treatments</h3>
              <div class="treatment-list">
                <div v-for="t in treatments" :key="t.name" class="treatment-item">
                  <div>
                    <p class="treatment-name">{{ t.name }}</p>
                    <p class="treatment-duration">{{ t.duration }}</p>
                  </div>
                  <span class="treatment-price">from ${{ t.price }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── POOL & FITNESS ─── -->
    <section id="pool" class="section services-section" aria-labelledby="pool-heading">
      <div class="container">
        <div class="services-section-header">
          <span class="section-label">Active Living</span>
          <h2 id="pool-heading" class="section-title">Pool &amp; Fitness</h2>
        </div>
        <div class="grid grid-3" style="align-items:start">
          <div v-for="f in poolFitness" :key="f.title" class="amenity-service-card">
            <div class="amenity-img-wrap"><img :src="f.img" :alt="f.title" class="amenity-img" loading="lazy"/></div>
            <div class="amenity-body">
              <h3 class="amenity-title">{{ f.title }}</h3>
              <p class="amenity-desc">{{ f.desc }}</p>
              <p class="amenity-hours"><strong>Hours:</strong> {{ f.hours }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── EVENTS ─── -->
    <section id="events" class="section services-section alt-bg" aria-labelledby="events-heading">
      <div class="container">
        <div class="services-section-header">
          <span class="section-label">Meetings &amp; Celebrations</span>
          <h2 id="events-heading" class="section-title">Events &amp; Venues</h2>
          <p class="section-desc">From intimate gatherings to grand celebrations — we host moments that matter.</p>
        </div>
        <div class="events-grid">
          <div v-for="ev in events" :key="ev.name" class="event-card">
            <div class="event-icon" aria-hidden="true">{{ ev.icon }}</div>
            <h3 class="event-name">{{ ev.name }}</h3>
            <p class="event-desc">{{ ev.desc }}</p>
            <div class="event-specs">
              <span>Capacity: {{ ev.capacity }}</span>
              <span>Size: {{ ev.size }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── CONCIERGE ─── -->
    <section id="concierge" class="section services-section" aria-labelledby="concierge-heading">
      <div class="container">
        <div class="concierge-layout">
          <div class="concierge-text">
            <span class="section-label">Always At Your Service</span>
            <h2 id="concierge-heading" class="section-title">Dedicated Concierge</h2>
            <p>Our experienced concierge team is available 24 hours a day, 7 days a week to fulfil every request — from private dining reservations to bespoke city experiences.</p>
            <ul class="concierge-list" role="list">
              <li v-for="s in conciergeServices" :key="s" role="listitem">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" stroke-width="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                {{ s }}
              </li>
            </ul>
            <RouterLink to="/booking" class="btn btn-primary" style="margin-top:var(--space-6);align-self:flex-start;">Book Your Stay</RouterLink>
          </div>
          <div class="concierge-contact">
            <div class="contact-card">
              <h3>Contact Concierge</h3>
              <div class="contact-method"><span>📞</span><div><p>Phone</p><strong>+61 3 9000 1234</strong></div></div>
              <div class="contact-method"><span>📧</span><div><p>Email</p><strong>concierge@aureliagrand.com</strong></div></div>
              <div class="contact-method"><span>💬</span><div><p>Live Chat</p><strong>Available via app</strong></div></div>
              <p class="contact-note">Concierge is available 24 hours a day, every day of the year.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── CTA ─── -->
    <section class="services-cta" aria-labelledby="services-cta-heading">
      <div class="container cta-inner">
        <div>
          <h2 id="services-cta-heading" class="section-title light">Ready to Experience It All?</h2>
          <p style="color:rgba(255,255,255,.65);margin-top:var(--space-3)">Book now and enjoy access to all our world-class services and amenities.</p>
        </div>
        <RouterLink to="/booking" class="btn btn-primary btn-lg">Make a Reservation</RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup>
const sections = [
  { id: 'dining',     icon: '🍽️', label: 'Dining'    },
  { id: 'spa',        icon: '💆',  label: 'Spa'       },
  { id: 'pool',       icon: '🏊',  label: 'Pool'      },
  { id: 'events',     icon: '🎊',  label: 'Events'    },
  { id: 'concierge',  icon: '🛎️', label: 'Concierge' },
]

const dining = [
  {
    name: 'The Meridian',
    cuisine: 'Modern Australian Fine Dining',
    tag: 'Signature Restaurant',
    desc: 'Our flagship restaurant celebrates the finest Australian produce with an innovative menu. Two-hat award winner for five consecutive years.',
    hours: '6:30 PM – 10:30 PM daily',
    dress: 'Smart casual',
    img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600'
  },
  {
    name: 'The Courtyard',
    cuisine: 'All-day Mediterranean',
    tag: 'All-Day Dining',
    desc: 'An open-air terrace overlooking the gardens, serving relaxed Mediterranean-inspired dishes from sunrise to sunset.',
    hours: '7:00 AM – 10:00 PM',
    dress: 'Casual',
    img: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600'
  },
  {
    name: 'The Velvet Bar',
    cuisine: 'Cocktails & Light Bites',
    tag: 'Bar & Lounge',
    desc: 'Melbourne\'s most celebrated hotel bar. Award-winning cocktails, curated whisky collection, and live jazz on weekends.',
    hours: '12:00 PM – 2:00 AM',
    dress: 'Smart casual',
    img: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600'
  }
]

const spaFeatures = [
  { icon: '🌊', name: 'Hydrotherapy Pool', desc: '30-metre heated pool with flotation zone' },
  { icon: '🧖', name: 'Treatment Suites',  desc: '14 private suites for individual or couples' },
  { icon: '🧘', name: 'Yoga & Meditation', desc: 'Daily classes with certified instructors' },
  { icon: '🔥', name: 'Thermal Facilities', desc: 'Sauna, steam room, and ice bath circuit' },
]

const treatments = [
  { name: 'Aurelia Signature Massage',   duration: '90 min', price: 180 },
  { name: 'Gold Radiance Facial',         duration: '75 min', price: 145 },
  { name: 'Couples Harmony Ritual',       duration: '120 min', price: 320 },
  { name: 'Deep Tissue Restoration',      duration: '60 min', price: 130 },
]

const poolFitness = [
  { title: 'Rooftop Infinity Pool',     desc: 'Heated outdoor pool with panoramic city views, poolside service, and cabanas.', hours: '6:00 AM – 10:00 PM', img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500' },
  { title: 'Fitness Centre',            desc: 'State-of-the-art gym with Technogym equipment, personal training available.', hours: '5:00 AM – 11:00 PM', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500' },
  { title: 'Indoor Lap Pool',           desc: 'Olympic-length heated lap pool, ideal for morning training sessions.', hours: '6:00 AM – 9:00 PM', img: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=500' },
]

const events = [
  { icon: '💍', name: 'Grand Ballroom',     desc: 'Opulent two-floor event space with chandeliers, stage, and dance floor.', capacity: 'Up to 500', size: '1,200m²' },
  { icon: '💼', name: 'Business Suite',     desc: 'Fully equipped boardroom with AV technology and breakout rooms.', capacity: 'Up to 30', size: '120m²' },
  { icon: '🥂', name: 'Garden Pavilion',    desc: 'Romantic outdoor setting for ceremonies and intimate celebrations.', capacity: 'Up to 150', size: '500m²' },
  { icon: '🎓', name: 'Conference Rooms',   desc: 'Versatile spaces for seminars, workshops, and corporate events.', capacity: 'Up to 200', size: '400m²' },
]

const conciergeServices = [
  'Restaurant reservations & private dining',
  'Theatre, opera & event tickets',
  'Limousine & helicopter transfers',
  'Private guided city experiences',
  'In-room celebrations & floral arrangements',
  'Business services & secretarial support',
  'Childcare & family activities',
  'Bespoke itinerary planning',
]
</script>

<style scoped>
.services-nav-bar { background:var(--color-white);border-bottom:1px solid var(--color-border);position:sticky;top:var(--nav-height);z-index:100; }
.services-nav { display:flex;gap:0;overflow-x:auto;scrollbar-width:none; }
.services-nav::-webkit-scrollbar { display:none; }
.services-nav-link { display:flex;align-items:center;gap:var(--space-2);padding:var(--space-4) var(--space-6);font-size:.85rem;font-weight:500;color:var(--color-muted);border-bottom:2px solid transparent;white-space:nowrap;transition:all var(--transition-fast); }
.services-nav-link:hover { color:var(--color-navy);border-bottom-color:var(--color-gold); }

.services-section { background:var(--color-white); }
.alt-bg { background:var(--color-cream); }
.services-section-header { text-align:center;max-width:640px;margin:0 auto var(--space-12); }

/* Dining */
.services-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-6); }
@media (max-width:1024px) { .services-grid { grid-template-columns:repeat(2,1fr); } }
@media (max-width:640px)  { .services-grid { grid-template-columns:1fr; } }
.service-card { background:var(--color-white);border-radius:var(--radius-lg);overflow:hidden;box-shadow:var(--shadow-sm);border:1px solid var(--color-border-soft);display:flex;flex-direction:column;transition:box-shadow var(--transition-base); }
.service-card:hover { box-shadow:var(--shadow-md); }
.service-img-wrap { position:relative;height:200px;overflow:hidden; }
.service-img { width:100%;height:100%;object-fit:cover;transition:transform .5s; }
.service-card:hover .service-img { transform:scale(1.04); }
.service-tag { position:absolute;top:var(--space-4);right:var(--space-4);background:var(--color-navy);color:var(--color-gold);font-size:.68rem;font-weight:700;letter-spacing:.08em;padding:.3rem .75rem;border-radius:var(--radius-full); }
.service-body { padding:var(--space-5);display:flex;flex-direction:column;gap:var(--space-3);flex:1; }
.service-name   { font-family:var(--font-display);font-size:1.15rem;font-weight:600;color:var(--color-navy); }
.service-cuisine { font-size:.75rem;color:var(--color-gold);font-weight:600;text-transform:uppercase;letter-spacing:.06em; }
.service-desc   { font-size:.88rem;color:var(--color-text-mid);line-height:1.6;flex:1; }
.service-detail-row { display:flex;flex-direction:column;gap:var(--space-1); }
.service-detail { font-size:.8rem;color:var(--color-muted); }

/* Spa */
.spa-layout { display:grid;grid-template-columns:1fr 1fr;gap:var(--space-12);align-items:start; }
@media (max-width:900px) { .spa-layout { grid-template-columns:1fr; } .spa-image { display:none; } }
.spa-image { border-radius:var(--radius-xl);overflow:hidden;box-shadow:var(--shadow-xl);height:500px; }
.spa-image img { width:100%;height:100%;object-fit:cover; }
.spa-content { display:flex;flex-direction:column;gap:var(--space-8); }
.spa-features { display:flex;flex-direction:column;gap:var(--space-4); }
.spa-feature { display:flex;gap:var(--space-4);align-items:flex-start; }
.spa-feature-icon { width:46px;height:46px;border-radius:var(--radius-md);background:var(--color-gold-pale);display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0; }
.spa-feature-name { font-weight:600;color:var(--color-navy);font-size:.95rem; }
.spa-feature-desc { font-size:.82rem;color:var(--color-muted);margin-top:2px; }
.spa-treatments-title { font-family:var(--font-display);font-size:1.1rem;font-weight:600;color:var(--color-navy);margin-bottom:var(--space-4); }
.treatment-list { display:flex;flex-direction:column;gap:var(--space-3); }
.treatment-item { display:flex;align-items:center;justify-content:space-between;padding:var(--space-3) var(--space-4);background:var(--color-white);border-radius:var(--radius-md);border:1px solid var(--color-border-soft); }
.treatment-name     { font-weight:500;color:var(--color-navy);font-size:.9rem; }
.treatment-duration { font-size:.75rem;color:var(--color-muted);margin-top:2px; }
.treatment-price    { font-weight:700;color:var(--color-navy);font-size:.9rem;flex-shrink:0; }

/* Amenities */
.amenity-service-card { background:var(--color-white);border-radius:var(--radius-lg);overflow:hidden;box-shadow:var(--shadow-sm);border:1px solid var(--color-border-soft); }
.amenity-img-wrap { height:180px;overflow:hidden; }
.amenity-img  { width:100%;height:100%;object-fit:cover; }
.amenity-body { padding:var(--space-5); }
.amenity-title { font-family:var(--font-display);font-size:1.05rem;font-weight:600;color:var(--color-navy);margin-bottom:var(--space-3); }
.amenity-desc  { font-size:.88rem;color:var(--color-text-mid);line-height:1.6;margin-bottom:var(--space-3); }
.amenity-hours { font-size:.8rem;color:var(--color-muted); }

/* Events */
.events-grid { display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-5); }
@media (max-width:1024px) { .events-grid { grid-template-columns:repeat(2,1fr); } }
@media (max-width:640px)  { .events-grid { grid-template-columns:1fr; } }
.event-card { background:var(--color-white);border-radius:var(--radius-lg);padding:var(--space-6);border:1px solid var(--color-border-soft);box-shadow:var(--shadow-xs);text-align:center;transition:box-shadow var(--transition-base); }
.event-card:hover { box-shadow:var(--shadow-md); }
.event-icon  { font-size:2rem;margin-bottom:var(--space-3); }
.event-name  { font-family:var(--font-display);font-size:1rem;font-weight:600;color:var(--color-navy);margin-bottom:var(--space-2); }
.event-desc  { font-size:.82rem;color:var(--color-muted);line-height:1.5;margin-bottom:var(--space-4); }
.event-specs { display:flex;flex-direction:column;gap:4px;font-size:.78rem;color:var(--color-text-mid); }

/* Concierge */
.concierge-layout { display:grid;grid-template-columns:1fr 380px;gap:var(--space-12);align-items:start; }
@media (max-width:900px) { .concierge-layout { grid-template-columns:1fr; } }
.concierge-text { display:flex;flex-direction:column;gap:var(--space-4); }
.concierge-text p { color:var(--color-text-mid);line-height:1.8; }
.concierge-list { display:flex;flex-direction:column;gap:var(--space-3); }
.concierge-list li { display:flex;align-items:center;gap:var(--space-3);font-size:.9rem;color:var(--color-text-mid); }
.contact-card { background:var(--color-white);border-radius:var(--radius-xl);padding:var(--space-8);box-shadow:var(--shadow-md);border:1px solid var(--color-border); }
.contact-card h3 { font-family:var(--font-display);font-size:1.2rem;font-weight:600;color:var(--color-navy);margin-bottom:var(--space-5); }
.contact-method { display:flex;align-items:center;gap:var(--space-4);padding:var(--space-4) 0;border-bottom:1px solid var(--color-border-soft); }
.contact-method span { font-size:1.3rem; }
.contact-method p { font-size:.72rem;text-transform:uppercase;letter-spacing:.06em;color:var(--color-muted); }
.contact-method strong { font-size:.9rem;color:var(--color-navy); }
.contact-note { font-size:.78rem;color:var(--color-muted);margin-top:var(--space-4);line-height:1.5; }

/* CTA */
.services-cta { background:linear-gradient(135deg,var(--color-navy) 0%,var(--color-navy-mid) 100%);padding:var(--space-16) 0;border-top:1px solid rgba(201,168,76,.2); }
.cta-inner { display:flex;align-items:center;justify-content:space-between;gap:var(--space-8);flex-wrap:wrap; }
</style>
