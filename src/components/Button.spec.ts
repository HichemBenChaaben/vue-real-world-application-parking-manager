import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from './Button.vue'
import Loading from './Loading.vue'

describe('Button component', () => {
  it('renders correctly with default props', () => {
    const wrapper = mount(Button)
    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.find('button').text()).toBe('')
  })

  it('renders loading state correctly', () => {
    const wrapper = mount(Button, { props: { busy: true } })
    expect(wrapper.find('button').classes()).toContain('bg-blue-600')
    expect(wrapper.findComponent(Loading).exists()).toBe(true)
  })

  it('renders custom busy text', () => {
    const busyText = 'Custom loading text'
    const wrapper = mount(Button, { props: { busy: true, busyText } })
    expect(wrapper.text()).toContain(busyText)
  })
})
