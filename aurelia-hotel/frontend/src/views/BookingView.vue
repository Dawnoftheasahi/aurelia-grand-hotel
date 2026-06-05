<template>
  <div>
    <div class="page-header">
      <div class="container">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <RouterLink to="/">Home</RouterLink><span>/</span>
          <RouterLink to="/rooms">Rooms</RouterLink><span>/</span>
          <span>Book</span>
        </nav>
        <h1>Complete Your Reservation</h1>
        <p>You're one step away from an extraordinary stay.</p>
      </div>
    </div>

    <div class="container booking-layout">
      <!-- ─── FORM ─── -->
      <div class="booking-form-area">

        <!-- Step 1: Choose Room -->
        <section class="form-card" aria-labelledby="room-step">
          <h2 id="room-step" class="step-title"><span class="step-num">1</span> Select Your Room</h2>
          <div v-if="loadingRooms" class="step-loading"><LoadingSpinner size="sm" inline label="Loading rooms…" /></div>
          <div v-else>
            <label for="room-select" class="form-label">Room</label>
            <select id="room-select" class="form-input" v-model.number="form.roomId" @change="onRoomChange" :class="{ error: errors.roomId }" aria-describedby="room-error">
              <option value="">— Select a room —</option>
              <option v-for="r in rooms" :key="r.id" :value="r.id">{{ r.name }} ({{ r.type }}) — ${{ r.price_per_night }}/night</option>
            </select>
            <p v-if="errors.roomId" id="room-error" class="form-error" role="alert">{{ errors.roomId }}</p>

            <!-- Selected Room Preview -->
            <div v-if="selectedRoom" class="room-preview">
              <img :src="selectedRoom.images?.[0]" :alt="selectedRoom.name" class="preview-img" loading="lazy" />
              <div class="preview-info">
                <p class="preview-name">{{ selectedRoom.name }}</p>
                <p class="preview-meta">{{ selectedRoom.bed_type }} · Up to {{ selectedRoom.capacity }} guests · {{ selectedRoom.size_sqm }}m²</p>
                <p class="preview-view">{{ selectedRoom.view_type }}</p>
              </div>
              <div class="preview-price">${{ selectedRoom.price_per_night }}<span>/night</span></div>
            </div>
          </div>
        </section>

        <!-- Step 2: Dates & Guests -->
        <section class="form-card" aria-labelledby="dates-step">
          <h2 id="dates-step" class="step-title"><span class="step-num">2</span> Dates &amp; Guests</h2>
          <div class="dates-grid">
            <div class="form-group">
              <label for="checkin" class="form-label">Check-in Date <span aria-hidden="true">*</span></label>
              <input id="checkin" type="date" class="form-input" v-model="form.checkIn" :min="today" @change="validateDates" :class="{ error: errors.checkIn }" aria-describedby="checkin-error" aria-required="true" />
              <p v-if="errors.checkIn" id="checkin-error" class="form-error" role="alert">{{ errors.checkIn }}</p>
            </div>
            <div class="form-group">
              <label for="checkout" class="form-label">Check-out Date <span aria-hidden="true">*</span></label>
              <input id="checkout" type="date" class="form-input" v-model="form.checkOut" :min="minCheckOut" @change="validateDates" :class="{ error: errors.checkOut }" aria-describedby="checkout-error" aria-required="true" />
              <p v-if="errors.checkOut" id="checkout-error" class="form-error" role="alert">{{ errors.checkOut }}</p>
            </div>
            <div class="form-group">
              <label for="guests" class="form-label">Number of Guests <span aria-hidden="true">*</span></label>
              <select id="guests" class="form-input" v-model.number="form.guests" :class="{ error: errors.guests }" aria-describedby="guests-error" aria-required="true">
                <option v-for="n in (selectedRoom?.capacity || 4)" :key="n" :value="n">{{ n }} {{ n === 1 ? 'Guest' : 'Guests' }}</option>
              </select>
              <p v-if="errors.guests" id="guests-error" class="form-error" role="alert">{{ errors.guests }}</p>
            </div>
          </div>

          <!-- Nights indicator -->
          <div v-if="nights > 0" class="nights-badge" aria-live="polite">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            {{ nights }} night{{ nights !== 1 ? 's' : '' }} selected
          </div>
        </section>

        <!-- Step 3: Extras -->
        <section class="form-card" aria-labelledby="extras-step">
          <h2 id="extras-step" class="step-title"><span class="step-num">3</span> Optional Extras</h2>
          <div class="extras-grid" role="group" aria-label="Optional add-ons">
            <label v-for="extra in extraOptions" :key="extra.key" class="extra-option">
              <input type="checkbox" :value="extra.key" v-model="form.selectedExtras" class="extra-checkbox" :aria-describedby="`extra-${extra.key}-desc`" />
              <div class="extra-content">
                <span class="extra-icon" aria-hidden="true">{{ extra.icon }}</span>
                <div class="extra-text">
                  <span class="extra-name">{{ extra.name }}</span>
                  <span :id="`extra-${extra.key}-desc`" class="extra-desc">{{ extra.desc }}</span>
                </div>
                <span class="extra-price">+${{ extra.price(nights, form.guests) }}</span>
              </div>
            </label>
          </div>
        </section>

        <!-- Step 4: Special Requests -->
        <section class="form-card" aria-labelledby="requests-step">
          <h2 id="requests-step" class="step-title"><span class="step-num">4</span> Special Requests</h2>
          <div class="form-group">
            <label for="requests" class="form-label">Special Requests (optional)</label>
            <textarea id="requests" class="form-input" v-model="form.specialRequests" rows="3" placeholder="Anniversary celebration, dietary requirements, room preferences…" maxlength="500" aria-describedby="requests-hint"></textarea>
            <p id="requests-hint" class="form-hint">{{ form.specialRequests.length }}/500 characters. Requests cannot be guaranteed but we'll do our best.</p>
          </div>
        </section>

        <!-- Step 5: Promo Code -->
        <section class="form-card" aria-labelledby="promo-step">
          <h2 id="promo-step" class="step-title"><span class="step-num">5</span> Promo Code</h2>
          <div class="promo-row">
            <div class="form-group" style="flex:1">
              <label for="promo-code" class="form-label">Enter Promo Code</label>
              <input id="promo-code" type="text" class="form-input" v-model="promoInput" placeholder="e.g. AURELIA10" :class="{ error: promoError, success: promoApplied }" @keyup.enter="applyPromo" aria-describedby="promo-feedback" />
              <p v-if="promoError"   id="promo-feedback" class="form-error" role="alert">{{ promoError }}</p>
              <p v-if="promoApplied" id="promo-feedback" class="form-success" role="status">✓ {{ promoApplied.title }} — {{ promoApplied.discount_percent }}% discount applied!</p>
            </div>
            <button class="btn btn-secondary" @click="applyPromo" :disabled="promoLoading" style="align-self:flex-end;" aria-label="Apply promo code">
              <LoadingSpinner v-if="promoLoading" size="sm" inline /> Apply
            </button>
          </div>
          <div v-if="promoApplied" class="promo-clear">
            <button class="btn-text" @click="clearPromo">Remove promo code</button>
          </div>
        </section>
      </div>

      <!-- ─── SUMMARY PANEL ─── -->
      <aside class="summary-panel" aria-label="Booking summary">
        <div class="summary-inner">
          <h2 class="summary-heading">Booking Summary</h2>

          <div v-if="!selectedRoom" class="summary-placeholder">
            <p>Select a room and dates to see your booking summary.</p>
          </div>

          <template v-else>
            <div class="summary-room">
              <img :src="selectedRoom.images?.[0]" :alt="selectedRoom.name" class="summary-img" loading="lazy" />
              <div>
                <p class="summary-room-name">{{ selectedRoom.name }}</p>
                <p class="summary-room-type">{{ selectedRoom.type }} · Level {{ selectedRoom.floor }}</p>
              </div>
            </div>

            <div v-if="nights > 0" class="summary-dates">
              <div class="summary-date-row">
                <span>Check-in</span>
                <span>{{ formatDate(form.checkIn) }}</span>
              </div>
              <div class="summary-date-row">
                <span>Check-out</span>
                <span>{{ formatDate(form.checkOut) }}</span>
              </div>
              <div class="summary-date-row">
                <span>Duration</span>
                <span>{{ nights }} night{{ nights !== 1 ? 's' : '' }}</span>
              </div>
              <div class="summary-date-row">
                <span>Guests</span>
                <span>{{ form.guests }}</span>
              </div>
            </div>

            <div class="summary-cost" v-if="nights > 0">
              <div class="cost-row">
                <span>${{ selectedRoom.price_per_night }} × {{ nights }} nights</span>
                <span>${{ roomTotal.toFixed(2) }}</span>
              </div>
              <div v-for="ex in activeExtras" :key="ex.key" class="cost-row">
                <span>{{ ex.name }}</span>
                <span>+${{ ex.price(nights, form.guests).toFixed(2) }}</span>
              </div>
              <div v-if="promoApplied" class="cost-row promo-row">
                <span>Promo ({{ promoApplied.code }})</span>
                <span>-${{ discountAmount.toFixed(2) }}</span>
              </div>
              <div class="cost-row total-row">
                <span>Total</span>
                <span>${{ grandTotal.toFixed(2) }}</span>
              </div>
            </div>

            <button
              class="btn btn-primary"
              style="width:100%;justify-content:center;margin-top:var(--space-2);"
              @click="submitBooking"
              :disabled="submitting || nights === 0"
              :aria-busy="submitting"
            >
              <LoadingSpinner v-if="submitting" size="sm" inline />
              {{ submitting ? 'Confirming…' : 'Confirm Booking' }}
            </button>
            <p v-if="submitError" class="form-error" role="alert" style="margin-top:var(--space-2);text-align:center;">{{ submitError }}</p>
            <p class="summary-note">Secure checkout. No payment until arrival.</p>
          </template>
        </div>
      </aside>
    </div>

    <!-- ─── CONFIRMATION MODAL ─── -->
    <AppModal v-model="showConfirm" title="Booking Confirmed! 🎉" size="md">
      <div class="confirm-modal">
        <div class="confirm-icon" aria-hidden="true">✦</div>
        <h3 class="confirm-title">Your reservation is secured</h3>
        <p class="confirm-desc">Thank you for choosing The Aurelia Grand. We look forward to welcoming you.</p>
        <div class="confirm-code-block">
          <p class="conf-label">Confirmation Number</p>
          <p class="conf-code">{{ confirmedBooking?.confirmation_code }}</p>
        </div>
        <div class="confirm-details">
          <div class="conf-detail">
            <span>Room</span><strong>{{ confirmedBooking?.room?.name }}</strong>
          </div>
          <div class="conf-detail">
            <span>Check-in</span><strong>{{ formatDate(confirmedBooking?.check_in) }}</strong>
          </div>
          <div class="conf-detail">
            <span>Check-out</span><strong>{{ formatDate(confirmedBooking?.check_out) }}</strong>
          </div>
          <div class="conf-detail">
            <span>Total Paid</span><strong>${{ confirmedBooking?.total_price?.toFixed(2) }}</strong>
          </div>
        </div>
      </div>
      <template #footer>
        <RouterLink to="/dashboard" class="btn btn-secondary" @click="showConfirm = false">Go to Dashboard</RouterLink>
        <RouterLink to="/history" class="btn btn-primary" @click="showConfirm = false">View All Bookings</RouterLink>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppModal from '@/components/ui/AppModal.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import { useAuthStore } from '@/stores/authStore.js'
