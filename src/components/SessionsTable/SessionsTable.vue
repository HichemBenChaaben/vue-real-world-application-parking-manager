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
      <div class="flex justify-start items-center gap-4">
        <input
          type="text"
          id="first_name"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Liscence plate"
          required
        />
        <select
          v-model="vehiculeType"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option selected>Choose a vehicule</option>
          <option value="car">car</option>
          <option value="mororcycle">motorcycle</option>
        </select>
        <button class="">Search</button>
      </div>
      <div class="flex items-center">
        <label class="inline-flex items-center cursor-pointer capitalize mx-2">
          <input
            type="checkbox"
            value=""
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
        <label class="inline-flex items-center cursor-pointer capitalize mx-2">
          <input
            type="checkbox"
            value=""
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
    </div>

    <div>
      <div class="min-h-[360px] max-h-[360px] overflow-hidden">
        <TableLoader v-if="loading && !firstMount" class="max-h-[400px]" />
        <div v-if="!firstMount && !loading" class="max-h-[400px] overflow-scroll w-full">
          <table class="bg-white border border-gray-300 text-sm w-full">
            <thead
              class="sticky top-[-1px] border-t-1 border-gray-200 z-99 bg-white border-collapse py-2"
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
                <td class="text-right py-2 px-4 border-b">
                  {{ session.sessionLengthInHoursMinutes }}
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
                    v-if="showIfActive(session)"
                    @click="handleEndSession"
                    class="bg-white text-red-600 rounded text-xs px-2 py-1 hover:bg-red-600 hover:text-white hover:border-white border border-1 font-semibold"
                  >
                    End session
                  </button>
                  <span v-else class="capitalize text-gray-700 font-semibold">ended</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="my-4 flex justify-end">
        <Pagination
          @nextPage="store.nextPage"
          @previousPage="store.previousPage"
          :currentPage="store.currentPage"
          :isLastPage="isLastPage"
        />
        <div class="inline-flex items-end">
          <select class="mx-4 border border-gray-300 rounded-md px-2 py-1" v-model="totalDisplay">
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
import { useDateFormat } from '@/composables/useDateFormat'
import Indicator from '@/components/Indicator.vue'
import type { ParkingSession } from '@/services/sessionService'

const store = useSessionsStore()
const firstMount = ref<boolean>(true)
const activeSessionsOnly = ref<boolean>(false)
const visitorsOnly = ref<boolean>(false)
const vehiculeType = ref('')

const { loading, activeSessions, filteredParkingSessions, sessionsList, isLastPage } =
  storeToRefs(store)

const { formatDate } = useDateFormat()

const totalDisplay = ref(10)

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

const showIfActive = (session: ParkingSession) => {
  return (
    !session.isSessionEnded && session.sessionStartedAt !== null && session.sessionEndedAt === null
  )
}

const handleEndSession = () => {
  console.log('handle ending session')
}

const toggleActiveOnly = () => {
  if (activeSessionsOnly.value === false) {
    store.toggleActiveSessions(activeSessionsOnly.value)
  } else {
    store.toggleActiveSessions(null)
  }
}

const toggleVisitorsOnly = () => {
  store.toggleVisitors(!visitorsOnly.value)
}
</script>

<style scoped>
/* Add your custom styles here */
.body-row {
  tr {
    @apply hover:bg-slate-100;
  }
}
</style>
