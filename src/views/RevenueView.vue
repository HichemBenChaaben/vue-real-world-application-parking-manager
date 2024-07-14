<template>
  <Overview>
    <template #title> revenue </template>
    <template #line> Overview of the revenue </template>
  </Overview>
  <div class="flex justify-end">
    <span class="text-xs py-2 px-2"> Revenue from 1st of January by vehicule type </span>
  </div>
  <div class="card" v-if="loading === false">
    <BarChart :dataSets="dataSets" v-if="aggregateParkingHours" />
  </div>
  <div class="card animate-pulse" v-else>
    <div class="h-full animate-pulse bg-gray-100"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import Overview from '@/components/Overview.vue'
import BarChart from '@/components/BarChart/BarChart.vue'
import { storeToRefs } from 'pinia'
import useRevenueStore from '@/stores/revenueStore'

const store = useRevenueStore()
const { loading, aggregateParkingHours } = storeToRefs(store)

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
  @apply p-6 rounded overflow-hidden shadow-sm border border-solid border-gray-300 bg-white w-full h-screen;
}
</style>
