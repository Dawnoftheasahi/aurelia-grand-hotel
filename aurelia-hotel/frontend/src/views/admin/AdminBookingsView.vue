<template>
  <AdminLayout page-title="Booking Management">
    <div class="admin-bookings">

      <!-- Toolbar -->
      <div class="bookings-toolbar">
        <div class="toolbar-search-wrap">
          <svg class="tsearch-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <label for="bk-search" class="sr-only">Search bookings</label>
          <input id="bk-search" type="text" class="form-input tsearch-input" v-model="filters.search" @input="load" placeholder="Guest name, email, room, or confirmation code…" />
        </div>
        <div class="toolbar-filters">
          <label for="bk-status" class="sr-only">Filter by status</label>
          <select id="bk-status" class="form-input filter-select" v-model="filters.status" @change="load">
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div class="toolbar-meta" aria-live="polite">
          <span class="meta-count">{{ bookings.length }} booking{{ bookings.length !== 1 ? 's' : '' }}</span>
        </div>
      </div>

      <!-- Table card -->
      <div class="admin-card">
        <!-- Loading -->
        <div v-if="loading" class="table-loading-state">
          <div v-for="n in 6" :key="n" class="skeleton" style="height:60px;border-radius:8px"></div>
        </div>

        <!-- Table -->
        <div v-else-if="bookings.length" class="table-wrap" role="region" aria-label="All bookings">
          <table class="full-table" aria-label="All hotel bookings">
            <thead>
              <tr>
                <th scope="col">Code</th>
                <th scope="col">Guest</th>
                <th scope="col">Room</th>
                <th scope="col">Check-in</th>
                <th scope="col">Check-out</th>
                <th scope="col">Nights</th>
                <th scope="col">Guests</th>
                <th scope="col">Total</th>
                <th scope="col">Status</th>
                <th scope="col">Update Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="b in bookings" :key="b.id" :class="['booking-row', b.status]">
                <td>
                  <span class="conf-pill">{{ b.confirmation_code }}</span>
                </td>
                <td>
                  <div class="guest-cell">
                    <div class="guest-ava" aria-hidden="true">{{ b.guest_name?.[0] }}</div>
                    <div>
                      <p class="g-name">{{ b.guest_name }}</p>
                      <p class="g-email">{{ b.guest_email }}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="room-cell">
                    <img :src="roomThumb(b)" :alt="b.room_name" class="room-ava" loading="lazy" />
                    <div>
                      <p class="r-name">{{ b.room_name }}</p>
                      <p class="r-type">{{ b.room_type }}</p>
                    </div>
                  </div>
                </td>
                <td class="mono">{{ fmtDate(b.check_in) }}</td>
                <td class="mono">{{ fmtDate(b.check_out) }}</td>
                <td class="center">{{ b.nights }}</td>
                <td class="center">{{ b.guests }}</td>
                <td class="price">${{ Number(b.total_price).toFixed(0) }}</td>
                <td><StatusBadge :status="b.status" /></td>
                <td>
                  <select
                    class="status-sel"
                    :value="b.status"
                    @change="updateStatus(b.id, $event.target.value, b)"
                    :disabled="b.updating"
                    :aria-label="`Change status for booking ${b.confirmation_code}`"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty -->
        <div v-else class="table-empty">
          <p class="empty-icon" aria-hidden="true">📋</p>
          <p class="empty-label">No bookings found</p>
          <p class="empty-sub">Try adjusting your search or filter.</p>
        </div>
      </div>

      <!-- Summary row -->
      <div class="summary-footer" v-if="!loading && bookings.length">
        <div class="sf-item" v-for="s in summaryStats" :key="s.label">
          <span class="sf-label">{{ s.label }}</span>
          <span class="sf-val">{{ s.val }}</span>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminLayout from './AdminLayout.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import { useUiStore } from '@/stores/uiStore.js'
import api from '@/composables/useApi.js'

const ui = useUiStore()
const bookings = ref([])
const loading  = ref(true)
const filters  = ref({ search: '', status: 'all' })

function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
}

function roomThumb(b) {
  const imgs = Array.isArray(b.room_images) ? b.room_images : JSON.parse(b.room_images || '[]')
  return imgs[0] || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=200&auto=format'
}

const summaryStats = computed(() => {
  const visible = bookings.value
  const revenue = visible.filter(b => b.status !== 'cancelled').reduce((s,b) => s + Number(b.total_price), 0)
  const confirmed = visible.filter(b => b.status === 'confirmed').length
  const completed = visible.filter(b => b.status === 'completed').length
  const cancelled = visible.filter(b => b.status === 'cancelled').length
  return [
    { label: 'Visible Revenue', val: `$${revenue.toFixed(0)}` },
    { label: 'Confirmed',       val: confirmed },
    { label: 'Completed',       val: completed },
    { label: 'Cancelled',       val: cancelled },
  ]
})

