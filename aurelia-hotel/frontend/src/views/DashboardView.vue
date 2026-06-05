<template>
  <div class="dashboard">
    <div class="page-header">
      <div class="container">
        <h1>{{ greeting }}, <em>{{ auth.user?.name?.split(' ')[0] }}</em> ✦</h1>
        <p>Manage your stays and explore exclusive member benefits.</p>
      </div>
    </div>

    <div class="container dashboard-layout">
      <!-- ─── STATS ─── -->
      <section class="stats-row" aria-label="Booking statistics">
        <template v-if="loading">
          <div v-for="n in 4" :key="n" class="skeleton" style="height:110px;border-radius:12px"></div>
        </template>
        <template v-else>
          <StatCard label="Total Bookings" :value="data.stats.total" sub="All time" variant="gold">
            <template #icon>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </template>
          </StatCard>
          <StatCard label="Upcoming Stays" :value="data.stats.upcoming" sub="Confirmed" variant="navy">
            <template #icon>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8a16 16 0 0 0 6 6l.93-.93a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 15l.19 1.92z"/></svg>
            </template>
          </StatCard>
          <StatCard label="Completed" :value="data.stats.completed" sub="Stays enjoyed" variant="green">
            <template #icon>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            </template>
          </StatCard>
          <StatCard label="Total Spent" :value="`$${Number(data.stats.totalSpent).toFixed(0)}`" sub="Excluding cancellations" variant="gold">
            <template #icon>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </template>
          </StatCard>
        </template>
      </section>

      <div class="dashboard-content">
        <!-- ─── Next Stay ─── -->
        <section class="dash-card next-stay" aria-labelledby="next-stay-heading" v-if="!loading">
          <h2 id="next-stay-heading" class="dash-card-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
            Your Next Stay
          </h2>
          <div v-if="data.nextBooking" class="next-stay-card">
            <img :src="nextImage" :alt="data.nextBooking.room_name" class="next-stay-img" loading="lazy" />
            <div class="next-stay-body">
              <div class="next-stay-top">
                <div>
                  <p class="next-stay-room">{{ data.nextBooking.room_name }}</p>
                  <p class="next-stay-type">{{ data.nextBooking.room_type }} Room</p>
                </div>
                <StatusBadge :status="data.nextBooking.status" />
              </div>
              <div class="next-stay-dates">
                <div class="next-date">
                  <span class="date-lbl">Arrival</span>
                  <span class="date-val">{{ formatDate(data.nextBooking.check_in) }}</span>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-border)" stroke-width="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                <div class="next-date">
                  <span class="date-lbl">Departure</span>
                  <span class="date-val">{{ formatDate(data.nextBooking.check_out) }}</span>
                </div>
                <div class="next-date">
                  <span class="date-lbl">Nights</span>
                  <span class="date-val">{{ data.nextBooking.nights }}</span>
                </div>
              </div>
              <div class="next-stay-footer">
                <span class="conf-code">{{ data.nextBooking.confirmation_code }}</span>
                <span class="countdown-badge" v-if="daysUntilCheckin !== null">
                  {{ daysUntilCheckin === 0 ? '🎉 Today!' : `In ${daysUntilCheckin} day${daysUntilCheckin !== 1 ? 's' : ''}` }}
                </span>
              </div>
            </div>
          </div>
          <EmptyState v-else title="No upcoming stays" message="Ready for your next escape? Browse our rooms." compact>
            <template #icon>✈️</template>
            <template #action>
              <RouterLink to="/rooms" class="btn btn-primary btn-sm">Browse Rooms</RouterLink>
            </template>
          </EmptyState>
        </section>

        <!-- ─── Recent Bookings ─── -->
        <section class="dash-card" aria-labelledby="recent-heading">
          <div class="dash-card-header">
            <h2 id="recent-heading" class="dash-card-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Recent Bookings
            </h2>
            <RouterLink to="/history" class="link-view-all">View All</RouterLink>
          </div>

          <div v-if="loading" class="recent-loading">
            <div v-for="n in 3" :key="n" class="booking-skel">
              <div class="skeleton" style="width:90px;height:70px;border-radius:8px;flex-shrink:0"></div>
              <div style="flex:1;display:flex;flex-direction:column;gap:.5rem;padding:.5rem 0">
                <div class="skeleton" style="height:16px;width:60%"></div>
                <div class="skeleton" style="height:12px"></div>
                <div class="skeleton" style="height:12px;width:45%"></div>
              </div>
            </div>
          </div>

          <div v-else-if="data.recentBookings?.length" class="recent-list">
            <BookingCard v-for="b in data.recentBookings" :key="b.id" :booking="b" @cancel="cancelBooking(b.id)" />
          </div>

          <EmptyState v-else title="No bookings yet" message="Your booking history will appear here." compact>
            <template #icon>📋</template>
          </EmptyState>
        </section>
      </div>

      <!-- ─── QUICK LINKS ─── -->
      <section class="quick-links" aria-label="Quick actions">
        <h2 class="dash-section-label">Quick Actions</h2>
        <div class="quick-links-grid">
          <RouterLink to="/booking" class="quick-link-card">
            <span class="ql-icon" aria-hidden="true">🏨</span>
            <span class="ql-label">New Booking</span>
          </RouterLink>
          <RouterLink to="/history" class="quick-link-card">
            <span class="ql-icon" aria-hidden="true">📋</span>
            <span class="ql-label">All Bookings</span>
          </RouterLink>
          <RouterLink to="/rooms" class="quick-link-card">
            <span class="ql-icon" aria-hidden="true">🔍</span>
            <span class="ql-label">Browse Rooms</span>
          </RouterLink>
          <RouterLink to="/profile" class="quick-link-card">
            <span class="ql-icon" aria-hidden="true">👤</span>
            <span class="ql-label">Profile Settings</span>
          </RouterLink>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import StatCard from '@/components/ui/StatCard.vue'
