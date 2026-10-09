<script setup>
import { ref, watch } from 'vue'
import { listBooks, updateBook, deleteBook, bookError } from '../services/books.js'
import { isAdmin } from '../stores/auth.js'
const props = defineProps({ revision: { type: Number, default: 0 } })
const minimumIsbn = ref(1000), resultLimit = ref(10), books = ref([]), loading = ref(false), saving = ref(false), error = ref(''), notice = ref('')
const editingId = ref(null), draftIsbn = ref(''), draftName = ref(''), pendingDelete = ref(null)
let requestVersion = 0
async function load() {
  const version = ++requestVersion
  loading.value = true; error.value = ''
  try {
    const results = await listBooks({ minimumIsbn: Number(minimumIsbn.value), limit: Number(resultLimit.value) })
    if (version === requestVersion) books.value = results
  } catch (err) { if (version === requestVersion) { error.value = bookError(err); books.value = [] } }
  finally { if (version === requestVersion) loading.value = false }
}
watch(() => props.revision, load, { immediate: true })
function edit(book) { editingId.value = book.id; draftIsbn.value = book.isbn; draftName.value = book.name; error.value = ''; notice.value = ''; pendingDelete.value = null }
async function save() {
  if (saving.value) return
  saving.value = true; error.value = ''; notice.value = ''
  try { await updateBook(editingId.value, { isbn: draftIsbn.value, name: draftName.value }); editingId.value = null; notice.value = 'Book updated.'; await load() }
  catch (err) { error.value = bookError(err) } finally { saving.value = false }
}
async function remove(book) {
  if (saving.value) return
  saving.value = true; error.value = ''; notice.value = ''
  try { await deleteBook(book.id); pendingDelete.value = null; notice.value = 'Book deleted.'; await load() }
  catch (err) { error.value = bookError(err) } finally { saving.value = false }
}
</script>
<template>
  <section class="border-top pt-4">
    <h2>Book List</h2>
    <p>Query: ISBN greater than {{ minimumIsbn || 0 }}, ordered by ISBN ascending, limited to {{ resultLimit }} results.</p>
    <form class="row g-3 align-items-end mb-3" @submit.prevent="load">
      <div class="col-sm-4"><label for="minimum-isbn" class="form-label">ISBN greater than</label><input id="minimum-isbn" v-model="minimumIsbn" type="number" min="0" step="1" required class="form-control" /></div>
      <div class="col-sm-4"><label for="result-limit" class="form-label">Result limit</label><input id="result-limit" v-model="resultLimit" type="number" min="1" max="100" step="1" required class="form-control" /></div>
      <div class="col-sm-4"><button class="btn btn-outline-primary" :disabled="loading">{{ loading ? 'Loading…' : 'Search Books' }}</button></div>
    </form>
    <p v-if="error" class="alert alert-danger" role="alert">{{ error }}</p>
    <p v-if="notice" class="alert alert-success" role="status">{{ notice }}</p>
    <p v-if="loading" role="status">Loading books…</p>
    <p v-else-if="!error && !books.length">No books match this query.</p>
    <div v-if="books.length" class="table-responsive">
      <table class="table align-middle"><thead><tr><th>ISBN</th><th>Book name</th><th v-if="isAdmin">Actions</th></tr></thead><tbody>
        <tr v-for="book in books" :key="book.id">
          <td>{{ book.isbn }}</td><td>{{ book.name }}</td>
          <td v-if="isAdmin">
            <template v-if="pendingDelete === book.id"><span>Delete this book?</span> <button class="btn btn-danger btn-sm me-2" :disabled="saving" @click="remove(book)">Confirm delete</button><button class="btn btn-outline-secondary btn-sm" :disabled="saving" @click="pendingDelete = null">Cancel</button></template>
            <template v-else><button class="btn btn-outline-primary btn-sm me-2" :disabled="saving" @click="edit(book)">Edit</button><button class="btn btn-outline-danger btn-sm" :disabled="saving" @click="pendingDelete = book.id">Delete</button></template>
          </td>
        </tr>
      </tbody></table>
    </div>
    <form v-if="editingId && isAdmin" class="border rounded p-3 mt-3" @submit.prevent="save">
      <h3 class="h5">Edit Book</h3>
      <label for="edit-isbn" class="form-label">ISBN</label><input id="edit-isbn" v-model="draftIsbn" type="number" required min="1" step="1" class="form-control mb-2" :disabled="saving" />
      <label for="edit-name" class="form-label">Book name</label><input id="edit-name" v-model="draftName" required maxlength="200" class="form-control mb-3" :disabled="saving" />
      <button class="btn btn-primary me-2" :disabled="saving">Save Changes</button><button type="button" class="btn btn-secondary" :disabled="saving" @click="editingId = null">Cancel</button>
    </form>
  </section>
</template>
