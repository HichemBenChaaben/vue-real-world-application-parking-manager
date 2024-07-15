<template>
  <Overview>
    <template #title>parking session </template>
    <template #line>create a new parking session </template>
  </Overview>
  <div class="card">
    <div class="gap-4 mb-2 pb-2 flex w-full flex-row justify-start">
      <div class="hidden lg:block min-w-[40%]">
        <ParkingInformation />
      </div>
      <div class="w-full lg:min-w-[600px] lg:border-l-2 lg:border-solid lg:border-gray-100 lg:px-6">
        <form @submit.prevent="handleSubmit" novalidate>
          <ConfettiExplosion
            v-if="showConfetti"
            :particleCount="200"
            :force="0.2"
            :particleSize="4"
            :duration="4000"
            :stageHeight="600"
            :shouldDestroyAfterDone="true"
          />
          <div class="py-2 pt-0">
            <label class="capitalize font-semibold text-lg"> vehicle type </label>
            <select
              v-model="vehicleType"
              class="capitalize bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="CAR">car</option>
              <option value="MOTORCYCLE">motorcycle</option>
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
              v-model="vehicleLicensePlate"
              type="text"
              id="first_name"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Liscence plate"
              required
            />
          </div>
          <div v-if="errorMessage" class="text-red-500">{{ errorMessage }}</div>
          <div v-if="error">{{ error }}</div>
          <div
            v-if="error && !loading"
            class="bg-red-100 p-4 border border-solid border-red-300 text-xs rounded-md py-4 my-4 text-red-400"
          >
            We couldn't create your session, please try again
          </div>
          <div
            v-if="showConfetti && !loading"
            class="capitalize text-green-800 bg-green-100 border border-green-400 text-xs rounded-md p-4"
          >
            session created successfully
          </div>
          <div class="py-2 flex justify-end">
            <Button type="submit" :busy="loading" busyText="creating a session...">create</Button>
          </div>
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
import ConfettiExplosion from 'vue-confetti-explosion'
import useSessionsStore from '@/stores/sessionsStore'
import useSpacesStore from '@/stores/spacesStore'
import Overview from '@/components/Overview.vue'
import Button from '@/components/Button.vue'
import ParkingInformation from '@/components/ParkingInformation/ParkingInformation.vue'
import { parkingSessionSchema } from '@/schemas/parkingSessionSchema'
import Indicator from '@/components/Indicator.vue'
import { useCurrencyFormatter } from '@/composables/useFormatCurrency'
import { config } from '@/config'
import { type ParkingSessionCreateParams, type VehiculeType } from '@/services/sessionService'

const spacesStore = useSpacesStore()
const { spaces } = storeToRefs(spacesStore)
const sessionsStore = useSessionsStore()
const { loading, error } = storeToRefs(sessionsStore)

const isResident = ref<boolean>(false)
const vehicleLicensePlate = ref<string>('')
const vehicleType = ref<VehiculeType>('CAR')
const errorMessage = ref<string | null>(null)
const showConfetti = ref<boolean>(false)

const { formatCurrency } = useCurrencyFormatter()

const hourlyCharge = computed(() => {
  return isResident.value
    ? 'Free of charge'
    : vehicleType.value.toLocaleLowerCase() === 'car'
      ? `${formatCurrency(config.pricesPerHourMinutes.car)} / hour`
      : `${formatCurrency(config.pricesPerHourMinutes.motorcycle)} / hour`
})

const handleSubmit = () => {
  showConfetti.value = false
  const formData: ParkingSessionCreateParams = {
    vehicleType: vehicleType.value,
    isResident: isResident.value,
    vehicleLicensePlate: vehicleLicensePlate.value
  }

  const result = parkingSessionSchema.safeParse(formData)

  if (!result.success) {
    errorMessage.value = result.error.errors.map((e: { message: string }) => e.message).join(', ')
  } else {
    errorMessage.value = null
    sessionsStore.startParkingSession(formData)
    resetForm()
    showConfetti.value = true
  }
}

const resetForm = () => {
  isResident.value = false
  vehicleLicensePlate.value = ''
  vehicleType.value = 'CAR'
}
</script>

<style scoped>
.card {
  @apply p-6 rounded overflow-hidden shadow-sm border border-solid border-gray-300 bg-white w-full;
}
</style>
