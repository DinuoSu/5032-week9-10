<template>
  <section class="container py-5 text-center">
    <h1>Book Counter</h1>
    <button class="btn btn-primary my-3" :disabled="loading" @click="getBookCount">
      Get Book Count
    </button>
    <p v-if="count !== null" role="status">Total number of books: {{ count }}</p>
    <p v-if="error" class="text-danger" role="alert">{{ error }}</p>
  </section>
</template>

<script setup>
import axios from 'axios'
import { ref } from 'vue'

const count = ref(null)
const error = ref(null)
const loading = ref(false)
const countBooksUrl = import.meta.env.VITE_COUNT_BOOKS_URL ||
  'http://127.0.0.1:5001/demo-fit5032/us-central1/countBooks'

const getBookCount = async () => {
  if (loading.value) return
  loading.value = true
  try {
    const response = await axios.get(countBooksUrl, { timeout: 10000 })
    count.value = response.data.count
    error.value = null
  } catch {
    error.value = 'Error fetching book count'
    count.value = null
  } finally {
    loading.value = false
  }
}
</script>
