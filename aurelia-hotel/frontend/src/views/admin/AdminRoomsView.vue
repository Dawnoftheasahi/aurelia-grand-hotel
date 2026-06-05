<template>
  <AdminLayout page-title="Room Management">
    <div class="admin-rooms">

      <div class="page-actions">
        <p class="page-desc">Manage availability and view performance for each room.</p>
        <div class="page-filters">
          <label for="rm-filter" class="sr-only">Filter rooms</label>
          <select id="rm-filter" class="form-input filter-select" v-model="typeFilter">
            <option value="all">All Types</option>
            <option value="Standard">Standard</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Suite">Suite</option>
            <option value="Family">Family</option>
          </select>
        </div>
      </div>

      <!-- Loading skeletons -->
      <div v-if="loading" class="rooms-grid">
        <div v-for="n in 8" :key="n" class="skeleton" style="height:300px;border-radius:12px"></div>
      </div>

      <!-- Room cards -->
      <div v-else class="rooms-grid" role="list" aria-label="Room management cards">
        <article
          v-for="room in filteredRooms" :key="room.id"
          class="room-mgmt-card"
          :class="{ unavailable: !room.is_available }"
          role="listitem"
          :aria-label="`${room.name}, ${room.is_available ? 'available' : 'unavailable'}`"
        >
          <!-- Image -->
          <div class="rm-img-wrap">
            <img :src="room.images?.[0] || fallback" :alt="room.name" class="rm-img" loading="lazy" />
            <div class="rm-type-badge">{{ room.type }}</div>
            <div class="rm-avail-overlay" v-if="!room.is_available" aria-hidden="true">
              <span>UNAVAILABLE</span>
            </div>
          </div>

          <!-- Body -->
          <div class="rm-body">
            <div class="rm-header">
              <div>
                <h3 class="rm-name">{{ room.name }}</h3>
                <p class="rm-meta">Floor {{ room.floor }} · {{ room.bed_type }} · {{ room.size_sqm }}m²</p>
              </div>
              <p class="rm-price">${{ room.price_per_night }}<span>/night</span></p>
            </div>

            <!-- Metrics -->
            <div class="rm-metrics" role="list">
              <div class="rm-metric" role="listitem">
                <p class="metric-n">{{ room.booking_count || 0 }}</p>
                <p class="metric-l">Total Bookings</p>
              </div>
              <div class="rm-metric" role="listitem">
                <p class="metric-n">${{ Number(room.total_revenue || 0).toFixed(0) }}</p>
                <p class="metric-l">Revenue</p>
              </div>
              <div class="rm-metric" role="listitem">
                <div class="stars-mini" aria-label="Rating: {{ room.rating }} out of 5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--color-gold)" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  <span class="metric-n">{{ room.rating }}</span>
                </div>
                <p class="metric-l">Rating</p>
              </div>
            </div>

            <!-- View type -->
            <p class="rm-view">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              {{ room.view_type }}
            </p>

            <!-- Availability toggle -->
            <div class="rm-actions">
              <label class="toggle-wrap" :for="`avail-${room.id}`">
                <input
                  type="checkbox"
                  :id="`avail-${room.id}`"
                  class="toggle-input"
                  :checked="!!room.is_available"
                  @change="toggleAvailability(room)"
                  :disabled="room.updating"
                  :aria-label="`Toggle availability for ${room.name}`"
                />
                <span class="toggle-track" aria-hidden="true"></span>
                <span class="toggle-label">{{ room.is_available ? 'Available' : 'Unavailable' }}</span>
              </label>
              <RouterLink :to="`/rooms/${room.id}`" target="_blank" class="btn btn-ghost btn-sm" aria-label="View room on website">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                View
              </RouterLink>
            </div>
          </div>
        </article>
      </div>

      <!-- Summary -->
      <div class="rooms-summary" v-if="!loading">
        <div class="summary-item">
          <span class="s-label">Total Rooms</span>
          <span class="s-val">{{ rooms.length }}</span>
        </div>
        <div class="summary-item">
          <span class="s-label">Available</span>
          <span class="s-val avail">{{ rooms.filter(r => r.is_available).length }}</span>
        </div>
        <div class="summary-item">
          <span class="s-label">Unavailable</span>
          <span class="s-val unavail">{{ rooms.filter(r => !r.is_available).length }}</span>
        </div>
        <div class="summary-item">
          <span class="s-label">Total Revenue</span>
          <span class="s-val">${{ rooms.reduce((s,r) => s + Number(r.total_revenue||0), 0).toFixed(0) }}</span>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminLayout from './AdminLayout.vue'
import { useUiStore } from '@/stores/uiStore.js'
import api from '@/composables/useApi.js'

const ui       = useUiStore()
const rooms    = ref([])
const loading  = ref(true)
const typeFilter = ref('all')
const fallback = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&auto=format'

const filteredRooms = computed(() =>
  typeFilter.value === 'all' ? rooms.value : rooms.value.filter(r => r.type === typeFilter.value)
)

