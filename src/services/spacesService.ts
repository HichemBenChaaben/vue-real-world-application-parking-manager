import { type AxiosResponse } from 'axios'
import axiosInstance from './axiosInstance'

export type ParkingSessionGetResponse = {
  readonly parkingSpaces: ParkingSpace[]
}

export type ParkingSpace = {
  readonly parkingSpaceId: number
  readonly isOccupied: boolean
  readonly occupancy: number
  readonly capacity: number
  readonly vehicleType: VehiculeType
}

export type ParkingSession = {
  readonly parkingSessionID: string
  readonly parkingSpaceID: number
  readonly isSessionEnded: boolean
  readonly sessionLengthInHoursMinutes: number
  readonly sessionStartedAt: Date
  readonly sessionEndedAt: Date
  readonly vehicleLicensePlate: string
  readonly vehicleType: VehiculeType
}

type VehiculeType = 'CAR' | 'MOTOR'

export interface ParkingSessionRequestParams {
  offset: number
  limit: number
}
export async function getSpacesList(params: ParkingSessionRequestParams): Promise<AxiosResponse> {
  return await axiosInstance.get<ParkingSessionGetResponse[]>('/v1/parking/spaces/list/', {
    params
  })
}
