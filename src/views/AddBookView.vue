<script setup>
import { ref } from 'vue'
import { addBook, bookError } from '../services/books.js'
import BookList from '../components/BookList.vue'
import { currentUser, role } from '../stores/auth.js'
const isbn = ref(''), name = ref(''), error = ref(''), success = ref(''), busy = ref(false), revision = ref(0)
async function submit() {
  if (busy.value) return
  error.value = ''; success.value = ''; busy.value = true
  try {
    await addBook({ isbn: isbn.value, name: name.value })
    success.value = `Added “${name.value.trim()}” to Firestore.`
    isbn.value = ''; name.value = ''; revision.value++
  } catch (err) { error.value = bookError(err) } finally { busy.value = false }
}
</script>
<template>
  <section class="container py-5">
    <h1>Add Book</h1>
    <p>Signed in as {{ currentUser?.email }} · {{ role }}. Members can add and browse; administrators can also edit and delete.</p>
    <form class="row g-3 mb-4" @submit.prevent="submit">
      <div class="col-sm-4"><label for="isbn" class="form-label">ISBN</label><input id="isbn" v-model="isbn" required type="number" min="1" step="1" class="form-control" :disabled="busy" /></div>
      <div class="col-sm-8"><label for="book-name" class="form-label">Book name</label><input id="book-name" v-model="name" required maxlength="200" class="form-control" :disabled="busy" /></div>
      <div class="col-12"><button class="btn btn-primary" :disabled="busy">{{ busy ? 'Adding…' : 'Add Book' }}</button></div>
    </form>
    <p v-if="error" class="alert alert-danger" role="alert">{{ error }}</p>
    <p v-if="success" class="alert alert-success" role="status">{{ success }}</p>
    <BookList :revision="revision" />
  </section>
</template>