import { useUiStore } from '@/stores/uiStore.js'
import api from '@/composables/useApi.js'

const route = useRoute()
const auth  = useAuthStore()
const ui    = useUiStore()

const rooms       = ref([])
const loadingRooms = ref(true)
const submitting   = ref(false)
const submitError  = ref('')
const showConfirm  = ref(false)
const confirmedBooking = ref(null)

const today = new Date().toISOString().split('T')[0]

const form = ref({
  roomId: Number(route.query.room) || '',
  checkIn: route.query.checkIn || '',
  checkOut: route.query.checkOut || '',
  guests: Number(route.query.guests) || 2,
  selectedExtras: [],
  specialRequests: ''
})

const errors = ref({ roomId: '', checkIn: '', checkOut: '', guests: '' })

const promoInput  = ref('')
const promoApplied = ref(null)
const promoError  = ref('')
const promoLoading = ref(false)

const extraOptions = [
  { key: 'breakfast',       icon: '🍳', name: 'Daily Breakfast',      desc: '$25 per person per night',       price: (n, g) => 25 * n * g },
  { key: 'airportTransfer', icon: '✈️', name: 'Airport Transfer',      desc: 'One-way, $80 per vehicle',       price: ()     => 80 },
  { key: 'lateCheckout',    icon: '🕐', name: 'Late Check-out (2 PM)', desc: '$50 one-time fee',               price: ()     => 50 },
  { key: 'extraBed',        icon: '🛏️', name: 'Extra Bed',             desc: '$40 per night',                  price: (n)    => 40 * n },
]

