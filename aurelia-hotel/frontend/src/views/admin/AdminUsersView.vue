<template>
  <AdminLayout page-title="Guest Management">
    <div class="admin-users">

      <div class="users-toolbar">
        <div class="search-wrap">
          <svg class="si" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <label for="user-search" class="sr-only">Search guests</label>
          <input id="user-search" type="text" class="form-input si-input" v-model="search" placeholder="Search by name or email…" />
        </div>
        <span class="count-badge" aria-live="polite">{{ filteredUsers.length }} guest{{ filteredUsers.length !== 1 ? 's' : '' }}</span>
      </div>

      <div class="admin-card">
        <div v-if="loading" class="tbl-loading">
          <div v-for="n in 5" :key="n" class="skeleton" style="height:64px;border-radius:8px"></div>
        </div>

        <div v-else-if="filteredUsers.length" class="tbl-wrap" role="region" aria-label="Guest list">
          <table class="users-table" aria-label="Registered guests">
            <thead>
              <tr>
                <th scope="col">Guest</th>
                <th scope="col">Phone</th>
                <th scope="col">Member Since</th>
                <th scope="col">Bookings</th>
                <th scope="col">Total Spent</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="u in filteredUsers" :key="u.id" class="user-row">
                <td>
                  <div class="user-cell">
                    <div class="user-ava" aria-hidden="true">{{ u.name?.[0] }}</div>
                    <div>
                      <p class="u-name">{{ u.name }}</p>
                      <p class="u-email">{{ u.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="u-phone">{{ u.phone || '—' }}</td>
                <td class="u-date">{{ fmtDate(u.created_at) }}</td>
                <td class="u-center">
                  <span class="count-chip">{{ u.booking_count || 0 }}</span>
                </td>
                <td class="u-spent">${{ Number(u.total_spent || 0).toFixed(0) }}</td>
                <td>
                  <span :class="['user-status', u.booking_count > 0 ? 'active' : 'new']">
                    {{ u.booking_count > 0 ? 'Returning Guest' : 'New Guest' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="tbl-empty">
          <p aria-hidden="true">👤</p>
          <p>No guests found</p>
        </div>
      </div>

      <!-- Summary cards -->
      <div class="user-summary" v-if="!loading">
        <div class="us-card">
          <p class="us-val">{{ users.length }}</p>
          <p class="us-label">Total Guests</p>
        </div>
        <div class="us-card">
          <p class="us-val">{{ users.filter(u => u.booking_count > 0).length }}</p>
          <p class="us-label">Returning Guests</p>
        </div>
        <div class="us-card">
          <p class="us-val">${{ avgSpend }}</p>
          <p class="us-label">Avg. Guest Spend</p>
        </div>
        <div class="us-card">
          <p class="us-val">{{ topSpender?.name?.split(' ')[0] || '—' }}</p>
          <p class="us-label">Top Spender</p>
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

const ui      = useUiStore()
const users   = ref([])
const loading = ref(true)
const search  = ref('')

const filteredUsers = computed(() => {
  if (!search.value) return users.value
  const s = search.value.toLowerCase()
  return users.value.filter(u => u.name?.toLowerCase().includes(s) || u.email?.toLowerCase().includes(s))
})

const avgSpend = computed(() => {
  const withSpend = users.value.filter(u => u.total_spent > 0)
  if (!withSpend.length) return 0
  return (withSpend.reduce((s,u) => s + Number(u.total_spent||0), 0) / withSpend.length).toFixed(0)
})

const topSpender = computed(() =>
  users.value.reduce((top, u) => (!top || Number(u.total_spent) > Number(top.total_spent)) ? u : top, null)
)

function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
}

onMounted(async () => {
  try {
    const { data } = await api.get('/admin/users')
    users.value = data
  } catch (e) { ui.error('Failed to load guests') }
  finally { loading.value = false }
})
</script>

<style scoped>
.admin-users { display:flex;flex-direction:column;gap:var(--space-5); }

.users-toolbar { display:flex;align-items:center;gap:var(--space-4);flex-wrap:wrap; }
.search-wrap { position:relative;flex:1;min-width:220px; }
.si   { position:absolute;left:.75rem;top:50%;transform:translateY(-50%);color:#9CA3AF;pointer-events:none; }
.si-input { padding-left:2.5rem; }
.count-badge { font-size:.82rem;font-weight:600;color:#6B7280;white-space:nowrap; }

.admin-card { background:white;border-radius:var(--radius-lg);border:1px solid #E5E7EB;overflow:hidden; }
.tbl-loading { display:flex;flex-direction:column;gap:var(--space-3);padding:var(--space-5); }
.tbl-wrap    { overflow-x:auto; }

.users-table { width:100%;border-collapse:collapse; }
.users-table th { padding:var(--space-3) var(--space-5);text-align:left;font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#6B7280;background:#F9FAFB;border-bottom:1px solid #E5E7EB; }
.users-table td { padding:var(--space-4) var(--space-5);border-bottom:1px solid #F9FAFB;vertical-align:middle; }
.users-table tr:last-child td { border-bottom:none; }
.user-row:hover td { background:#FAFBFF; }

.user-cell { display:flex;align-items:center;gap:var(--space-3); }
.user-ava  { width:34px;height:34px;border-radius:50%;background:var(--color-gold);color:var(--color-navy);font-size:.75rem;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
.u-name    { font-size:.88rem;font-weight:600;color:var(--color-navy); }
.u-email   { font-size:.72rem;color:#9CA3AF; }
.u-phone   { font-size:.82rem;color:#6B7280; }
.u-date    { font-size:.82rem;color:#6B7280;white-space:nowrap; }
.u-center  { text-align:center; }
.count-chip { background:#EFF6FF;color:#3B82F6;font-size:.75rem;font-weight:700;padding:.2rem .7rem;border-radius:var(--radius-full); }
.u-spent   { font-size:.9rem;font-weight:700;color:var(--color-navy); }

.user-status { font-size:.72rem;font-weight:600;padding:.25rem .7rem;border-radius:var(--radius-full); }
.user-status.active { background:#ECFDF5;color:#10B981; }
.user-status.new    { background:#F3F4F6;color:#6B7280; }

.tbl-empty { padding:var(--space-10);text-align:center;color:#9CA3AF;font-size:.88rem;display:flex;flex-direction:column;gap:var(--space-2);align-items:center; }

.user-summary { display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-4); }
@media (max-width:768px) { .user-summary { grid-template-columns:repeat(2,1fr); } }
@media (max-width:480px) { .user-summary { grid-template-columns:1fr; } }
.us-card { background:white;border-radius:var(--radius-lg);padding:var(--space-5);border:1px solid #E5E7EB;text-align:center; }
.us-val   { font-family:var(--font-display);font-size:1.8rem;font-weight:700;color:var(--color-navy); }
.us-label { font-size:.75rem;color:#9CA3AF;text-transform:uppercase;letter-spacing:.06em;margin-top:4px; }

.sr-only { position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0); }
</style>