async function toggleAvailability(room) {
  room.updating = true
  const newVal = room.is_available ? 0 : 1
  try {
    await api.patch(`/admin/rooms/${room.id}/availability`, { is_available: newVal })
    room.is_available = newVal
    ui.success(`${room.name} is now ${newVal ? 'available' : 'unavailable'}.`)
  } catch (e) {
    ui.error(e.message)
  } finally {
    room.updating = false
  }
}

onMounted(async () => {
  try {
    const { data } = await api.get('/admin/rooms')
    rooms.value = data.map(r => ({ ...r, updating: false }))
  } catch (e) { ui.error('Failed to load rooms') }
  finally { loading.value = false }
})
</script>

<style scoped>
.admin-rooms { display:flex;flex-direction:column;gap:var(--space-5); }

.page-actions { display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:var(--space-3); }
.page-desc    { font-size:.88rem;color:#6B7280; }
.filter-select { width:auto;padding:.5rem .9rem;font-size:.85rem; }

.rooms-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:var(--space-5); }

.room-mgmt-card { background:white;border-radius:var(--radius-lg);border:1px solid #E5E7EB;overflow:hidden;display:flex;flex-direction:column;transition:box-shadow .2s; }
.room-mgmt-card:hover { box-shadow:0 4px 20px rgba(0,0,0,.1); }
.room-mgmt-card.unavailable { opacity:.7; }

.rm-img-wrap { position:relative;height:160px;overflow:hidden; }
.rm-img { width:100%;height:100%;object-fit:cover;transition:transform .4s; }
.room-mgmt-card:hover .rm-img { transform:scale(1.03); }
.rm-type-badge {
  position:absolute;top:var(--space-3);left:var(--space-3);
  background:var(--color-gold);color:var(--color-navy);
  font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;
  padding:.2rem .6rem;border-radius:var(--radius-full);
}
.rm-avail-overlay {
  position:absolute;inset:0;background:rgba(0,0,0,.55);
  display:flex;align-items:center;justify-content:center;
}
.rm-avail-overlay span { color:white;font-size:.78rem;font-weight:700;letter-spacing:.12em;border:2px solid rgba(255,255,255,.5);padding:.4rem 1rem;border-radius:var(--radius-full); }

.rm-body { padding:var(--space-4);display:flex;flex-direction:column;gap:var(--space-3);flex:1; }
.rm-header { display:flex;align-items:flex-start;justify-content:space-between;gap:var(--space-2); }
.rm-name { font-family:var(--font-display);font-size:1rem;font-weight:600;color:var(--color-navy); }
.rm-meta { font-size:.72rem;color:#9CA3AF;margin-top:2px; }
.rm-price { font-family:var(--font-display);font-size:1.1rem;font-weight:700;color:var(--color-navy);white-space:nowrap; }
.rm-price span { font-size:.7rem;font-weight:400;color:#9CA3AF; }

.rm-metrics { display:flex;gap:var(--space-4); }
.rm-metric  { display:flex;flex-direction:column;gap:2px; }
.metric-n   { font-size:.95rem;font-weight:700;color:var(--color-navy); }
.metric-l   { font-size:.65rem;text-transform:uppercase;letter-spacing:.06em;color:#9CA3AF; }
.stars-mini { display:flex;align-items:center;gap:3px; }

.rm-view { display:flex;align-items:center;gap:var(--space-2);font-size:.78rem;color:#6B7280; }

.rm-actions { display:flex;align-items:center;justify-content:space-between;padding-top:var(--space-3);border-top:1px solid #F3F4F6;margin-top:auto; }

/* Toggle switch */
.toggle-wrap  { display:flex;align-items:center;gap:var(--space-2);cursor:pointer; }
.toggle-input { position:absolute;opacity:0;width:0;height:0; }
.toggle-track {
  position:relative;width:40px;height:22px;background:#E5E7EB;border-radius:11px;
  transition:background .2s;flex-shrink:0;
}
.toggle-track::after {
  content:'';position:absolute;top:3px;left:3px;
  width:16px;height:16px;background:white;border-radius:50%;
  box-shadow:0 1px 3px rgba(0,0,0,.2);transition:transform .2s;
}
.toggle-input:checked + .toggle-track { background:#10B981; }
.toggle-input:checked + .toggle-track::after { transform:translateX(18px); }
.toggle-input:focus-visible + .toggle-track { outline:3px solid var(--color-gold);outline-offset:2px; }
.toggle-input:disabled + .toggle-track { opacity:.5;cursor:not-allowed; }
.toggle-label { font-size:.8rem;font-weight:500;color:#374151; }

/* Summary */
.rooms-summary { display:flex;gap:var(--space-6);flex-wrap:wrap;background:white;border-radius:var(--radius-lg);padding:var(--space-4) var(--space-6);border:1px solid #E5E7EB; }
.summary-item { display:flex;flex-direction:column;gap:2px; }
.s-label  { font-size:.68rem;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:#9CA3AF; }
.s-val    { font-size:1.15rem;font-weight:700;color:var(--color-navy); }
.s-val.avail  { color:#10B981; }
.s-val.unavail { color:#EF4444; }

.sr-only { position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0); }
</style>
