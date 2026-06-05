<template>
  <div>
    <div class="page-header">
      <div class="container">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <RouterLink to="/">Home</RouterLink><span>/</span>
          <RouterLink to="/dashboard">Dashboard</RouterLink><span>/</span>
          <span>Booking History</span>
        </nav>
        <h1>Booking History</h1>
        <p>A complete record of your stays at The Aurelia Grand.</p>
      </div>
    </div>

    <div class="container history-layout">
      <!-- Toolbar -->
      <div class="history-toolbar" role="search" aria-label="Filter bookings">
        <div class="toolbar-search">
          <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <label for="history-search" class="sr-only">Search bookings</label>
          <input id="history-search" type="text" class="form-input search-pad" v-model="filters.search" placeholder="Search by room or confirmation code…" @input="loadBookings" />
        </div>
        <fieldset class="status-filters" aria-label="Filter by status">
          <legend class="sr-only">Filter by booking status</legend>
          <button v-for="s in statusOptions" :key="s.value"
            :class="['status-chip', { active: filters.status === s.value }]"
            @click="setStatus(s.value)" :aria-pressed="filters.status === s.value">
            {{ s.label }}
          </button>
        </fieldset>
      </div>

      <p class="results-info" aria-live="polite">
        <template v-if="!loading">{{ bookings.length }} booking{{ bookings.length !== 1 ? 's' : '' }}</template>
      </p>

      <!-- Loading skeletons -->
      <div v-if="loading" class="loading-state">
        <div v-for="n in 4" :key="n" class="history-skel">
          <div class="skeleton" style="width:150px;height:110px;border-radius:8px;flex-shrink:0"></div>
          <div style="flex:1;display:flex;flex-direction:column;gap:.6rem;padding:.5rem">
            <div class="skeleton" style="height:18px;width:50%"></div>
            <div class="skeleton" style="height:13px"></div>
            <div class="skeleton" style="height:13px;width:70%"></div>
            <div class="skeleton" style="height:13px;width:40%"></div>
          </div>
        </div>
      </div>

      <!-- Bookings list -->
      <div v-else-if="bookings.length > 0" class="bookings-list" role="list">
        <BookingCard
          v-for="booking in bookings" :key="booking.id"
          :booking="booking"
          @cancel="confirmCancel(booking)"
          @view-details="openDetails(booking)"
          role="listitem"
        />
      </div>

      <EmptyState v-else title="No bookings found" :message="emptyMessage">
        <template #icon>📋</template>
        <template #action>
          <div style="display:flex;gap:1rem;flex-wrap:wrap;justify-content:center;">
            <button v-if="filters.status !== 'all'" class="btn btn-ghost btn-sm" @click="setStatus('all')">Show all bookings</button>
            <RouterLink to="/rooms" class="btn btn-primary btn-sm">Browse Rooms</RouterLink>
          </div>
        </template>
      </EmptyState>
    </div>

    <!-- ─── Booking Detail Modal ─── -->
    <AppModal v-model="detailModal.show" title="Booking Details" size="lg">
      <div v-if="detailModal.booking" class="detail-modal">
        <!-- Room image & name header -->
        <div class="detail-room-header">
          <img :src="detailPrimaryImage" :alt="detailModal.booking.room_name" class="detail-room-img" loading="lazy" />
          <div class="detail-room-info">
            <div class="detail-type-pill">{{ detailModal.booking.room_type }}</div>
            <h3 class="detail-room-name">{{ detailModal.booking.room_name }}</h3>
            <StatusBadge :status="detailModal.booking.status" />
          </div>
        </div>

        <!-- Confirmation code -->
        <div class="detail-conf-block">
          <p class="detail-conf-label">Confirmation Number</p>
          <p class="detail-conf-code">{{ detailModal.booking.confirmation_code }}</p>
        </div>

        <!-- Details grid -->
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-label">Check-in</span>
            <span class="detail-val">{{ formatDate(detailModal.booking.check_in) }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Check-out</span>
            <span class="detail-val">{{ formatDate(detailModal.booking.check_out) }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Duration</span>
            <span class="detail-val">{{ detailModal.booking.nights }} nights</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Guests</span>
            <span class="detail-val">{{ detailModal.booking.guests }} {{ detailModal.booking.guests === 1 ? 'guest' : 'guests' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Booked on</span>
            <span class="detail-val">{{ formatDate(detailModal.booking.created_at) }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Room rate</span>
            <span class="detail-val">${{ detailModal.booking.room_price }}/night</span>
          </div>
        </div>

        <!-- Extras -->
        <div v-if="detailExtras.length > 0" class="detail-extras">
          <h4 class="detail-section-label">Extras Included</h4>
          <div class="extras-chips">
            <span v-for="ex in detailExtras" :key="ex" class="extra-chip">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" stroke-width="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
              {{ ex }}
            </span>
          </div>
        </div>

        <!-- Special Requests -->
        <div v-if="detailModal.booking.special_requests" class="detail-requests">
          <h4 class="detail-section-label">Special Requests</h4>
          <p class="detail-requests-text">{{ detailModal.booking.special_requests }}</p>
        </div>

        <!-- Price summary -->
        <div class="detail-price-summary">
          <h4 class="detail-section-label">Price Breakdown</h4>
          <div class="price-rows">
            <div class="price-row">
              <span>${{ detailModal.booking.room_price }} × {{ detailModal.booking.nights }} nights</span>
              <span>${{ (detailModal.booking.room_price * detailModal.booking.nights).toFixed(2) }}</span>
            </div>
            <div class="price-row" v-if="detailModal.booking.extras_price > 0">
              <span>Extras & Add-ons</span>
              <span>+${{ Number(detailModal.booking.extras_price).toFixed(2) }}</span>
            </div>
            <div class="price-row total">
              <span>Total Charged</span>
              <span>${{ Number(detailModal.booking.total_price).toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <button class="btn btn-ghost" @click="detailModal.show = false">Close</button>
        <button
          v-if="detailModal.booking?.status === 'confirmed' && canCancelDetail"
          class="btn btn-danger"
          @click="confirmCancelFromDetail"
        >Cancel Booking</button>
      </template>
    </AppModal>

    <!-- Cancel Confirm Modal -->
    <AppModal v-model="cancelModal.show" title="Cancel Booking" size="sm">
      <div class="cancel-modal-body">
        <div class="cancel-icon" aria-hidden="true">⚠️</div>
        <p class="cancel-title">Are you sure you want to cancel?</p>
        <p class="cancel-desc">
          <strong>{{ cancelModal.booking?.room_name }}</strong><br/>
          Check-in: {{ formatDate(cancelModal.booking?.check_in) }}<br/>
          Code: {{ cancelModal.booking?.confirmation_code }}
        </p>
        <p class="cancel-policy">Free cancellation applies up to 24 hours before check-in.</p>
      </div>
      <template #footer>
        <button class="btn btn-ghost" @click="cancelModal.show = false">Keep Booking</button>
        <button class="btn btn-danger" @click="doCancel" :disabled="cancelModal.loading" :aria-busy="cancelModal.loading">
          <LoadingSpinner v-if="cancelModal.loading" size="sm" inline />
          Yes, Cancel
        </button>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import BookingCard   from '@/components/ui/BookingCard.vue'
import EmptyState    from '@/components/ui/EmptyState.vue'
import AppModal      from '@/components/ui/AppModal.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import StatusBadge   from '@/components/ui/StatusBadge.vue'
import { useUiStore } from '@/stores/uiStore.js'
import api from '@/composables/useApi.js'

const ui = useUiStore()
const bookings = ref([])
const loading  = ref(true)
const filters  = ref({ search: '', status: 'all' })

const statusOptions = [
  { value: 'all',       label: 'All' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

// Detail modal
const detailModal = ref({ show: false, booking: null })

// Cancel modal
const cancelModal = ref({ show: false, booking: null, loading: false })

const detailPrimaryImage = computed(() => {
  const b = detailModal.value.booking
  if (!b) return ''
  const imgs = Array.isArray(b.room_images) ? b.room_images : JSON.parse(b.room_images || '[]')
  return imgs[0] || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format'
})

const detailExtras = computed(() => {
  const ex = detailModal.value.booking?.extras || {}
  const labels = {
    breakfast:       '🍳 Daily Breakfast',
    airportTransfer: '✈️ Airport Transfer',
    lateCheckout:    '🕐 Late Check-out',
    extraBed:        '🛏️ Extra Bed',
  }
  return Object.keys(ex).filter(k => ex[k]).map(k => labels[k] || k)
})

const canCancelDetail = computed(() => {
  const b = detailModal.value.booking
  if (!b) return false
  return Math.ceil((new Date(b.check_in) - new Date()) / 86400000) >= 1
})

const emptyMessage = computed(() => {
  if (filters.value.search) return `No bookings matching "${filters.value.search}".`
  if (filters.value.status !== 'all') return `No ${filters.value.status} bookings found.`
  return 'You have no bookings yet. Start planning your next luxury escape.'
})

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

async function loadBookings() {
  loading.value = true
  try {
    const params = {}
    if (filters.value.status !== 'all') params.status = filters.value.status
    if (filters.value.search) params.search = filters.value.search
    const { data } = await api.get('/bookings', { params })
    bookings.value = data
  } catch (e) { console.error(e) } finally { loading.value = false }
}

function setStatus(val) { filters.value.status = val; loadBookings() }

function openDetails(booking) {
  detailModal.value = { show: true, booking }
}

function confirmCancel(booking) {
  cancelModal.value = { show: true, booking, loading: false }
}

function confirmCancelFromDetail() {
  detailModal.value.show = false
  confirmCancel(detailModal.value.booking)
}

async function doCancel() {
  cancelModal.value.loading = true
  try {
    await api.patch(`/bookings/${cancelModal.value.booking.id}/cancel`)
    ui.success('Booking cancelled successfully.')
    cancelModal.value.show = false
    await loadBookings()
  } catch (e) {
    ui.error(e.message)
  } finally {
    cancelModal.value.loading = false
  }
}

onMounted(loadBookings)
</script>

<style scoped>
.history-layout { padding:var(--space-8) 0 var(--space-16);display:flex;flex-direction:column;gap:var(--space-6); }

.history-toolbar { display:flex;align-items:center;gap:var(--space-4);flex-wrap:wrap;background:var(--color-white);padding:var(--space-4) var(--space-5);border-radius:var(--radius-lg);box-shadow:var(--shadow-xs);border:1px solid var(--color-border-soft); }
.toolbar-search { position:relative;flex:1;min-width:220px; }
.search-icon    { position:absolute;left:.75rem;top:50%;transform:translateY(-50%);color:var(--color-muted);pointer-events:none; }
.search-pad     { padding-left:2.5rem; }
.status-filters { display:flex;gap:var(--space-2);flex-wrap:wrap;border:none;padding:0; }
.status-chip { padding:.4rem .9rem;border-radius:var(--radius-full);border:1.5px solid var(--color-border);font-size:.8rem;font-weight:500;color:var(--color-text-mid);transition:all var(--transition-fast);cursor:pointer; }
.status-chip.active { background:var(--color-navy);color:white;border-color:var(--color-navy); }
.status-chip:hover:not(.active) { border-color:var(--color-navy); }

.results-info { font-size:.82rem;color:var(--color-muted); }
.loading-state,.bookings-list { display:flex;flex-direction:column;gap:var(--space-4); }
.history-skel { display:flex;gap:var(--space-4);background:var(--color-white);border-radius:var(--radius-lg);padding:var(--space-4);border:1px solid var(--color-border-soft); }

/* Detail Modal */
.detail-modal { display:flex;flex-direction:column;gap:var(--space-5); }
.detail-room-header { display:flex;gap:var(--space-4);align-items:flex-start; }
.detail-room-img { width:120px;height:90px;border-radius:var(--radius-md);object-fit:cover;flex-shrink:0; }
.detail-room-info { display:flex;flex-direction:column;gap:var(--space-2); }
.detail-type-pill { display:inline-flex;background:var(--color-gold);color:var(--color-navy);font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;padding:.25rem .65rem;border-radius:var(--radius-full);align-self:flex-start; }
.detail-room-name { font-family:var(--font-display);font-size:1.3rem;font-weight:700;color:var(--color-navy); }

.detail-conf-block { background:var(--color-cream);border-radius:var(--radius-md);padding:var(--space-4);text-align:center;border:1px dashed var(--color-border); }
.detail-conf-label { font-size:.7rem;text-transform:uppercase;letter-spacing:.1em;color:var(--color-muted);margin-bottom:var(--space-1); }
.detail-conf-code  { font-family:var(--font-display);font-size:1.6rem;font-weight:700;color:var(--color-navy);letter-spacing:.08em; }

.detail-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-3); }
@media (max-width:500px) { .detail-grid { grid-template-columns:repeat(2,1fr); } }
.detail-item { background:var(--color-white);border:1px solid var(--color-border-soft);border-radius:var(--radius-md);padding:var(--space-3) var(--space-4); }
.detail-label { display:block;font-size:.68rem;text-transform:uppercase;letter-spacing:.06em;color:var(--color-muted);font-weight:500;margin-bottom:3px; }
.detail-val   { font-weight:600;color:var(--color-navy);font-size:.9rem; }

.detail-section-label { font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--color-muted);margin-bottom:var(--space-3); }

.extras-chips { display:flex;flex-wrap:wrap;gap:var(--space-2); }
.extra-chip { display:inline-flex;align-items:center;gap:var(--space-2);font-size:.82rem;padding:.35rem .8rem;background:var(--color-success-bg);color:var(--color-success);border-radius:var(--radius-full); }

.detail-requests { background:var(--color-info-bg);border-radius:var(--radius-md);padding:var(--space-4); }
.detail-requests-text { font-size:.9rem;color:var(--color-info);font-style:italic; }

.detail-price-summary { background:var(--color-cream);border-radius:var(--radius-md);padding:var(--space-4); }
.price-rows { display:flex;flex-direction:column;gap:var(--space-2); }
.price-row { display:flex;justify-content:space-between;font-size:.88rem;color:var(--color-text-mid); }
.price-row.total { font-weight:700;color:var(--color-navy);font-size:.95rem;padding-top:var(--space-2);border-top:1px solid var(--color-border); }

/* Cancel Modal */
.cancel-modal-body { display:flex;flex-direction:column;align-items:center;gap:var(--space-4);text-align:center; }
.cancel-icon  { font-size:2.5rem; }
.cancel-title { font-family:var(--font-display);font-size:1.15rem;font-weight:600;color:var(--color-navy); }
.cancel-desc  { font-size:.9rem;color:var(--color-text-mid);line-height:1.6;background:var(--color-cream);padding:var(--space-4);border-radius:var(--radius-md);width:100%; }
.cancel-policy { font-size:.8rem;color:var(--color-warning);background:var(--color-warning-bg);padding:.6rem 1rem;border-radius:var(--radius-sm);width:100%; }

.sr-only { position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0); }
</style>
