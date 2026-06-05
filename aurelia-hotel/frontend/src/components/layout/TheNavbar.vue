<template>
  <!-- ── ADMIN TOPBAR (shown when admin is logged in) ── -->
  <div v-if="auth.isAdmin && auth.isLoggedIn" class="admin-topbar-mini" role="banner" aria-label="Admin quick nav">
    <div class="atm-inner">
      <RouterLink to="/admin" class="atm-brand">
        <span>✦</span> Aurelia Admin
      </RouterLink>
      <nav class="atm-links" aria-label="Admin navigation">
        <RouterLink to="/admin"          :class="['atm-link', { active: $route.path === '/admin' }]">Dashboard</RouterLink>
        <RouterLink to="/admin/bookings" :class="['atm-link', { active: $route.path === '/admin/bookings' }]">Bookings</RouterLink>
        <RouterLink to="/admin/rooms"    :class="['atm-link', { active: $route.path === '/admin/rooms' }]">Rooms</RouterLink>
        <RouterLink to="/admin/users"    :class="['atm-link', { active: $route.path === '/admin/users' }]">Guests</RouterLink>
        <RouterLink to="/"               class="atm-link">Hotel Site</RouterLink>
      </nav>
      <div class="atm-actions">
        <span class="atm-user">{{ auth.user?.name?.split(' ')[0] }}</span>
        <button class="btn btn-sm atm-logout" @click="handleLogout" aria-label="Sign out">Sign Out</button>
      </div>
    </div>
  </div>

  <!-- ── GUEST NAVBAR ── -->
  <header v-else class="navbar" :class="{ scrolled: isScrolled, open: menuOpen }" role="banner">
    <div class="container navbar-inner">
      <!-- Logo -->
      <RouterLink to="/" class="navbar-logo" aria-label="The Aurelia Grand - Home">
        <span class="logo-mark" aria-hidden="true">✦</span>
        <div class="logo-text">
          <span class="logo-name">The Aurelia Grand</span>
          <span class="logo-tagline">Luxury Collection</span>
        </div>
      </RouterLink>

      <!-- Desktop Nav -->
      <nav class="navbar-links" aria-label="Main navigation">
        <RouterLink to="/"        :class="['nav-link', { active: $route.path === '/' }]">Home</RouterLink>
        <RouterLink to="/rooms"   :class="['nav-link', { active: $route.path.startsWith('/rooms') }]">Rooms</RouterLink>
        <RouterLink to="/services":class="['nav-link', { active: $route.path === '/services' }]">Services</RouterLink>
        <RouterLink v-if="auth.isLoggedIn" to="/dashboard" :class="['nav-link', { active: $route.path === '/dashboard' }]">Dashboard</RouterLink>
      </nav>

      <!-- Desktop Actions -->
      <div class="navbar-actions">
        <RouterLink v-if="!auth.isLoggedIn" to="/auth" class="btn btn-outline-gold btn-sm">Sign In</RouterLink>
        <template v-else>
          <div class="user-menu-wrap" ref="userMenuRef">
            <button class="user-btn" @click="userMenuOpen = !userMenuOpen" :aria-expanded="userMenuOpen" aria-haspopup="true" aria-label="User menu">
              <div class="user-avatar" aria-hidden="true">{{ initials }}</div>
              <span class="user-name">{{ auth.user?.name?.split(' ')[0] }}</span>
              <svg class="chevron" :class="{ rotated: userMenuOpen }" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>
            </button>
            <Transition name="dropdown">
              <div v-if="userMenuOpen" class="user-dropdown" role="menu" aria-label="Account menu">
                <div class="dropdown-header">
                  <p class="dropdown-name">{{ auth.user?.name }}</p>
                  <p class="dropdown-email">{{ auth.user?.email }}</p>
                </div>
                <hr />
                <RouterLink to="/dashboard" class="dropdown-item" @click="userMenuOpen = false" role="menuitem">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                  Dashboard
                </RouterLink>
                <RouterLink to="/history" class="dropdown-item" @click="userMenuOpen = false" role="menuitem">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Booking History
                </RouterLink>
                <RouterLink to="/profile" class="dropdown-item" @click="userMenuOpen = false" role="menuitem">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Profile Settings
                </RouterLink>
                <hr />
                <button class="dropdown-item danger" @click="handleLogout" role="menuitem">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  Sign Out
                </button>
              </div>
            </Transition>
          </div>
        </template>
        <RouterLink to="/booking" class="btn btn-primary btn-sm">Book Now</RouterLink>
      </div>

      <!-- Mobile hamburger -->
      <button class="hamburger" @click="menuOpen = !menuOpen" :aria-expanded="menuOpen" aria-label="Toggle navigation" aria-controls="mobile-menu">
        <span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>
      </button>
    </div>

    <!-- Mobile Menu -->
    <Transition name="mobile-menu">
      <div v-if="menuOpen" id="mobile-menu" class="mobile-nav" role="navigation" aria-label="Mobile navigation">
        <nav class="mobile-links">
          <RouterLink to="/"        class="mobile-link" @click="menuOpen=false">Home</RouterLink>
          <RouterLink to="/rooms"   class="mobile-link" @click="menuOpen=false">Rooms &amp; Suites</RouterLink>
          <RouterLink to="/services"class="mobile-link" @click="menuOpen=false">Hotel Services</RouterLink>
          <template v-if="auth.isLoggedIn">
            <RouterLink to="/dashboard" class="mobile-link" @click="menuOpen=false">Dashboard</RouterLink>
            <RouterLink to="/history"   class="mobile-link" @click="menuOpen=false">Booking History</RouterLink>
            <RouterLink to="/profile"   class="mobile-link" @click="menuOpen=false">Profile</RouterLink>
            <button class="mobile-link mobile-logout" @click="handleLogout">Sign Out</button>
          </template>
          <template v-else>
            <RouterLink to="/auth" class="mobile-link" @click="menuOpen=false">Sign In / Register</RouterLink>
          </template>
          <RouterLink to="/booking" class="btn btn-primary" style="margin-top:1rem;width:100%;justify-content:center;" @click="menuOpen=false">Book Now</RouterLink>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.js'
