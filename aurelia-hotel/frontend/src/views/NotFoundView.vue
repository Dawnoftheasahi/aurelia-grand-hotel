<template>
  <div class="not-found">
    <div class="container not-found-inner">
      <div class="nf-mark" aria-hidden="true">✦</div>
      <h1 class="nf-code">404</h1>
      <h2 class="nf-title">Page Not Found</h2>
      <p class="nf-desc">The page you are looking for may have been moved, deleted, or perhaps never existed. Allow us to guide you back.</p>
      <div class="nf-actions">
        <RouterLink to="/" class="btn btn-primary btn-lg">Return Home</RouterLink>
        <RouterLink to="/rooms" class="btn btn-outline-gold btn-lg">Browse Rooms</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.not-found { min-height:90vh;display:flex;align-items:center;justify-content:center;background:var(--color-navy); }
.not-found-inner { text-align:center;display:flex;flex-direction:column;align-items:center;gap:var(--space-4);padding:var(--space-16) 0; }
.nf-mark  { color:var(--color-gold);font-size:2rem;opacity:.5; }
.nf-code  { font-family:var(--font-display);font-size:clamp(5rem,15vw,10rem);font-weight:700;color:rgba(255,255,255,.08);line-height:1; }
.nf-title { font-family:var(--font-display);font-size:2rem;color:white;margin-top:calc(-1 * var(--space-8)); }
.nf-desc  { color:rgba(255,255,255,.55);max-width:420px;line-height:1.7;margin-bottom:var(--space-4); }
.nf-actions { display:flex;gap:var(--space-4);flex-wrap:wrap;justify-content:center; }
</style>