const selectedRoom = computed(() => rooms.value.find(r => r.id === form.value.roomId) || null)
const minCheckOut  = computed(() => {
  if (!form.value.checkIn) return today
  const d = new Date(form.value.checkIn); d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
})
const nights = computed(() => {
  if (!form.value.checkIn || !form.value.checkOut) return 0
  return Math.max(0, Math.round((new Date(form.value.checkOut) - new Date(form.value.checkIn)) / 86400000))
})

const activeExtras = computed(() => extraOptions.filter(e => form.value.selectedExtras.includes(e.key)))
const extrasTotal  = computed(() => activeExtras.value.reduce((s, e) => s + e.price(nights.value, form.value.guests), 0))
const roomTotal    = computed(() => (selectedRoom.value?.price_per_night || 0) * nights.value)
const subtotal     = computed(() => roomTotal.value + extrasTotal.value)
const discountAmount = computed(() => promoApplied.value ? Math.round(subtotal.value * promoApplied.value.discount_percent / 100) : 0)
const grandTotal   = computed(() => subtotal.value - discountAmount.value)

function onRoomChange() { errors.value.roomId = '' }
function validateDates() {
  errors.value.checkIn  = !form.value.checkIn  ? 'Check-in date is required' : ''
  errors.value.checkOut = !form.value.checkOut ? 'Check-out date is required' : ''
  if (form.value.checkIn && form.value.checkOut && form.value.checkOut <= form.value.checkIn)
    errors.value.checkOut = 'Check-out must be after check-in'
}

