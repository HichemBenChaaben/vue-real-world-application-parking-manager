import { VueWrapper, mount, type MountingOptions } from '@vue/test-utils'
import type { Component, ComponentPublicInstance } from 'vue'

/**
 * a wrapper for the mount function that magically knows about component props
 * via wrapper.vm.$props[]
 * example wrapper.vm.$props['your-props'] will get you access to the value it self
 * extends vue-test-utils mount function
 */
export const factory = <P, D = Record<string, symbol>>(
  Component: Component,
  options?: MountingOptions<P, D>
): VueWrapper<ComponentPublicInstance<P>> => {
  return mount(Component, {
    ...options
  })
}

/**
 * function to return element by tesId
 * usage
 * const  { findByTestId } = fromWrapper(wrappper);
 * const el = findByTestId('your-test-id');
 *
 * @param wrapper VueWrapper
 */
export const fromWrapper = (wrapper: VueWrapper) => {
  const findByTestId = (testid: string) => wrapper.find(`[data-testid="${testid}"]`)
  return { findByTestId }
}
