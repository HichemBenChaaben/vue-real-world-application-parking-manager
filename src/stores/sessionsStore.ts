import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import axios, { type AxiosError } from 'axios'
import api from '@/services/api'
import type {
  EndParkingSession,
  ParkingSession,
  SessionListParams,
  SessionListResponse,
  ParkingSessionCreateParams,
  StartSessionResponse
} from '@/services/sessionService'
import type { TypeOrNull } from 'types'

/** extend the session list params to support nulling the values by the store actions */
interface SessionListParamsExtended {
  isSessionEnded: TypeOrNull<boolean>
  visitorsOnly: TypeOrNull<boolean>
}

const useSessionsStore = defineStore('sessions', () => {
  const loading = ref<boolean>(false)
  const error = ref<TypeOrNull<string>>(null)
  const sessionsList = ref<TypeOrNull<SessionListResponse>>(null)
  const filteredParkingSessions = ref<TypeOrNull<SessionListResponse['parkingSessions']>>(null)
  const currentPage = ref<number>(1)
  const parkingSessionIdBusy = ref<TypeOrNull<string>>(null)
  const sessionStarted = ref<TypeOrNull<StartSessionResponse>>(null)
  const sessionCreateSuccess = ref<TypeOrNull<boolean>>(null)
  const isSessionEndedFilter = ref<TypeOrNull<boolean>>(null)
  const vehicleLicensePlate = ref<string>('')

  const defaultStoreFilters: Partial<SessionListParams> = {
    offset: 0,
    limit: 100
  }

  /* extending the sessionlistparams to create filters type that can be set to null */
  const filters = ref<Partial<SessionListParams & SessionListParamsExtended>>({
    ...defaultStoreFilters
  })

  /* extracting the total active sessions seperate from filters */
  const activeSessions = computed(() => {
    return sessionsList.value?.parkingSessions.filter(
      (session: ParkingSession) => !session?.isSessionEnded
    ).length
  })

  const fetchSessionList = async (params: Partial<SessionListParams>): Promise<void> => {
    try {
      loading.value = true
      const response = await api.sessionsService.list({
        isSessionEnded: isSessionEndedFilter.value ? null : false,
        vehicleLicensePlate: vehicleLicensePlate.value,
        ...params
      })
      sessionsList.value = response.data.data
    } catch (err: unknown | Error | AxiosError) {
      /** not stock error */
      if (axios.isAxiosError(err)) {
        error.value = err.response?.data.message
      }
    } finally {
      loading.value = false
      applyFilters()
    }
  }

  /** function applying frontend filters to the original list */
  const applyFilters = () => {
    let list = [...(sessionsList.value?.parkingSessions || [])]

    /* visitors-only filter */
    if (filters.value.visitorsOnly === false) {
      list = list.filter((session) => session.parkingSpaceId !== 1)
    }

    /* limit being changed and reduced */
    if (filters.value.limit && filters.value.limit < list.length) {
      list = list.slice(0, filters.value.limit)
    }

    filteredParkingSessions.value = list
  }

  const endParkingSession = async (parkingSessionId: string) => {
    try {
      parkingSessionIdBusy.value = parkingSessionId
      const res = await api.sessionsService.endSession(parkingSessionId)
      const endedSessionData = res.data.data
      udpateParkingSession(endedSessionData, parkingSessionId)
    } catch (err: unknown | Error | AxiosError) {
      if (axios.isAxiosError(err)) {
        error.value = err.response?.data.message
      }
    } finally {
      parkingSessionIdBusy.value = null
    }
  }

  const udpateParkingSession = (endedSessionData: EndParkingSession, parkingSessionId: string) => {
    let list = [...(sessionsList.value?.parkingSessions || [])]
    list =
      list.map((session) => {
        if (session.parkingSessionId === parkingSessionId) {
          return {
            ...session,
            isSessionEnded: true,
            sessionLengthInHoursMinutes: endedSessionData.endedSession.sessionLengthInHoursMinutes
          }
        }
        return session
      }) || []

    filteredParkingSessions.value = list
  }

  const startParkingSession = async (params: ParkingSessionCreateParams): Promise<void> => {
    try {
      loading.value = true
      sessionCreateSuccess.value = null
      const response = await api.sessionsService.startSession(params)
      sessionStarted.value = response?.data?.data
      sessionCreateSuccess.value = true
    } catch (err: unknown | Error | AxiosError) {
      if (axios.isAxiosError(err)) {
        error.value = err.response?.data.message
      }
      error.value = 'An error occured'
    } finally {
      loading.value = false
    }
  }

  const setIsSessionEndedFilter = (value: boolean) => {
    isSessionEndedFilter.value = value
  }

  /* Use the state in the template or computed properties */
  const filteredSessions = computed(() => filteredParkingSessions.value)

  return {
    activeSessions,
    sessionsList,
    sessionStarted,
    fetchSessionList,
    endParkingSession,
    startParkingSession,
    setIsSessionEndedFilter,
    currentPage,
    isSessionEndedFilter,
    filteredParkingSessions,
    parkingSessionIdBusy,
    filteredSessions,
    loading,
    filters,
    error,
    sessionCreateSuccess
  }
})

export default useSessionsStore
