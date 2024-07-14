import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Overview from './Overview.vue'

describe('Overview', () => {
  it('matches snapshot', () => {
    const wrapper = mount(Overview)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('renders without slots', () => {
    const wrapper = mount(Overview)
    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div data-v-55ca85f9="" class="mt-3">
        <h1 data-v-55ca85f9="" class="title"></h1>
        <p data-v-55ca85f9="" class="line"></p>
      </div>"
    `)
  })

  it('renders correctly with default slots', () => {
    const wrapper = mount(Overview, {
      slots: {
        title: '<span>My Title</span>',
        line: '<span>My Line</span>'
      }
    })

    expect(wrapper.find('h1').text()).toBe('My Title')
    expect(wrapper.find('p').text()).toBe('My Line')
  })

  it('applies correct classes to title and line elements', () => {
    const wrapper = mount(Overview, {
      slots: {
        title: '<span>My Title</span>',
        line: '<span>My Line</span>'
      }
    })

    expect(wrapper.find('h1').classes()).toContain('title')
    expect(wrapper.find('p').classes()).toContain('line')
  })
})
