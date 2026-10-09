import { flushPromises } from '@vue/test-utils'
import { beforeAll, describe, expect, it } from 'vitest'

describe('Activity 4 Bootstrap setup', () => {
  beforeAll(async () => {
    document.body.innerHTML = '<div id="app"></div>'

    await import('../main.js')
    await flushPromises()
  })

  it('applies the Bootstrap reboot styles globally', () => {
    const heading = document.querySelector('h1')

    expect(getComputedStyle(document.body).margin).toBe('0px')
    expect(getComputedStyle(heading).marginTop).toBe('0px')
    expect(getComputedStyle(heading).fontWeight).toBe('500')
  })

  it('stops applying the Activity 3 custom styles', () => {
    const heading = document.querySelector('h1')
    const form = document.querySelector('form')
    const gender = document.querySelector('#gender')

    expect(getComputedStyle(heading).textShadow).not.toBe(
      '4px 4px 8px rgba(0, 0, 0, 0.5)',
    )
    expect(getComputedStyle(form).textAlign).not.toBe('center')
    expect(getComputedStyle(gender).backgroundColor).not.toBe('rgb(211, 211, 211)')
  })
})
