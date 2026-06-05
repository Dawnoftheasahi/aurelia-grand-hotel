<template>
  <div id="app-root">
    <TheNavbar />
    <main id="main-content">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="$route.path" />
        </Transition>
      </RouterView>
    </main>
    <TheFooter />
    <ToastContainer />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import TheNavbar from '@/components/layout/TheNavbar.vue'
import TheFooter from '@/components/layout/TheFooter.vue'
import ToastContainer from '@/components/ui/ToastContainer.vue'
import { useAuthStore } from '@/stores/authStore.js'

const auth = useAuthStore()
onMounted(() => { auth.fetchMe() })
</script>

<style>
#app-root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
#main-content {
  flex: 1;
}
</style>
