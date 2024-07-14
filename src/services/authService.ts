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

export async function login(credentials: LoginCredentials): Promise<AxiosResponse<LoginResponse>> {
  return await axiosInstance.post('/auth/login', credentials)
}

export async function logout(): Promise<AxiosResponse<void>> {
  return await axiosInstance.post('/auth/logout')
}

export async function me(): Promise<AxiosResponse<{ data: AuthMeResponse }>> {
  return await axiosInstance.get('/v1/auth/me')
}
