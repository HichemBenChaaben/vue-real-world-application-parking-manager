import { config } from '@/config'
import { unref, type Ref } from 'vue'

export function useCurrencyFormatter() {
  const formatCurrency = (value: number | Ref<number>) => {
    const formatter = new Intl.NumberFormat(config.appLocale, {
      style: 'currency',
      currency: config.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
    return formatter.format(unref(value))
  }

  return {
    formatCurrency
  }
}
