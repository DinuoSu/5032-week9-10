<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { login, register, authMessage, currentUser, role } from '../stores/auth.js'
import { useEmulators } from '../firebase/init.js'
const props = defineProps({ mode: { type: String, default: 'signin' } })
const email = ref(''), password = ref(''), confirmation = ref(''), error = ref(''), busy = ref(false)
const router = useRouter(), route = useRoute()
async function submit() {
  error.value = ''
  if (props.mode === 'register' && password.value !== confirmation.value) { error.value = 'Passwords do not match.'; return }
  busy.value = true
  try {
    await (props.mode === 'register' ? register : login)(email.value, password.value)
    password.value = ''; confirmation.value = ''
    const destination = ['/about', '/addbook'].includes(route.query.redirect) ? route.query.redirect : '/about'
    await router.push(destination)
  } catch (err) { error.value = authMessage(err) } finally { busy.value = false }
}
</script>
<template>
  <section class="container py-5 auth-panel">
    <h1>{{ mode === 'register' ? 'Firebase Registration' : 'Firebase Sign In' }}</h1>
    <p v-if="currentUser" class="alert alert-success">Current user: {{ currentUser.email }} · {{ role }}</p>
    <form @submit.prevent="submit">
      <div class="mb-3"><label for="firebase-email" class="form-label">Email</label><input id="firebase-email" v-model="email" type="email" required autocomplete="username" class="form-control" :disabled="busy" /></div>
      <div class="mb-3"><label for="firebase-password" class="form-label">Password</label><input id="firebase-password" v-model="password" type="password" required minlength="6" :autocomplete="mode === 'register' ? 'new-password' : 'current-password'" class="form-control" :disabled="busy" /></div>
      <div v-if="mode === 'register'" class="mb-3"><label for="firebase-confirm" class="form-label">Confirm password</label><input id="firebase-confirm" v-model="confirmation" type="password" required autocomplete="new-password" class="form-control" :disabled="busy" /></div>
      <p v-if="error" class="text-danger" role="alert">{{ error }}</p>
      <button class="btn btn-primary" :disabled="busy">{{ busy ? 'Please wait…' : mode === 'register' ? 'Register' : 'Sign in' }}</button>
    </form>
    <p v-if="mode === 'register'" class="mt-3">Already registered? <RouterLink to="/FireLogin">Sign in</RouterLink></p>
    <p v-else class="mt-3">New member? <RouterLink to="/FireRegister">Register</RouterLink></p>
    <div v-if="useEmulators" class="alert alert-info mt-4">
      <p class="mb-1">Local test accounts (run <code>npm run seed</code> first):</p>
      <p class="mb-0"><code>admin@library.test</code> or <code>member@library.test</code><br />Password: <code>Library123!</code></p>
    </div>
  </section>
</template>
