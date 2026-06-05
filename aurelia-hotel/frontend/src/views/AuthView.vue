<template>
  <div class="auth-page">
    <div class="auth-left" aria-hidden="true">
      <div class="auth-bg"></div>
      <div class="auth-left-overlay"></div>
      <div class="auth-left-content">
        <div class="auth-brand">
          <span class="auth-logo-mark">✦</span>
          <div>
            <p class="auth-logo-name">The Aurelia Grand</p>
            <p class="auth-logo-tag">Luxury Collection</p>
          </div>
        </div>
        <blockquote class="auth-quote">
          <p>"A true sanctuary where every detail is an expression of care."</p>
          <footer>— Our Guest Promise</footer>
        </blockquote>
      </div>
    </div>

    <main class="auth-right" role="main">
      <div class="auth-form-wrap">
        <!-- Tab Toggle -->
        <div class="auth-tabs" role="tablist" aria-label="Authentication options">
          <button
            class="auth-tab"
            :class="{ active: mode === 'login' }"
            @click="mode = 'login'"
            role="tab"
            :aria-selected="mode === 'login'"
            id="tab-login"
            aria-controls="panel-login"
          >Sign In</button>
          <button
            class="auth-tab"
            :class="{ active: mode === 'register' }"
            @click="mode = 'register'"
            role="tab"
            :aria-selected="mode === 'register'"
            id="tab-register"
            aria-controls="panel-register"
          >Create Account</button>
        </div>

        <!-- ─── LOGIN ─── -->
        <div v-if="mode === 'login'" id="panel-login" role="tabpanel" aria-labelledby="tab-login" class="auth-panel animate-fade">
          <div class="auth-header">
            <h1 class="auth-title">Welcome Back</h1>
            <p class="auth-subtitle">Sign in to manage your reservations.</p>
          </div>

          <form @submit.prevent="handleLogin" novalidate aria-label="Sign in form">
            <div class="form-group">
              <label for="login-email" class="form-label">Email Address</label>
              <input
                id="login-email" type="email" class="form-input" v-model="loginForm.email"
                placeholder="your@email.com" autocomplete="email" required
                :class="{ error: loginErrors.email }" aria-describedby="login-email-error"
              />
              <p v-if="loginErrors.email" id="login-email-error" class="form-error" role="alert">{{ loginErrors.email }}</p>
            </div>

            <div class="form-group">
              <label for="login-password" class="form-label">Password</label>
              <div class="input-icon-wrap">
                <input
                  id="login-password" :type="showLoginPw ? 'text' : 'password'"
                  class="form-input" v-model="loginForm.password"
                  placeholder="Your password" autocomplete="current-password" required
                  :class="{ error: loginErrors.password }" aria-describedby="login-password-error"
                />
                <button type="button" class="pw-toggle" @click="showLoginPw = !showLoginPw"
                  :aria-label="showLoginPw ? 'Hide password' : 'Show password'">
                  <svg v-if="!showLoginPw" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                </button>
              </div>
              <p v-if="loginErrors.password" id="login-password-error" class="form-error" role="alert">{{ loginErrors.password }}</p>
            </div>

            <p v-if="loginErrors.general" class="form-error general-error" role="alert">{{ loginErrors.general }}</p>

            <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:var(--space-2);" :disabled="loginLoading" :aria-busy="loginLoading">
              <LoadingSpinner v-if="loginLoading" size="sm" inline />
              {{ loginLoading ? 'Signing in…' : 'Sign In' }}
            </button>
          </form>

          <div class="auth-demo">
            <p class="demo-label">Demo Credentials</p>
            <button class="demo-btn" @click="fillDemo('alex@example.com','password123')">
              <strong>Guest:</strong> alex@example.com / password123
            </button>
            <button class="demo-btn" @click="fillDemo('admin@aurelia.com','admin123')">
              <strong>Admin:</strong> admin@aurelia.com / admin123
            </button>
          </div>
        </div>

        <!-- ─── REGISTER ─── -->
        <div v-else id="panel-register" role="tabpanel" aria-labelledby="tab-register" class="auth-panel animate-fade">
          <div class="auth-header">
            <h1 class="auth-title">Join The Aurelia Grand</h1>
            <p class="auth-subtitle">Create an account for a seamless experience.</p>
          </div>

          <form @submit.prevent="handleRegister" novalidate aria-label="Create account form">
            <div class="form-group">
              <label for="reg-name" class="form-label">Full Name</label>
              <input id="reg-name" type="text" class="form-input" v-model="regForm.name"
                placeholder="Your full name" autocomplete="name" required
                :class="{ error: regErrors.name }" aria-describedby="reg-name-error" />
              <p v-if="regErrors.name" id="reg-name-error" class="form-error" role="alert">{{ regErrors.name }}</p>
            </div>
            <div class="form-group">
              <label for="reg-email" class="form-label">Email Address</label>
              <input id="reg-email" type="email" class="form-input" v-model="regForm.email"
                placeholder="your@email.com" autocomplete="email" required
                :class="{ error: regErrors.email }" aria-describedby="reg-email-error" />
              <p v-if="regErrors.email" id="reg-email-error" class="form-error" role="alert">{{ regErrors.email }}</p>
            </div>
            <div class="form-group">
              <label for="reg-phone" class="form-label">Phone Number (optional)</label>
              <input id="reg-phone" type="tel" class="form-input" v-model="regForm.phone"
                placeholder="+61 4xx xxx xxx" autocomplete="tel" />
            </div>
            <div class="form-group">
              <label for="reg-pw" class="form-label">Password</label>
              <div class="input-icon-wrap">
                <input id="reg-pw" :type="showRegPw ? 'text' : 'password'"
                  class="form-input" v-model="regForm.password"
                  placeholder="Min. 6 characters" autocomplete="new-password" required
                  :class="{ error: regErrors.password }" aria-describedby="reg-pw-error" />
                <button type="button" class="pw-toggle" @click="showRegPw = !showRegPw"
                  :aria-label="showRegPw ? 'Hide password' : 'Show password'">
                  <svg v-if="!showRegPw" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                </button>
              </div>
              <div class="pw-strength" aria-live="polite">
                <div class="strength-bar" :class="pwStrengthClass"></div>
                <span class="strength-label">{{ pwStrengthLabel }}</span>
              </div>
              <p v-if="regErrors.password" id="reg-pw-error" class="form-error" role="alert">{{ regErrors.password }}</p>
            </div>
            <p v-if="regErrors.general" class="form-error general-error" role="alert">{{ regErrors.general }}</p>
            <p class="form-hint" style="margin-top:var(--space-3)">By creating an account, you agree to our Terms &amp; Conditions and Privacy Policy.</p>
            <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:var(--space-4);" :disabled="regLoading" :aria-busy="regLoading">
              <LoadingSpinner v-if="regLoading" size="sm" inline />
              {{ regLoading ? 'Creating Account…' : 'Create Account' }}
            </button>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import { useAuthStore } from '@/stores/authStore.js'
