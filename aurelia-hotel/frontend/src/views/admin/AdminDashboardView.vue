<template>
  <AdminLayout page-title="Dashboard Overview">
    <div class="admin-dashboard">

      <!-- Stats Row -->
      <div class="stats-grid" role="list" aria-label="Key metrics">
        <div v-if="loading" v-for="n in 4" :key="n" class="skeleton stat-skel" role="listitem"></div>
        <template v-else>
          <div class="stat-tile gold" role="listitem">
            <div class="stat-tile-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <div class="stat-tile-body">
              <p class="stat-tile-label">Total Revenue</p>
              <p class="stat-tile-val">${{ Number(stats.totalRevenue).toLocaleString('en-AU', {minimumFractionDigits:0}) }}</p>
              <p class="stat-tile-sub">Excluding cancellations</p>
            </div>
          </div>

          <div class="stat-tile blue" role="listitem">
            <div class="stat-tile-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <div class="stat-tile-body">
              <p class="stat-tile-label">Total Bookings</p>
              <p class="stat-tile-val">{{ stats.totalBookings }}</p>
              <p class="stat-tile-sub">{{ stats.activeBookings }} confirmed</p>
            </div>
          </div>

          <div class="stat-tile green" role="listitem">
            <div class="stat-tile-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div class="stat-tile-body">
              <p class="stat-tile-label">Registered Guests</p>
              <p class="stat-tile-val">{{ stats.totalUsers }}</p>
              <p class="stat-tile-sub">Active accounts</p>
            </div>
          </div>

          <div class="stat-tile purple" role="listitem">
            <div class="stat-tile-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
            </div>
            <div class="stat-tile-body">
              <p class="stat-tile-label">Rooms Available</p>
              <p class="stat-tile-val">{{ stats.availRooms }}<span class="stat-of"> / {{ stats.totalRooms }}</span></p>
              <p class="stat-tile-sub">{{ stats.totalRooms - stats.availRooms }} unavailable</p>
            </div>
          </div>
        </template>
      </div>

      <!-- Secondary stats -->
      <div class="secondary-stats" v-if="!loading">
        <div class="sec-stat">
          <span class="sec-dot confirmed" aria-hidden="true"></span>
          <span class="sec-label">Confirmed</span>
          <span class="sec-val">{{ stats.activeBookings }}</span>
        </div>
        <div class="sec-stat">
          <span class="sec-dot completed" aria-hidden="true"></span>
          <span class="sec-label">Completed</span>
          <span class="sec-val">{{ stats.completed }}</span>
        </div>
        <div class="sec-stat">
          <span class="sec-dot cancelled" aria-hidden="true"></span>
          <span class="sec-label">Cancelled</span>
          <span class="sec-val">{{ stats.cancelled }}</span>
        </div>
        <div class="sec-stat">
          <span class="sec-label">Cancellation Rate</span>
          <span class="sec-val">{{ stats.totalBookings ? Math.round(stats.cancelled / stats.totalBookings * 100) : 0 }}%</span>
        </div>
      </div>

      <div class="dashboard-body">
        <!-- Recent Bookings -->
        <section class="admin-card" aria-labelledby="recent-bk-heading">
          <div class="admin-card-header">
            <h2 id="recent-bk-heading" class="admin-card-title">Recent Bookings</h2>
            <RouterLink to="/admin/bookings" class="view-all-link">View All</RouterLink>
          </div>

          <div v-if="loading" class="table-loading">
            <div v-for="n in 5" :key="n" class="skeleton" style="height:52px;border-radius:8px"></div>
          </div>

          <div v-else-if="recentBookings.length" class="admin-table-wrap" role="region" aria-label="Recent bookings table">
            <table class="admin-table" aria-label="Recent bookings">
              <thead>
                <tr>
                  <th scope="col">Guest</th>
                  <th scope="col">Room</th>
                  <th scope="col">Check-in</th>
                  <th scope="col">Check-out</th>
                  <th scope="col">Total</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="b in recentBookings" :key="b.id">
                  <td>
                    <div class="guest-cell">
                      <div class="guest-avatar" aria-hidden="true">{{ b.guest_name?.[0] }}</div>
                      <div>
                        <p class="guest-name">{{ b.guest_name }}</p>
                        <p class="guest-email">{{ b.guest_email }}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p class="room-cell-name">{{ b.room_name }}</p>
                    <p class="room-cell-type">{{ b.room_type }}</p>
                  </td>
                  <td class="date-cell">{{ fmtDate(b.check_in) }}</td>
                  <td class="date-cell">{{ fmtDate(b.check_out) }}</td>
                  <td class="price-cell">${{ Number(b.total_price).toFixed(0) }}</td>
                  <td><StatusBadge :status="b.status" /></td>
                  <td>
                    <select class="status-select" :value="b.status" @change="updateStatus(b.id, $event.target.value)" :aria-label="`Change status for ${b.room_name} booking`">
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="empty-table">No bookings yet.</div>
        </section>

        <!-- Top Rooms -->
        <section class="admin-card" aria-labelledby="top-rooms-heading">
          <div class="admin-card-header">
            <h2 id="top-rooms-heading" class="admin-card-title">Top Performing Rooms</h2>
            <RouterLink to="/admin/rooms" class="view-all-link">Manage</RouterLink>
          </div>

          <div v-if="loading" class="top-rooms-loading">
            <div v-for="n in 5" :key="n" class="skeleton" style="height:64px;border-radius:8px"></div>
          </div>

          <ul v-else class="top-rooms-list" role="list">
            <li v-for="(room, idx) in topRooms" :key="room.id" class="top-room-item" role="listitem">
              <span class="room-rank" :class="`rank-${idx+1}`" aria-label="Rank {{ idx + 1 }}">{{ idx + 1 }}</span>
              <img :src="room.images?.[0] || fallbackImg" :alt="room.name" class="room-thumb" loading="lazy" />
              <div class="room-info">
                <p class="room-info-name">{{ room.name }}</p>
                <p class="room-info-type">{{ room.type }} · ${{ room.price_per_night }}/night</p>
              </div>
              <div class="room-metrics">
                <p class="metric-val">{{ room.booking_count }}</p>
                <p class="metric-label">bookings</p>
              </div>
              <div class="room-metrics">
                <p class="metric-val">${{ Number(room.revenue || 0).toFixed(0) }}</p>
                <p class="metric-label">revenue</p>
              </div>
            </li>
          </ul>
        </section>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from './AdminLayout.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import { useUiStore } from '@/stores/uiStore.js'
