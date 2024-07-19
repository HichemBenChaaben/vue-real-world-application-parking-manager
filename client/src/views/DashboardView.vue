<template>
  <div>
    <div class="px-0 m-0 flex justify-between w-full items-center">
      <Overview>
        <template #title> Highlights </template>
        <template #line> Overview of the building </template>
      </Overview>

      <div class="flex items-end">
        <router-link to="/dashboard/create">
          <Button
            class="bg-indigo-600 hover:bg-indigo-800 border border-solid border-1 border-indigo-300 hover:border-indigo-600 text-white"
          >
            <i class="fa fa-hourglass-start"></i>
            <span class="pl-2">new session</span>
          </Button>
        </router-link>
      </div>
    </div>
    <div class="overview-card">
      <SessionsTable />
    </div>

    <div class="overview-cards">
      <div class="overview-card">
        <div v-if="!loading">
          <div class="flex justify-between">
            <h2 class="capitalise"><i class="fas fa-car"></i>{{ cars?.vehicleType }}</h2>
            <div>
              <Indicator v-if="!cars?.isOccupied" variant="success"> Available </Indicator>
            </div>
          </div>
          <div class="flex flex-between items-top justify-center">
            <div class="w-1/2 min-h-[220px] pt-2 text-md color-gray-400 capitalize">
              <p>
                occupancy: <span class="font-semibold">{{ cars?.occupancy }}</span>
              </p>
              <p>
                capacity <span class="font-semibold">{{ cars?.capacity }}</span>
              </p>
              <p>
                free <span class="font-semibold">{{ cars?.capacity - cars?.occupancy }}</span>
              </p>
            </div>

            <div class="w-1/2 h-[220px] flex justify-end items-end">
              <DaughnutChart :data="config" />
            </div>
          </div>
        </div>
        <div v-else class="h-full animate-pulse bg-gray-100"></div>
      </div>
      <div class="overview-card">
        <div v-if="!loading">
          <div class="flex justify-between">
            <h2 class="capitalise">
              <i class="fas fa-motorcycle"></i>{{ motorcycles?.vehicleType }}
            </h2>
            <div>
              <Indicator v-if="!motorcycles?.isOccupied" variant="success"> Available </Indicator>
            </div>
          </div>
          <div class="flex flex-between items-top justify-center">
            <div class="w-1/2 pt-2 text-md color-gray-400 capitalize">
              <p>
                occupancy: <span class="font-semibold">{{ motorcycles?.occupancy }}</span>
              </p>
              <p>
                capacity <span class="font-semibold">{{ motorcycles?.capacity }}</span>
              </p>
              <p>
                free
                <span class="font-semibold">{{
                  motorcycles?.capacity - motorcycles?.occupancy
                }}</span>
              </p>
            </div>

            <div class="w-1/2 h-[220px] flex justify-end items-end">
              <DaughnutChart :data="configMotorcycles" />
            </div>
          </div>
        </div>
        <div v-else class="h-full animate-pulse bg-gray-100"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import Overview from '@/components/Overview.vue'
import useSpacesStore from '@/stores/spacesStore'
import DaughnutChart, { type Data } from '@/components/DaughnutChart.vue'
import SessionsTable from '@/components/SessionsTable/SessionsTable.vue'
import Indicator from '@/components/Indicator.vue'
import useLoginStore from '@/stores/authStore'
import Button from '@/components/Button.vue'

const store = useSpacesStore()
const { motorcycles, cars, loading } = storeToRefs(store)

const limit = 100
const offset = 1

store.getSpaces({ limit, offset })

const configMotorcycles = computed((): Data => {
  const free = motorcycles?.value?.capacity - motorcycles?.value?.occupancy
  const occupancy = motorcycles?.value?.occupancy
  return {
    labels: ['free', 'occupied'],
    datasets: [
      {
        backgroundColor: ['#ededed', '#4f46e5'],
        data: [free, occupancy]
      }
    ]
  }
})

const config = computed((): Data => {
  const free = cars?.value?.capacity - cars?.value?.occupancy
  const occupancy = cars?.value?.occupancy
  return {
    labels: ['free', 'occupied'],
    datasets: [
      {
        backgroundColor: ['#ededed', '#4f46e5'],
        data: [free, occupancy]
      }
    ]
  }
})
</script>
<style scoped>
.overview-cards {
  @apply my-2 flex flex-col md:grid md:grid-cols-2 gap-4 w-full;
}
.overview-card {
  @apply p-5 rounded overflow-hidden shadow-sm border border-solid border-gray-300 bg-white w-full min-h-[260px];
  h2 {
    @apply font-semibold text-xl inline-flex justify-center items-center;
    i {
      @apply mr-2 text-2xl text-blue-500;
    }
  }
}
</style>
