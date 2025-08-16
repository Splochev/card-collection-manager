import type { ICreateUser, IGetUser, IUpdateUser } from '../interfaces/user.interface'
import axios from 'axios'

/**
 * UserManager - A class to handle user management.
 */
export default class UserManager {
  private systemUrl: string;

  constructor(systemUrl: string) {
    this.systemUrl = systemUrl;
  }

  /**
   * Retrieves all users.
   */
  async getAllUsers(): Promise<IGetUser[]> {
    const {data} = await axios.get<IGetUser[]>(`${this.systemUrl}/users`)
    return data
  }

  /**
   * Retrieves user details by ID.
   */
  async getUserById(userId: number): Promise<IGetUser | null> {
    const {data} = await axios.get<IGetUser | null>(`${this.systemUrl}/users/${userId}`)
    return data
  }

  /**
   * Creates a new user.
   */
  async createUser(userDetails: ICreateUser): Promise<IGetUser> {
    const {data} = await axios.post<IGetUser>(`${this.systemUrl}/users`, userDetails)
    return data
  }

  /**
   * Updates user details.
   */
  async updateUser(userId: number, userDetails: IUpdateUser): Promise<IGetUser> {
    const {data} = await axios.put<IGetUser>(`${this.systemUrl}/users/${userId}`, userDetails)
    return data
  }

  /**
   * Deletes a user.
   */
  async deleteUser(userId: number): Promise<void> {
    await axios.delete(`${this.systemUrl}/users/${userId}`)
  }
}
