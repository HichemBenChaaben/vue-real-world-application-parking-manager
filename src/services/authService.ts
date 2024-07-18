import { type AxiosResponse } from 'axios'
import axiosInstance from './axiosInstance'

export type Auth = {
  readonly accessToken?: string
  readonly expiresIn?: number
}

export type AuthMeResponse = {
  readonly user?: User
  readonly auth?: Auth
}

export type User = {
  readonly id?: string
  readonly email?: string
}

interface LoginResponse {
  token: string
  user: {
    id: number
    username: string
    email: string
  }
}

interface LoginCredentials {
  email: string
  password: string
}

export function login(
  credentials: LoginCredentials
): Promise<AxiosResponse<{ data: LoginResponse }>> {
  return axiosInstance.post('/auth/login', credentials)
}

export function logout(): Promise<AxiosResponse<void>> {
  return axiosInstance.post('/auth/logout')
}

export function me(): Promise<AxiosResponse<{ data: AuthMeResponse }>> {
  return axiosInstance.get('/v1/auth/me')
}
