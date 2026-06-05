<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-backdrop" @click.self="$emit('update:modelValue', false)" role="dialog" :aria-modal="true" :aria-labelledby="titleId">
        <div class="modal-box" :class="`size-${size}`">
          <div class="modal-header">
            <h2 :id="titleId" class="modal-title">{{ title }}</h2>
            <button class="modal-close" @click="$emit('update:modelValue', false)" aria-label="Close dialog">
              <svg width="18" height="18" viewBox="0 0 18 18"><path d="M1 1l16 16M17 1L1 17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
          </div>
          <div class="modal-body"><slot /></div>
          <div v-if="$slots.footer" class="modal-footer"><slot name="footer" /></div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
<script setup>
import { computed } from 'vue'
const props = defineProps({
  modelValue: Boolean,
  title: { type: String, default: '' },
  size: { type: String, default: 'md' }
})
defineEmits(['update:modelValue'])
const titleId = computed(() => `modal-title-${Math.random().toString(36).slice(2,8)}`)
</script>
<style scoped>
.modal-backdrop { position:fixed;inset:0;background:rgba(10,22,40,0.65);backdrop-filter:blur(4px);z-index:2000;display:flex;align-items:center;justify-content:center;padding:var(--space-4); }
.modal-box { background:var(--color-white);border-radius:var(--radius-xl);box-shadow:var(--shadow-xl);width:100%;max-height:90vh;overflow-y:auto;display:flex;flex-direction:column; }
.size-sm { max-width:480px; }
.size-md { max-width:600px; }
.size-lg { max-width:800px; }
.modal-header { display:flex;align-items:center;justify-content:space-between;padding:var(--space-6) var(--space-6) var(--space-4);border-bottom:1px solid var(--color-border); }
.modal-title  { font-family:var(--font-display);font-size:1.3rem;font-weight:600;color:var(--color-navy); }
.modal-close  { color:var(--color-muted);padding:var(--space-2);border-radius:var(--radius-sm);transition:color var(--transition-fast),background var(--transition-fast); }
.modal-close:hover { color:var(--color-text);background:var(--color-cream); }
.modal-body   { padding:var(--space-6);flex:1; }
.modal-footer { padding:var(--space-4) var(--space-6);border-top:1px solid var(--color-border);display:flex;justify-content:flex-end;gap:var(--space-3); }
.modal-enter-active,.modal-leave-active { transition:opacity .25s ease; }
.modal-enter-active .modal-box,.modal-leave-active .modal-box { transition:transform .25s ease,opacity .25s ease; }
.modal-enter-from,.modal-leave-to { opacity:0; }
.modal-enter-from .modal-box,.modal-leave-to .modal-box { transform:scale(.95)translateY(10px); }
</style>
