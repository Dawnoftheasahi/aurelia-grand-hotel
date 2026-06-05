import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.js'

const routes = [
  // Public
  { path: '/',          name: 'Home',           component: () => import('@/views/HomeView.vue') },
  { path: '/rooms',     name: 'Rooms',          component: () => import('@/views/RoomsView.vue') },
  { path: '/rooms/:id', name: 'RoomDetail',     component: () => import('@/views/RoomDetailView.vue') },
  { path: '/services',  name: 'Services',       component: () => import('@/views/ServicesView.vue') },
  { path: '/auth',      name: 'Auth',           component: () => import('@/views/AuthView.vue'), meta: { guestOnly: true } },

  // Guest (logged-in, non-admin)
  { path: '/booking',            name: 'Booking',       component: () => import('@/views/BookingView.vue'),        meta: { requiresAuth: true, guestRole: true } },
  { path: '/booking/:id/confirm',name: 'BookingConfirm',component: () => import('@/views/BookingConfirmView.vue'), meta: { requiresAuth: true, guestRole: true } },
  { path: '/dashboard',          name: 'Dashboard',     component: () => import('@/views/DashboardView.vue'),      meta: { requiresAuth: true, guestRole: true } },
  { path: '/history',            name: 'History',       component: () => import('@/views/BookingHistoryView.vue'), meta: { requiresAuth: true, guestRole: true } },
  { path: '/profile',            name: 'Profile',       component: () => import('@/views/ProfileView.vue'),        meta: { requiresAuth: true } },

  // Admin
  { path: '/admin',          name: 'AdminDashboard', component: () => import('@/views/admin/AdminDashboardView.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/bookings', name: 'AdminBookings',  component: () => import('@/views/admin/AdminBookingsView.vue'),  meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/rooms',    name: 'AdminRooms',     component: () => import('@/views/admin/AdminRoomsView.vue'),     meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/users',    name: 'AdminUsers',     component: () => import('@/views/admin/AdminUsersView.vue'),     meta: { requiresAuth: true, requiresAdmin: true } },

  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/views/NotFoundView.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, saved) {
    if (saved) return saved
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0, behavior: 'smooth' }
  }
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  const isAdmin = auth.user?.role === 'admin'

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return next({ name: 'Auth', query: { redirect: to.fullPath } })
  }
  if (to.meta.guestOnly && auth.isLoggedIn) {
    return next(isAdmin ? { name: 'AdminDashboard' } : { name: 'Dashboard' })
  }
  // Block admin from guest-only routes
  if (to.meta.guestRole && auth.isLoggedIn && isAdmin) {
    return next({ name: 'AdminDashboard' })
  }
  // Block non-admin from admin routes
  if (to.meta.requiresAdmin && auth.isLoggedIn && !isAdmin) {
    return next({ name: 'Dashboard' })
  }
  next()
})

export default router
