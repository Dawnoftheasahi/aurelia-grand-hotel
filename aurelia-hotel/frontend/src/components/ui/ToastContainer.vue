<template>
  <Teleport to="body">
    <div class="toast-container" role="status" aria-live="polite" aria-atomic="true">
      <TransitionGroup name="toast">
        <div
          v-for="toast in ui.toasts"
          :key="toast.id"
          :class="['toast', `toast-${toast.type}`]"
          role="alert"
        >
          <span class="toast-icon" aria-hidden="true">{{ icons[toast.type] }}</span>
          <span class="toast-msg">{{ toast.message }}</span>
          <button class="toast-close" @click="ui.removeToast(toast.id)" aria-label="Dismiss notification">
            <svg width="14" height="14" viewBox="0 0 14 14"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useUiStore } from '@/stores/uiStore.js'
const ui = useUiStore()
const icons = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' }
</script>

<style scoped>
.toast-container {
  position: fixed; top: var(--space-6); right: var(--space-6);
  z-index: 9999; display: flex; flex-direction: column; gap: var(--space-3);
  pointer-events: none; max-width: 360px; width: 100%;
}
@media (max-width: 640px) {
  .toast-container { right: var(--space-4); left: var(--space-4); max-width: none; }
}

.toast {
  display: flex; align-items: center; gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
  background: var(--color-white); border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  border-left: 4px solid transparent;
  pointer-events: all;
  font-size: 0.9rem; font-weight: 500;
}
.toast-success { border-left-color: var(--color-success); }
.toast-error   { border-left-color: var(--color-error); }
.toast-info    { border-left-color: var(--color-info); }
.toast-warning { border-left-color: var(--color-warning); }

.toast-icon {
  width: 22px; height: 22px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.72rem; font-weight: 700; flex-shrink: 0;
}
.toast-success .toast-icon { background: var(--color-success-bg); color: var(--color-success); }
.toast-error   .toast-icon { background: var(--color-error-bg);   color: var(--color-error); }
.toast-info    .toast-icon { background: var(--color-info-bg);    color: var(--color-info); }
.toast-warning .toast-icon { background: var(--color-warning-bg); color: var(--color-warning); }

.toast-msg   { flex: 1; color: var(--color-text); line-height: 1.4; }
.toast-close { color: var(--color-muted); padding: 2px; border-radius: 4px; flex-shrink: 0; transition: color var(--transition-fast); }
.toast-close:hover { color: var(--color-text); }

.toast-enter-active { transition: all 0.3s ease; }
.toast-leave-active { transition: all 0.25s ease; }
.toast-enter-from   { opacity: 0; transform: translateX(20px); }
.toast-leave-to     { opacity: 0; transform: translateX(20px); }
.toast-move         { transition: transform 0.3s ease; }
</style>
