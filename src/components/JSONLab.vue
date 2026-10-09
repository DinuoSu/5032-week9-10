<script setup>
import { computed, ref } from 'vue'

// Activity 1: Import JSON files (authors.json and bookstores.json)
import authors from '../assets/json/authors.json'
import bookstores from '../assets/json/bookstores.json'

// Activity 2.1: Get authors born after 1850
const modernAuthors = computed(() =>
  authors.filter((author) => author.birthYear > 1850),
)

// Activity 2.2: Get all famous work titles
const allFamousWorks = computed(() =>
  authors.flatMap((author) => author.famousWorks.map((work) => work.title)),
)

// Activity 4.1: Toggle message visibility with v-if and v-else
const showMessage = ref(false)

// Post-Lab Activity 5: Highlight George Orwell using attribute, class and style bindings
const highlightGeorgeOrwell = ref(true)

const isHighlightedAuthor = (author) =>
  highlightGeorgeOrwell.value && author.name === 'George Orwell'
</script>

<template>
  <section class="library-data">
    <h1>📚 Working with JSON Arrays</h1>
    <p>Our <code>authors.json</code> contains an array of author objects.</p>

    <section class="result-group">
      <h2>Iterating through Arrays</h2>
      <button type="button" @click="highlightGeorgeOrwell = !highlightGeorgeOrwell">
        Toggle George Orwell Highlight
      </button>
      <ul>
        <li
          v-for="author in authors"
          :key="author.id"
          :title="
            isHighlightedAuthor(author)
              ? 'Highlighted author: George Orwell'
              : `Author: ${author.name}`
          "
          :aria-label="`Author ${author.name}, born ${author.birthYear}`"
          :class="{ 'highlighted-author': isHighlightedAuthor(author) }"
          :style="{
            fontWeight: isHighlightedAuthor(author) ? '700' : '400',
            borderLeftColor: isHighlightedAuthor(author) ? '#f59e0b' : 'transparent',
          }"
        >
          {{ author.name }} ({{ author.birthYear }})
        </li>
      </ul>
    </section>

    <section class="result-group">
      <h2>Filtering Arrays</h2>
      <p>Authors born after 1850:</p>
      <ul>
        <li v-for="author in modernAuthors" :key="author.id">
          {{ author.name }} ({{ author.birthYear }})
        </li>
      </ul>
    </section>

    <section class="result-group">
      <h2>Mapping Arrays</h2>
      <p>Famous works:</p>
      <ul>
        <li v-for="work in allFamousWorks" :key="work">
          {{ work }}
        </li>
      </ul>
    </section>

    <section class="result-group">
      <h2>v-if &amp; v-else</h2>
      <p>Toggle visibility based on a condition.</p>
      <button type="button" @click="showMessage = !showMessage">Toggle Message</button>
      <p v-if="showMessage" class="message success">✨ You're a Vue superstar! ✨</p>
      <p v-else class="message">Click the button to see a message.</p>
    </section>
  </section>
</template>

<style scoped>
.library-data {
  width: min(900px, 100%);
  margin: 3rem auto;
  padding: 2rem;
  color: #1f2937;
  background: #ffffff;
}

h1 {
  margin-bottom: 1.5rem;
  font-size: 2rem;
  font-weight: 700;
}

h2 {
  margin-bottom: 1rem;
  font-size: 1.4rem;
  font-weight: 700;
}

.result-group {
  margin-top: 2.5rem;
}

ul {
  margin-top: 1rem;
  padding: 0;
  list-style: none;
}

li {
  margin-bottom: 0.5rem;
  padding: 0.85rem 1rem;
  border-left: 5px solid transparent;
  background: #f0f0f0;
  transition: 0.2s ease;
}

.highlighted-author {
  color: #92400e;
  background: #fef3c7;
  box-shadow: 0 0 0 1px #f59e0b;
}

code {
  padding: 0.15rem 0.4rem;
  border-radius: 0.25rem;
  background: #eeeeee;
}

button {
  margin-top: 1rem;
  padding: 0.55rem 0.9rem;
  border: 1px solid #9ca3af;
  border-radius: 0.3rem;
  color: #1f2937;
  background: #f8fafc;
  cursor: pointer;
}

button:hover {
  background: #e5e7eb;
}

.message {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 0.4rem;
  background: #f3f4f6;
}

.success {
  border: 1px solid #34d399;
  color: #047857;
  background: #ecfdf5;
}
</style>
