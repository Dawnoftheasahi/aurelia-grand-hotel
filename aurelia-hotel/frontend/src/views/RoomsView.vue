<template>
  <div>
    <!-- Page Header -->
    <div class="page-header">
      <div class="container">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <RouterLink to="/">Home</RouterLink><span>/</span><span>Rooms &amp; Suites</span>
        </nav>
        <h1>Rooms &amp; Suites</h1>
        <p>Eight distinctive categories of luxury accommodation, each thoughtfully designed.</p>
      </div>
    </div>

    <div class="container rooms-layout">
      <!-- ─── Filters Sidebar ─── -->
      <aside class="filters-panel" aria-label="Filter rooms">
        <div class="filters-header">
          <h2 class="filters-title">Filters</h2>
          <button v-if="hasFilters" class="btn-clear" @click="clearFilters" aria-label="Clear all filters">Clear all</button>
        </div>

        <!-- Search -->
        <div class="filter-section">
          <label for="search-input" class="form-label">Search</label>
          <div class="search-wrap">
            <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input id="search-input" type="text" class="form-input search-pad" v-model="filters.search" placeholder="Room name or type…" aria-label="Search rooms" />
          </div>
        </div>

        <!-- Room Type -->
        <div class="filter-section">
          <fieldset>
            <legend class="form-label">Room Type</legend>
            <div class="type-options">
              <label v-for="t in roomTypes" :key="t" class="type-option">
                <input type="checkbox" :value="t" v-model="filters.types" class="sr-only" />
                <span :class="['type-chip', { active: filters.types.includes(t) }]">{{ t }}</span>
              </label>
            </div>
          </fieldset>
        </div>

        <!-- Price Range -->
        <div class="filter-section">
          <p class="form-label">Price Range (per night)</p>
          <div class="price-range-display">
            <span>${{ filters.minPrice }}</span>
            <span>${{ filters.maxPrice }}</span>
          </div>
          <input type="range" min="80" max="600" step="10" v-model.number="filters.minPrice" class="range-input" aria-label="Minimum price" />
          <input type="range" min="80" max="600" step="10" v-model.number="filters.maxPrice" class="range-input" aria-label="Maximum price" />
        </div>

        <!-- Capacity -->
        <div class="filter-section">
          <label for="capacity-select" class="form-label">Minimum Guests</label>
          <select id="capacity-select" class="form-input" v-model.number="filters.capacity" aria-label="Minimum guest capacity">
            <option value="1">Any capacity</option>
            <option v-for="n in [1,2,3,4]" :key="n" :value="n">{{ n }}+ guest{{ n > 1 ? 's' : '' }}</option>
          </select>
        </div>

        <!-- Mobile apply -->
        <button class="btn btn-primary mobile-apply" @click="mobileFiltersOpen = false">Apply Filters</button>
      </aside>

      <!-- ─── Rooms Content ─── -->
      <div class="rooms-content">
        <!-- Toolbar -->
        <div class="rooms-toolbar">
          <p class="results-count" aria-live="polite" aria-atomic="true">
            <template v-if="loading">Searching…</template>
            <template v-else>{{ filteredRooms.length }} room{{ filteredRooms.length !== 1 ? 's' : '' }} found</template>
          </p>
          <div class="toolbar-right">
            <label for="sort-select" class="sr-only">Sort rooms by</label>
            <select id="sort-select" class="form-input sort-select" v-model="filters.sort" aria-label="Sort rooms by">
              <option value="rating">Top Rated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="capacity">Most Guests</option>
            </select>
            <button class="btn btn-ghost btn-sm mobile-filter-btn" @click="mobileFiltersOpen = true" aria-expanded="mobileFiltersOpen" aria-controls="mobile-filters">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
              Filters
              <span v-if="activeFilterCount > 0" class="filter-badge">{{ activeFilterCount }}</span>
            </button>
          </div>
        </div>

        <!-- Loading skeletons -->
        <div v-if="loading" class="rooms-grid">
          <div v-for="n in 6" :key="n" class="room-skel">
            <div class="skeleton" style="height:200px"></div>
            <div style="padding:1.25rem;display:flex;flex-direction:column;gap:.6rem">
              <div class="skeleton" style="height:18px;width:65%"></div>
              <div class="skeleton" style="height:13px"></div>
              <div class="skeleton" style="height:13px;width:80%"></div>
            </div>
          </div>
        </div>

        <!-- Room grid -->
        <div v-else-if="filteredRooms.length > 0" class="rooms-grid" aria-label="Room listings">
          <RoomCard v-for="room in filteredRooms" :key="room.id" :room="room" />
        </div>

        <!-- Empty state -->
        <EmptyState v-else title="No rooms match your filters" message="Try adjusting your search criteria or clearing the filters.">
          <template #icon>🔍</template>
          <template #action>
            <button class="btn btn-secondary" @click="clearFilters">Clear Filters</button>
          </template>
        </EmptyState>
      </div>
    </div>

    <!-- Mobile Filters Overlay -->
    <Transition name="slide-up">
      <div v-if="mobileFiltersOpen" class="mobile-filters-overlay" id="mobile-filters" role="dialog" aria-label="Filter rooms" aria-modal="true">
        <div class="mobile-filters-header">
          <h2>Filters</h2>
          <button @click="mobileFiltersOpen = false" aria-label="Close filters">
            <svg width="20" height="20" viewBox="0 0 20 20"><path d="M1 1l18 18M19 1L1 19" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import RoomCard from '@/components/ui/RoomCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import api from '@/composables/useApi.js'

