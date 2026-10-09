import PrimeVue from 'primevue/config'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import LibraryRegistrationForm from '../LibraryRegistrationForm.vue'

const fillForm = async (wrapper, values) => {
  await wrapper.get('#username').setValue(values.username)
  await wrapper.get('#password').setValue(values.password)
  await wrapper.get('#confirm-password').setValue(values.password)
  await wrapper.get('#isAustralian').setValue(values.isAustralian)
  await wrapper.get('#gender').setValue(values.gender)
  await wrapper.get('#reason').setValue(values.reason)
}

describe('LibraryRegistrationForm', () => {
  it('lays out the Activity 5 form with Bootstrap grid and control classes', () => {
    const wrapper = mount(LibraryRegistrationForm, { global: { plugins: [PrimeVue] } })

    expect(wrapper.get('.container.mt-5').exists()).toBe(true)
    expect(wrapper.get('.row > .col-md-8.offset-md-2').exists()).toBe(true)
    expect(wrapper.get('h1.text-center').text()).toBe('W5. Library Registration Form')
    expect(wrapper.findAll('form > .row.mb-3')).toHaveLength(2)

    expect(wrapper.get('label[for="username"].form-label').text()).toBe('Username')
    expect(wrapper.get('#username').attributes('type')).toBe('text')
    expect(wrapper.get('#username').classes()).toContain('form-control')
    expect(wrapper.get('label[for="password"].form-label').text()).toBe('Password')
    expect(wrapper.get('#password').attributes('type')).toBe('password')
    expect(wrapper.get('#password').classes()).toContain('form-control')

    expect(wrapper.get('.form-check label[for="isAustralian"]').text()).toBe(
      'Australian Resident?',
    )
    expect(wrapper.get('#isAustralian').attributes('type')).toBe('checkbox')
    expect(wrapper.get('#isAustralian').classes()).toContain('form-check-input')
    expect(wrapper.get('label[for="gender"].form-label').text()).toBe('Gender')
    expect(wrapper.get('#gender').classes()).toContain('form-select')
    expect(wrapper.findAll('#gender option').map((option) => option.text())).toEqual([
      'Select a gender',
      'Male',
      'Female',
      'Other',
    ])

    expect(wrapper.get('label[for="reason"].form-label').text()).toBe('Reason for joining')
    expect(wrapper.get('#reason').attributes('rows')).toBe('3')
    expect(wrapper.get('#reason').classes()).toContain('form-control')
  })

  it('shows the Activity 5 Bootstrap action buttons', () => {
    const wrapper = mount(LibraryRegistrationForm, { global: { plugins: [PrimeVue] } })
    const submitButton = wrapper.get('button[type="submit"]')
    const clearButton = wrapper.get('button[type="button"]')

    expect(submitButton.text()).toBe('Submit')
    expect(submitButton.classes()).toEqual(expect.arrayContaining(['btn', 'btn-primary', 'me-2']))
    expect(clearButton.text()).toBe('Clear')
    expect(clearButton.classes()).toEqual(expect.arrayContaining(['btn', 'btn-secondary']))
  })

  it('uses Vue validation instead of Activity 2 native HTML constraints', () => {
    const wrapper = mount(LibraryRegistrationForm, { global: { plugins: [PrimeVue] } })

    expect(wrapper.get('form').element.checkValidity()).toBe(true)
  })

  it('shows and clears the Vue username validation message', async () => {
    const wrapper = mount(LibraryRegistrationForm, { global: { plugins: [PrimeVue] } })
    const username = wrapper.get('#username')

    await username.setValue('Di')
    await username.trigger('blur')
    expect(wrapper.text()).toContain('Name must be at least 3 characters')

    await username.setValue('Dinuo')
    expect(wrapper.text()).not.toContain('Name must be at least 3 characters')
  })

  it.each([
    ['Ab1!', 'Password must be at least 8 characters long.'],
    ['abcdefgh1!', 'Password must contain at least one uppercase letter.'],
    ['ABCDEFGH1!', 'Password must contain at least one lowercase letter.'],
    ['Abcdefgh!', 'Password must contain at least one number.'],
    ['Abcdefgh1', 'Password must contain at least one special character.'],
  ])('rejects password %s with the correct Vue message', async (password, message) => {
    const wrapper = mount(LibraryRegistrationForm, { global: { plugins: [PrimeVue] } })
    const passwordInput = wrapper.get('#password')

    await passwordInput.setValue(password)
    await passwordInput.trigger('blur')

    expect(wrapper.text()).toContain(message)
  })

  it('validates residency, gender and reason before creating a card', async () => {
    const wrapper = mount(LibraryRegistrationForm, { global: { plugins: [PrimeVue] } })

    await wrapper.get('#username').setValue('Dinuo')
    await wrapper.get('#password').setValue('Secure1!')
    await wrapper.get('form').trigger('submit')

    expect(wrapper.text()).toContain('Please confirm Australian residency.')
    expect(wrapper.text()).toContain('Please select a gender.')
    expect(wrapper.text()).toContain('Reason must be at least 10 characters.')
    expect(wrapper.findAll('.card')).toHaveLength(0)
  })

  it('uses the small breakpoint to keep paired fields in two columns from 576px', () => {
    const wrapper = mount(LibraryRegistrationForm, { global: { plugins: [PrimeVue] } })
    const pairedFieldColumns = wrapper.findAll('form > .row.mb-3 > div')

    expect(pairedFieldColumns).toHaveLength(4)
    pairedFieldColumns.forEach((column) => {
      expect(column.classes()).toContain('col-sm-6')
      expect(column.classes()).not.toContain('col-md-6')
    })
  })

  it('displays submitted user information in a Bootstrap card', async () => {
    const wrapper = mount(LibraryRegistrationForm, { global: { plugins: [PrimeVue] } })

    await fillForm(wrapper, {
      username: 'Dinuo',
      password: 'Secure1!',
      isAustralian: true,
      gender: 'female',
      reason: 'I enjoy reading.',
    })
    await wrapper.get('form').trigger('submit')

    const cardRow = wrapper.get('.row.mt-5')
    const card = cardRow.get('.d-flex.flex-wrap.justify-content-start .card.m-2')
    expect(card.get('.card-header').text()).toBe('User Information')
    expect(card.get('.list-group.list-group-flush').exists()).toBe(true)
    expect(card.findAll('.list-group-item').map((item) => item.text())).toEqual([
      'Username: Dinuo',
      'Password: ••••••••',
      'Australian Resident: Yes',
      'Gender: female',
      'Reason: I enjoy reading.',
      'Suburb: Clayton',
    ])

    expect(wrapper.get('#username').element.value).toBe('')
    expect(wrapper.get('#password').element.value).toBe('')
    expect(wrapper.get('#isAustralian').element.checked).toBe(false)
    expect(wrapper.get('#gender').element.value).toBe('')
    expect(wrapper.get('#reason').element.value).toBe('')
  })

  it('clears validation messages when Clear is clicked', async () => {
    const wrapper = mount(LibraryRegistrationForm, { global: { plugins: [PrimeVue] } })

    await wrapper.get('form').trigger('submit')
    expect(wrapper.text()).toContain('Name must be at least 3 characters')
    expect(wrapper.text()).toContain('Password must be at least 8 characters long.')

    await wrapper.get('button[type="button"]').trigger('click')

    expect(wrapper.text()).not.toContain('Name must be at least 3 characters')
    expect(wrapper.text()).not.toContain('Password must be at least 8 characters long.')
  })

  it('keeps each submitted card as an independent snapshot', async () => {
    const wrapper = mount(LibraryRegistrationForm, { global: { plugins: [PrimeVue] } })

    await fillForm(wrapper, {
      username: 'First user',
      password: 'Secure1!',
      isAustralian: true,
      gender: 'female',
      reason: 'First valid reason',
    })
    await wrapper.get('form').trigger('submit')
    await fillForm(wrapper, {
      username: 'Second user',
      password: 'Secure2!',
      isAustralian: true,
      gender: 'other',
      reason: 'Second valid reason',
    })
    await wrapper.get('form').trigger('submit')

    const cards = wrapper.findAll('.card')
    expect(cards).toHaveLength(2)
    expect(cards[0].text()).toContain('Username: First user')
    expect(cards[1].text()).toContain('Username: Second user')
  })

  it('clears the form without deleting submitted cards', async () => {
    const wrapper = mount(LibraryRegistrationForm, { global: { plugins: [PrimeVue] } })

    await fillForm(wrapper, {
      username: 'Saved user',
      password: 'Secure1!',
      isAustralian: true,
      gender: 'other',
      reason: 'Saved valid reason',
    })
    await wrapper.get('form').trigger('submit')
    await wrapper.get('button[type="button"]').trigger('click')

    expect(wrapper.get('#username').element.value).toBe('')
    expect(wrapper.get('#password').element.value).toBe('')
    expect(wrapper.get('#isAustralian').element.checked).toBe(false)
    expect(wrapper.get('#gender').element.value).toBe('')
    expect(wrapper.get('#reason').element.value).toBe('')
    expect(wrapper.findAll('.card')).toHaveLength(1)
    expect(wrapper.get('.card').text()).toContain('Username: Saved user')
  })
})
