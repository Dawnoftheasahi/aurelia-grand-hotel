<template>
  <div class="stat-card" :class="variant">
    <div class="stat-icon" aria-hidden="true">
      <slot name="icon" />
    </div>
    <div class="stat-content">
      <p class="stat-label">{{ label }}</p>
      <p class="stat-value">{{ value }}</p>
      <p v-if="sub" class="stat-sub">{{ sub }}</p>
    </div>
  </div>
</template>
<script setup>
defineProps({
  label:   { type: String, required: true },
  value:   { type: [String, Number], required: true },
  sub:     { type: String, default: '' },
  variant: { type: String, default: 'default' }
})
</script>
<style scoped>
.stat-card {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  display: flex; gap: var(--space-4); align-items: flex-start;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border-soft);
  transition: box-shadow var(--transition-base);
}
.stat-card:hover { box-shadow: var(--shadow-md); }
.stat-card.gold  { border-top: 3px solid var(--color-gold); }
.stat-card.navy  { border-top: 3px solid var(--color-navy); }
.stat-card.green { border-top: 3px solid var(--color-success); }
.stat-card.red   { border-top: 3px solid var(--color-error); }

.stat-icon {
  width: 46px; height: 46px; border-radius: var(--radius-md);
  background: var(--color-cream);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; color: var(--color-gold);
}
.stat-card.navy .stat-icon  { background: rgba(10,22,40,0.06); color: var(--color-navy); }
.stat-card.green .stat-icon { background: var(--color-success-bg); color: var(--color-success); }
.stat-card.red   .stat-icon { background: var(--color-error-bg);   color: var(--color-error); }

.stat-label { font-size: 0.78rem; font-weight: 500; color: var(--color-muted); text-transform: uppercase; letter-spacing: .06em; margin-bottom: var(--space-1); }
.stat-value { font-family: var(--font-display); font-size: 2rem; font-weight: 700; color: var(--color-navy); line-height: 1; }
.stat-sub   { font-size: 0.78rem; color: var(--color-muted); margin-top: var(--space-1); }
</style>
