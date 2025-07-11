import axios from 'axios'
import UserManager from '@/sdk/UserManager'
import AuthManager from '@/sdk/AuthManager'
import CardsManager from '@/sdk/CardsManager'

/**
 * SDK - Main class to manage authentication, users, and cards.
 *
 * This class can be used both as a regular class and as a singleton.
 *
 * When used as a singleton, it ensures that only one instance of the class is created and shared throughout the application.
 * When used as a normal class, a new instance can be created with custom configurations.
 *
 * @example
 *
 * 1. Normal Instantiation (Creates a new instance):
 *  const systemUrl = 'https://example.com';
 *  const sdk = new SDK(systemUrl);  // Creates a new instance
 *  sdk.authManager.login('email', 'password');
 *
 * 2. Singleton Instantiation (Always gets the same instance):
 *  const systemUrl = 'https://example.com';
 *  const sdkSingleton = SDK.getInstance(systemUrl);  // Returns the Singleton instance
 *  sdkSingleton.setTokens('your-auth-token');
 *
 * @param {string} systemUrl - The base URL for the system backend.
 */
export default class SDK {
  private static instance: SDK | null = null

  public userManager: UserManager
  public authManager: AuthManager
  public cardsManager: CardsManager

  private token: string | null = null

  constructor(public systemUrl: string) {
    this.initToken()
    this.userManager = new UserManager(systemUrl)
    this.authManager = new AuthManager(systemUrl, this)
    this.cardsManager = new CardsManager(systemUrl)
  }

  /**
   * Static method to get the singleton instance of SDK.
   */
  public static getInstance(systemUrl: string): SDK {
    if (!SDK.instance) {
      SDK.instance = new SDK(systemUrl)
    }
    SDK.instance.initToken()
    return SDK.instance
  }

  /**
   * Sets the authentication token for all managers.
   */
  public setTokens(token: string): void {
    this.token = token
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  /**
   * Retrieves the current authentication token.
   */
  public getToken(): string | null {
    return this.token
  }

  private initToken(): void {
    const token = localStorage.getItem('token')
    if (token) {
      this.setTokens(token)
    } else {
      this.setTokens('')
    }
  }
}
