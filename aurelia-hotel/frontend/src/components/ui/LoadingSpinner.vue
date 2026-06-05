<template>
  <div class="spinner-wrap" :class="{ inline }" :aria-label="label || 'Loading'">
    <div class="spinner" :class="`size-${size}`" aria-hidden="true"></div>
    <p v-if="label && !inline" class="spinner-label">{{ label }}</p>
  </div>
</template>
<script setup>
defineProps({
  size:   { type: String, default: 'md' },
  label:  { type: String, default: '' },
  inline: { type: Boolean, default: false }
})
</script>
<style scoped>
.spinner-wrap { display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--space-3); }
.spinner-wrap.inline { flex-direction:row; }
.spinner {
  border-radius:50%;
  border:2px solid var(--color-border);
  border-top-color:var(--color-gold);
  animation:spin 0.8s linear infinite;
}
.size-sm { width:18px;height:18px; }
.size-md { width:32px;height:32px;border-width:3px; }
.size-lg { width:48px;height:48px;border-width:3px; }
.spinner-label { font-size:.85rem;color:var(--color-muted); }
@keyframes spin { to { transform:rotate(360deg); } }
</style>
