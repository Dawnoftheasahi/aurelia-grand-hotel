<!-- StatusBadge.vue -->
<template>
  <span :class="['badge', badgeClass]" :aria-label="`Status: ${status}`">
    <span class="badge-dot" aria-hidden="true"></span>
    {{ label }}
  </span>
</template>
<script setup>
import { computed } from 'vue'
const props = defineProps({ status: { type: String, required: true } })
const MAP = {
  confirmed: { class: 'badge-success', label: 'Confirmed' },
  pending:   { class: 'badge-warning', label: 'Pending' },
  cancelled: { class: 'badge-error',   label: 'Cancelled' },
  completed: { class: 'badge-info',    label: 'Completed' },
}
const badgeClass = computed(() => MAP[props.status]?.class || 'badge-muted')
const label      = computed(() => MAP[props.status]?.label || props.status)
</script>
<style scoped>
.badge { display:inline-flex;align-items:center;gap:6px;padding:.3rem .8rem;border-radius:var(--radius-full);font-size:.75rem;font-weight:600;letter-spacing:.04em; }
.badge-dot { width:7px;height:7px;border-radius:50%;background:currentColor; }
.badge-success { background:var(--color-success-bg);color:var(--color-success); }
.badge-warning { background:var(--color-warning-bg);color:var(--color-warning); }
.badge-error   { background:var(--color-error-bg);  color:var(--color-error); }
.badge-info    { background:var(--color-info-bg);   color:var(--color-info); }
.badge-muted   { background:var(--color-border-soft);color:var(--color-muted); }
</style>
