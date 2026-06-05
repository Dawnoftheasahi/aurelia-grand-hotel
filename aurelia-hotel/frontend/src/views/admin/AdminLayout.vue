<template>
  <div class="admin-shell">
    <!-- Sidebar -->
    <aside class="admin-sidebar" :class="{ open: sidebarOpen }" aria-label="Admin navigation">
      <div class="sidebar-header">
        <div class="sidebar-brand">
          <span class="brand-mark" aria-hidden="true">✦</span>
          <div>
            <p class="brand-name">Aurelia Grand</p>
            <p class="brand-role">Admin Panel</p>
          </div>
        </div>
        <button class="sidebar-close" @click="sidebarOpen = false" aria-label="Close sidebar">
          <svg width="18" height="18" viewBox="0 0 18 18"><path d="M1 1l16 16M17 1L1 17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
        </button>
      </div>

      <div class="sidebar-admin-info">
        <div class="admin-avatar" aria-hidden="true">{{ initials }}</div>
        <div>
          <p class="admin-name">{{ auth.user?.name }}</p>
          <span class="admin-badge">Administrator</span>
        </div>
      </div>

      <nav class="sidebar-nav" aria-label="Admin sections">
        <RouterLink v-for="item in navItems" :key="item.to" :to="item.to"
          :class="['sidebar-link', { active: $route.path === item.to || ($route.path.startsWith(item.to) && item.to !== '/admin') }]"
          @click="sidebarOpen = false">
          <span class="link-icon" aria-hidden="true" v-html="item.icon"></span>
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div class="sidebar-footer">
        <RouterLink to="/" class="sidebar-link-sm">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          View Hotel Site
        </RouterLink>
        <button class="sidebar-link-sm logout-btn" @click="handleLogout">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Sign Out
        </button>
      </div>
    </aside>

    <!-- Overlay for mobile -->
    <div v-if="sidebarOpen" class="sidebar-overlay" @click="sidebarOpen = false" aria-hidden="true"></div>

    <!-- Main content area -->
    <div class="admin-main">
      <!-- Top bar -->
      <header class="admin-topbar" role="banner">
        <button class="topbar-menu-btn" @click="sidebarOpen = true" aria-label="Open navigation" aria-expanded="sidebarOpen">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <div class="topbar-title">
          <h1 class="topbar-heading">{{ pageTitle }}</h1>
        </div>
        <div class="topbar-right">
          <span class="topbar-date">{{ currentDate }}</span>
        </div>
      </header>

      <!-- Page slot -->
      <main class="admin-content" id="admin-main-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.js'
import { useUiStore } from '@/stores/uiStore.js'

const auth   = useAuthStore()
const ui     = useUiStore()
const router = useRouter()
const route  = useRoute()

defineProps({ pageTitle: { type: String, default: 'Admin Panel' } })

const sidebarOpen = ref(false)

const initials = computed(() => {
  const n = auth.user?.name || ''
  return n.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
})

const currentDate = computed(() =>
  new Date().toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })
)

