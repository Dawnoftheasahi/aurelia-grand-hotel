<template>
  <div class="empty-state" :class="compact ? 'compact' : ''">
    <div class="empty-icon" aria-hidden="true"><slot name="icon">✦</slot></div>
    <h3 class="empty-title">{{ title }}</h3>
    <p v-if="message" class="empty-message">{{ message }}</p>
    <div v-if="$slots.action" class="empty-action"><slot name="action" /></div>
  </div>
</template>
<script setup>
defineProps({
  title:   { type: String, default: 'Nothing here yet' },
  message: { type: String, default: '' },
  compact: { type: Boolean, default: false }
})
</script>
<style scoped>
.empty-state { text-align:center;padding:var(--space-16) var(--space-8);display:flex;flex-direction:column;align-items:center;gap:var(--space-4); }
.empty-state.compact { padding:var(--space-10) var(--space-6); }
.empty-icon { font-size:2.5rem;color:var(--color-border);margin-bottom:var(--space-2); }
.empty-title { font-family:var(--font-display);font-size:1.3rem;font-weight:600;color:var(--color-navy); }
.empty-message { font-size:.9rem;color:var(--color-muted);max-width:320px;line-height:1.6; }
.empty-action { margin-top:var(--space-2); }
</style>
