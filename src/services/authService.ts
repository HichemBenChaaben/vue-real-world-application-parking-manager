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
  username: string
  password: string
}
// TODO use the real creadentials here...
export async function login(credentials: LoginCredentials): Promise<AxiosResponse<LoginResponse>> {
  const cre = {
    email: 'super@parkdemeer.nl',
    password: 'SUPER_USER_SECRET_PASS'
  }
  try {
    const res = await axiosInstance.post('/api/auth/password', cre)
    return res.data
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

export async function me(): Promise<AxiosResponse<{ data: AuthMeResponse }>> {
  return await axiosInstance.get('/v1/auth/me')
}
