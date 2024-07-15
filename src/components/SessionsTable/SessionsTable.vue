<template>
  <div class="w-full">
    <div class="mb-4 flex justify-between">
      <div>
        <h2 class="text-2xl">Sessions</h2>
        <p class="text-gray-400">list of the sessions</p>
      </div>
      <div
        v-if="sessionsList?.parkingSessionsTotalCount"
        class="flex justify-end items-end flex-col"
      >
        <div>
          <span class="font-semibold text-gray-600">
            {{ sessionsList?.parkingSessionsTotalCount }}
          </span>
          sessions
        </div>
        <div>
          <span>in view {{ activeSessions }} active</span>
        </div>
      </div>
    </div>

    <div class="flex justify-between border boder-1 border-gray-200 p-4 mb-4">
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
          v-model="vehiculeType"
          @change="() => store.filterVehiculeType(vehiculeType)"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="all">all vehicules</option>
          <option value="car">car</option>
          <option value="motorcycle">motorcycle</option>
        </select>
      </div>
      <div class="flex justify-start items-center gap-2">
        <input type="date" min="2023-01-01" max="2024-12-31" />
        <input type="date" min="2023-01-01" max="2024-12-31" />
        <input
          type="text"
          id="first_name"
          class="w-[200px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Liscence plate"
          required
        />
        <Button>Search</Button>
      </div>
    </div>

    <div>
      <div class="min-h-[300px] max-h-[300px] overflow-hidden">
        <TableLoader v-if="loading && !firstMount" class="max-h-[400px]" />
        <div v-if="!firstMount && !loading" class="max-h-[400px] overflow-scroll w-full">
          <table class="bg-white border border-gray-300 text-sm w-full">
            <thead
              class="sticky z-10 top-[-1px] border-t-1 border-gray-200 z-99 bg-white border-collapse py-2"
            >
              <tr>
                <th class="py-2 px-4 border-b text-left">Parking Id</th>
                <th class="py-2 px-4 border-b text-left">Start Time</th>
                <th class="text-center py-2 px-4 border-b">End Time</th>
                <th class="text-right py-2 px-4 border-b">
                  Duration <span class="text-xs text-gray-600">(minutes)</span>
                </th>
                <th class="text-right py-2 px-4 border-b">Liscence</th>
                <th class="text-right py-2 px-4 border-b">Vehicule</th>
                <th class="text-right py-2 px-4 border-b">&nbsp;</th>
              </tr>
            </thead>
            <tbody class="body-row">
              <tr
                v-for="session in filteredParkingSessions"
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
                <td class="text-center py-2 px-4 border-b">
                  {{ formatDate(session.sessionEndedAt) }}
                </td>
                <td class="text-right py-2 px-4 border-b font-semibold text-gray-600 font-italic">
                  {{ session.sessionLengthInHoursMinutes ?? '-' }}
                </td>
                <td class="text-right py-2 px-4 border-b">
                  {{ session.vehicleLicensePlate }}
                </td>
                <td class="text-right py-2 px-4 border-b">
                  <i
                    :class="`text-xl fas fa-${session.vehicleType === 'CAR' ? 'car' : 'motorcycle'} text-gray-400`"
                  ></i>
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
            <p class="text-gray-400">No items to display , try changing your search criteria</p>
          </div>
        </div>
      </div>
      <div class="mt-4 mx-0 flex justify-center relative">
        <Pagination
          @nextPage="store.nextPage"
          @previousPage="store.previousPage"
          :currentPage="store.currentPage"
          :isLastPage="isLastPage"
        />
        <div class="right-0 top-0 z-0 absolute">
          <select
            class="border border-gray-300 rounded-md px-2 py-1"
            v-model="totalDisplay"
            @change="() => store.updateLimit(totalDisplay)"
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
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import useSessionsStore from '@/stores/sessionsStore'
import TableLoader from './TableLoader.vue'
import Pagination from './Pagination.vue'
import Button from '@/components/Button.vue'
import { useDateFormat } from '@/composables/useDateFormat'
import Indicator from '@/components/Indicator.vue'
import type { ParkingSession } from '@/services/sessionService'

type VahiculeSelection = 'cars' | 'motorcycles' | 'all'

const store = useSessionsStore()
const firstMount = ref<boolean>(true)
const activeSessionsOnly = ref<boolean>(false)
const visitorsOnly = ref<boolean>(false)
const vehiculeType = ref<VahiculeSelection>('all')
const {
  loading,
  activeSessions,
  filteredSessions,
  filteredParkingSessions,
  sessionsList,
  isLastPage,
  parkingSessionIdBusy
} = storeToRefs(store)
const { formatDate } = useDateFormat()

// infernig the type of the limit from the store
const totalDisplay = ref<number>(store.filters.limit as number)

watch(
  () => loading.value,
  () => {
    firstMount.value = false
  }
)

watch(
  () => totalDisplay.value,
  () => {
    store.fetchSessionList({
      limit: totalDisplay.value,
      offset: 1
    })
  }
)

watch(
  () => totalDisplay.value,
  () => {
    store.fetchSessionList({
      limit: totalDisplay.value,
      offset: 1
    })
  }
)

store.fetchSessionList({
  limit: totalDisplay.value,
  offset: 1
})

const showIfActive = (session: ParkingSession): boolean => {
  return (
    !session.isSessionEnded && session.sessionStartedAt !== null && session.sessionEndedAt === null
  )
}

const handleEndSession = (session: ParkingSession): void => {
  store.endParkingSession(session.parkingSessionId)
}

const toggleActiveOnly = () => {
  const toggleValue: boolean | null =
    activeSessionsOnly.value === false ? activeSessionsOnly.value : null
  store.toggleActiveSessions(toggleValue)
}

const toggleVisitorsOnly = () => {
  store.toggleVisitors(!visitorsOnly.value)
}
</script>

<style scoped>
.body-row {
  tr {
    @apply hover:bg-slate-100;
  }
}
</style>
