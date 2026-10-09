<script setup>
import BHeader from './components/BHeader.vue'
import { useEmulators } from './firebase/init.js'
</script>
<template>
  <BHeader />
  <main><RouterView /></main>
  <footer class="container border-top mt-5 py-3 text-center text-muted small">FIT5032 · Weeks 1–8<span v-if="useEmulators"> · Local Firebase emulators</span></footer>
</template>
