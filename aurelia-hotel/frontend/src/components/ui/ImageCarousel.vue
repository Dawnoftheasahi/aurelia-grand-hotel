<template>
  <div class="carousel" role="region" aria-label="Room image gallery">
    <div class="carousel-track" :style="{ transform: `translateX(-${current * 100}%)` }">
      <div v-for="(img, i) in images" :key="i" class="carousel-slide">
        <img :src="img" :alt="`Room image ${i + 1} of ${images.length}`" class="carousel-img" loading="lazy" />
      </div>
    </div>

    <!-- Controls -->
    <button v-if="images.length > 1" class="carousel-btn prev" @click="prev" aria-label="Previous image">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
    </button>
    <button v-if="images.length > 1" class="carousel-btn next" @click="next" aria-label="Next image">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
    </button>

    <!-- Dots -->
    <div v-if="images.length > 1" class="carousel-dots" role="tablist" aria-label="Image navigation">
      <button
        v-for="(_, i) in images" :key="i"
        :class="['dot', { active: i === current }]"
        @click="current = i"
        :aria-label="`Go to image ${i + 1}`"
        :aria-selected="i === current"
        role="tab"
      />
    </div>

    <!-- Counter -->
    <div class="carousel-counter" aria-live="polite" aria-atomic="true">{{ current + 1 }} / {{ images.length }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({ images: { type: Array, required: true } })
const current = ref(0)
function prev() { current.value = (current.value - 1 + props.images.length) % props.images.length }
function next() { current.value = (current.value + 1) % props.images.length }
</script>

<style scoped>
.carousel { position:relative;overflow:hidden;border-radius:var(--radius-lg);background:var(--color-navy); aspect-ratio:16/9; }
.carousel-track { display:flex;transition:transform 0.4s cubic-bezier(.4,0,.2,1);height:100%; }
.carousel-slide { min-width:100%;height:100%; }
.carousel-img   { width:100%;height:100%;object-fit:cover; }

.carousel-btn {
  position:absolute;top:50%;transform:translateY(-50%);
  width:44px;height:44px;border-radius:50%;
  background:rgba(255,255,255,0.9);color:var(--color-navy);
  display:flex;align-items:center;justify-content:center;
  box-shadow:var(--shadow-md);
  transition:background var(--transition-fast),transform var(--transition-fast);
  z-index:2;
}
.carousel-btn:hover { background:var(--color-white);transform:translateY(-50%) scale(1.05); }
.prev { left:var(--space-4); }
.next { right:var(--space-4); }

.carousel-dots { position:absolute;bottom:var(--space-4);left:50%;transform:translateX(-50%);display:flex;gap:var(--space-2);z-index:2; }
.dot { width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,0.5);transition:all var(--transition-fast); }
.dot.active { background:var(--color-gold);width:24px;border-radius:4px; }

.carousel-counter {
  position:absolute;top:var(--space-4);right:var(--space-4);
  background:rgba(0,0,0,0.45);color:white;
  font-size:0.75rem;padding:.3rem .7rem;border-radius:var(--radius-full);
  backdrop-filter:blur(4px);z-index:2;
}
</style>