const route = useRoute()
const allRooms = ref([])
const loading  = ref(true)
const mobileFiltersOpen = ref(false)

const roomTypes = ['Standard', 'Deluxe', 'Suite', 'Family']

const filters = ref({
  search:   '',
  types:    [],
  minPrice: 80,
  maxPrice: 600,
  capacity: 1,
  sort:     'rating'
})

// Pre-fill capacity from route query
onMounted(async () => {
  if (route.query.capacity) filters.value.capacity = Number(route.query.capacity)
  try {
    const { data } = await api.get('/rooms')
    allRooms.value = data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

const filteredRooms = computed(() => {
  let rooms = [...allRooms.value]
  const f = filters.value

  if (f.search) {
    const s = f.search.toLowerCase()
    rooms = rooms.filter(r => r.name.toLowerCase().includes(s) || r.type.toLowerCase().includes(s) || r.description.toLowerCase().includes(s))
  }
  if (f.types.length) rooms = rooms.filter(r => f.types.includes(r.type))
  rooms = rooms.filter(r => r.price_per_night >= f.minPrice && r.price_per_night <= f.maxPrice)
  if (f.capacity > 1) rooms = rooms.filter(r => r.capacity >= f.capacity)

  switch (f.sort) {
    case 'price_asc':  rooms.sort((a,b) => a.price_per_night - b.price_per_night); break
    case 'price_desc': rooms.sort((a,b) => b.price_per_night - a.price_per_night); break
    case 'capacity':   rooms.sort((a,b) => b.capacity - a.capacity); break
    default:           rooms.sort((a,b) => b.rating - a.rating)
  }
  return rooms
})

const hasFilters = computed(() => {
  const f = filters.value
  return f.search || f.types.length || f.minPrice > 80 || f.maxPrice < 600 || f.capacity > 1
})

const activeFilterCount = computed(() => {
  let c = 0
  const f = filters.value
  if (f.search) c++
  if (f.types.length) c++
  if (f.minPrice > 80 || f.maxPrice < 600) c++
  if (f.capacity > 1) c++
  return c
})

function clearFilters() {
  filters.value = { search: '', types: [], minPrice: 80, maxPrice: 600, capacity: 1, sort: 'rating' }
}
</script>

<style scoped>
.rooms-layout { display:grid;grid-template-columns:280px 1fr;gap:var(--space-8);padding-top:var(--space-8);padding-bottom:var(--space-16); }
@media (max-width:1024px) { .rooms-layout { grid-template-columns:240px 1fr; } }
@media (max-width:768px)  { .rooms-layout { grid-template-columns:1fr; } .filters-panel { display:none; } }

/* Filters Panel */
.filters-panel { background:var(--color-white);border-radius:var(--radius-lg);padding:var(--space-6);box-shadow:var(--shadow-sm);border:1px solid var(--color-border-soft);height:fit-content;position:sticky;top:calc(var(--nav-height) + var(--space-4)); }
.filters-header { display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-6); }
.filters-title { font-family:var(--font-display);font-size:1.1rem;font-weight:600;color:var(--color-navy); }
.btn-clear { font-size:.78rem;color:var(--color-gold);font-weight:500;transition:opacity var(--transition-fast); }
.btn-clear:hover { opacity:.7; }
.filter-section { padding:var(--space-5) 0;border-bottom:1px solid var(--color-border-soft); }
.filter-section:last-of-type { border-bottom:none; }
.filter-section .form-label { margin-bottom:var(--space-3); }

.search-wrap { position:relative; }
.search-icon { position:absolute;left:.75rem;top:50%;transform:translateY(-50%);color:var(--color-muted);pointer-events:none; }
.search-pad  { padding-left:2.5rem; }

.type-options { display:flex;flex-wrap:wrap;gap:var(--space-2);margin-top:var(--space-3); }
.type-chip { display:inline-block;padding:.35rem .85rem;border:1.5px solid var(--color-border);border-radius:var(--radius-full);font-size:.78rem;font-weight:500;color:var(--color-text-mid);cursor:pointer;transition:all var(--transition-fast); }
.type-chip.active { background:var(--color-navy);color:var(--color-white);border-color:var(--color-navy); }
.type-chip:hover:not(.active) { border-color:var(--color-gold);color:var(--color-navy); }

.price-range-display { display:flex;justify-content:space-between;font-size:.82rem;font-weight:600;color:var(--color-navy);margin-bottom:var(--space-3); }
.range-input { width:100%;accent-color:var(--color-gold);margin-bottom:var(--space-2); }

.mobile-apply { display:none;width:100%;margin-top:var(--space-4);justify-content:center; }
@media (max-width:768px) { .mobile-apply { display:flex; } }

/* Toolbar */
.rooms-toolbar { display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-6);padding-bottom:var(--space-4);border-bottom:1px solid var(--color-border-soft); }
.results-count { font-size:.88rem;color:var(--color-muted); }
.toolbar-right { display:flex;align-items:center;gap:var(--space-3); }
.sort-select { width:auto;padding:.5rem .9rem;font-size:.85rem; }
.mobile-filter-btn { display:none;position:relative; }
@media (max-width:768px) { .mobile-filter-btn { display:flex; } }
.filter-badge { position:absolute;top:-5px;right:-5px;width:16px;height:16px;border-radius:50%;background:var(--color-gold);color:var(--color-navy);font-size:.6rem;font-weight:700;display:flex;align-items:center;justify-content:center; }

/* Grid */
.rooms-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:var(--space-6); }
.room-skel  { background:var(--color-white);border-radius:var(--radius-lg);overflow:hidden; }

/* Screen reader only */
.sr-only { position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0; }
</style>
