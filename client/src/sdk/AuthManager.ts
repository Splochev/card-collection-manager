import type { IUser } from '@/interfaces/user.interface'
import axios from 'axios'
import SDK from '@/sdk/SDK'

/**
 * AuthManager - A class to handle authentication.
 */
export default class AuthManager {
  constructor(
    private systemUrl: string,
    private sdk: SDK,
  ) {}

  /**
   * Logs in a user and returns a token.
   */
  async login(email: string, password: string): Promise<IUser> {
    const response = await axios.post(`${this.systemUrl}/auth/login`, { email, password })
    const token = response.data.access_token
    this.sdk.setTokens(token)
    localStorage.setItem('token', token)
    return response.data
  }

  /**
   * Gets the current authenticated user's details.
   */
  async getMe(): Promise<IUser> {
    const response = await axios.get(`${this.systemUrl}/auth/me`)
    return response.data
  }
}
