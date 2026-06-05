<template>
  <div class="room-detail" v-if="room">
    <!-- Back nav -->
    <div class="back-bar">
      <div class="container">
        <RouterLink to="/rooms" class="back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
          Back to Rooms
        </RouterLink>
      </div>
    </div>

    <div class="container detail-layout">
      <!-- ─── LEFT COLUMN ─── -->
      <div class="detail-main">
        <!-- Gallery -->
        <ImageCarousel :images="room.images" />

        <!-- Title row -->
        <div class="detail-title-row">
          <div>
            <div class="detail-type-badge">{{ room.type }}</div>
            <h1 class="detail-name">{{ room.name }}</h1>
          </div>
          <div class="detail-rating-block" :aria-label="`Rated ${room.rating} out of 5 from ${room.review_count} reviews`">
            <div class="rating-stars" aria-hidden="true">
              <svg v-for="n in 5" :key="n" width="16" height="16" viewBox="0 0 24 24" :fill="n <= Math.round(room.rating) ? 'var(--color-gold)' : 'var(--color-border)'"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
            <span class="rating-val">{{ room.rating }}</span>
            <span class="rating-count">({{ room.review_count }} reviews)</span>
          </div>
        </div>

        <!-- Quick Facts -->
        <div class="quick-facts" role="list">
          <div class="fact-item" role="listitem">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></svg>
            <span class="fact-label">Guests</span>
            <span class="fact-val">Up to {{ room.capacity }}</span>
          </div>
          <div class="fact-item" role="listitem">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M3 11V8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v3"/></svg>
            <span class="fact-label">Bed</span>
            <span class="fact-val">{{ room.bed_type }}</span>
          </div>
          <div class="fact-item" role="listitem">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
            <span class="fact-label">Size</span>
            <span class="fact-val">{{ room.size_sqm }}m²</span>
          </div>
          <div class="fact-item" role="listitem">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
            <span class="fact-label">Floor</span>
            <span class="fact-val">Level {{ room.floor }}</span>
          </div>
          <div class="fact-item" role="listitem">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            <span class="fact-label">View</span>
            <span class="fact-val">{{ room.view_type }}</span>
          </div>
        </div>

        <!-- Description -->
        <section class="detail-section" aria-labelledby="desc-heading">
          <h2 id="desc-heading" class="detail-section-title">About This Room</h2>
          <p class="detail-desc">{{ room.description }}</p>
        </section>

        <!-- Amenities -->
        <section class="detail-section" aria-labelledby="amenities-heading">
          <h2 id="amenities-heading" class="detail-section-title">Room Amenities</h2>
          <div class="amenities-grid" role="list" aria-label="Room amenities">
            <div v-for="am in room.amenities" :key="am" class="amenity-item" role="listitem">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" stroke-width="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
              <span>{{ am }}</span>
            </div>
          </div>
        </section>

        <!-- Hotel Policies -->
        <section class="detail-section" aria-labelledby="policies-heading">
          <h2 id="policies-heading" class="detail-section-title">Hotel Policies</h2>
          <div class="policies-grid">
            <div class="policy-item" v-for="p in policies" :key="p.label">
              <span class="policy-icon" aria-hidden="true">{{ p.icon }}</span>
              <div>
                <p class="policy-label">{{ p.label }}</p>
                <p class="policy-val">{{ p.val }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Reviews -->
        <section class="detail-section" aria-labelledby="reviews-heading">
          <h2 id="reviews-heading" class="detail-section-title">Guest Reviews</h2>
          <div v-if="loadingReviews" class="reviews-loading">
            <div v-for="n in 2" :key="n" class="review-skel">
              <div class="skeleton" style="height:14px;width:30%"></div>
              <div class="skeleton" style="height:14px"></div>
              <div class="skeleton" style="height:14px;width:75%"></div>
            </div>
          </div>
          <div v-else-if="reviews.length" class="reviews-list">
            <article v-for="rev in reviews" :key="rev.id" class="review-item">
              <div class="review-header">
                <div class="review-avatar" aria-hidden="true">{{ rev.user_name?.[0] }}</div>
                <div>
                  <p class="review-author">{{ rev.user_name }}</p>
                  <p class="review-date">{{ formatDate(rev.created_at) }}</p>
                </div>
                <div class="review-stars" :aria-label="`${rev.rating} out of 5 stars`">
                  <svg v-for="n in 5" :key="n" width="14" height="14" viewBox="0 0 24 24" :fill="n <= rev.rating ? 'var(--color-gold)' : 'var(--color-border)'" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </div>
              </div>
              <p v-if="rev.title" class="review-title">{{ rev.title }}</p>
              <p class="review-comment">{{ rev.comment }}</p>
            </article>
          </div>
          <EmptyState v-else title="No reviews yet" message="Be the first to share your experience." compact>
            <template #icon>⭐</template>
          </EmptyState>
        </section>
      </div>

      <!-- ─── RIGHT COLUMN (Sticky Booking Panel) ─── -->
      <aside class="booking-panel" aria-label="Booking panel">
        <div class="booking-panel-inner">
          <div class="panel-price">
            <span class="panel-amount">${{ room.price_per_night }}</span>
            <span class="panel-unit">/ night</span>
          </div>
          <div class="panel-rating" aria-label="Room rating">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--color-gold)" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span>{{ room.rating }}</span>
            <span class="text-muted text-sm">· {{ room.review_count }} reviews</span>
          </div>

          <hr class="divider" />

          <!-- Quick availability check -->
          <div class="panel-dates">
            <div class="form-group">
              <label for="panel-checkin" class="form-label">Check-in</label>
              <input id="panel-checkin" type="date" class="form-input" v-model="quickBook.checkIn" :min="today" />
            </div>
            <div class="form-group">
              <label for="panel-checkout" class="form-label">Check-out</label>
              <input id="panel-checkout" type="date" class="form-input" v-model="quickBook.checkOut" :min="quickBook.checkIn || today" />
            </div>
            <div class="form-group">
              <label for="panel-guests" class="form-label">Guests</label>
              <select id="panel-guests" class="form-input" v-model.number="quickBook.guests">
                <option v-for="n in room.capacity" :key="n" :value="n">{{ n }} {{ n === 1 ? 'guest' : 'guests' }}</option>
              </select>
            </div>
          </div>

          <!-- Price summary -->
          <div v-if="nights > 0" class="panel-summary" aria-live="polite">
            <div class="summary-row">
              <span>${{ room.price_per_night }} × {{ nights }} nights</span>
              <span>${{ (room.price_per_night * nights).toFixed(2) }}</span>
            </div>
            <div class="summary-row total">
              <span>Estimated Total</span>
              <span>${{ (room.price_per_night * nights).toFixed(2) }}</span>
            </div>
          </div>

          <RouterLink
            :to="bookingLink"
            class="btn btn-primary"
            style="width:100%;justify-content:center;margin-top:var(--space-2);"
          >
            Book Now
          </RouterLink>
          <p class="panel-note">No charges until confirmation</p>

          <!-- Perks list -->
          <ul class="panel-perks" aria-label="Booking benefits">
            <li v-for="perk in perks" :key="perk">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" stroke-width="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
              {{ perk }}
            </li>
          </ul>
        </div>
      </aside>
    </div>
  </div>

  <!-- Loading -->
  <div v-else-if="loading" class="loading-page">
    <LoadingSpinner size="lg" label="Loading room details…" />
  </div>

  <!-- Not found -->
  <div v-else class="loading-page">
    <EmptyState title="Room not found" message="This room doesn't exist or is no longer available.">
      <template #icon>🏨</template>
      <template #action>
        <RouterLink to="/rooms" class="btn btn-secondary">Browse All Rooms</RouterLink>
      </template>
    </EmptyState>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ImageCarousel from '@/components/ui/ImageCarousel.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import api from '@/composables/useApi.js'

