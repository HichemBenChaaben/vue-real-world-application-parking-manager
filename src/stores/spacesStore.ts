import api from '@/services/api'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  type ParkingSessionRequestParams,
  type ParkingSessionGetResponse,
  type ParkingSpace
} from '@/services/spacesService'
import axios, { type AxiosError, type AxiosResponse } from 'axios'
import type { TypeOrNull } from 'types'

const useSpacesStore = defineStore('spaces', () => {
  const loading = ref(false)
  const spaces = ref<ParkingSpace[]>([])
  const error = ref<TypeOrNull<string>>()

  const motorcycles = computed(() => {
    return spaces.value?.filter((space) => space?.vehicleType === 'MOTOR')[0]
  })

  const cars = computed(() => {
    return spaces.value?.filter((space) => space?.vehicleType === 'CAR')[0]
  })

  const vehicules = computed(() => {
    return [cars.value, motorcycles.value]
  })

  const getSpaces = async (params: ParkingSessionRequestParams): Promise<void> => {
    try {
      loading.value = true
      const res: AxiosResponse<{ data: ParkingSessionGetResponse }> =
        await api.spacesService.getSpacesList(params)
      spaces.value = res.data.data.parkingSpaces
    } catch (err: unknown | Error | AxiosError) {
      if (axios.isAxiosError(err)) {
        error.value = err.response?.data.message
      }
    } finally {
      loading.value = false
    }
  }

  return {
    getSpaces,
    loading,
    error,
    motorcycles,
    cars,
    spaces,
    vehicules
  }
})

export default useSpacesStore