function validateAll() {
  validateDates()
  errors.value.roomId = !form.value.roomId ? 'Please select a room' : ''
  errors.value.guests = !form.value.guests  ? 'Please select guests' : ''
  return !Object.values(errors.value).some(Boolean)
}

async function applyPromo() {
  if (!promoInput.value.trim()) return
  promoLoading.value = true; promoError.value = ''
  try {
    const { data } = await api.post('/promotions/validate', { code: promoInput.value.trim() })
    promoApplied.value = data
    ui.success(`Promo code applied — ${data.discount_percent}% off!`)
  } catch (e) {
    promoError.value = e.message
    promoApplied.value = null
  } finally {
    promoLoading.value = false
  }
}

function clearPromo() { promoApplied.value = null; promoInput.value = ''; promoError.value = '' }

async function submitBooking() {
  if (!validateAll()) return
  submitting.value = true; submitError.value = ''
  const extrasObj = {}
  form.value.selectedExtras.forEach(k => { extrasObj[k] = true })
  try {
    const { data } = await api.post('/bookings', {
      room_id: form.value.roomId,
      check_in: form.value.checkIn,
      check_out: form.value.checkOut,
      guests: form.value.guests,
      extras: extrasObj,
      special_requests: form.value.specialRequests || undefined,
      promo_code: promoApplied.value?.code || undefined
    })
    confirmedBooking.value = data
    showConfirm.value = true
    ui.success('Booking confirmed! Welcome to The Aurelia Grand.')
  } catch (e) {
    submitError.value = e.message
    ui.error(e.message)
  } finally {
    submitting.value = false
  }
}

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