const route = useRoute()
const room    = ref(null)
const reviews = ref([])
const loading  = ref(true)
const loadingReviews = ref(true)
const today = new Date().toISOString().split('T')[0]

const quickBook = ref({ checkIn: '', checkOut: '', guests: 2 })

const nights = computed(() => {
  if (!quickBook.value.checkIn || !quickBook.value.checkOut) return 0
  const d1 = new Date(quickBook.value.checkIn), d2 = new Date(quickBook.value.checkOut)
  return Math.max(0, Math.round((d2 - d1) / 86400000))
})

const bookingLink = computed(() => ({
  name: 'Booking',
  query: {
    room: route.params.id,
    checkIn:  quickBook.value.checkIn  || undefined,
    checkOut: quickBook.value.checkOut || undefined,
    guests:   quickBook.value.guests   || undefined
  }
}))

const policies = [
  { icon: '🕒', label: 'Check-in',   val: 'From 3:00 PM' },
  { icon: '🕐', label: 'Check-out',  val: 'By 11:00 AM' },
  { icon: '🚭', label: 'Smoking',    val: 'Non-smoking property' },
  { icon: '🐾', label: 'Pets',       val: 'Not permitted' },
  { icon: '💳', label: 'Payment',    val: 'All major cards' },
  { icon: '❌', label: 'Cancellation', val: 'Free up to 24h before check-in' },
]

