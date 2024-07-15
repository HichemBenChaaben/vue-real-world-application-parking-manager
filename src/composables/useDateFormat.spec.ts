import { describe, it, expect } from 'vitest'
import { format } from 'date-fns'
import { useDateFormat } from './useDateFormat'

describe('useDateFormat composable', () => {
  it('formats a Date object correctly', () => {
    const date = new Date(2023, 11, 25)
    const { formatDate } = useDateFormat()
    const formattedDate = formatDate(date)

    expect(formattedDate).toBe(format(date, 'MMMM do, yyyy HH:mm'))
  })

  it('formats a string date correctly', () => {
    const dateString = '2023-12-25'
    const { formatDate } = useDateFormat()
    const formattedDate = formatDate(dateString)

    // Assuming desired behavior for string input, you might need adjustments
    expect(formattedDate).toBe(format(new Date(dateString), 'MMMM do, yyyy HH:mm'))
  })

  it('formats a number (timestamp) correctly', () => {
    const timestamp = 1671932800000
    const { formatDate } = useDateFormat()
    const formattedDate = formatDate(timestamp)

    expect(formattedDate).toBe(format(new Date(timestamp), 'MMMM do, yyyy HH:mm'))
  })

  it('formats with a custom format', () => {
    const date = new Date(2023, 11, 25)
    const customFormat = 'dd/MM/yyyy'
    const { formatDate } = useDateFormat()
    const formattedDate = formatDate(date, customFormat)

    expect(formattedDate).toBe(format(date, customFormat))
  })

  it('handles invalid date input', () => {
    const invalidDate = 'invalid-date'
    const { formatDate } = useDateFormat()

    // Expect a specific error or default behavior here
    expect(() => formatDate(invalidDate)).toThrow()
  })
})
