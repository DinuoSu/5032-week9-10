<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginDemo } from '../stores/auth.js'
const username = ref(''), password = ref(''), error = ref('')
const router = useRouter()
function submit() {
  if (!loginDemo(username.value, password.value)) { error.value = 'Incorrect username or password.'; return }
  password.value = ''
  router.push('/about')
}
</script>
<template>
  <section class="container py-5 auth-panel">
    <h1>Member Login</h1>
    <p>Week 5 routing exercise. Demo credentials: <code>student</code> / <code>Library123!</code>.</p>
    <form @submit.prevent="submit">
      <label for="demo-username" class="form-label">Username</label>
      <input id="demo-username" v-model="username" required class="form-control mb-3" autocomplete="username" />
      <label for="demo-password" class="form-label">Password</label>
      <input id="demo-password" v-model="password" required type="password" class="form-control mb-3" autocomplete="current-password" />
      <p v-if="error" class="text-danger" role="alert">{{ error }}</p>
      <button class="btn btn-primary">Log in</button>
    </form>
    <p class="mt-3">For the book database, use <RouterLink to="/FireLogin">Firebase Sign In</RouterLink>.</p>
  </section>
</template>
