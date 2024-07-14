<template>
  <Overview>
    <template #title>parking session </template>
    <template #line>create a new parking session </template>
  </Overview>
  <div class="card">
    <div class="gap-4 mb-4 pb-4 flex w-full flex-row justify-start">
      <div>
        <h2 class="text-xl font-semibold">Parking Information</h2>
        <div class="bg-gray-100 p-4 rounded-2">
          <div class="max-w-4xl mx-auto p-6">
            <div class="bg-white rounded-lg p-6 mb-6">
              <h2 class="text-2xl font-semibold mb-3">Floor 1</h2>
              <p class="text-gray-700 mb-2">Parking spaces 1 – 75</p>
              <ul class="list-disc list-inside text-gray-600">
                <li>Space 1 – 50: Spaces used for residents of the building (no charge)</li>
                <li>Space 51 – 130: Cars <strong>€ 5,00</strong> per hour</li>
                <li>Space 131 – 150: Motorcycles <strong>€ 3,00</strong> per hour</li>
              </ul>
            </div>

            <div class="bg-white rounded-lg p-6">
              <h2 class="text-2xl font-semibold mb-3">Floor 2</h2>
              <p class="text-gray-700 mb-2">Parking spaces 76 – 150</p>
              <ul class="list-disc list-inside text-gray-600">
                <li>Space 1 – 50: Spaces used for residents of the building (no charge)</li>
                <li>Space 51 – 130: Cars <strong>€ 5,00</strong> per hour</li>
                <li>Space 131 – 150: Motorcycles <strong>€ 3,00</strong> per hour</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="min-w-[600px] border-l-2 border-solid border-gray-100 px-6">
        <form @submit.prevent="handleSubmit" novalidate>
          <div class="py-2 pt-0">
            <label class="capitalize font-semibold text-lg"> vehicule type </label>
            <select
              v-model="vehicleType"
              class="capitalize bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="car">car</option>
              <option value="motorcycle">motorcycle</option>
            </select>
          </div>
          <div class="py-2 flex items-center">
            <label class="inline-flex items-center cursor-pointer capitalize">
              <input v-model="isResident" type="checkbox" class="sr-only peer" />
              <div
                class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
              ></div>
              <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                resident
              </span>
            </label>
            <span class="text-xs text-gray-600 ml-4 mx-2 py-2 flex items-end">
              <Indicator variant="primary" v-if="isResident"> Free of charge </Indicator>
              <Indicator variant="success" v-else>{{ hourlyCharge }}</Indicator>
            </span>
          </div>
          <div class="py-2">
            <label class="capitalize font-semibold text-lg">Liscence plate</label>
            <input
              v-model="licensePlate"
              type="text"
              id="first_name"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Liscence plate"
              required
            />
          </div>
          <div v-if="errorMessage" class="text-red-500">{{ errorMessage }}</div>
          <div class="py-2 flex justify-end"><Button type="submit">create</Button></div>
        </form>
        <div
          class="bg-blue-50 border border-1 border-solid border-blue-100 rounded-4 rounded-md p-4 mt-8"
        >
          <h2 class="text-lg font-semibold text-blue-500 capitalize">capacity</h2>
          <div v-for="space in spaces" :key="space.parkingSpaceId" class="my-2 py-1">
            <div class="flex justify-between">
              <h4 class="flex items-center">
                <i
                  :class="`text-lg fas fa-${space.vehicleType === 'CAR' ? 'car' : 'motorcycle'}`"
                ></i>
                <span class="mx-2 font-semibold"> Parking {{ space.parkingSpaceId }} </span>
              </h4>
              <Indicator variant="primary">Available</Indicator>
            </div>
            <span class="font-semibold my-2">
              {{ Math.abs(space.occupancy) }} / {{ space.capacity }}</span
            >
            <span class="text-xs text-blue-400 ml-2">
              occupancy of {{ Math.abs(space.occupancy) }} out of {{ space.capacity }} total spaces
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import useSpacesStore from '@/stores/spacesStore'
import Overview from '@/components/Overview.vue'
import Button from '@/components/Button.vue'
import { parkingSessionSchema, type ParkingSession } from '@/schemas/parkingSessionSchema'
import Indicator from '@/components/Indicator.vue'

const spacesStore = useSpacesStore()
const { spaces } = storeToRefs(spacesStore)

const isResident = ref<boolean>(false)
const licensePlate = ref<string>('')
const vehicleType = ref<'all' | 'car' | 'motorcycle'>('car')
const errorMessage = ref<string | null>(null)

const hourlyCharge = computed(() => {
  return isResident.value
    ? 'Free of charge'
    : vehicleType.value === 'car'
      ? '5 euro / hour'
      : '3 euro / hour'
})

const handleSubmit = () => {
  const formData: ParkingSession = {
    vehicleType: vehicleType.value,
    isResident: isResident.value,
    licensePlate: licensePlate.value
  }

  const result = parkingSessionSchema.safeParse(formData)

  if (!result.success) {
    errorMessage.value = result.error.errors.map((e: Error) => e.message).join(', ')
  } else {
    errorMessage.value = null
    console.log('submit new data....', formData)
  }
}
</script>

<style scoped>
.card {
  @apply p-6 rounded overflow-hidden shadow-sm border border-solid border-gray-300 bg-white w-full;
}
</style>