const perks = ['Free cancellation before check-in', 'No prepayment required', 'Best rate guaranteed', 'Complimentary welcome amenities']

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
}

onMounted(async () => {
  try {
    const [roomRes, reviewsRes] = await Promise.all([
      api.get(`/rooms/${route.params.id}`),
      api.get(`/reviews/${route.params.id}`)
    ])
    room.value    = roomRes.data
    reviews.value = reviewsRes.data
    quickBook.value.guests = Math.min(2, roomRes.data.capacity)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
    loadingReviews.value = false
  }
})
</script>

<style scoped>
.back-bar { background:var(--color-white);border-bottom:1px solid var(--color-border-soft);padding:var(--space-3) 0; }
.back-link { display:inline-flex;align-items:center;gap:var(--space-2);font-size:.85rem;color:var(--color-text-mid);transition:color var(--transition-fast); }
.back-link:hover { color:var(--color-navy); }

.detail-layout { display:grid;grid-template-columns:1fr 360px;gap:var(--space-10);padding:var(--space-8) 0 var(--space-16); }
@media (max-width:1100px) { .detail-layout { grid-template-columns:1fr 320px; gap:var(--space-6); } }
@media (max-width:900px)  { .detail-layout { grid-template-columns:1fr; } .booking-panel { order:-1; } }

/* Title */
.detail-type-badge { display:inline-flex;background:var(--color-gold);color:var(--color-navy);font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;padding:.25rem .75rem;border-radius:var(--radius-full);margin-bottom:var(--space-3); }
.detail-name { font-family:var(--font-display);font-size:clamp(1.6rem,3vw,2.2rem);font-weight:700;color:var(--color-navy); }

.detail-title-row { display:flex;align-items:flex-start;justify-content:space-between;gap:var(--space-4);margin-top:var(--space-5);flex-wrap:wrap; }
.detail-rating-block { display:flex;align-items:center;gap:var(--space-2);flex-shrink:0; }
.rating-stars { display:flex;gap:2px; }
.rating-val { font-weight:700;font-size:.95rem;color:var(--color-navy); }
.rating-count { font-size:.82rem;color:var(--color-muted); }

/* Quick Facts */
.quick-facts { display:flex;flex-wrap:wrap;gap:var(--space-2);margin-top:var(--space-5); }
.fact-item { display:flex;align-items:center;gap:var(--space-2);background:var(--color-white);border:1px solid var(--color-border);border-radius:var(--radius-md);padding:.6rem 1rem; }
.fact-label { font-size:.7rem;text-transform:uppercase;letter-spacing:.06em;color:var(--color-muted);font-weight:500; }
.fact-val   { font-size:.88rem;font-weight:600;color:var(--color-navy);margin-left:4px; }

