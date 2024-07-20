<template>
  <div class="w-full">
    <div class="mb-4 flex justify-between">
      <div>
        <h2 class="text-2xl">Sessions</h2>
        <p class="text-gray-400">list of the sessions</p>
      </div>
      <div class="hidden md:flex align-center justify-center pt-2">
        <FilterGroup :activeFilters="activeFilters" @on-reset-filter="handResetFilter" />
      </div>
      <div
        v-if="sessionsList?.parkingSessionsTotalCount || !loading"
        class="flex justify-end items-end flex-col"
      >
        <div>
          <span class="font-semibold text-gray-600">
            {{ sessionsList?.parkingSessionsTotalCount }}
          </span>
          total sessions
        </div>
        <div>
          <Indicator variant="primary" v-if="filteredParkingSessions?.length">
            showing <strong class="mx-1">{{ filteredParkingSessions.length }}</strong> sessions
          </Indicator>
          <span v-else class="my-2">no active sessions in the view</span>
        </div>
      </div>
      <div v-else class="flex flex-col gap-y-2 pt-2">
        <TextLoader class="min-w-[120px]" />
        <TextLoader class="min-w-[120px]" />
      </div>
    </div>
    <Modal v-model:modelValue="isModalOpen" class="h-screen w-full animate">
      <div class="flex flex-col items-start px-0 mx-0 gap-y-10 my-8">
        <div class="flex flex-row justify-between items-center w-full">
          <h2 class="text-2xl capitalize font-semibold pb-4">refine results</h2>
          <div>
            <Indicator variant="primary" v-if="!loading">
              {{ localFilteredState?.length }} session{{
                localFilteredState?.length === 0 ? '' : 's'
              }}
            </Indicator>
            <TextLoader v-else />
          </div>
        </div>
        <form
          @submit.prevent="() => fetchSessionsByLiscencePlate()"
          class="flex justify-between gap-2 w-full"
          novalidate
        >
          <input
            type="text"
            class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Liscence plate"
            required
            v-model="liscencePlate"
          />
          <Button
            class="flex gap-2"
            type="submit"
            @click="() => fetchSessionsByLiscencePlate()"
            :disabled="localSearchLoading"
          >
            <span v-if="localSearchLoading">
              <Loading />
            </span>
            search
          </Button>
        </form>

        <div class="flex justify-between flex-row w-full">
          <label class="inline-flex items-center cursor-pointer capitalize mx-2 min-w-[160px]">
            <input
              type="checkbox"
              class="sr-only peer"
              v-model="activeSessionsOnly"
              @change="toggleActiveOnly"
            />
            <div
              class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
            ></div>
            <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300"
              >all sessions</span
            >
          </label>
          <label class="inline-flex items-center cursor-pointer capitalize mx-2 min-w-[160px]">
            <input
              type="checkbox"
              class="sr-only peer"
              v-model="visitorsOnly"
              @change="toggleVisitorsOnly"
            />
            <div
              class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
            ></div>
            <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              visitors only
            </span>
          </label>
        </div>
        <div class="w-full flex">
          <select
            v-model="vehicleType"
            @change="() => handleFilterByVehicleType()"
            class="w-full p-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="all">all vehicles</option>
            <option value="CAR">car</option>
            <option value="MOTORCYCLE">motorcycle</option>
          </select>
        </div>
      </div>
      <template #close class="w-full"> Apply </template>
    </Modal>

    <div class="flex justify-between border boder-1 border-gray-200 p2 lg:p-4 mb-4">
      <div class="flex lg:hidden flex-row justify-between items-center align-center w-full">
        <Button class="block lg:hidden my-4 mx-2" @click="() => openModal()">
          <i class="fas fa-filter"></i>
          <span class="mx-2">Filter sessions</span>
        </Button>

        <Button
          variant="secondary"
          class="block lg:hidden my-4 mx-2"
          @click="() => resetAllFilters()"
          >reset filters</Button
        >
      </div>
      <div class="hidden lg:flex justify-between w-full">
        <div class="flex items-center">
          <label class="inline-flex items-center cursor-pointer capitalize mx-2 min-w-[160px]">
            <input
              type="checkbox"
              class="sr-only peer"
              v-model="activeSessionsOnly"
              @change="toggleActiveOnly"
            />
            <div
              class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
            ></div>
            <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300"
              >all sessions</span
            >
          </label>
          <label class="inline-flex items-center cursor-pointer capitalize mx-2 min-w-[160px]">
            <input
              type="checkbox"
              class="sr-only peer"
              v-model="visitorsOnly"
              @change="toggleVisitorsOnly"
            />
            <div
              class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
            ></div>
            <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              visitors only
            </span>
          </label>
          <select
            v-model="vehicleType"
            @change="() => handleFilterByVehicleType()"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="all">all vehicles</option>
            <option value="CAR">car</option>
            <option value="MOTORCYCLE">motorcycle</option>
          </select>
        </div>
        <div class="flex justify-start items-center gap-2">
          <DatePicker @changed="handleSearchByDate" />
          <form
            @submit.prevent="() => fetchSessionsByLiscencePlate()"
            class="flex justify-between gap-2"
            novalidate
          >
            <input
              type="text"
              class="w-[200px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Liscence plate"
              required
              v-model="liscencePlate"
            />
            <Button
              class="flex gap-2"
              type="submit"
              @click="() => fetchSessionsByLiscencePlate()"
              :disabled="localSearchLoading"
            >
              <span v-if="localSearchLoading">
                <Loading />
              </span>
              search
            </Button>
          </form>
        </div>
      </div>
    </div>

    <div>
      <div class="min-h-[300px] max-h-[300px] overflow-hidden">
        <TableLoader v-if="loading" class="max-h-[400px]" />
        <div v-if="!loading" class="max-h-[400px] overflow-scroll w-full">
          <table
            class="bg-white border border-gray-300 text-sm w-full"
            :class="{ 'animate-pulse': loading }"
          >
            <thead
              class="sticky z-10 top-[-1px] border-t-1 border-gray-200 z-99 bg-white border-collapse py-2"
            >
              <tr>
                <th class="py-2 px-4 border-b text-left">Parking Id</th>
                <th class="py-2 px-4 border-b text-left w-[200px]">Start Time</th>
                <th class="text-right py-2 px-4 border-b">End Time</th>
                <th class="text-right py-2 px-4 border-b">
                  Duration <span class="text-xs text-gray-600">(minutes)</span>
                </th>
                <th class="text-right py-2 px-4 border-b">Liscence</th>
                <th class="text-right py-2 px-4 border-b">Vehicle</th>
                <th class="text-right py-2 px-4 border-b">&nbsp;</th>
              </tr>
            </thead>
            <tbody class="body-row">
              <tr
                v-for="session in localFilteredState"
                :key="session.parkingSessionId"
                class="text-right"
                :class="{
                  'bg-gray-50': session.isSessionEnded,
                  'bg-blue-100': parkingSessionIdBusy === session.parkingSessionId
                }"
              >
                <td class="py-2 px-4 border-b text-left">
                  <Indicator :variant="session.parkingSpaceId === 1 ? 'secondary' : 'primary'">
                    {{ session.parkingSpaceId === 1 ? 'resident' : 'visitor' }}
                  </Indicator>
                </td>
                <td class="py-2 px-4 border-b text-left">
                  {{ formatDate(session.sessionStartedAt) }}
                </td>
                <td class="text-right py-2 px-4 border-b">
                  {{ formatDate(session.sessionEndedAt) }}
                </td>
                <td class="text-right py-2 px-4 border-b font-semibold text-gray-600 font-italic">
                  {{ session.sessionLengthInHoursMinutes ?? '-' }}
                </td>
                <td class="text-right py-2 px-4 border-b">
                  {{ session.vehicleLicensePlate }}
                </td>
                <td class="text-right py-2 px-4 border-b">
                  <VehicleIndicator :vehicleType="session.vehicleType" />
                </td>
                <td class="text-right py-2 px-4 border-b">
                  <button
                    :disabled="parkingSessionIdBusy === session.parkingSessionId"
                    v-if="!session.isSessionEnded"
                    @click="handleEndSession(session)"
                    class="capitalize bg-white text-red-600 text-xs px-2 py-1 hover:bg-red-600 hover:text-white rounded-md hover:border-white border border-1 font-semibold"
                  >
                    {{
                      parkingSessionIdBusy === session.parkingSessionId
                        ? 'ending session...'
                        : 'end session'
                    }}
                  </button>
                  <span v-else class="capitalize text-gray-700 font-semibold">ended</span>
                </td>
              </tr>
            </tbody>
          </table>

          <div
            v-if="filteredParkingSessions?.length === 0 && !loading"
            class="flex justify-center items-center h-40"
          >
            <p class="text-gray-400">
              No items to display , try changing your search criteria or
              <button v-if="!loading" class="text-blue-300" @click="resetLocalFilters()">
                reset filters
              </button>
              <span v-else>...</span>
            </p>
          </div>
        </div>
      </div>
      <div class="mt-4 mx-0 flex justify-start sm:justify-center relative">
        <Pagination
          @nextPage="nextPage"
          @previousPage="previousPage"
          :currentPage="currentPage"
          :isLastPage="isLastPage"
        />
        <div class="right-0 top-0 z-0 absolute">
          <select
            class="border border-gray-300 rounded-md px-2 py-1"
            v-model="perPage"
            @change="() => updateLimitPerPage"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import useSessionsStore from '@/stores/sessionsStore'