import BookingCard from '@/components/ui/BookingCard.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { useAuthStore } from '@/stores/authStore.js'
import { useUiStore } from '@/stores/uiStore.js'
import api from '@/composables/useApi.js'

const auth = useAuthStore(); const ui = useUiStore()
const loading = ref(true)
const data = ref({ stats: { total:0,upcoming:0,completed:0,cancelled:0,totalSpent:0 }, nextBooking: null, recentBookings: [] })

const greeting = computed(() => {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
})

const nextImage = computed(() => {
  const imgs = data.value.nextBooking?.room_images || []
  return imgs[0] || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'
})

const daysUntilCheckin = computed(() => {
  if (!data.value.nextBooking) return null
  const diff = Math.ceil((new Date(data.value.nextBooking.check_in) - new Date()) / 86400000)
  return Math.max(0, diff)
})

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' })
}

async function cancelBooking(id) {
  try {
    await api.patch(`/bookings/${id}/cancel`)
    ui.success('Booking cancelled successfully.')
    await loadData()
  } catch (e) { ui.error(e.message) }
}

async function loadData() {
  try {
    const { data: d } = await api.get('/dashboard/summary')
    data.value = d
  } catch (e) { console.error(e) } finally { loading.value = false }
}

onMounted(loadData)
</script>

<style scoped>
.dashboard { background:var(--color-cream);min-height:100vh; }
.page-header h1 em { font-style:italic;color:var(--color-gold-light); }

.dashboard-layout { padding:var(--space-8) 0 var(--space-16);display:flex;flex-direction:column;gap:var(--space-8); }

.stats-row { display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-5); }
@media (max-width:1024px) { .stats-row { grid-template-columns:repeat(2,1fr); } }
@media (max-width:480px)  { .stats-row { grid-template-columns:1fr; } }

.dashboard-content { display:grid;grid-template-columns:1fr 1fr;gap:var(--space-6); }
@media (max-width:900px) { .dashboard-content { grid-template-columns:1fr; } }

.dash-card { background:var(--color-white);border-radius:var(--radius-xl);padding:var(--space-6);box-shadow:var(--shadow-sm);border:1px solid var(--color-border-soft); }
.dash-card-header { display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-5); }
.dash-card-title { display:flex;align-items:center;gap:var(--space-3);font-family:var(--font-display);font-size:1.1rem;font-weight:600;color:var(--color-navy); }
.dash-card-title + * { margin-top:var(--space-5); }
.link-view-all { font-size:.82rem;color:var(--color-gold);font-weight:500;transition:opacity var(--transition-fast); }
.link-view-all:hover { opacity:.7; }

/* Next Stay */
.next-stay-card { border-radius:var(--radius-lg);overflow:hidden;border:1px solid var(--color-border-soft); }
.next-stay-img  { width:100%;height:160px;object-fit:cover; }
.next-stay-body { padding:var(--space-4); }
.next-stay-top  { display:flex;align-items:flex-start;justify-content:space-between;gap:var(--space-3);margin-bottom:var(--space-4); }
.next-stay-room { font-family:var(--font-display);font-size:1.05rem;font-weight:600;color:var(--color-navy); }
.next-stay-type { font-size:.75rem;color:var(--color-muted);margin-top:2px; }
.next-stay-dates { display:flex;align-items:center;gap:var(--space-4);flex-wrap:wrap;margin-bottom:var(--space-4); }
.next-date { display:flex;flex-direction:column;gap:2px; }
.date-lbl { font-size:.68rem;text-transform:uppercase;letter-spacing:.06em;color:var(--color-muted);font-weight:500; }
.date-val { font-size:.9rem;font-weight:600;color:var(--color-navy); }
.next-stay-footer { display:flex;align-items:center;justify-content:space-between; }
.conf-code { font-size:.75rem;font-weight:600;color:var(--color-gold);background:var(--color-gold-pale);padding:.2rem .6rem;border-radius:var(--radius-sm); }
.countdown-badge { font-size:.78rem;font-weight:600;color:var(--color-info);background:var(--color-info-bg);padding:.25rem .75rem;border-radius:var(--radius-full); }

/* Recent */
.recent-loading { display:flex;flex-direction:column;gap:var(--space-3); }
.booking-skel   { display:flex;gap:var(--space-3);padding:var(--space-3);border-radius:var(--radius-md);background:var(--color-cream); }
.recent-list    { display:flex;flex-direction:column;gap:var(--space-4); }

/* Quick Links */
.dash-section-label { font-family:var(--font-display);font-size:1.1rem;font-weight:600;color:var(--color-navy);margin-bottom:var(--space-4); }
.quick-links-grid { display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-4); }
@media (max-width:640px) { .quick-links-grid { grid-template-columns:repeat(2,1fr); } }
.quick-link-card {
  background:var(--color-white);border-radius:var(--radius-lg);padding:var(--space-6);
  display:flex;flex-direction:column;align-items:center;gap:var(--space-3);
  border:1px solid var(--color-border-soft);box-shadow:var(--shadow-xs);
  transition:all var(--transition-base);text-align:center;
}
.quick-link-card:hover { transform:translateY(-2px);box-shadow:var(--shadow-md);border-color:var(--color-gold); }
.ql-icon  { font-size:1.8rem; }
.ql-label { font-size:.85rem;font-weight:600;color:var(--color-navy); }
</style>
