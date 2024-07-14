import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios, { type AxiosError } from 'axios'
import api from '@/services/api'
import type { SessionListParams, SessionListResponse } from '@/services/sessionService'
import type { TypeOrNull } from 'types'

const useSessionsStore = defineStore('revenue', () => {
  const loading = ref<boolean>(false)
  const error = ref<TypeOrNull<string>>(null)
  const sessionsList = ref<TypeOrNull<SessionListResponse>>(null)

  interface UnitPrices {
    car: number
    motorcycle: number
  }

  const RESIDENTS_SPACE_ID = 1

  const unitPrices: UnitPrices = {
    car: 5,
    motorcycle: 3
  }

  const fetchSessionList = async (params: Partial<SessionListParams>): Promise<void> => {
    try {
      loading.value = true
      const {
        data: { data }
      } = await api.sessionsService.list(params)
      sessionsList.value = data
    } catch (err: unknown | Error | AxiosError) {
      if (axios.isAxiosError(err)) {
        error.value = err.response?.data.message
      }
    } finally {
      loading.value = false
    }
  }

  /** revenue calculations and fetching might be heavy
   * only fetch if the store doesnt contain state value
   */
  const fetchSessionListIfNeeded = async (params: Partial<SessionListParams>) => {
    if (sessionsList.value === null) {
      await fetchSessionList(params)
    }
  }

  // comuted property to calculte the total revenue for each month in the current year
  const aggregateParkingHours = computed(() => {
    const totals = {
      cars: 0,
      motorcycles: 0
    }

    sessionsList.value?.parkingSessions
      .filter((session) => session.parkingSpaceId !== RESIDENTS_SPACE_ID)
      .forEach((session) => {
        const totalHours = session.sessionLengthInHoursMinutes / 60 // Convert minutes to hours
        if (session.vehicleType === 'CAR') {
          totals.cars += totalHours * unitPrices.car
        } else if (session.vehicleType === 'MOTOR') {
          totals.motorcycles += totalHours * unitPrices.motorcycle
        }
      })

    return totals
  })

  return {
    error,
    sessionsList,
    fetchSessionList,
    fetchSessionListIfNeeded,
    aggregateParkingHours,
    loading
  }
})

export default useSessionsStore
