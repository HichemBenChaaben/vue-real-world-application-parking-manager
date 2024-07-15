import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios, { type AxiosError } from 'axios'
import api from '@/services/api'
import type { ParkingSession, SessionListParams } from '@/services/sessionService'
import type { TypeOrNull } from 'types'
import { config } from '@/config'

interface SessionsRevene {
  sessions: number
  revenue: number
}

type SortOrder = 'asc' | 'desc'

interface RevenueAggregates {
  from: Date | string | undefined
  to: Date | string | undefined
  totalSessions: number
  facets?: Record<keyof ParkingSession, { order: SortOrder }>
  sessions: ParkingSession[]
  aggregate: {
    cars: SessionsRevene
    motorcycles: SessionsRevene
  }
}

const useSessionsStore = defineStore('revenue', () => {
  const loading = ref<boolean>(false)
  const error = ref<TypeOrNull<string>>(null)
  const sessionsList = ref<TypeOrNull<ParkingSession[]>>(null)
  const state = ref<TypeOrNull<RevenueAggregates>>(null)

  const defaultSearchParams: Partial<SessionListParams> = {
    offset: 0,
    limit: 300,
    isSessionEnded: true,
    sessionStartedAtFrom: new Date(new Date().getFullYear(), 0, 1).toISOString(),
    sessionEndedAtTo: new Date().toISOString()
  }

  const fetchSessionList = async (params = defaultSearchParams): Promise<void> => {
    try {
      loading.value = true
      const {
        data: { data }
      } = await api.sessionsService.list(params)
      sessionsList.value = filterByNonResidentsSessions(data.parkingSessions)
      setRevenueAggregates(sessionsList.value, params)
    } catch (err: unknown | Error | AxiosError) {
      if (axios.isAxiosError(err)) {
        error.value = err.response?.data.message
      }
    } finally {
      loading.value = false
    }
  }

  /** filters the session list by non residents  */
  const filterByNonResidentsSessions = (sessions: ParkingSession[]) =>
    sessions.filter(({ parkingSpaceId }) => parkingSpaceId !== 1)

  const setRevenueAggregates = (sessions: ParkingSession[], params: typeof defaultSearchParams) => {
    const aggregateState: RevenueAggregates = {
      from: params.sessionStartedAtFrom,
      to: params.sessionEndedAtTo,
      sessions,
      totalSessions: sessions?.length || 0,
      facets: {
        ...(state.value?.facets || {})
      } as RevenueAggregates['facets'],
      aggregate: genrateAggerate(sessions)
    }
    state.value = aggregateState
  }

  const sortStateFacetsByKey = (facet: keyof RevenueAggregates['facets']) => {
    const currentOrder = state.value?.facets?.[facet]['order'] ?? 'asc'

    const sortedSessions =
      state.value?.sessions?.sort((a, b) => {
        if (currentOrder === 'asc') {
          return a[facet] - b[facet]
        } else {
          return b[facet] - a[facet]
        }
      }) || []

    state.value!.sessions = sortedSessions
  }

  const filterByVehiculeType = (filterKey: keyof ParkingSession['vehicleType'] | string) => {
    // if there is no data or no filter key, return to prevent adding state.value!
    if (!state.value || !sessionsList.value) {
      return
    }
    if (filterKey === 'CAR' || filterKey === 'MOTOR') {
      const filterByVehicleList = sessionsList.value.filter(
        (session) => session.vehicleType === filterKey
      )
      state.value.sessions = filterByVehicleList
      state.value.aggregate = genrateAggerate(filterByVehicleList as ParkingSession[])
    } else {
      setRevenueAggregates(sessionsList.value as ParkingSession[], defaultSearchParams)
    }
  }

  const genrateAggerate = (sessions: ParkingSession[]) => {
    const aggregate = {
      cars: { sessions: 0, revenue: 0 },
      motorcycles: { sessions: 0, revenue: 0 }
    }

    sessions.forEach((session) => {
      const totalHours = session.sessionLengthInHoursMinutes / 60
      if (session.vehicleType === 'CAR') {
        aggregate.cars.sessions += 1
        aggregate.cars.revenue += totalHours * config.pricesPerHourMinutes.car
      } else if (session.vehicleType === 'MOTOR') {
        aggregate.motorcycles.sessions += 1
        aggregate.motorcycles.revenue += totalHours * config.pricesPerHourMinutes.motorcycle
      }
    })

    return aggregate
  }

  return {
    error,
    sessionsList,
    fetchSessionList,
    filterByVehiculeType,
    sortStateFacetsByKey,
    loading,
    state
  }
})

export default useSessionsStore