import { useUiStore } from '@/stores/uiStore.js'

const auth   = useAuthStore()
const ui     = useUiStore()
const router = useRouter()

const isScrolled   = ref(false)
const menuOpen     = ref(false)
const userMenuOpen = ref(false)
const userMenuRef  = ref(null)

const initials = computed(() => {
  const n = auth.user?.name || ''
  return n.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
})

function handleLogout() {
  auth.logout()
  userMenuOpen.value = false
  menuOpen.value     = false
  ui.success('You have been signed out. Until next time!')
  router.push('/')
}

function onScroll() { isScrolled.value = window.scrollY > 20 }
function onClickOutside(e) {
  if (userMenuRef.value && !userMenuRef.value.contains(e.target)) userMenuOpen.value = false
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('click', onClickOutside)
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('click', onClickOutside)
})
</script>

<style scoped>
/* ── Admin topbar mini ── */
.admin-topbar-mini {
  background:var(--color-navy);border-bottom:1px solid rgba(201,168,76,.2);
  position:sticky;top:0;z-index:1000;
}
.atm-inner {
  max-width:var(--max-width);margin:0 auto;
  padding:0 var(--space-6);height:56px;
  display:flex;align-items:center;gap:var(--space-6);
}
.atm-brand {
  display:flex;align-items:center;gap:var(--space-2);
  font-family:var(--font-display);font-size:.95rem;font-weight:600;
  color:var(--color-gold);flex-shrink:0;
}
.atm-links { display:flex;align-items:center;gap:0;flex:1; }
.atm-link  {
  padding:.4rem .85rem;font-size:.83rem;font-weight:500;color:rgba(255,255,255,.6);
  border-radius:var(--radius-sm);transition:all var(--transition-fast);
}
.atm-link:hover,.atm-link.active { color:white;background:rgba(255,255,255,.07); }
.atm-link.active { color:var(--color-gold); }
.atm-actions { display:flex;align-items:center;gap:var(--space-3);flex-shrink:0; }
.atm-user    { font-size:.82rem;color:rgba(255,255,255,.55); }
.atm-logout  { background:rgba(255,255,255,.08);color:rgba(255,255,255,.75);border:1px solid rgba(255,255,255,.12);padding:.35rem .9rem; }
.atm-logout:hover { background:rgba(255,80,80,.15);color:rgba(255,120,120,.9); }
@media (max-width:768px) { .atm-links { display:none; } }

/* ── Guest Navbar ── */
.navbar {
  position:sticky;top:0;z-index:1000;
  background:rgba(10,22,40,.96);backdrop-filter:blur(12px);
  border-bottom:1px solid rgba(201,168,76,.15);transition:box-shadow var(--transition-base);
}
.navbar.scrolled { box-shadow:0 4px 24px rgba(0,0,0,.3); }
.navbar-inner { height:var(--nav-height);display:flex;align-items:center;gap:var(--space-8); }

