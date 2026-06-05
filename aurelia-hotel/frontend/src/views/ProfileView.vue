<template>
  <div>
    <div class="page-header">
      <div class="container">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <RouterLink to="/dashboard">Dashboard</RouterLink><span>/</span><span>Profile Settings</span>
        </nav>
        <h1>Profile Settings</h1>
        <p>Manage your account information and preferences.</p>
      </div>
    </div>

    <div class="container profile-layout">
      <!-- Sidebar -->
      <aside class="profile-sidebar" aria-label="Profile navigation">
        <div class="profile-avatar-block">
          <div class="avatar-circle" aria-hidden="true">{{ initials }}</div>
          <div>
            <p class="profile-name">{{ auth.user?.name }}</p>
            <p class="profile-email">{{ auth.user?.email }}</p>
          </div>
        </div>
        <nav class="profile-nav" aria-label="Settings sections">
          <button v-for="tab in tabs" :key="tab.id" :class="['profile-nav-btn', { active: activeTab === tab.id }]" @click="activeTab = tab.id" :aria-current="activeTab === tab.id ? 'page' : undefined">
            <span aria-hidden="true">{{ tab.icon }}</span> {{ tab.label }}
          </button>
        </nav>
      </aside>

      <!-- Content -->
      <div class="profile-content">
        <!-- Personal Info -->
        <section v-if="activeTab === 'personal'" class="profile-card" aria-labelledby="personal-heading">
          <h2 id="personal-heading" class="profile-section-title">Personal Information</h2>
          <form @submit.prevent="saveProfile" novalidate aria-label="Personal information form">
            <div class="form-row">
              <div class="form-group">
                <label for="p-name" class="form-label">Full Name</label>
                <input id="p-name" type="text" class="form-input" v-model="profileForm.name" :class="{ error: profileErrors.name }" aria-describedby="p-name-error" />
                <p v-if="profileErrors.name" id="p-name-error" class="form-error" role="alert">{{ profileErrors.name }}</p>
              </div>
              <div class="form-group">
                <label for="p-email" class="form-label">Email Address</label>
                <input id="p-email" type="email" class="form-input" :value="auth.user?.email" disabled aria-describedby="email-hint" />
                <p id="email-hint" class="form-hint">Email cannot be changed</p>
              </div>
            </div>
            <div class="form-group">
              <label for="p-phone" class="form-label">Phone Number</label>
              <input id="p-phone" type="tel" class="form-input" v-model="profileForm.phone" placeholder="+61 4xx xxx xxx" />
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary" :disabled="saving" :aria-busy="saving">
                <LoadingSpinner v-if="saving" size="sm" inline />
                {{ saving ? 'Saving…' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </section>

        <!-- Membership -->
        <section v-else-if="activeTab === 'membership'" class="profile-card" aria-labelledby="member-heading">
          <h2 id="member-heading" class="profile-section-title">Loyalty Membership</h2>
          <div class="membership-card">
            <div class="membership-tier">
              <span class="tier-badge">✦ Gold Member</span>
              <p class="tier-name">{{ auth.user?.name }}</p>
            </div>
            <div class="membership-stats">
              <div class="member-stat"><span class="ms-val">2,450</span><span class="ms-label">Points</span></div>
              <div class="member-stat"><span class="ms-val">3</span><span class="ms-label">Nights Stayed</span></div>
              <div class="member-stat"><span class="ms-val">Gold</span><span class="ms-label">Current Tier</span></div>
            </div>
          </div>
          <div class="tier-progress">
            <div class="tier-progress-header">
              <span>Progress to Platinum</span>
              <span>2,450 / 5,000 points</span>
            </div>
            <div class="progress-bar" role="progressbar" aria-valuenow="2450" aria-valuemin="0" aria-valuemax="5000" aria-label="Loyalty points progress">
              <div class="progress-fill" style="width:49%"></div>
            </div>
          </div>
          <div class="tier-benefits">
            <h3 class="benefits-title">Your Gold Member Benefits</h3>
            <ul class="benefits-list" role="list">
              <li v-for="b in goldBenefits" :key="b" role="listitem">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" stroke-width="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                {{ b }}
              </li>
            </ul>
          </div>
        </section>

        <!-- Preferences -->
        <section v-else-if="activeTab === 'preferences'" class="profile-card" aria-labelledby="pref-heading">
          <h2 id="pref-heading" class="profile-section-title">Stay Preferences</h2>
          <div class="preferences-grid">
            <div class="form-group">
              <label for="pref-bed" class="form-label">Preferred Bed Type</label>
              <select id="pref-bed" class="form-input" v-model="prefs.bedType">
                <option>King</option><option>Queen</option><option>Twin</option>
              </select>
            </div>
            <div class="form-group">
              <label for="pref-floor" class="form-label">Floor Preference</label>
              <select id="pref-floor" class="form-input" v-model="prefs.floor">
                <option>No preference</option><option>Low floor (1–5)</option><option>High floor (6+)</option>
              </select>
            </div>
            <div class="form-group">
              <label for="pref-view" class="form-label">View Preference</label>
              <select id="pref-view" class="form-input" v-model="prefs.view">
                <option>No preference</option><option>City View</option><option>Garden View</option><option>Ocean View</option>
              </select>
            </div>
            <div class="form-group">
              <label for="pref-pillow" class="form-label">Pillow Preference</label>
              <select id="pref-pillow" class="form-input" v-model="prefs.pillow">
                <option>Firm</option><option>Soft</option><option>Medium</option>
              </select>
            </div>
          </div>
          <div class="pref-checkboxes">
            <p class="form-label" style="margin-bottom:var(--space-3)">Special Requirements</p>
            <label v-for="r in specialReqs" :key="r" class="pref-checkbox-label">
              <input type="checkbox" v-model="prefs.specialReqs" :value="r" class="pref-checkbox" />
              <span>{{ r }}</span>
            </label>
          </div>
          <button class="btn btn-primary" style="margin-top:var(--space-6);" @click="ui.success('Preferences saved!')">Save Preferences</button>
        </section>

        <!-- Security -->
        <section v-else-if="activeTab === 'security'" class="profile-card" aria-labelledby="security-heading">
          <h2 id="security-heading" class="profile-section-title">Account Security</h2>
          <div class="security-info">
            <div class="security-item">
              <div>
                <p class="si-label">Password</p>
                <p class="si-value">Last changed: Unknown</p>
              </div>
              <button class="btn btn-ghost btn-sm" @click="ui.info('Password reset email sent!')">Change Password</button>
            </div>
            <div class="security-item">
              <div>
                <p class="si-label">Two-Factor Authentication</p>
                <p class="si-value">Not enabled</p>
              </div>
              <button class="btn btn-ghost btn-sm" @click="ui.info('2FA setup coming soon!')">Enable</button>
            </div>
            <div class="security-item">
              <div>
                <p class="si-label">Member since</p>
                <p class="si-value">{{ formatDate(auth.user?.created_at) }}</p>
              </div>
            </div>
          </div>
          <div class="danger-zone">
            <h3 class="dz-title">Danger Zone</h3>
            <p class="dz-desc">Permanently delete your account and all associated data. This action cannot be undone.</p>
            <button class="btn btn-danger btn-sm" @click="ui.warning('Account deletion is not available in this demo.')">Delete Account</button>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import { useAuthStore } from '@/stores/authStore.js'
import { useUiStore } from '@/stores/uiStore.js'

const auth = useAuthStore(); const ui = useUiStore()
const activeTab = ref('personal')
const saving = ref(false)

const profileForm = ref({ name: '', phone: '' })
const profileErrors = ref({ name: '' })

const prefs = ref({ bedType: 'King', floor: 'No preference', view: 'No preference', pillow: 'Medium', specialReqs: [] })
const specialReqs = ['Accessible room', 'Allergy-friendly pillows', 'Extra towels', 'No feather products', 'Quiet location']

const tabs = [
  { id: 'personal',     icon: '👤', label: 'Personal Info' },
  { id: 'membership',   icon: '✦',  label: 'Membership' },
  { id: 'preferences',  icon: '⚙️', label: 'Preferences' },
  { id: 'security',     icon: '🔒', label: 'Security' },
]

const goldBenefits = [
  'Early check-in from 12:00 PM (subject to availability)',
  'Late check-out until 2:00 PM guaranteed',
  'Complimentary room upgrade when available',
  'Welcome amenity on each arrival',
  '15% off all spa treatments',
  'Priority reservations at The Meridian',
]

const initials = computed(() => {
  const n = auth.user?.name || ''
  return n.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
})

function formatDate(d) {
  if (!d) return 'Unknown'
  return new Date(d).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
}

async function saveProfile() {
  profileErrors.value.name = ''
  if (!profileForm.value.name.trim()) { profileErrors.value.name = 'Name is required'; return }
  saving.value = true
  try {
    await auth.updateProfile({ name: profileForm.value.name, phone: profileForm.value.phone })
    ui.success('Profile updated successfully!')
  } catch (e) { ui.error(e.message) } finally { saving.value = false }
}

onMounted(() => {
  profileForm.value.name  = auth.user?.name  || ''
  profileForm.value.phone = auth.user?.phone || ''
})
</script>

<style scoped>
.profile-layout { display:grid;grid-template-columns:260px 1fr;gap:var(--space-8);padding:var(--space-8) 0 var(--space-16); }
@media (max-width:900px) { .profile-layout { grid-template-columns:1fr; } }

.profile-sidebar { height:fit-content;position:sticky;top:calc(var(--nav-height) + var(--space-4));background:var(--color-white);border-radius:var(--radius-xl);box-shadow:var(--shadow-sm);border:1px solid var(--color-border-soft);overflow:hidden; }
.profile-avatar-block { display:flex;align-items:center;gap:var(--space-3);padding:var(--space-6);background:var(--color-navy); }
.avatar-circle { width:52px;height:52px;border-radius:50%;background:var(--color-gold);color:var(--color-navy);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.1rem;flex-shrink:0; }
.profile-name  { font-weight:600;color:white;font-size:.95rem; }
.profile-email { font-size:.75rem;color:rgba(255,255,255,.55);margin-top:2px; }
.profile-nav { display:flex;flex-direction:column;padding:var(--space-3); }
.profile-nav-btn { display:flex;align-items:center;gap:var(--space-3);width:100%;text-align:left;padding:var(--space-3) var(--space-4);border-radius:var(--radius-md);font-size:.88rem;font-weight:500;color:var(--color-text-mid);transition:all var(--transition-fast); }
.profile-nav-btn:hover,.profile-nav-btn.active { background:var(--color-cream);color:var(--color-navy); }
.profile-nav-btn.active { background:var(--color-gold-pale);color:var(--color-navy);font-weight:600; }

.profile-card { background:var(--color-white);border-radius:var(--radius-xl);padding:var(--space-8);box-shadow:var(--shadow-sm);border:1px solid var(--color-border-soft); }
.profile-section-title { font-family:var(--font-display);font-size:1.3rem;font-weight:600;color:var(--color-navy);margin-bottom:var(--space-6);padding-bottom:var(--space-4);border-bottom:1px solid var(--color-border-soft); }

form { display:flex;flex-direction:column;gap:var(--space-4); }
.form-row { display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4); }
@media (max-width:640px) { .form-row { grid-template-columns:1fr; } }
.form-actions { display:flex;justify-content:flex-end;padding-top:var(--space-4); }

/* Membership */
.membership-card { background:linear-gradient(135deg,var(--color-navy) 0%,var(--color-navy-light) 100%);border-radius:var(--radius-lg);padding:var(--space-6);margin-bottom:var(--space-6); }
.membership-tier { margin-bottom:var(--space-5); }
.tier-badge { background:var(--color-gold);color:var(--color-navy);font-size:.75rem;font-weight:700;letter-spacing:.1em;padding:.35rem .85rem;border-radius:var(--radius-full);display:inline-flex;align-items:center;gap:var(--space-2); }
.tier-name  { font-family:var(--font-display);font-size:1.3rem;color:white;font-weight:600;margin-top:var(--space-3); }
.membership-stats { display:flex;gap:var(--space-8); }
.member-stat { display:flex;flex-direction:column;gap:4px; }
.ms-val   { font-family:var(--font-display);font-size:1.5rem;font-weight:700;color:var(--color-gold); }
.ms-label { font-size:.7rem;text-transform:uppercase;letter-spacing:.06em;color:rgba(255,255,255,.5); }
.tier-progress { margin-bottom:var(--space-6); }
.tier-progress-header { display:flex;justify-content:space-between;font-size:.82rem;color:var(--color-muted);margin-bottom:var(--space-2); }
.progress-bar { height:8px;background:var(--color-border);border-radius:var(--radius-full);overflow:hidden; }
.progress-fill { height:100%;background:var(--color-gold);border-radius:var(--radius-full);transition:width .5s; }
.benefits-title { font-family:var(--font-display);font-size:1rem;font-weight:600;color:var(--color-navy);margin-bottom:var(--space-4); }
.benefits-list { display:flex;flex-direction:column;gap:var(--space-2); }
.benefits-list li { display:flex;align-items:center;gap:var(--space-2);font-size:.88rem;color:var(--color-text-mid); }

/* Prefs */
.preferences-grid { display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4);margin-bottom:var(--space-6); }
@media (max-width:640px) { .preferences-grid { grid-template-columns:1fr; } }
.pref-checkboxes { display:flex;flex-direction:column;gap:var(--space-2); }
.pref-checkbox-label { display:flex;align-items:center;gap:var(--space-3);font-size:.9rem;color:var(--color-text-mid);cursor:pointer;padding:var(--space-2) 0; }
.pref-checkbox { accent-color:var(--color-gold); }

/* Security */
.security-info { display:flex;flex-direction:column;gap:0;margin-bottom:var(--space-8); }
.security-item { display:flex;align-items:center;justify-content:space-between;padding:var(--space-4) 0;border-bottom:1px solid var(--color-border-soft); }
.si-label { font-weight:600;color:var(--color-navy);font-size:.9rem; }
.si-value { font-size:.78rem;color:var(--color-muted);margin-top:2px; }
.danger-zone { background:var(--color-error-bg);border-radius:var(--radius-lg);padding:var(--space-5);border:1px solid rgba(185,28,28,.1); }
.dz-title { font-weight:600;color:var(--color-error);font-size:.95rem;margin-bottom:var(--space-2); }
.dz-desc  { font-size:.85rem;color:var(--color-text-mid);margin-bottom:var(--space-4);line-height:1.5; }
</style>