import { useUiStore } from '@/stores/uiStore.js'

const router = useRouter(); const route = useRoute()
const auth = useAuthStore(); const ui = useUiStore()

const mode = ref('login')
const showLoginPw = ref(false); const showRegPw = ref(false)
const loginLoading = ref(false); const regLoading = ref(false)

const loginForm = ref({ email: '', password: '' })
const loginErrors = ref({ email: '', password: '', general: '' })

const regForm = ref({ name: '', email: '', phone: '', password: '' })
const regErrors = ref({ name: '', email: '', password: '', general: '' })

const pwStrengthClass = computed(() => {
  const pw = regForm.value.password
  if (!pw) return ''
  if (pw.length < 6) return 'weak'
  if (pw.length < 10) return 'medium'
  return 'strong'
})
const pwStrengthLabel = computed(() => ({ '': '', weak: 'Weak', medium: 'Fair', strong: 'Strong' }[pwStrengthClass.value]))

function fillDemo(email, password) { loginForm.value = { email, password } }

async function handleLogin() {
  loginErrors.value = { email: '', password: '', general: '' }
  if (!loginForm.value.email)    { loginErrors.value.email    = 'Email is required'; return }
  if (!loginForm.value.password) { loginErrors.value.password = 'Password is required'; return }
  loginLoading.value = true
  try {
    await auth.login(loginForm.value.email, loginForm.value.password)
    ui.success(`Welcome back, ${auth.user.name.split(' ')[0]}!`)
    router.push(route.query.redirect || '/dashboard')
  } catch (e) {
    loginErrors.value.general = e.message
  } finally { loginLoading.value = false }
}

async function handleRegister() {
  regErrors.value = { name: '', email: '', password: '', general: '' }
  if (!regForm.value.name)     { regErrors.value.name     = 'Full name is required'; return }
  if (!regForm.value.email)    { regErrors.value.email    = 'Email is required'; return }
  if (!regForm.value.password) { regErrors.value.password = 'Password is required'; return }
  if (regForm.value.password.length < 6) { regErrors.value.password = 'Password must be at least 6 characters'; return }
  regLoading.value = true
  try {
    await auth.register(regForm.value.name, regForm.value.email, regForm.value.password, regForm.value.phone)
    ui.success(`Account created! Welcome to The Aurelia Grand, ${auth.user.name.split(' ')[0]}!`)
    router.push('/dashboard')
  } catch (e) {
    regErrors.value.general = e.message
  } finally { regLoading.value = false }
}
</script>

