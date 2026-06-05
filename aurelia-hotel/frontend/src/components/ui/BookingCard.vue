<template>
  <article class="booking-card" :aria-label="`Booking for ${booking.room_name}`">
    <div class="booking-img-wrap">
      <img :src="primaryImage" :alt="booking.room_name" class="booking-img" loading="lazy" />
    </div>
    <div class="booking-content">
      <div class="booking-top">
        <div>
          <h3 class="booking-room">{{ booking.room_name }}</h3>
          <p class="booking-type">{{ booking.room_type }} Room</p>
        </div>
        <StatusBadge :status="booking.status" />
      </div>
      <div class="booking-dates">
        <div class="date-item">
          <span class="date-label">Check-in</span>
          <span class="date-value">{{ formatDate(booking.check_in) }}</span>
        </div>
        <div class="date-arrow" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </div>
        <div class="date-item">
          <span class="date-label">Check-out</span>
          <span class="date-value">{{ formatDate(booking.check_out) }}</span>
        </div>
        <div class="date-item nights">
          <span class="date-label">Duration</span>
          <span class="date-value">{{ booking.nights }} nights</span>
        </div>
      </div>
      <div class="booking-footer">
        <div class="booking-meta">
          <span class="conf-code">{{ booking.confirmation_code }}</span>
          <span class="booking-guests">{{ booking.guests }} {{ booking.guests === 1 ? 'guest' : 'guests' }}</span>
        </div>
        <div class="booking-price-actions">
          <span class="booking-total">${{ Number(booking.total_price).toFixed(2) }}</span>
          <div class="booking-actions">
            <!-- Emit view-details so parent can show modal -->
            <button class="btn btn-ghost btn-sm" @click="$emit('view-details', booking)" aria-label="View booking details">
              Details
            </button>
            <button
              v-if="booking.status === 'confirmed' && canCancel"
              class="btn btn-sm cancel-btn"
              @click="$emit('cancel', booking.id)"
              aria-label="Cancel this booking"
            >Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import StatusBadge from './StatusBadge.vue'

const props = defineProps({ booking: { type: Object, required: true } })
defineEmits(['cancel', 'view-details'])

const primaryImage = computed(() => {
  const imgs = Array.isArray(props.booking.room_images)
    ? props.booking.room_images
    : JSON.parse(props.booking.room_images || '[]')
  return imgs[0] || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format'
})

const canCancel = computed(() => {
  const diff = Math.ceil((new Date(props.booking.check_in) - new Date()) / 86400000)
  return diff >= 1
})

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
.booking-card { background:var(--color-white);border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);overflow:hidden;display:flex;border:1px solid var(--color-border-soft);transition:box-shadow var(--transition-base); }
.booking-card:hover { box-shadow:var(--shadow-md); }
.booking-img-wrap { width:160px;flex-shrink:0; }
.booking-img { width:100%;height:100%;object-fit:cover; }
.booking-content { flex:1;padding:var(--space-5);display:flex;flex-direction:column;gap:var(--space-4); }
.booking-top { display:flex;align-items:flex-start;justify-content:space-between;gap:var(--space-3); }
.booking-room { font-family:var(--font-display);font-size:1.1rem;font-weight:600;color:var(--color-navy); }
.booking-type { font-size:.78rem;color:var(--color-muted);margin-top:2px; }
.booking-dates { display:flex;align-items:center;gap:var(--space-4);flex-wrap:wrap; }
.date-item { display:flex;flex-direction:column;gap:2px; }
.date-label { font-size:.7rem;font-weight:500;color:var(--color-muted);text-transform:uppercase;letter-spacing:.06em; }
.date-value { font-size:.9rem;font-weight:600;color:var(--color-navy); }
.date-arrow { color:var(--color-border); }
.booking-footer { display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:var(--space-3);padding-top:var(--space-3);border-top:1px solid var(--color-border-soft);margin-top:auto; }
.booking-meta { display:flex;align-items:center;gap:var(--space-4); }
.conf-code { font-size:.78rem;font-weight:600;color:var(--color-gold);background:var(--color-gold-pale);padding:.2rem .6rem;border-radius:var(--radius-sm); }
.booking-guests { font-size:.78rem;color:var(--color-muted); }
.booking-price-actions { display:flex;align-items:center;gap:var(--space-3); }
.booking-total { font-family:var(--font-display);font-size:1.2rem;font-weight:700;color:var(--color-navy); }
.booking-actions { display:flex;gap:var(--space-2); }
.cancel-btn { border:1px solid var(--color-error);color:var(--color-error);background:transparent;transition:all var(--transition-fast); }
.cancel-btn:hover { background:var(--color-error-bg); }
@media (max-width:640px) {
  .booking-img-wrap { width:100px; }
  .booking-content { padding:var(--space-4); }
  .date-arrow { display:none; }
}
</style>
