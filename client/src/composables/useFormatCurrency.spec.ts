import { ref } from 'vue'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { useCurrencyFormatter } from './useFormatCurrency'
import { config } from '@/config'

describe('useCurrencyFormatter', () => {
  beforeAll(() => {
    vi.mock('@/config', () => ({
      config: {
        appLocale: 'en-US',
        currency: 'USD'
      }
    }))
  })
  it('formats a number as currency', () => {
    const { formatCurrency } = useCurrencyFormatter()
    const formattedValue = formatCurrency(1234.56)
    expect(formattedValue).toBe('$1,234.56')
  })

  it('formats a ref as currency', () => {
    const price = ref(1234.56)
    const { formatCurrency } = useCurrencyFormatter()
    const formattedValue = formatCurrency(price)
    expect(formattedValue).toBe('$1,234.56')
  })

  it('handles different locales and currencies', () => {
    vi.mocked(config).appLocale = 'nl-NL'
    vi.mocked(config).currency = 'EUR'

    const { formatCurrency } = useCurrencyFormatter()
    const formattedValue = formatCurrency(1234.56)
    expect(formattedValue).toBe('€ 1.234,56')
  })

  it('handles different number formats', () => {
    vi.mocked(config).appLocale = 'en-US'
    vi.mocked(config).currency = 'USD'

    const { formatCurrency } = useCurrencyFormatter()
    const formattedValue = formatCurrency(1234.5678)
    expect(formattedValue).toBe('$1,234.57')
  })
})