import api from '@/composables/useApi.js'

const ui = useUiStore()
const loading        = ref(true)
const stats          = ref({ totalRevenue:0, totalBookings:0, activeBookings:0, totalUsers:0, totalRooms:0, availRooms:0, cancelled:0, completed:0 })
const recentBookings = ref([])
const topRooms       = ref([])
const fallbackImg    = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=200&auto=format'

function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
}

async function updateStatus(id, status) {
  try {
    await api.patch(`/admin/bookings/${id}/status`, { status })
    ui.success(`Booking status updated to "${status}"`)
    const b = recentBookings.value.find(b => b.id === id)
    if (b) b.status = status
  } catch (e) { ui.error(e.message) }
}

onMounted(async () => {
  try {
    const { data } = await api.get('/admin/stats')
    stats.value          = data.stats
    recentBookings.value = data.recentBookings
    topRooms.value       = data.topRooms
  } catch (e) { ui.error('Failed to load dashboard data') }
  finally { loading.value = false }
})
</script>

<style scoped>
.admin-dashboard { display:flex;flex-direction:column;gap:var(--space-6); }

/* Stat tiles */
.stats-grid { display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-4); }
@media (max-width:1200px) { .stats-grid { grid-template-columns:repeat(2,1fr); } }
@media (max-width:580px)  { .stats-grid { grid-template-columns:1fr; } }
.stat-skel { height:110px;border-radius:var(--radius-lg); }

