<template>
  <div class="confirm-page">
    <div class="container confirm-layout">
      <div class="confirm-card animate-fade">
        <div class="confirm-hero">
          <div class="confirm-mark" aria-hidden="true">✦</div>
          <h1 class="confirm-title">Booking Confirmed</h1>
          <p class="confirm-subtitle">Your reservation at The Aurelia Grand is secured. We look forward to welcoming you.</p>
        </div>

        <div class="confirm-body">
          <div class="conf-code-display">
            <p class="code-label">Confirmation Number</p>
            <p class="code-value">{{ booking?.confirmation_code || '—' }}</p>
          </div>

          <div class="confirm-details-grid">
            <div class="cd-item">
              <span class="cd-label">Room</span>
              <span class="cd-val">{{ booking?.room?.name || '—' }}</span>
            </div>
            <div class="cd-item">
              <span class="cd-label">Check-in</span>
              <span class="cd-val">{{ formatDate(booking?.check_in) }}</span>
            </div>
            <div class="cd-item">
              <span class="cd-label">Check-out</span>
              <span class="cd-val">{{ formatDate(booking?.check_out) }}</span>
            </div>
            <div class="cd-item">
              <span class="cd-label">Guests</span>
              <span class="cd-val">{{ booking?.guests }}</span>
            </div>
            <div class="cd-item">
              <span class="cd-label">Nights</span>
              <span class="cd-val">{{ booking?.nights }}</span>
            </div>
            <div class="cd-item">
              <span class="cd-label">Total</span>
              <span class="cd-val highlight">${{ booking?.total_price?.toFixed(2) }}</span>
            </div>
          </div>

          <div class="confirm-actions">
            <RouterLink to="/dashboard" class="btn btn-secondary">Go to Dashboard</RouterLink>
            <RouterLink to="/history" class="btn btn-primary">View All Bookings</RouterLink>
          </div>

          <div class="confirm-next-steps">
            <h2 class="steps-title">What Happens Next?</h2>
            <div class="steps-list">
              <div class="step-item" v-for="s in nextSteps" :key="s.label">
                <div class="step-num" aria-hidden="true">{{ s.num }}</div>
                <div>
                  <p class="step-label">{{ s.label }}</p>
                  <p class="step-desc">{{ s.desc }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/composables/useApi.js'

const route = useRoute()
const booking = ref(null)

const nextSteps = [
  { num: '1', label: 'Confirmation Email',    desc: 'A confirmation with all booking details has been sent to your registered email.' },
  { num: '2', label: 'Pre-Arrival Contact',   desc: 'Our concierge team will reach out 48 hours before your arrival to confirm preferences.' },
  { num: '3', label: 'Check-in',              desc: 'Arrive from 3:00 PM. Our team will be ready to welcome you at the front desk.' },
  { num: '4', label: 'Enjoy Your Stay',       desc: 'Relax and enjoy The Aurelia Grand experience. We\'re here for you 24/7.' },
]

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

onMounted(async () => {
  try {
    const { data } = await api.get(`/bookings/${route.params.id}`)
    booking.value = data
  } catch (e) { console.error(e) }
})
</script>

<style scoped>
.confirm-page { background:var(--color-cream);min-height:100vh;padding:var(--space-16) 0; }
.confirm-layout { max-width:720px;margin:0 auto; }
.confirm-card { background:var(--color-white);border-radius:var(--radius-xl);box-shadow:var(--shadow-xl);overflow:hidden;border:1px solid var(--color-border); }
.confirm-hero { background:linear-gradient(135deg,var(--color-navy) 0%,var(--color-navy-light) 100%);padding:var(--space-12) var(--space-10);text-align:center; }
.confirm-mark { width:72px;height:72px;border-radius:50%;background:var(--color-gold);color:var(--color-navy);font-size:1.8rem;display:flex;align-items:center;justify-content:center;margin:0 auto var(--space-5); }
.confirm-title    { font-family:var(--font-display);font-size:2rem;font-weight:700;color:white; }
.confirm-subtitle { color:rgba(255,255,255,.65);margin-top:var(--space-3);max-width:400px;margin-left:auto;margin-right:auto;line-height:1.6; }
.confirm-body { padding:var(--space-8); }
.conf-code-display { text-align:center;background:var(--color-cream);border-radius:var(--radius-lg);padding:var(--space-6);border:1px dashed var(--color-border);margin-bottom:var(--space-6); }
.code-label { font-size:.72rem;text-transform:uppercase;letter-spacing:.12em;color:var(--color-muted);margin-bottom:var(--space-2); }
.code-value { font-family:var(--font-display);font-size:2rem;font-weight:700;color:var(--color-navy);letter-spacing:.1em; }
.confirm-details-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-4);margin-bottom:var(--space-6); }
@media (max-width:640px) { .confirm-details-grid { grid-template-columns:repeat(2,1fr); } }
.cd-item { background:var(--color-cream);border-radius:var(--radius-md);padding:var(--space-4);border:1px solid var(--color-border-soft); }
.cd-label { font-size:.68rem;text-transform:uppercase;letter-spacing:.08em;color:var(--color-muted);font-weight:500; }
.cd-val   { display:block;font-weight:600;color:var(--color-navy);font-size:.95rem;margin-top:4px; }
.cd-val.highlight { color:var(--color-gold);font-family:var(--font-display);font-size:1.1rem; }
.confirm-actions { display:flex;gap:var(--space-4);justify-content:center;margin-bottom:var(--space-8);flex-wrap:wrap; }
.confirm-next-steps { border-top:1px solid var(--color-border-soft);padding-top:var(--space-6); }
.steps-title { font-family:var(--font-display);font-size:1.1rem;font-weight:600;color:var(--color-navy);margin-bottom:var(--space-5); }
.steps-list  { display:flex;flex-direction:column;gap:var(--space-4); }
.step-item   { display:flex;gap:var(--space-4);align-items:flex-start; }
.step-num    { width:32px;height:32px;border-radius:50%;background:var(--color-gold);color:var(--color-navy);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.82rem;flex-shrink:0; }
.step-label  { font-weight:600;color:var(--color-navy);font-size:.9rem; }
.step-desc   { font-size:.82rem;color:var(--color-muted);margin-top:2px;line-height:1.5; }
</style>
