import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const toasts = ref([])
  let nextId = 0

  function addToast(message, type = 'info', duration = 4000) {
    const id = ++nextId
    toasts.value.push({ id, message, type })
    if (duration > 0) setTimeout(() => removeToast(id), duration)
    return id
  }

  function removeToast(id) {
    const i = toasts.value.findIndex(t => t.id === id)
    if (i !== -1) toasts.value.splice(i, 1)
  }

  const success = (msg, dur) => addToast(msg, 'success', dur)
  const error   = (msg, dur) => addToast(msg, 'error',   dur)
  const info    = (msg, dur) => addToast(msg, 'info',    dur)
  const warning = (msg, dur) => addToast(msg, 'warning', dur)

  return { toasts, addToast, removeToast, success, error, info, warning }
})