.navbar-logo { display:flex;align-items:center;gap:var(--space-3);flex-shrink:0; }
.logo-mark    { color:var(--color-gold);font-size:1.4rem;line-height:1; }
.logo-text    { display:flex;flex-direction:column;gap:1px; }
.logo-name    { font-family:var(--font-display);font-size:1.05rem;font-weight:600;color:var(--color-white);line-height:1;letter-spacing:.02em; }
.logo-tagline { font-size:.62rem;color:var(--color-gold);text-transform:uppercase;letter-spacing:.18em; }

.navbar-links { display:flex;align-items:center;gap:var(--space-1);flex:1; }
.nav-link { padding:.5rem .9rem;font-size:.88rem;font-weight:500;color:rgba(255,255,255,.75);border-radius:var(--radius-sm);transition:color var(--transition-fast),background var(--transition-fast);position:relative; }
.nav-link:hover,.nav-link.active { color:var(--color-white); }
.nav-link.active::after { content:'';position:absolute;bottom:-2px;left:50%;transform:translateX(-50%);width:20px;height:2px;background:var(--color-gold);border-radius:2px; }

.navbar-actions { display:flex;align-items:center;gap:var(--space-3);flex-shrink:0; }

.user-btn { display:flex;align-items:center;gap:var(--space-2);color:rgba(255,255,255,.85);padding:.4rem .75rem;border-radius:var(--radius-sm);transition:background var(--transition-fast); }
.user-btn:hover { background:rgba(255,255,255,.08); }
.user-avatar { width:32px;height:32px;border-radius:50%;background:var(--color-gold);color:var(--color-navy);font-size:.75rem;font-weight:700;display:flex;align-items:center;justify-content:center; }
.user-name { font-size:.88rem;font-weight:500; }
.chevron { transition:transform var(--transition-fast);color:rgba(255,255,255,.5); }
.chevron.rotated { transform:rotate(180deg); }

.user-menu-wrap { position:relative; }
.user-dropdown { position:absolute;top:calc(100% + 8px);right:0;width:220px;background:var(--color-white);border-radius:var(--radius-lg);box-shadow:var(--shadow-xl);border:1px solid var(--color-border);overflow:hidden;z-index:200; }
.dropdown-header { padding:var(--space-4);background:var(--color-cream); }
.dropdown-name   { font-weight:600;font-size:.9rem;color:var(--color-navy); }
.dropdown-email  { font-size:.78rem;color:var(--color-muted);margin-top:2px; }
.user-dropdown hr { border:none;border-top:1px solid var(--color-border);margin:0; }
.dropdown-item { display:flex;align-items:center;gap:var(--space-3);width:100%;padding:var(--space-3) var(--space-4);font-size:.88rem;color:var(--color-text-mid);transition:background var(--transition-fast),color var(--transition-fast);cursor:pointer;text-align:left; }
.dropdown-item:hover { background:var(--color-cream);color:var(--color-navy); }
.dropdown-item.danger:hover { background:var(--color-error-bg);color:var(--color-error); }

.hamburger { display:none;flex-direction:column;gap:5px;padding:var(--space-2);border-radius:var(--radius-sm); }
.hamburger span { display:block;width:22px;height:2px;background:var(--color-white);border-radius:2px;transition:all var(--transition-fast); }
.navbar.open .hamburger span:nth-child(1) { transform:rotate(45deg) translate(5px,5px); }
.navbar.open .hamburger span:nth-child(2) { opacity:0; }
.navbar.open .hamburger span:nth-child(3) { transform:rotate(-45deg) translate(5px,-5px); }

.mobile-nav { background:var(--color-navy);border-top:1px solid rgba(201,168,76,.2);padding:var(--space-6); }
.mobile-links { display:flex;flex-direction:column;gap:var(--space-1); }
.mobile-link { display:block;padding:var(--space-3) var(--space-4);color:rgba(255,255,255,.8);font-size:1rem;font-weight:500;border-radius:var(--radius-md);transition:all var(--transition-fast); }
.mobile-link:hover { background:rgba(255,255,255,.08);color:white; }
.mobile-logout { width:100%;text-align:left;color:rgba(255,100,100,.8); }
.mobile-logout:hover { background:rgba(255,80,80,.1); }

.dropdown-enter-active,.dropdown-leave-active { transition:opacity .15s ease,transform .15s ease; }
.dropdown-enter-from,.dropdown-leave-to { opacity:0;transform:translateY(-6px); }
.mobile-menu-enter-active,.mobile-menu-leave-active { transition:max-height .3s ease,opacity .2s ease;overflow:hidden; }
.mobile-menu-enter-from,.mobile-menu-leave-to { max-height:0;opacity:0; }
.mobile-menu-enter-to,.mobile-menu-leave-from { max-height:500px;opacity:1; }

@media (max-width:900px) { .navbar-links,.navbar-actions { display:none; } .hamburger { display:flex;margin-left:auto; } }
</style>
