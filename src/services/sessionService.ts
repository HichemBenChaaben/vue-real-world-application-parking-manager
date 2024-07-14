import { type AxiosResponse } from 'axios'
import axiosInstance from './axiosInstance'

export type VehiculeType = 'CAR' | 'MOTORCYCLE'

export interface SessionListParams {
  offset: number
  limit: number
  isSessionEnded: boolean
  sessionStartedAtFrom: string
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

interface EndedSession {
  ParkingSpaceId: number
  sessionLengthInHoursMinutes: number
}

export interface EndParkingSession {
  endedSession: EndedSession
}

export async function list(
  params: Partial<SessionListParams>
): Promise<AxiosResponse<{ data: SessionListResponse }>> {
  return axiosInstance.get('/v1/parking/sessions/list', {
    params
  })
}

export async function endSession(
  parkingSessionId: string
): Promise<AxiosResponse<{ data: EndParkingSession }>> {
  return axiosInstance.post(`/v1/parking/session/end`, {
    parkingSession: {
      id: parkingSessionId
    }
  })
}

export interface ParkingSessionCreateParams {
  vehicleType: VehiculeType
  isResident: boolean
  vehicleLicensePlate: string
}
export interface StartedSession {
  readonly parkingSessionId: string
  readonly parkingSpaceId: number
  readonly sessionStartedAt: Date
  readonly vehicleLicensePlate: string
}
export interface StartSessionResponse {
  startedSession: readonly StartedSession[]
}
export async function startSession(
  params: ParkingSessionCreateParams
): Promise<AxiosResponse<{ data: StartSessionResponse }>> {
  console.log('params', params)
  console.log('creating a post request....', { parkingSession: params })
  return axiosInstance.post(`/v1/parking/session/start`, {
    parkingSession: params
  })
}
