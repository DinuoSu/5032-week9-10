<script setup>
import { computed, ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const formData = ref({
  username: '',
  password: '',
  confirmPassword: '',
  suburb: 'Clayton',
  isAustralian: false,
  reason: '',
  gender: '',
})

const submittedCards = ref([])
const friendMessage = computed(() => /\bfriend\b/i.test(formData.value.reason))
const validateConfirmPassword = () => {
  errors.value.confirmPassword = formData.value.password === formData.value.confirmPassword ? null : 'Passwords do not match.'
  return !errors.value.confirmPassword
}

const errors = ref({
  username: null,
  password: null,
  confirmPassword: null,
  resident: null,
  gender: null,
  reason: null,
})

const setValidationError = (field, message, showError) => {
  if (showError || errors.value[field]) {
    errors.value[field] = message
  }
}

const validateName = (showError = true) => {
  const message =
    formData.value.username.trim().length < 3 ? 'Name must be at least 3 characters' : null

  setValidationError('username', message, showError)
  return !message
}

const validatePassword = (showError = true) => {
  const password = formData.value.password
  let message = null

  if (password.length < 8) {
    message = 'Password must be at least 8 characters long.'
  } else if (!/[A-Z]/.test(password)) {
    message = 'Password must contain at least one uppercase letter.'
  } else if (!/[a-z]/.test(password)) {
    message = 'Password must contain at least one lowercase letter.'
  } else if (!/\d/.test(password)) {
    message = 'Password must contain at least one number.'
  } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    message = 'Password must contain at least one special character.'
  }

  setValidationError('password', message, showError)
  return !message
}

const validateResident = (showError = true) => {
  const message = formData.value.isAustralian ? null : 'Please confirm Australian residency.'

  setValidationError('resident', message, showError)
  return !message
}

const validateGender = (showError = true) => {
  const message = formData.value.gender ? null : 'Please select a gender.'

  setValidationError('gender', message, showError)
  return !message
}

const validateReason = (showError = true) => {
  const message =
    formData.value.reason.trim().length < 10 ? 'Reason must be at least 10 characters.' : null

  setValidationError('reason', message, showError)
  return !message
}

const clearErrors = () => {
  errors.value = {
    username: null,
    password: null,
    confirmPassword: null,
    resident: null,
    gender: null,
    reason: null,
  }
}

const clearForm = () => {
  formData.value = {
    username: '',
    password: '',
    confirmPassword: '',
    suburb: 'Clayton',
    isAustralian: false,
    reason: '',
    gender: '',
  }
  clearErrors()
}

const submitForm = () => {
  const isValid = [
    validateName(true),
    validatePassword(true),
    validateConfirmPassword(),
    validateResident(true),
    validateGender(true),
    validateReason(true),
  ].every(Boolean)

  if (!isValid) return

  const { password, confirmPassword, ...record } = formData.value
  submittedCards.value.push({ ...record, password: '••••••••' })
  clearForm()
}
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">W5. Library Registration Form</h1>
        <p class="text-center">Let's build some more advanced features into our form.</p>
        <form novalidate @submit.prevent="submitForm">
          <div class="row mb-3">
            <div class="col-sm-6">
              <label for="username" class="form-label">Username</label>
              <input id="username" v-model="formData.username" type="text" class="form-control" :class="{ 'is-invalid': errors.username }" @blur="validateName(true)" @input="validateName(false)" />
              <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
            </div>
            <div class="col-sm-6">
              <label for="gender" class="form-label">Gender</label>
              <select id="gender" v-model="formData.gender" class="form-select" @change="validateGender(true)">
                <option value="" disabled>Select a gender</option>
                <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
              </select>
              <div v-if="errors.gender" class="text-danger">{{ errors.gender }}</div>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-sm-6">
              <label for="password" class="form-label">Password</label>
              <input id="password" v-model="formData.password" type="password" autocomplete="new-password" class="form-control" :class="{ 'is-invalid': errors.password }" @blur="validatePassword(true)" @input="validatePassword(false)" />
              <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
            </div>
            <div class="col-sm-6">
              <label for="confirm-password" class="form-label">Confirm password</label>
              <input id="confirm-password" v-model="formData.confirmPassword" type="password" autocomplete="new-password" class="form-control" :class="{ 'is-invalid': errors.confirmPassword }" @blur="validateConfirmPassword" />
              <div v-if="errors.confirmPassword" class="text-danger" role="alert">{{ errors.confirmPassword }}</div>
            </div>
          </div>
          <div class="mb-3">
            <div class="form-check">
              <input id="isAustralian" v-model="formData.isAustralian" type="checkbox" class="form-check-input" @change="validateResident(true)" />
              <label for="isAustralian" class="form-check-label">Australian Resident?</label>
            </div>
            <div v-if="errors.resident" class="text-danger">{{ errors.resident }}</div>
          </div>
          <div class="mb-3">
            <label for="reason" class="form-label">Reason for joining</label>
            <textarea id="reason" v-model="formData.reason" class="form-control" rows="3" @blur="validateReason(true)" @input="validateReason(false)"></textarea>
            <div v-if="errors.reason" class="text-danger">{{ errors.reason }}</div>
            <div v-if="friendMessage" class="text-success">Great to have a friend</div>
          </div>
          <div class="mb-3">
            <label for="suburb" class="form-label">Suburb</label>
            <input id="suburb" v-model="formData.suburb" class="form-control" />
          </div>
          <div class="text-center">
            <button type="submit" class="btn btn-primary me-2">Submit</button>
            <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
          </div>
        </form>
      </div>
    </div>
    <section class="mt-5" aria-label="Registered users">
      <h2 class="h4">Registered users — PrimeVue DataTable</h2>
      <DataTable :value="submittedCards" paginator :rows="5" tableStyle="min-width: 42rem" class="table-scroll">
        <template #empty>No registrations yet.</template>
        <Column field="username" header="Username" sortable />
        <Column field="password" header="Password" />
        <Column field="isAustralian" header="Australian Resident" />
        <Column field="gender" header="Gender" /><Column field="reason" header="Reason" /><Column field="suburb" header="Suburb" />
      </DataTable>
    </section>
    <div v-if="submittedCards.length" class="row mt-5">
      <div class="d-flex flex-wrap justify-content-start">
        <div v-for="(card, index) in submittedCards" :key="index" class="card m-2" style="width: 18rem">
          <div class="card-header">User Information</div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">Username: {{ card.username }}</li>
            <li class="list-group-item">Password: {{ card.password }}</li>
            <li class="list-group-item">Australian Resident: {{ card.isAustralian ? 'Yes' : 'No' }}</li>
            <li class="list-group-item">Gender: {{ card.gender }}</li>
            <li class="list-group-item">Reason: {{ card.reason }}</li>
            <li class="list-group-item">Suburb: {{ card.suburb }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  padding: 10px;
  color: white;
  background-color: #275fda;
  border-radius: 10px 10px 0 0;
}

.list-group-item {
  padding: 10px;
}
</style>