const navItems = [
  {
    to: '/admin', label: 'Dashboard',
    icon: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`
  },
  {
    to: '/admin/bookings', label: 'All Bookings',
    icon: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`
  },
  {
    to: '/admin/rooms', label: 'Room Management',
    icon: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`
  },
  {
    to: '/admin/users', label: 'Guests',
    icon: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
  },
]

function handleLogout() {
  auth.logout()
  ui.success('Signed out of admin panel.')
  router.push('/')
}
</script>

<style scoped>
.admin-shell { display:flex;min-height:100vh;background:#F0F2F5; }

/* Sidebar */
.admin-sidebar {
  width:260px;flex-shrink:0;background:var(--color-navy);
  display:flex;flex-direction:column;
  position:fixed;top:0;left:0;height:100vh;z-index:500;
  transition:transform var(--transition-base);
}
@media (max-width:1024px) {
  .admin-sidebar { transform:translateX(-100%); }
  .admin-sidebar.open { transform:translateX(0); }
}

.sidebar-header { display:flex;align-items:center;justify-content:space-between;padding:var(--space-5) var(--space-5);border-bottom:1px solid rgba(255,255,255,0.08); }
.sidebar-brand  { display:flex;align-items:center;gap:var(--space-3); }
.brand-mark { color:var(--color-gold);font-size:1.3rem; }
.brand-name { font-family:var(--font-display);font-size:.95rem;font-weight:600;color:white;line-height:1; }
.brand-role { font-size:.62rem;color:var(--color-gold);text-transform:uppercase;letter-spacing:.15em;margin-top:2px; }
.sidebar-close { color:rgba(255,255,255,.4);padding:4px;border-radius:4px;transition:color var(--transition-fast);display:none; }
.sidebar-close:hover { color:white; }
@media (max-width:1024px) { .sidebar-close { display:flex; } }

.sidebar-admin-info { display:flex;align-items:center;gap:var(--space-3);padding:var(--space-4) var(--space-5);border-bottom:1px solid rgba(255,255,255,.06);background:rgba(255,255,255,.04); }
.admin-avatar { width:38px;height:38px;border-radius:50%;background:var(--color-gold);color:var(--color-navy);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.82rem;flex-shrink:0; }
.admin-name  { font-size:.88rem;font-weight:600;color:white; }
.admin-badge { font-size:.62rem;text-transform:uppercase;letter-spacing:.1em;color:var(--color-gold);background:rgba(201,168,76,.12);border:1px solid rgba(201,168,76,.25);padding:.15rem .5rem;border-radius:var(--radius-full);margin-top:2px;display:inline-block; }

.sidebar-nav { display:flex;flex-direction:column;gap:2px;padding:var(--space-4) var(--space-3);flex:1; }
.sidebar-link {
  display:flex;align-items:center;gap:var(--space-3);
  padding:var(--space-3) var(--space-4);border-radius:var(--radius-md);
  font-size:.88rem;font-weight:500;color:rgba(255,255,255,.6);
  transition:all var(--transition-fast);
}
.sidebar-link:hover { background:rgba(255,255,255,.07);color:white; }
.sidebar-link.active { background:rgba(201,168,76,.15);color:var(--color-gold);border:1px solid rgba(201,168,76,.2); }
.link-icon { flex-shrink:0; }

.sidebar-footer { padding:var(--space-4) var(--space-3);border-top:1px solid rgba(255,255,255,.06);display:flex;flex-direction:column;gap:2px; }
.sidebar-link-sm { display:flex;align-items:center;gap:var(--space-3);padding:var(--space-2) var(--space-4);border-radius:var(--radius-md);font-size:.82rem;color:rgba(255,255,255,.4);transition:all var(--transition-fast);width:100%;text-align:left; }
.sidebar-link-sm:hover { background:rgba(255,255,255,.06);color:rgba(255,255,255,.7); }
.logout-btn:hover { color:rgba(255,100,100,.8) !important; }

.sidebar-overlay { position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:499;display:none; }
@media (max-width:1024px) { .sidebar-overlay { display:block; } }

/* Main */
.admin-main { flex:1;margin-left:260px;display:flex;flex-direction:column;min-height:100vh; }
@media (max-width:1024px) { .admin-main { margin-left:0; } }

.admin-topbar {
  background:white;border-bottom:1px solid #E5E7EB;
  padding:0 var(--space-6);height:64px;
  display:flex;align-items:center;gap:var(--space-4);
  position:sticky;top:0;z-index:100;
}
.topbar-menu-btn { color:#6B7280;padding:var(--space-2);border-radius:var(--radius-md);transition:background var(--transition-fast); }
.topbar-menu-btn:hover { background:#F3F4F6; }
@media (min-width:1025px) { .topbar-menu-btn { display:none; } }
.topbar-title { flex:1; }
.topbar-heading { font-family:var(--font-display);font-size:1.2rem;font-weight:600;color:var(--color-navy); }
.topbar-right { display:flex;align-items:center;gap:var(--space-4); }
.topbar-date { font-size:.8rem;color:#9CA3AF; }

.admin-content { padding:var(--space-6);flex:1; }
@media (max-width:640px) { .admin-content { padding:var(--space-4); } }
</style>
