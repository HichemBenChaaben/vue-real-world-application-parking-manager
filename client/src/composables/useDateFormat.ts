import { config } from '@/config'
import { format } from 'date-fns'

export function useDateFormat() {
  const formatDate = (
    date: Date | string | number,
    dateFormat: string = 'MMMM do, yyyy HH:mm'
  ): string => {
    return format(new Date(date), dateFormat)
  }

  return {
    formatDate
  }
}
