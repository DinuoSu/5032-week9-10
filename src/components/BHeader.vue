<script setup>
import { isAuthenticated, currentUser, role } from '../stores/auth.js'
</script>
<template>
  <header class="container border-bottom py-3">
    <nav aria-label="Main navigation"><ul class="nav nav-pills justify-content-center flex-wrap gap-1">
      <li class="nav-item"><RouterLink to="/" class="nav-link" exact-active-class="active">Home (Week 5)</RouterLink></li>
      <li class="nav-item"><RouterLink to="/about" class="nav-link" active-class="active">About</RouterLink></li>
      <li class="nav-item"><RouterLink to="/json" class="nav-link" active-class="active">JSON Lab</RouterLink></li>
      <li class="nav-item"><RouterLink to="/addbook" class="nav-link" active-class="active">Add Book</RouterLink></li>
      <li class="nav-item"><RouterLink to="/getbookcount" class="nav-link" active-class="active">Get Book Count</RouterLink></li>
      <li v-if="!isAuthenticated" class="nav-item"><RouterLink to="/login" class="nav-link" active-class="active">Member Login</RouterLink></li>
      <li class="nav-item"><RouterLink to="/FireLogin" class="nav-link" active-class="active">Firebase Sign In</RouterLink></li>
      <li v-if="!currentUser" class="nav-item"><RouterLink to="/FireRegister" class="nav-link" active-class="active">Firebase Register</RouterLink></li>
      <li v-if="isAuthenticated" class="nav-item"><RouterLink to="/logout" class="nav-link" active-class="active">Log Out</RouterLink></li>
    </ul></nav>
    <p v-if="currentUser" class="text-center text-muted small mt-2 mb-0">{{ currentUser.email }} · {{ role }}</p>
  </header>
</template>