<style scoped>
.auth-page { display:flex;min-height:100vh; }
.auth-left { display:none;flex:1;position:relative;overflow:hidden; }
@media (min-width:900px) { .auth-left { display:flex; } }
.auth-bg { position:absolute;inset:0;background-image:url('https://images.unsplash.com/photo-1578898887932-dce23a595ad4?w=1200');background-size:cover;background-position:center; }
.auth-left-overlay { position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,22,40,.5) 0%,rgba(10,22,40,.85) 100%); }
.auth-left-content { position:relative;z-index:1;display:flex;flex-direction:column;justify-content:space-between;padding:var(--space-12);height:100%; }
.auth-brand { display:flex;align-items:center;gap:var(--space-3); }
.auth-logo-mark { color:var(--color-gold);font-size:1.8rem; }
.auth-logo-name  { font-family:var(--font-display);font-size:1.2rem;font-weight:600;color:white; }
.auth-logo-tag   { font-size:.62rem;color:var(--color-gold);text-transform:uppercase;letter-spacing:.18em; }
.auth-quote { border-left:3px solid var(--color-gold);padding-left:var(--space-5);margin:auto 0; }
.auth-quote p      { font-family:var(--font-display);font-style:italic;font-size:1.3rem;color:white;line-height:1.6; }
.auth-quote footer { color:rgba(255,255,255,.5);font-size:.82rem;margin-top:var(--space-3); }

.auth-right { width:100%;max-width:520px;display:flex;align-items:center;justify-content:center;padding:var(--space-12) var(--space-8);background:var(--color-cream); }
@media (min-width:900px) { .auth-right { border-left:1px solid var(--color-border); } }
.auth-form-wrap { width:100%;max-width:420px; }

.auth-tabs { display:flex;background:var(--color-white);border-radius:var(--radius-full);padding:4px;box-shadow:var(--shadow-xs);margin-bottom:var(--space-8);border:1px solid var(--color-border); }
.auth-tab { flex:1;padding:.6rem;border-radius:var(--radius-full);font-size:.88rem;font-weight:500;color:var(--color-muted);transition:all var(--transition-base);text-align:center; }
.auth-tab.active { background:var(--color-navy);color:white;box-shadow:var(--shadow-sm); }
.auth-tab:focus-visible { outline:3px solid var(--color-gold);outline-offset:2px; }

.auth-panel { display:flex;flex-direction:column;gap:var(--space-5); }
.auth-header { margin-bottom:var(--space-2); }
.auth-title    { font-family:var(--font-display);font-size:1.8rem;font-weight:700;color:var(--color-navy); }
.auth-subtitle { color:var(--color-muted);margin-top:var(--space-2); }

form { display:flex;flex-direction:column;gap:var(--space-4); }
.input-icon-wrap { position:relative; }
.input-icon-wrap .form-input { padding-right:3rem; }
.pw-toggle { position:absolute;right:.75rem;top:50%;transform:translateY(-50%);color:var(--color-muted);transition:color var(--transition-fast);padding:4px; }
.pw-toggle:hover { color:var(--color-navy); }
.general-error { padding:var(--space-3) var(--space-4);background:var(--color-error-bg);border-radius:var(--radius-md);margin-top:var(--space-2); }

/* Password Strength */
.pw-strength { display:flex;align-items:center;gap:var(--space-2);margin-top:var(--space-2); }
.strength-bar { height:3px;border-radius:2px;transition:all .3s;background:var(--color-border); }
.strength-bar.weak   { width:33%;background:var(--color-error); }
.strength-bar.medium { width:66%;background:var(--color-warning); }
.strength-bar.strong { width:100%;background:var(--color-success); }
.strength-label { font-size:.72rem;font-weight:500; }

/* Demo */
.auth-demo { background:var(--color-white);border-radius:var(--radius-md);padding:var(--space-4);border:1px solid var(--color-border-soft); }
.demo-label { font-size:.72rem;text-transform:uppercase;letter-spacing:.06em;color:var(--color-muted);margin-bottom:var(--space-3); }
.demo-btn { display:block;width:100%;text-align:left;font-size:.78rem;padding:var(--space-2) var(--space-3);border-radius:var(--radius-sm);color:var(--color-text-mid);transition:background var(--transition-fast); }
.demo-btn:hover { background:var(--color-cream); }
.demo-btn strong { color:var(--color-navy); }
</style>
