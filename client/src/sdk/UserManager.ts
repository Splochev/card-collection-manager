import type { ICreateUser, IGetUser, IUpdateUser } from '@/interfaces/user.interface'
import axios from 'axios'

/**
 * UserManager - A class to handle user management.
 */
export default class UserManager {
  constructor(private systemUrl: string) {}

  /**
   * Retrieves all users.
   */
  async getAllUsers(): Promise<IGetUser[]> {
    const response = await axios.get(`${this.systemUrl}/users`)
    return response.data
  }

  /**
   * Retrieves user details by ID.
   */
  async getUserById(userId: number): Promise<IGetUser | null> {
    const response = await axios.get(`${this.systemUrl}/users/${userId}`)
    return response.data
  }

  /**
   * Creates a new user.
   */
  async createUser(userDetails: ICreateUser): Promise<IGetUser> {
    const response = await axios.post(`${this.systemUrl}/users`, userDetails)
    return response.data
  }

  /**
   * Updates user details.
   */
  async updateUser(userId: number, userDetails: IUpdateUser): Promise<IGetUser> {
    const response = await axios.put(`${this.systemUrl}/users/${userId}`, userDetails)
    return response.data
  }

  /**
   * Deletes a user.
   */
  async deleteUser(userId: number): Promise<void> {
    await axios.delete(`${this.systemUrl}/users/${userId}`)
  }
}