onMounted(async () => {
  try {
    const { data } = await api.get('/rooms')
    rooms.value = data
  } catch (e) { console.error(e) } finally { loadingRooms.value = false }
})
</script>

<style scoped>
.booking-layout { display:grid;grid-template-columns:1fr 360px;gap:var(--space-8);padding:var(--space-8) 0 var(--space-16); }
@media (max-width:1024px) { .booking-layout { grid-template-columns:1fr 320px;gap:var(--space-6); } }
@media (max-width:860px)  { .booking-layout { grid-template-columns:1fr; } .summary-panel { order:-1; } }

.booking-form-area { display:flex;flex-direction:column;gap:var(--space-5); }
.form-card { background:var(--color-white);border-radius:var(--radius-lg);padding:var(--space-6);box-shadow:var(--shadow-sm);border:1px solid var(--color-border-soft); }
.step-title { display:flex;align-items:center;gap:var(--space-3);font-family:var(--font-display);font-size:1.2rem;font-weight:600;color:var(--color-navy);margin-bottom:var(--space-5); }
.step-num { width:28px;height:28px;border-radius:50%;background:var(--color-gold);color:var(--color-navy);display:flex;align-items:center;justify-content:center;font-size:.78rem;font-weight:700;flex-shrink:0; }
.step-loading { padding:var(--space-4) 0; }

/* Room Preview */
.room-preview { display:flex;align-items:center;gap:var(--space-4);margin-top:var(--space-4);padding:var(--space-4);background:var(--color-cream);border-radius:var(--radius-md);border:1px solid var(--color-border); }
.preview-img  { width:80px;height:60px;border-radius:var(--radius-sm);object-fit:cover;flex-shrink:0; }
.preview-name { font-weight:600;color:var(--color-navy);font-size:.95rem; }
.preview-meta { font-size:.78rem;color:var(--color-muted);margin-top:2px; }
.preview-view { font-size:.75rem;color:var(--color-gold);margin-top:2px; }
.preview-price { margin-left:auto;font-family:var(--font-display);font-size:1.3rem;font-weight:700;color:var(--color-navy);flex-shrink:0; }
.preview-price span { font-size:.75rem;font-weight:400;color:var(--color-muted); }

.dates-grid { display:grid;grid-template-columns:1fr 1fr 1fr;gap:var(--space-4); }
@media (max-width:640px) { .dates-grid { grid-template-columns:1fr; } }

.nights-badge { display:inline-flex;align-items:center;gap:var(--space-2);margin-top:var(--space-4);padding:.5rem 1rem;background:var(--color-info-bg);color:var(--color-info);border-radius:var(--radius-full);font-size:.82rem;font-weight:600; }

/* Extras */
.extras-grid { display:flex;flex-direction:column;gap:var(--space-3); }
.extra-option { display:flex;align-items:center;gap:var(--space-3);cursor:pointer; }
.extra-checkbox { position:absolute;opacity:0;width:0;height:0; }
.extra-content {
  display:flex;align-items:center;gap:var(--space-3);flex:1;
  padding:var(--space-4) var(--space-4);border:1.5px solid var(--color-border);
  border-radius:var(--radius-md);transition:all var(--transition-fast);cursor:pointer;
}
.extra-checkbox:checked + .extra-content { border-color:var(--color-gold);background:var(--color-gold-pale); }
.extra-checkbox:focus-visible + .extra-content { outline:3px solid var(--color-gold);outline-offset:2px; }
.extra-icon { font-size:1.3rem;flex-shrink:0; }
.extra-text { flex:1;display:flex;flex-direction:column;gap:2px; }
.extra-name { font-weight:600;font-size:.9rem;color:var(--color-navy); }
.extra-desc { font-size:.75rem;color:var(--color-muted); }
.extra-price { font-weight:700;color:var(--color-navy);font-size:.9rem;flex-shrink:0; }

