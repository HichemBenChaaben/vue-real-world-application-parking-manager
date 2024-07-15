<template>
  <div>
    <div class="flex justify-between items-end">
      <Overview>
        <template #title> revenue </template>
        <template #line> Revenue of all ended sessions since 1st January </template>
      </Overview>
      <div class="flex justify-end flex-row text-end gap-4">
        <div
          class="bg-blue-50 rounded-md p-2 text-blue-800 m-1 flex flex-col px-2 py-2 mb-2 border boder-solid border-blue-400"
        >
          <span class="p-0 text-sm mr-2 flex justify-between gap-4">
            cars
            <TextLoader v-if="loading" />
            <strong v-else> {{ state?.aggregate.cars.sessions }} sessions </strong>
          </span>
          <span class="p-0 text-sm mr-2 flex justify-between gap-4">
            revenue
            <TextLoader v-if="loading" />
            <strong v-else>
              {{ formatCurrency(state?.aggregate.cars.revenue as number) }}
            </strong>
          </span>
        </div>
        <div
          class="bg-blue-50 rounded-md p-2 text-blue-800 m-1 flex flex-col px-2 py-2 mb-2 border boder-solid border-blue-400"
        >
          <span class="p-0 text-sm mr-2 flex justify-between gap-4">
            motorcycles
            <TextLoader v-if="loading" />
            <strong v-else> {{ state?.aggregate.motorcycles.sessions }} sessions </strong>
          </span>
          <span class="p-0 text-sm mr-2 flex justify-between gap-4">
            revenue
            <TextLoader v-if="loading" />
            <strong v-else>
              {{ formatCurrency(state?.aggregate.motorcycles.revenue as number) }}
            </strong>
          </span>
        </div>
      </div>
    </div>
    <div class="flex w-full flex-col card">
      <div class="flex justify-between border boder-1 border-gray-200 p-4 mb-4">
        <div class="flex items-center">
          <div class="capitalize" v-if="!loading">
            showing
            <span class="mx-1 text-md font-semibold">{{ state?.totalSessions }}</span>
            session{{ (state?.sessions || []).length > 1 ? 's' : '' }}
          </div>
          <TextLoader v-if="loading" />
        </div>
        <div class="min-w-[200px]" v-if="!loading">
          <select
            v-model="vehiculeTypeFilter"
            @change="() => setVehiculeTypeFilter()"
            class="w-full capitalize bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="all">all vehicles</option>
            <option value="CAR">car</option>
            <option value="MOTOR">motorcycle</option>
          </select>
        </div>
        <div v-else>
          <TextLoader />
        </div>
      </div>

      <div class="max-h-[400px] overflow-scroll w-full">
        <table v-if="!loading" class="bg-white border border-gray-300 text-sm w-full revenue-table">
          <thead
            class="sticky z-10 top-[-1px] border-t-1 border-gray-200 z-99 bg-white border-collapse py-2"
          >
            <tr>
              <th class="py-2 px-4 border-b text-left cursor-pointer">
                <button @click="handleSetSortingKey('sessionStartedAt')">Start Time</button>
              </th>
              <th class="text-right py-2 px-4 border-b" width="210px">
                <button @click="handleSetSortingKey('sessionEndedAt')">End time</button>
              </th>
              <th class="text-right py-2 px-4 border-b">
                <button @click="handleSetSortingKey('sessionLengthInHoursMinutes')">
                  Duration <span class="text-xs text-gray-600">(minutes)</span>
                </button>
              </th>
              <th class="text-right py-2 px-4 border-b">
                <button @click="handleSetSortingKey('vehicleLicensePlate')">Liscence plate</button>
              </th>
              <th class="text-right py-2 px-4 border-b">
                <button @click="handleSetSortingKey('vehicleType')">Vehicle</button>
              </th>
              <th class="text-right py-2 px-4 border-b">Realised profit</th>
            </tr>
          </thead>
          <tbody class="body-row">
            <tr
              v-for="session in state?.sessions"
              :key="session.parkingSessionId"
              class="text-right"
            >
              <td class="text-left py-2 px-4 border-b">
                {{ formatDate(session.sessionStartedAt) }}
              </td>
              <td class="text-right py-2 px-4 border-b">
                {{ formatDate(session.sessionEndedAt) }}
              </td>
              <td class="text-right py-2 px-4 border-b">
                {{ session.sessionLengthInHoursMinutes ?? 'N/A' }}
              </td>
              <td class="text-right py-2 px-4 border-b">{{ session.vehicleLicensePlate }}</td>
              <td class="text-right py-2 px-4 border-b">{{ session.vehicleType }}</td>
              <td class="text-right py-2 px-4 border-b">
                <span class="font-semibold text-gray-800">
                  {{
                    Intl.NumberFormat('nl-NL', {
                      style: 'currency',
                      currency: 'EUR'
                    }).format(
                      session.vehicleType === 'CAR'
                        ? (session?.sessionLengthInHoursMinutes / 60) * 5
                        : (session?.sessionLengthInHoursMinutes / 60) * 3
                    )
                  }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <TableLoader v-else />
        <div
          class="hide flex justify-center items-center h-40"
          v-if="state?.sessions?.length === 0"
        >
          <p class="text-gray-400">No items to display , try changing your search criteria</p>
        </div>
      </div>
      <div class="flex justify-end items-center py-2 mt-4" v-if="state?.aggregate.cars.revenue">
        <span class="text-xs">Total Aggregate</span>
        <span class="text-md font-semibold px-2">
          {{
            formatCurrency(state.aggregate.cars.revenue + state.aggregate.motorcycles.revenue) ??
            'N/A'
          }}
        </span>
      </div>
    </div>

    <div class="sm:grid sm:grid-cols-2 gap-4 mb-4 pb-4 flex w-full flex-col mt-4">
      <div class="w-full">
        <div class="card" v-if="!loading">
          <BarChart :dataSets="dataSets" />
        </div>
        <div class="card animate-pulse" v-else>
          <div class="h-full animate-pulse bg-gray-100"></div>
        </div>
      </div>
      <div class="w-full">
        <div class="card" v-if="!loading">
          <BarChart :dataSets="dataSetsSessions" />
        </div>
        <div class="card animate-pulse" v-else>
          <div class="h-full animate-pulse bg-gray-100"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import Overview from '@/components/Overview.vue'
import BarChart from '@/components/BarChart/BarChart.vue'
import { storeToRefs } from 'pinia'
import useRevenueStore from '@/stores/revenueStore'
import { useDateFormat } from '@/composables/useDateFormat'
import { useCurrencyFormatter } from '@/composables/useFormatCurrency'
import TableLoader from '@/components/SessionsTable/TableLoader.vue'
import TextLoader from '@/components/TextLoader.vue'
import type { ParkingSession, VehiculeType } from '@/services/sessionService'
import type { TypeOrNull } from 'types'

type VehiculeTypeSelection = string | VehiculeType

const { formatDate } = useDateFormat()
const { formatCurrency } = useCurrencyFormatter()

const store = useRevenueStore()
const { loading, state } = storeToRefs(store)

const sortingKey = ref<TypeOrNull<keyof ParkingSession>>(null)
const sortingOrder = ref<string>('asc')
const vehiculeTypeFilter = ref<VehiculeTypeSelection>('all')

store.fetchSessionList()

const setVehiculeTypeFilter = () => {
  store.filterByVehiculeType(vehiculeTypeFilter.value)
}

/** setting the sorting key from the ui */
const handleSetSortingKey = (param: keyof ParkingSession) => {
  sortingOrder.value = sortingOrder.value === 'asc' ? 'desc' : 'asc'
  sortingKey.value = param
}

const dataSets = ref({
  labels: ['Car', 'Motorcycle'],
  datasets: [
    {
      label: 'revenue in euros',
      backgroundColor: ['indigo', 'gray'],
      data: [state.value?.aggregate.cars.revenue, state.value?.aggregate.motorcycles.revenue]
    }
  ]
})

const dataSetsSessions = ref({
  labels: ['Car', 'Motorcycle'],
  datasets: [
    {
      label: 'sessions by vehicle',
      backgroundColor: ['blue', 'fushia'],
      data: [state.value?.aggregate.cars.sessions, state.value?.aggregate.motorcycles.sessions]
    }
  ]
})

watch(
  () => state.value?.aggregate,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      const { cars, motorcycles } = state.value?.aggregate || { cars: {}, motorcycles: {} }
      dataSetsSessions.value.datasets[0].data = [cars.sessions, motorcycles.sessions]
      dataSets.value.datasets[0].data = [cars.revenue, motorcycles.revenue]
    }
  },
  {
    deep: true
  }
)
</script>
<style scoped>
.card {
  @apply p-6 rounded overflow-hidden shadow-sm border border-solid border-gray-300 bg-white w-full min-h-[300px] md:min-h-[400px];
}

table {
  tbody > tr {
    @apply hover:bg-blue-50;
  }
}
</style>
