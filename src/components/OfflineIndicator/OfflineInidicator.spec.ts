import { vi } from 'vitest'
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import OnlineStatus from './OfflineIndicator.vue'

const navigatorMock = vi.fn(() => ({
  online: vi.fn()
}))

vi.stubGlobal('navigator', navigatorMock)

describe('OnlineStatus', () => {
  it('displays offline message when offline', async () => {
    const wrapper = mount(OnlineStatus)

    window.dispatchEvent(new Event('offline'))
    await wrapper.vm.$nextTick()
    expect(wrapper.classes()).toContain('offline-indicator')
  })

  it('does not display offline message when online', async () => {
    const wrapper = mount(OnlineStatus)
    window.dispatchEvent(new Event('online'))
    await wrapper.vm.$nextTick()

    expect(wrapper.classes()).toContain('offline-indicator')
    expect(wrapper.classes()).not.toContain('online-indicator')
  })
})
