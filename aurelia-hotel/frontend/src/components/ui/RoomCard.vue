<template>
  <article class="room-card" :aria-label="`${room.name}, ${room.type} room, $${room.price_per_night} per night`">
    <RouterLink :to="`/rooms/${room.id}`" class="card-image-link" tabindex="-1" aria-hidden="true">
      <div class="card-img-wrap">
        <img :src="primaryImage" :alt="`${room.name} interior`" class="card-img" loading="lazy" />
        <div class="card-type-badge">{{ room.type }}</div>
        <div class="card-img-overlay"></div>
      </div>
    </RouterLink>

    <div class="card-body">
      <div class="card-top">
        <div>
          <RouterLink :to="`/rooms/${room.id}`" class="card-name-link">
            <h3 class="card-name">{{ room.name }}</h3>
          </RouterLink>
          <div class="card-meta">
            <span class="meta-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <span>Up to {{ room.capacity }} {{ room.capacity === 1 ? 'guest' : 'guests' }}</span>
            </span>
            <span class="meta-dot" aria-hidden="true">·</span>
            <span class="meta-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M3 11V8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v3"/></svg>
              <span>{{ room.bed_type }}</span>
            </span>
            <span class="meta-dot" aria-hidden="true">·</span>
            <span class="meta-item">{{ room.size_sqm }}m²</span>
          </div>
        </div>
        <div class="card-rating" :aria-label="`Rated ${room.rating} out of 5`">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--color-gold)" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <span>{{ room.rating }}</span>
          <span class="review-count">({{ room.review_count }})</span>
        </div>
      </div>

      <p class="card-desc">{{ truncatedDesc }}</p>

      <div class="card-amenities">
        <span v-for="am in displayAmenities" :key="am" class="amenity-chip">{{ am }}</span>
        <span v-if="extraAmenities > 0" class="amenity-chip amenity-more">+{{ extraAmenities }} more</span>
      </div>

      <div class="card-footer">
        <div class="price-block">
          <span class="price-amount">${{ room.price_per_night }}</span>
          <span class="price-unit">/night</span>
        </div>
        <div class="card-actions">
          <RouterLink :to="`/rooms/${room.id}`" class="btn btn-ghost btn-sm">View Details</RouterLink>
          <RouterLink :to="{ name: 'Booking', query: { room: room.id } }" class="btn btn-primary btn-sm">Book Now</RouterLink>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  room: { type: Object, required: true }
})

const primaryImage = computed(() => {
  const imgs = Array.isArray(props.room.images) ? props.room.images : JSON.parse(props.room.images || '[]')
  return imgs[0] || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'
})

const truncatedDesc = computed(() => {
  const d = props.room.description || ''
  return d.length > 110 ? d.substring(0, 110) + '…' : d
})

const displayAmenities = computed(() => {
  const a = Array.isArray(props.room.amenities) ? props.room.amenities : JSON.parse(props.room.amenities || '[]')
  return a.slice(0, 4)
})

const extraAmenities = computed(() => {
  const a = Array.isArray(props.room.amenities) ? props.room.amenities : JSON.parse(props.room.amenities || '[]')
  return Math.max(0, a.length - 4)
})
</script>

<style scoped>
.room-card {
  background: var(--color-white); border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm); overflow: hidden;
  display: flex; flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.room-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }

.card-img-wrap { position: relative; overflow: hidden; height: 220px; }
.card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
.room-card:hover .card-img { transform: scale(1.05); }
.card-img-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.25), transparent 60%); }
.card-type-badge {
  position: absolute; top: var(--space-4); left: var(--space-4);
  background: var(--color-gold); color: var(--color-navy);
  font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;
  padding: 0.25rem 0.65rem; border-radius: var(--radius-full);
}

.card-body { padding: var(--space-5); display: flex; flex-direction: column; gap: var(--space-3); flex: 1; }

.card-top { display: flex; justify-content: space-between; align-items: flex-start; gap: var(--space-3); }
.card-name-link:hover .card-name { color: var(--color-gold); }
.card-name { font-family: var(--font-display); font-size: 1.2rem; font-weight: 600; color: var(--color-navy); transition: color var(--transition-fast); }
.card-meta { display: flex; align-items: center; flex-wrap: wrap; gap: var(--space-2); margin-top: var(--space-1); }
.meta-item { display: flex; align-items: center; gap: 4px; font-size: 0.78rem; color: var(--color-muted); }
.meta-dot  { color: var(--color-border); font-size: 0.9rem; }

.card-rating { display: flex; align-items: center; gap: 4px; font-size: 0.85rem; font-weight: 600; color: var(--color-navy); flex-shrink: 0; }
.review-count { font-weight: 400; color: var(--color-muted); font-size: 0.78rem; }

.card-desc { font-size: 0.85rem; color: var(--color-text-mid); line-height: 1.5; }

.card-amenities { display: flex; flex-wrap: wrap; gap: var(--space-2); }
.amenity-chip {
  font-size: 0.72rem; padding: 0.2rem 0.65rem;
  background: var(--color-cream); color: var(--color-text-mid);
  border-radius: var(--radius-full); border: 1px solid var(--color-border);
}
.amenity-more { background: var(--color-gold-pale); color: var(--color-navy); border-color: var(--color-gold-pale); }

.card-footer { display: flex; align-items: center; justify-content: space-between; padding-top: var(--space-3); border-top: 1px solid var(--color-border-soft); margin-top: auto; flex-wrap: wrap; gap: var(--space-3); }
.price-block { display: flex; align-items: baseline; gap: 4px; }
.price-amount { font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; color: var(--color-navy); }
.price-unit   { font-size: 0.82rem; color: var(--color-muted); }
.card-actions { display: flex; gap: var(--space-2); }
</style>
