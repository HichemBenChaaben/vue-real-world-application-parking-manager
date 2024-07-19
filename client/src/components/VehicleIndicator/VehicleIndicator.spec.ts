import { describe, expect, it } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import VehicleIndicator from './VehicleIndicator.vue'

describe('VehicleIndicator', () => {
  it('renders and matches snapshot', () => {
    const wrapper = shallowMount(VehicleIndicator, {
      props: {
        vehicleType: 'CAR'
      }
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('renders car icon for vehicleType CAR', () => {
    const wrapper = shallowMount(VehicleIndicator, {
      props: {
        vehicleType: 'CAR'
      }
    })
    expect(wrapper.find('i').classes()).toContain('fa-car')
  })

  it('renders motorcycle icon for vehicleType MOTORCYCLE', () => {
    const wrapper = shallowMount(VehicleIndicator, {
      props: {
        vehicleType: 'MOTORCYCLE'
      }
    })
    expect(wrapper.find('i').classes()).toContain('fa-motorcycle')
  })
})
