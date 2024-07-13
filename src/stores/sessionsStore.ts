import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import axios, { type AxiosError } from 'axios'
import api from '@/services/api'
import type {
  ParkingSession,
  SessionListParams,
  SessionListResponse
} from '@/services/sessionService'
import type { Maybe, TypeOrNull } from 'types'

/** extend the session list params to support nulling the values by the store actions */
interface SessionListParamsExtended {
  isSessionEnded: TypeOrNull<boolean>
  visitorsOnly: TypeOrNull<boolean>
}

/** filters to support frontend filtering */
enum Filter {
  ActiveVisitor = 'ACTIVE_VISITORS'
}

const useSessionsStore = defineStore('sessions', () => {
  const loading = ref<boolean>(false)
  const error = ref<TypeOrNull<string>>(null)
  const sessionsList = ref<TypeOrNull<SessionListResponse>>(null)
  const filteredParkingSessions = ref<SessionListResponse['parkingSessions'] | null>(null)
  const currentPage = ref<number>(1)

  const defaultStoreFilters: Partial<SessionListParams> = {
    offset: 0,
    limit: 10
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
      const {
        data: { data }
      } = await api.sessionsService.list(params)
      sessionsList.value = data
    } catch (err: unknown | Error | AxiosError) {
      // axios error, handle
      if (axios.isAxiosError(err)) {
        error.value = err.response?.data.message
      }
      // some stock error if its not axios error
    } finally {
      loading.value = false
      applyFilters()
    }
  }

  const toggleActiveSessions = (checked: TypeOrNull<boolean>) => {
    filters.value.isSessionEnded = checked as boolean | undefined
    applyFilters()
  }

  const toggleVisitors = (checked: Maybe<boolean>) => {
    filters.value.visitorsOnly = checked
    applyFilters()
  }

  /* set an individual filter */
  const setSingleFilter = (filter: Filter): void => {
    console.log('change a particular filter once at a time')
    /* apply filter function will just filter the dataset already fetched earlier */
    applyFilters()
  }

  /* batch change params */
  const setFilters = (filterSet: SessionListParams): void => {
    console.log('batch change filters all at once...')
    filters.value = filterSet
  }

  /** function applying frontend filters to the original list */
  const applyFilters = () => {
    let list = [...(sessionsList.value?.parkingSessions || [])]

    // filter the list if the user want to see all sessions (active/unactive)
    if (filters.value.isSessionEnded !== null) {
      list = list.filter((session) => session.isSessionEnded === false)
    }

    // visitors only filter
    if (filters.value.visitorsOnly === false) {
      list = list.filter((session) => session.parkingSpaceId !== 1)
    }

    filteredParkingSessions.value = list
  }

  const nextPage = () => {
    currentPage.value = currentPage.value + 1
  }
  const previousPage = () => {
    currentPage.value = currentPage.value - 1
  }

  const isLastPage = computed((): boolean => {
    if (filters.value.limit && sessionsList.value?.parkingSessionsTotalCount) {
      return (
        (currentPage.value * filters.value.limit || 10) >=
        sessionsList.value?.parkingSessionsTotalCount
      )
    }
    return false
  })

  // anytime the page changes we fetch with different offset
  watch(
    () => currentPage.value,
    (newValue, oldValue) => {
      console.log('page changed', newValue)
      if (newValue !== oldValue) {
        filters.value.offset = (currentPage.value - 1) * (filters.value.limit || 10)
        fetchSessionList(filters.value)
      }
    }
  )

  return {
    activeSessions,
    sessionsList,
    fetchSessionList,
    toggleActiveSessions,
    toggleVisitors,
    nextPage,
    previousPage,
    isLastPage,
    currentPage,
    filteredParkingSessions,
    loading
  }
})

export default useSessionsStore
