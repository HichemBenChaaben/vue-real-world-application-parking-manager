<template>
  <div>
    <div class="flex justify-between items-end">
      <Overview>
        <template #title> revenue </template>
        <template #line> Revenue of all ended sessions since 1st January </template>
      </Overview>
      <div class="flex justify-end flex-col text-end">
        <div
          class="bg-blue-50 rounded-md p-2 text-blue-800 m-1 flex flex-col px-4 py-2 mb-2 border boder-solid border-blue-400"
        >
          <span class="p-0 text-sm mr-2">
            total realised profit
            <strong>
              {{
                Intl.NumberFormat('nl-nl', {
                  currency: 'EUR',
                  style: 'currency',
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0
                }).format(aggregateParkingHours.cars * 5 || 0)
              }}
              cars
            </strong>
          </span>
          <span class="p-0 text-sm mr-2">
            total realised profit
            <strong>
              {{
                Intl.NumberFormat('nl-nl', {
                  currency: 'EUR',
                  style: 'currency',
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0
                }).format(aggregateParkingHours.cars * 3 || 0)
              }}
              motorcycles
            </strong>
          </span>
        </div>
      </div>
    </div>
    <div class="flex w-full flex-col card">
      <h2 class="text-2xl">Revenue per session</h2>
      <br />
      <div class="max-h-[400px] overflow-scroll w-full">
        <table v-if="!sessionStoreLoading" class="bg-white border border-gray-300 text-sm w-full">
          <thead
            class="sticky z-10 top-[-1px] border-t-1 border-gray-200 z-99 bg-white border-collapse py-2"
          >
            <tr>
              <th class="py-2 px-4 border-b text-left">Start Time</th>
              <th class="text-center py-2 px-4 border-b">End Time</th>
              <th class="text-right py-2 px-4 border-b">
                Duration <span class="text-xs text-gray-600">(minutes)</span>
              </th>
              <th class="text-right py-2 px-4 border-b">Liscence</th>
              <th class="text-right py-2 px-4 border-b">Vehicule</th>
              <th class="text-right py-2 px-4 border-b">Realised profit</th>
            </tr>
          </thead>
          <tbody class="body-row">
            <tr
              v-for="session in nonResidentSessionList"
              :key="session.parkingSessionId"
              class="text-right"
            >
              <td class="text-left py-2 px-4 border-b">
                {{ formatDate(session.sessionStartedAt) }}
              </td>
              <td class="text-center py-2 px-4 border-b">
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
                        ? session?.sessionLengthInHoursMinutes * 5
                        : session?.sessionLengthInHoursMinutes * 3
                    )
                  }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- aggregate -->
        <div
          class="hide flex justify-center items-center h-40"
          v-if="nonResidentSessionList.length === 0"
        >
          <p class="text-gray-400">No items to display , try changing your search criteria</p>
        </div>
      </div>
      <div class="flex justify-end items-end py-2 mt-4">
        <span class="text-md">Total Aggregate</span>
        <span class="text-md font-semibold px-2">
          {{
            Intl.NumberFormat('nl-nl', {
              style: 'currency',
              currency: 'EUR'
            }).format(totalRealisedProfitAgg) ?? 'N/A'
          }}
        </span>
      </div>
    </div>

    <div class="sm:grid sm:grid-cols-2 gap-4 mb-4 pb-4 flex w-full flex-col mt-4">
      <div class="w-full">
        <div class="card" v-if="loading === false">
          <BarChart :dataSets="dataSets" v-if="aggregateParkingHours" />
        </div>
        <div class="card animate-pulse" v-else>
          <div class="h-full animate-pulse bg-gray-100"></div>
        </div>
      </div>
      <div class="w-full">
        <div class="card" v-if="loading === false">
          <BarChart :dataSets="dataSets" v-if="aggregateParkingHours" />
        </div>
        <div class="card animate-pulse" v-else>
          <div class="h-full animate-pulse bg-gray-100"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import Overview from '@/components/Overview.vue'
import BarChart from '@/components/BarChart/BarChart.vue'
import { storeToRefs } from 'pinia'
import useRevenueStore from '@/stores/revenueStore'
import useSessionsStore from '@/stores/sessionsStore'
import { useDateFormat } from '@/composables/useDateFormat'
import type { ParkingSession } from '@/services/spacesService'
import type { VehiculeType } from '@/services/sessionService'

const store = useRevenueStore()
const { formatDate } = useDateFormat()
const { loading, aggregateParkingHours } = storeToRefs(store)
const sessionsStore = useSessionsStore()
const { loading: sessionStoreLoading, sessionsList } = storeToRefs(sessionsStore)

const nonResidentSessionList = computed(() => {
  return sessionsList.value?.parkingSessions.filter((s) => s.parkingSpaceId !== 1) || []
})

const getVehiculeHourlyRate = (vehiculeType: VehiculeType) => {
  const carHourlyParkingRate = 5
  const motorcycleHourlyParkingRate = 5
  return vehiculeType === 'CAR' ? carHourlyParkingRate : motorcycleHourlyParkingRate
}
const totalRealisedProfitAgg = computed(() => {
  return nonResidentSessionList.value.reduce(
    (agg, curr) =>
      curr.sessionLengthInHoursMinutes * getVehiculeHourlyRate(curr.vehicleType as VehiculeType) +
      agg,
    0
  )
})

const currentYear = new Date().getFullYear()
const januaryStart = new Date(currentYear, 0, 1) // January 1st of the current year
const today = new Date() // Today's date

const dataSets = ref({
  labels: ['Car', 'Motorcycle'],
  datasets: [
    {
      label: 'revenue in euros',
      backgroundColor: ['indigo', 'blue'],
      data: Object.values(aggregateParkingHours.value)
    }
  ]
})
store.fetchSessionListIfNeeded({
  offset: 0,
  isSessionEnded: true,
  sessionStartedAtFrom: januaryStart.toISOString(),
  sessionEndedAtTo: today.toISOString()
})
watch(
  () => aggregateParkingHours.value,
  () => {
    dataSets.value.datasets[0].data = Object.values(aggregateParkingHours.value)
  }
)
</script>
<style scoped>
.card {
  @apply p-6 rounded overflow-hidden shadow-sm border border-solid border-gray-300 bg-white w-full min-h-[300px] md:min-h-[400px];
}
</style>
