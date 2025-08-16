import type { IUser } from "../interfaces/user.interface";
import axios from "axios";
import SDK from "./SDK";

/**
 * AuthManager - A class to handle authentication.
 */
export default class AuthManager {
  private systemUrl: string;
  private sdk: SDK;

  constructor(systemUrl: string, sdk: SDK) {
    this.systemUrl = systemUrl;
    this.sdk = sdk;
  }

  /**
   * Logs in a user and returns a token.
   */
  async login(email: string, password: string): Promise<IUser> {
    const { data } = await axios.post<IUser>(`${this.systemUrl}/auth/login`, {
      email,
      password,
    });
    const token = data.access_token;
    this.sdk.setTokens(token);
    localStorage.setItem("token", token);
    return data;
  }

  /**
   * Gets the current authenticated user's details.
   */
  async getMe(): Promise<IUser> {
    const { data } = await axios.get<IUser>(`${this.systemUrl}/auth/me`);
    return data;
  }
}
