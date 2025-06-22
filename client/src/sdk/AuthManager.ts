import type { IUser } from '@/interfaces/user.interface'
import axios from 'axios'
import SDK from './SDK'

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
    return response.data
  }

  /**
   * Validates a token.
   */
  async validateToken(token: string): Promise<boolean> {
    const response = await axios.post(`${this.systemUrl}/auth/validate`, { token })
    return response.data.isValid
  }
}
