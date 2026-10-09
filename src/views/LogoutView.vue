<script setup>
import { ref, onMounted } from 'vue'
import { logout, currentUser } from '../stores/auth.js'
const done = ref(false), error = ref('')
onMounted(async () => { try { await logout(); done.value = true } catch { error.value = 'Could not sign out. Please try again.' } })
</script>
<template><section class="container py-5"><h1>Log Out</h1><p v-if="done" class="alert alert-success">You are signed out. Current user: {{ currentUser === null ? 'null' : currentUser.email }}</p><p v-else-if="error" role="alert" class="text-danger">{{ error }}</p><p v-else>Signing out…</p><RouterLink to="/FireLogin">Sign in again</RouterLink></section></template>