.stat-tile {
  background:white;border-radius:var(--radius-lg);padding:var(--space-5);
  display:flex;gap:var(--space-4);align-items:flex-start;
  border:1px solid #E5E7EB;box-shadow:0 1px 3px rgba(0,0,0,.05);
  border-top:3px solid transparent;
}
.stat-tile.gold   { border-top-color:#C9A84C; }
.stat-tile.blue   { border-top-color:#3B82F6; }
.stat-tile.green  { border-top-color:#10B981; }
.stat-tile.purple { border-top-color:#8B5CF6; }

.stat-tile-icon {
  width:44px;height:44px;border-radius:var(--radius-md);
  display:flex;align-items:center;justify-content:center;flex-shrink:0;
}
.gold   .stat-tile-icon { background:#FEF3C7;color:#C9A84C; }
.blue   .stat-tile-icon { background:#EFF6FF;color:#3B82F6; }
.green  .stat-tile-icon { background:#ECFDF5;color:#10B981; }
.purple .stat-tile-icon { background:#F5F3FF;color:#8B5CF6; }

.stat-tile-label { font-size:.72rem;font-weight:600;text-transform:uppercase;letter-spacing:.07em;color:#6B7280;margin-bottom:var(--space-1); }
.stat-tile-val   { font-family:var(--font-display);font-size:1.9rem;font-weight:700;color:var(--color-navy);line-height:1; }
.stat-of         { font-size:1rem;color:#9CA3AF;font-weight:400; }
.stat-tile-sub   { font-size:.72rem;color:#9CA3AF;margin-top:4px; }

/* Secondary stats */
.secondary-stats {
  display:flex;align-items:center;gap:var(--space-6);flex-wrap:wrap;
  background:white;border-radius:var(--radius-lg);padding:var(--space-4) var(--space-5);
  border:1px solid #E5E7EB;
}
.sec-stat  { display:flex;align-items:center;gap:var(--space-2); }
.sec-dot   { width:8px;height:8px;border-radius:50%; }
.sec-dot.confirmed { background:#10B981; }
.sec-dot.completed { background:#3B82F6; }
.sec-dot.cancelled { background:#EF4444; }
.sec-label { font-size:.82rem;color:#6B7280; }
.sec-val   { font-size:.9rem;font-weight:700;color:var(--color-navy); }

/* Cards */
.dashboard-body { display:grid;grid-template-columns:1fr 380px;gap:var(--space-6); }
@media (max-width:1200px) { .dashboard-body { grid-template-columns:1fr; } }

.admin-card { background:white;border-radius:var(--radius-lg);border:1px solid #E5E7EB;overflow:hidden; }
.admin-card-header { display:flex;align-items:center;justify-content:space-between;padding:var(--space-5) var(--space-5);border-bottom:1px solid #F3F4F6; }
.admin-card-title  { font-family:var(--font-display);font-size:1.05rem;font-weight:600;color:var(--color-navy); }
.view-all-link     { font-size:.8rem;color:var(--color-gold);font-weight:600;transition:opacity .2s; }
.view-all-link:hover { opacity:.7; }

/* Table */
.admin-table-wrap { overflow-x:auto; }
.table-loading    { display:flex;flex-direction:column;gap:var(--space-3);padding:var(--space-5); }
.admin-table { width:100%;border-collapse:collapse; }
.admin-table th { padding:var(--space-3) var(--space-4);text-align:left;font-size:.72rem;font-weight:600;text-transform:uppercase;letter-spacing:.07em;color:#6B7280;background:#F9FAFB;border-bottom:1px solid #F3F4F6;white-space:nowrap; }
.admin-table td { padding:var(--space-4);border-bottom:1px solid #F9FAFB;vertical-align:middle; }
.admin-table tr:last-child td { border-bottom:none; }
.admin-table tr:hover td { background:#FAFAFA; }

.guest-cell  { display:flex;align-items:center;gap:var(--space-3); }
.guest-avatar { width:32px;height:32px;border-radius:50%;background:var(--color-gold);color:var(--color-navy);font-size:.72rem;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
.guest-name  { font-size:.85rem;font-weight:600;color:var(--color-navy);white-space:nowrap; }
.guest-email { font-size:.72rem;color:#9CA3AF; }
.room-cell-name { font-size:.85rem;font-weight:500;color:var(--color-navy);white-space:nowrap; }
.room-cell-type { font-size:.72rem;color:#9CA3AF; }
.date-cell   { font-size:.82rem;color:#374151;white-space:nowrap; }
.price-cell  { font-size:.9rem;font-weight:600;color:var(--color-navy); }

.status-select {
  border:1px solid #E5E7EB;border-radius:var(--radius-sm);
  padding:.3rem .6rem;font-size:.78rem;color:#374151;
  background:white;cursor:pointer;transition:border-color .2s;
}
.status-select:focus { outline:none;border-color:var(--color-gold); }
.empty-table { padding:var(--space-8);text-align:center;color:#9CA3AF;font-size:.88rem; }

/* Top Rooms */
.top-rooms-loading { display:flex;flex-direction:column;gap:var(--space-3);padding:var(--space-5); }
.top-rooms-list    { list-style:none; }
.top-room-item     { display:flex;align-items:center;gap:var(--space-3);padding:var(--space-4) var(--space-5);border-bottom:1px solid #F9FAFB;transition:background .15s; }
.top-room-item:last-child { border-bottom:none; }
.top-room-item:hover { background:#FAFAFA; }
.room-rank { width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.72rem;font-weight:700;flex-shrink:0; }
.rank-1 { background:#FEF3C7;color:#C9A84C; }
.rank-2 { background:#F3F4F6;color:#6B7280; }
.rank-3 { background:#FEF3C7;color:#B45309; }
.rank-4,.rank-5 { background:#F9FAFB;color:#9CA3AF; }
.room-thumb { width:44px;height:36px;border-radius:var(--radius-sm);object-fit:cover;flex-shrink:0; }
.room-info  { flex:1;min-width:0; }
.room-info-name { font-size:.85rem;font-weight:600;color:var(--color-navy);overflow:hidden;white-space:nowrap;text-overflow:ellipsis; }
.room-info-type { font-size:.72rem;color:#9CA3AF; }
.room-metrics   { text-align:right;flex-shrink:0; }
.metric-val     { font-size:.9rem;font-weight:700;color:var(--color-navy); }
.metric-label   { font-size:.68rem;color:#9CA3AF;text-transform:uppercase;letter-spacing:.04em; }
</style>
