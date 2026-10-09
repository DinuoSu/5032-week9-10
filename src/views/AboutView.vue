<script setup>
import { currentUser, role } from '../stores/auth.js'
</script>
<template>
  <section class="container py-5">
    <h1>About Our Library</h1>
    <p>Welcome to our library! We are dedicated to providing a vast collection of books and resources to our community.</p>
    <p>Our mission is to foster a love for reading and lifelong learning. Whether you're here to find your next great read, attend an event, or access our online resources, we're here to help.</p>
    <p class="alert alert-success">Members area — signed in as {{ currentUser?.email || 'student (Week 5 demo)' }}<span v-if="role"> · {{ role }}</span></p>
  </section>
</template>