async function load() {
  loading.value = true
  try {
    const params = {}
    if (filters.value.status !== 'all') params.status = filters.value.status
    if (filters.value.search) params.search = filters.value.search
    const { data } = await api.get('/admin/bookings', { params })
    bookings.value = data.map(b => ({ ...b, updating: false }))
  } catch (e) { ui.error('Failed to load bookings') }
  finally { loading.value = false }
}

async function updateStatus(id, status, booking) {
  booking.updating = true
  try {
    await api.patch(`/admin/bookings/${id}/status`, { status })
    booking.status   = status
    booking.updating = false
    ui.success(`Booking ${booking.confirmation_code} → ${status}`)
  } catch (e) {
    booking.updating = false
    ui.error(e.message)
  }
}

onMounted(load)
</script>

<style scoped>
.admin-bookings { display:flex;flex-direction:column;gap:var(--space-5); }

/* Toolbar */
.bookings-toolbar { display:flex;align-items:center;gap:var(--space-3);flex-wrap:wrap; }
.toolbar-search-wrap { position:relative;flex:1;min-width:260px; }
.tsearch-icon  { position:absolute;left:.75rem;top:50%;transform:translateY(-50%);color:#9CA3AF;pointer-events:none; }
.tsearch-input { padding-left:2.5rem; }
.toolbar-filters { flex-shrink:0; }
.filter-select { width:auto;padding:.6rem 1rem;font-size:.85rem; }
.toolbar-meta  { font-size:.82rem;color:#6B7280;flex-shrink:0; }
.meta-count    { font-weight:600;color:var(--color-navy); }

/* Card */
.admin-card { background:white;border-radius:var(--radius-lg);border:1px solid #E5E7EB;overflow:hidden; }
.table-loading-state { display:flex;flex-direction:column;gap:var(--space-3);padding:var(--space-5); }
.table-wrap  { overflow-x:auto; }

.full-table { width:100%;border-collapse:collapse;white-space:nowrap; }
.full-table th {
  padding:var(--space-3) var(--space-4);text-align:left;
  font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;
  color:#6B7280;background:#F9FAFB;border-bottom:1px solid #E5E7EB;
}
.full-table td { padding:var(--space-4) var(--space-4);border-bottom:1px solid #F9FAFB;vertical-align:middle; }
.full-table tr:last-child td { border-bottom:none; }
.booking-row:hover td { background:#FAFBFF; }
.booking-row.cancelled td { opacity:.65; }

.conf-pill { background:#F3F4F6;color:var(--color-navy);font-size:.72rem;font-weight:700;padding:.25rem .65rem;border-radius:var(--radius-sm);letter-spacing:.05em;font-family:monospace; }

.guest-cell { display:flex;align-items:center;gap:var(--space-3); }
.guest-ava  { width:30px;height:30px;border-radius:50%;background:var(--color-gold);color:var(--color-navy);font-size:.68rem;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
.g-name  { font-size:.85rem;font-weight:600;color:var(--color-navy); }
.g-email { font-size:.72rem;color:#9CA3AF; }

.room-cell { display:flex;align-items:center;gap:var(--space-2); }
.room-ava  { width:40px;height:32px;border-radius:var(--radius-sm);object-fit:cover;flex-shrink:0; }
.r-name { font-size:.82rem;font-weight:500;color:var(--color-navy); }
.r-type { font-size:.68rem;color:#9CA3AF; }

.mono   { font-size:.82rem;color:#374151; }
.center { text-align:center;font-size:.85rem;font-weight:500;color:var(--color-navy); }
.price  { font-size:.9rem;font-weight:700;color:var(--color-navy); }

.status-sel {
  border:1px solid #E5E7EB;border-radius:var(--radius-sm);
  padding:.35rem .7rem;font-size:.78rem;color:#374151;background:white;cursor:pointer;
}
.status-sel:focus { outline:none;border-color:var(--color-gold); }
.status-sel:disabled { opacity:.5;cursor:not-allowed; }

.table-empty { padding:var(--space-12);text-align:center;display:flex;flex-direction:column;align-items:center;gap:var(--space-3); }
.empty-icon  { font-size:2rem; }
.empty-label { font-family:var(--font-display);font-size:1.1rem;color:var(--color-navy); }
.empty-sub   { font-size:.85rem;color:#9CA3AF; }

/* Summary footer */
.summary-footer { display:flex;gap:var(--space-6);flex-wrap:wrap;background:white;border-radius:var(--radius-lg);padding:var(--space-4) var(--space-5);border:1px solid #E5E7EB; }
.sf-item  { display:flex;flex-direction:column;gap:2px; }
.sf-label { font-size:.68rem;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:#9CA3AF; }
.sf-val   { font-size:1.1rem;font-weight:700;color:var(--color-navy); }

.sr-only { position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0); }
</style>
