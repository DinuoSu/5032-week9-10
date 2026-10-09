import { beforeEach, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import axios from 'axios'
import GetBookCountView from '../GetBookCountView.vue'

vi.mock('axios', () => ({ default: { get: vi.fn() } }))
beforeEach(() => vi.resetAllMocks())

it('displays zero as a successful count after clicking the button', async () => {
  axios.get.mockResolvedValue({ data: { count: 0 } })
  const wrapper = mount(GetBookCountView)
  expect(wrapper.get('h1').text()).toBe('Book Counter')
  expect(wrapper.text()).not.toContain('Total number of books:')
  await wrapper.get('button').trigger('click')
  await flushPromises()
  expect(wrapper.text()).toContain('Total number of books: 0')
  expect(wrapper.find('[role="alert"]').exists()).toBe(false)
})

it('clears the previous count on failure and recovers on a successful retry', async () => {
  axios.get.mockResolvedValueOnce({ data: { count: 2 } })
    .mockRejectedValueOnce(new Error('Network error'))
    .mockResolvedValueOnce({ data: { count: 3 } })
  const wrapper = mount(GetBookCountView)
  await wrapper.get('button').trigger('click'); await flushPromises()
  expect(wrapper.text()).toContain('Total number of books: 2')
  await wrapper.get('button').trigger('click'); await flushPromises()
  expect(wrapper.get('[role="alert"]').text()).toBe('Error fetching book count')
  expect(wrapper.text()).not.toContain('Total number of books:')
  await wrapper.get('button').trigger('click'); await flushPromises()
  expect(wrapper.text()).toContain('Total number of books: 3')
  expect(wrapper.find('[role="alert"]').exists()).toBe(false)
})
