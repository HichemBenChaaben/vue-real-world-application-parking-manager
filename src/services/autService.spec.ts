import { test, expect, vi } from 'vitest'
import { login, logout } from './authService'
import axiosInstance from './axiosInstance'
import { fail } from 'assert'

vi.mock('./axiosInstance')

test('login fetches token and user data', async () => {
  const mockResponse = {
    token: 'mock_token',
    user: {
      id: 1,
      username: 'test_user',
      email: 'test@example.com'
    }
  }

  vi.mocked(axiosInstance.post).mockResolvedValueOnce({ data: mockResponse })

  const credentials = {
    email: 'test@example.com',
    password: 'test_password'
  }

  const response = await login(credentials)
  expect(response.data).toEqual(mockResponse)
})

test('login handles errors', async () => {
  const error = new Error('Login failed')
  vi.mocked(axiosInstance.post).mockRejectedValue(error)

  const credentials = {
    email: 'invalid@example.com',
    password: 'wrong_password'
  }

  try {
    await login(credentials)
    fail('Expected login to throw error')
  } catch (err) {
    expect(err).toEqual(error)
  }
})

test('logout handles errors', async () => {
  const error = new Error('Logout failed')
  vi.mocked(axiosInstance.post).mockRejectedValue(error)

  try {
    await logout()
    fail('Expected logout to throw error')
  } catch (err) {
    expect(err).toEqual(error)
  }
})