import TableLoader from './TableLoader.vue'
import Pagination from './Pagination.vue'
import Button from '@/components/Button.vue'
import { useDateFormat } from '@/composables/useDateFormat'
import Indicator from '@/components/Indicator.vue'
import Modal from '@/components/Modal/Modal.vue'
import type { ParkingSession } from '@/services/sessionService'
import FilterGroup from '@/components/FilterGroup/FilterGroup.vue'
import DatePicker from '@/components/DatePicker/DatePicker.vue'
import Activity from '@/components/Activity/Activity.vue'

type VahiculeSelection = 'cars' | 'motorcycles' | 'all'

const store = useSessionsStore()
const activeSessionsOnly = ref<boolean>(false)
const visitorsOnly = ref<boolean>(false)
const vehicleType = ref<VahiculeSelection>('all')
const localSearchLoading = ref<boolean>(false)
const { loading, filteredParkingSessions, sessionsList, parkingSessionIdBusy } = storeToRefs(store)
const { formatDate } = useDateFormat()
const localFilteredState = ref<typeof filteredParkingSessions>(filteredParkingSessions)
const liscencePlate = ref<string>()
const perPage = ref<number>(100)
const currentPage = ref<number>(1)
const isModalOpen = ref(false)
const activeFilters = ref<string[]>([])

