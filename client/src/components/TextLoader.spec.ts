import { describe, test, expect, beforeEach } from 'vitest'
import type { Component, ComponentPublicInstance } from 'vue'
import type { VueWrapper } from '@vue/test-utils'
import TextLoader from './TextLoader.vue'
import { factory } from '@/testUtils'

/**
 * most of type generics do not need to explicetely be defined like this
 * i just did it to show how it works if typescript wouldnt auto-infer the type
 */

const mountFunction = <T extends Component>(component: T) => factory(component)

describe('TextLoader', () => {
  let wrapper: VueWrapper<ComponentPublicInstance>

  beforeEach(() => {
    wrapper = mountFunction<Component>(TextLoader)
  })

  test('render and match snapshot', () => {
    expect(wrapper.exists()).toBeTruthy()
    expect(wrapper.html()).toMatchSnapshot()
  })

  test('contains animate-pulse class', () => {
    expect(wrapper.classes()).toContain('animate-pulse')
  })
})