/* Sections */
.detail-section { margin-top:var(--space-10);padding-top:var(--space-8);border-top:1px solid var(--color-border-soft); }
.detail-section-title { font-family:var(--font-display);font-size:1.3rem;font-weight:600;color:var(--color-navy);margin-bottom:var(--space-5); }
.detail-desc { line-height:1.8;color:var(--color-text-mid);font-size:.95rem; }

/* Amenities */
.amenities-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:var(--space-3); }
.amenity-item { display:flex;align-items:center;gap:var(--space-3);font-size:.88rem;color:var(--color-text-mid); }

/* Policies */
.policies-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:var(--space-4); }
.policy-item { display:flex;align-items:flex-start;gap:var(--space-3); }
.policy-icon { font-size:1.1rem;margin-top:2px; }
.policy-label { font-size:.72rem;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--color-muted); }
.policy-val   { font-size:.88rem;color:var(--color-text-mid);margin-top:2px; }

/* Reviews */
.reviews-list { display:flex;flex-direction:column;gap:var(--space-6); }
.review-item { background:var(--color-white);border:1px solid var(--color-border-soft);border-radius:var(--radius-lg);padding:var(--space-5); }
.review-header { display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-3); }
.review-avatar { width:38px;height:38px;border-radius:50%;background:var(--color-gold);color:var(--color-navy);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.85rem;flex-shrink:0; }
.review-author { font-weight:600;font-size:.9rem;color:var(--color-navy); }
.review-date   { font-size:.75rem;color:var(--color-muted);margin-top:1px; }
.review-stars  { display:flex;gap:2px;margin-left:auto; }
.review-title  { font-weight:600;font-size:.9rem;color:var(--color-navy);margin-bottom:var(--space-2); }
.review-comment { font-size:.88rem;color:var(--color-text-mid);line-height:1.7; }
.reviews-loading,.review-skel { display:flex;flex-direction:column;gap:var(--space-3);padding:var(--space-5);background:var(--color-white);border-radius:var(--radius-lg); }

/* Booking Panel */
.booking-panel { position:sticky;top:calc(var(--nav-height) + var(--space-4));height:fit-content; }
.booking-panel-inner { background:var(--color-white);border-radius:var(--radius-xl);box-shadow:var(--shadow-lg);border:1px solid var(--color-border);padding:var(--space-6);display:flex;flex-direction:column;gap:var(--space-4); }
.panel-price { display:flex;align-items:baseline;gap:var(--space-2); }
.panel-amount { font-family:var(--font-display);font-size:2rem;font-weight:700;color:var(--color-navy); }
.panel-unit   { font-size:.9rem;color:var(--color-muted); }
.panel-rating { display:flex;align-items:center;gap:var(--space-2);margin-top:-var(--space-2); }
.panel-dates  { display:flex;flex-direction:column;gap:var(--space-3); }
.panel-summary { background:var(--color-cream);border-radius:var(--radius-md);padding:var(--space-4); display:flex;flex-direction:column;gap:var(--space-2); }
.summary-row { display:flex;justify-content:space-between;font-size:.88rem;color:var(--color-text-mid); }
.summary-row.total { font-weight:700;color:var(--color-navy);font-size:.95rem;padding-top:var(--space-2);border-top:1px solid var(--color-border); }
.panel-note { font-size:.75rem;color:var(--color-muted);text-align:center; }
.panel-perks { display:flex;flex-direction:column;gap:var(--space-2);padding-top:var(--space-2);border-top:1px solid var(--color-border-soft); }
.panel-perks li { display:flex;align-items:center;gap:var(--space-2);font-size:.8rem;color:var(--color-text-mid); }

.loading-page { min-height:60vh;display:flex;align-items:center;justify-content:center; }
</style>
