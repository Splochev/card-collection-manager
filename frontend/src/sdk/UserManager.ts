import axios from 'axios'


interface IUpdateUser {
 
}

interface IGetUser {
  
}

/**
 * UserManager - A class to handle user management.
 */
export default class UserManager {
  private systemUrl: string;

  constructor(systemUrl: string) {
    this.systemUrl = systemUrl;
  }
  /**
   * Updates user details.
   */
  async updateUser(userId: number, userDetails: IUpdateUser): Promise<IGetUser> {
    const {data} = await axios.put<IGetUser>(`${this.systemUrl}/users/${userId}`, userDetails)
    return data
  }
}