/* Promo */
.promo-row { display:flex;align-items:flex-end;gap:var(--space-3); }
.form-success { font-size:.82rem;color:var(--color-success);margin-top:var(--space-1); }
.promo-clear { margin-top:var(--space-2); }
.btn-text { font-size:.82rem;color:var(--color-muted);text-decoration:underline;transition:color var(--transition-fast); }
.btn-text:hover { color:var(--color-error); }

/* Summary */
.summary-panel { height:fit-content;position:sticky;top:calc(var(--nav-height) + var(--space-4)); }
.summary-inner { background:var(--color-white);border-radius:var(--radius-xl);box-shadow:var(--shadow-lg);border:1px solid var(--color-border);padding:var(--space-6);display:flex;flex-direction:column;gap:var(--space-4); }
.summary-heading { font-family:var(--font-display);font-size:1.2rem;font-weight:600;color:var(--color-navy); }
.summary-placeholder { color:var(--color-muted);font-size:.88rem;text-align:center;padding:var(--space-8) 0; }
.summary-room { display:flex;align-items:center;gap:var(--space-3);padding-bottom:var(--space-4);border-bottom:1px solid var(--color-border-soft); }
.summary-img  { width:64px;height:48px;border-radius:var(--radius-sm);object-fit:cover;flex-shrink:0; }
.summary-room-name { font-weight:600;color:var(--color-navy);font-size:.9rem; }
.summary-room-type { font-size:.75rem;color:var(--color-muted);margin-top:2px; }
.summary-dates { display:flex;flex-direction:column;gap:var(--space-2);padding-bottom:var(--space-4);border-bottom:1px solid var(--color-border-soft); }
.summary-date-row { display:flex;justify-content:space-between;font-size:.82rem; }
.summary-date-row span:first-child { color:var(--color-muted); }
.summary-date-row span:last-child  { font-weight:500;color:var(--color-navy); }
.summary-cost { display:flex;flex-direction:column;gap:var(--space-2); }
.cost-row { display:flex;justify-content:space-between;font-size:.88rem;color:var(--color-text-mid); }
.promo-row { color:var(--color-success); }
.total-row { font-weight:700;color:var(--color-navy);font-size:1rem;padding-top:var(--space-2);border-top:1px solid var(--color-border);margin-top:var(--space-1); }
.summary-note { font-size:.72rem;color:var(--color-muted);text-align:center; }

/* Confirm Modal */
.confirm-modal { text-align:center;display:flex;flex-direction:column;align-items:center;gap:var(--space-4); }
.confirm-icon  { width:64px;height:64px;border-radius:50%;background:var(--color-gold);color:var(--color-navy);display:flex;align-items:center;justify-content:center;font-size:1.5rem; }
.confirm-title { font-family:var(--font-display);font-size:1.4rem;font-weight:600;color:var(--color-navy); }
.confirm-desc  { color:var(--color-muted);font-size:.9rem;max-width:340px;line-height:1.6; }
.confirm-code-block { background:var(--color-cream);border-radius:var(--radius-md);padding:var(--space-4) var(--space-8);border:1px dashed var(--color-border); }
.conf-label { font-size:.72rem;text-transform:uppercase;letter-spacing:.1em;color:var(--color-muted);margin-bottom:var(--space-2); }
.conf-code  { font-family:var(--font-display);font-size:1.8rem;font-weight:700;color:var(--color-navy);letter-spacing:.1em; }
.confirm-details { width:100%;display:flex;flex-direction:column;gap:var(--space-2);padding:var(--space-4);background:var(--color-white);border-radius:var(--radius-md);border:1px solid var(--color-border-soft); }
.conf-detail { display:flex;justify-content:space-between;font-size:.88rem; }
.conf-detail span { color:var(--color-muted); }
.conf-detail strong { color:var(--color-navy); }
</style>