const openModal = () => {
  isModalOpen.value = true
}

store.fetchSessionList({
  limit: perPage.value,
  offset: 1
})

const handleEndSession = (session: ParkingSession): void => {
  store.endParkingSession(session.parkingSessionId)
}

const toggleVisitorsOnly = () => {
  if (sessionsList.value) {
    localFilteredState.value = visitorsOnly.value
      ? sessionsList.value.parkingSessions.filter(
          (session: ParkingSession) => session.parkingSpaceId !== 1
        )
      : sessionsList.value.parkingSessions
  }
}

const toggleActiveOnly = () => {
  store.setIsSessionEndedFilter(activeSessionsOnly.value)
  store.fetchSessionList({
    limit: perPage.value,
    offset: 0
  })
}

const handleFilterByVehicleType = () => {
  if (vehicleType.value === 'all') {
    localFilteredState.value = sessionsList.value?.parkingSessions
    return
  }
  localFilteredState.value = sessionsList.value?.parkingSessions.filter(
    (session: ParkingSession) => session.vehicleType === vehicleType.value
  )
}

const resetLocalFilters = () => {
  visitorsOnly.value = false
  activeSessionsOnly.value = false
  liscencePlate.value = ''
  toggleActiveOnly()
  store.currentPage = 1
  store.fetchSessionList({
    limit: perPage.value,
    offset: 0
  })
}

const resetAllFilters = () => {
  resetLocalFilters()
  vehicleType.value = 'all'
  store.fetchSessionList({
    limit: perPage.value,
    offset: 0
  })
}

const fetchSessionsByLiscencePlate = async () => {
  if (liscencePlate.value) {
    activeFilters.value = [liscencePlate.value]
  }

  try {
    localSearchLoading.value = true
    await store.fetchSessionList({
      limit: perPage.value,
      offset: 0,
      vehicleLicensePlate: liscencePlate.value
    })
  } catch (error) {
    // handle the error
  } finally {
    localSearchLoading.value = false
  }
}

const updateLimitPerPage = () => {
  store.fetchSessionList({
    limit: perPage.value,
    offset: (currentPage.value - 1) * perPage.value
  })
}

const nextPage = () => {
  const totalPages = Math.ceil(sessionsList.value!.parkingSessionsTotalCount / perPage.value)
  if (store.currentPage < totalPages) {
    currentPage.value++
    store.fetchSessionList({
      limit: perPage.value,
      offset: (currentPage.value - 1) * perPage.value
    })
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    store.fetchSessionList({
      limit: perPage.value,
      offset: (currentPage.value - 1) * perPage.value
    })
  }
}
const isLastPage = computed((): boolean => {
  if (sessionsList?.value?.parkingSessionsTotalCount) {
    return currentPage.value * perPage.value >= sessionsList.value!.parkingSessionsTotalCount
  }
  return false
})

const handResetFilter = (filter: string) => {
  activeFilters.value = activeFilters.value.filter((activeFilter) => activeFilter !== filter)
  liscencePlate.value = ''

  // search with the params
  store.fetchSessionList({
    limit: perPage.value,
    offset: 1
  })
}

const handleSearchByDate = (value: { startDate: Date; endDate: Date }) => {
  store.setDateRange({ startDate: value.startDate, endDate: value.endDate })
}
</script>

<style scoped>
.body-row {
  tr {
    @apply hover:bg-slate-100;
  }
}
</style>
