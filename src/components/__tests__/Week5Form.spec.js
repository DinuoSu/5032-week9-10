import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import PrimeVue from 'primevue/config'
import LibraryRegistrationForm from '../LibraryRegistrationForm.vue'

const form = () => mount(LibraryRegistrationForm, { global: { plugins: [PrimeVue] } })
const validInputs = async (wrapper) => {
  await wrapper.get('#username').setValue('Dinuo')
  await wrapper.get('#password').setValue('Secure1!')
  await wrapper.get('#isAustralian').setValue(true)
  await wrapper.get('#gender').setValue('other')
  await wrapper.get('#reason').setValue('I enjoy reading with a friend.')
}

describe('Week 5 registration behavior', () => {
  it('blocks a mismatched confirmation on submit without requiring blur', async () => {
    const wrapper = form()
    await validInputs(wrapper)
    await wrapper.get('form').trigger('submit')
    expect(wrapper.text()).toContain('Passwords do not match.')
    expect(wrapper.findAll('.card')).toHaveLength(0)
  })
  it('waits for blur before warning about confirmation and rechecks changed passwords', async () => {
    const wrapper = form()
    await validInputs(wrapper)
    await wrapper.get('#confirm-password').setValue('different')
    expect(wrapper.text()).not.toContain('Passwords do not match.')
    await wrapper.get('#confirm-password').trigger('blur')
    expect(wrapper.text()).toContain('Passwords do not match.')
    await wrapper.get('#confirm-password').setValue('Secure1!')
    await wrapper.get('#confirm-password').trigger('blur')
    expect(wrapper.text()).not.toContain('Passwords do not match.')
    await wrapper.get('#password').setValue('Secure2!')
    await wrapper.get('form').trigger('submit')
    expect(wrapper.findAll('.card')).toHaveLength(0)
  })
  it('adds a sanitized independent record to the table and resets form feedback', async () => {
    const wrapper = form()
    await validInputs(wrapper)
    await wrapper.get('#confirm-password').setValue('Secure1!')
    await wrapper.get('#suburb').setValue('Melbourne')
    expect(wrapper.get('.text-success').text()).toBe('Great to have a friend')
    await wrapper.get('form').trigger('submit')
    expect(wrapper.get('.card').text()).toContain('Suburb: Melbourne')
    expect(wrapper.get('table').text()).toContain('Dinuo')
    expect(wrapper.get('table').text()).toContain('Melbourne')
    expect(wrapper.text()).not.toContain('Secure1!')
    expect(wrapper.get('#confirm-password').element.value).toBe('')
    expect(wrapper.get('#suburb').element.value).toBe('Clayton')
    expect(wrapper.find('.text-success').exists()).toBe(false)
  })
})
