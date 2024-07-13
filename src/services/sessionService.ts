import { type AxiosResponse } from 'axios'
import axiosInstance from './axiosInstance'

export type VehiculeType = 'CAR' | 'MOTORCYCLE'

export interface SessionListParams {
  offset: number
  limit: number
  isSessionEnded: boolean
  sessionStartedFrom: string
  sessionStartedAtTo: string
  sessionEndedAtFrom: string
  sessionEndedAtTo: string
  vehicleLicensePlate: string
  vehicleType: VehiculeType
}

export type SessionListResponse = {
  readonly parkingSessions: ParkingSession[]
  readonly parkingSessionsTotalCount: number
}

export type ParkingSession = {
  readonly parkingSessionId: string
  readonly parkingSpaceId: number
  readonly isSessionEnded: boolean
  readonly sessionLengthInHoursMinutes: number
  readonly sessionStartedAt: Date
  readonly sessionEndedAt: Date
  readonly vehicleLicensePlate: string
  readonly vehicleType: string
}

export async function list(
  params: Partial<SessionListParams>
): Promise<AxiosResponse<{ data: SessionListResponse }>> {
  return axiosInstance.get('/v1/parking/sessions/list', {
    params
  })
}
