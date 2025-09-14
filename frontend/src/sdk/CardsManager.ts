import type { ICard } from "../interfaces/card.interface";
import axios from "axios";
import type SDK from "./SDK";

/**
 * CardsManager - A class to handle card-related operations.
 */
export default class CardsManager {
  private systemUrl: string;
  private sdk: SDK;

  constructor(systemUrl: string, sdk: SDK) {
    this.systemUrl = systemUrl;
    this.sdk = sdk;
  }

  /**
   * Retrieves cards by card set code.
   */
  async getCardsBySetCode(cardSetCode: string): Promise<ICard[]> {
    const token = this.sdk.getToken();

    const { data } = await axios.get<ICard[]>(
      `${this.systemUrl}/cards/${cardSetCode}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  }

  /**
   * Searches card sets by name.
   */
  async findCardSets(
    body: { cardSetNames: string[]; cardSetCode: string },
    socketId?: string
  ): Promise<void> {
    const headers: Record<string, string> = {};
    const token = this.sdk.getToken();
    if (socketId) headers["x-socket-id"] = socketId;

    await axios.post<void>(`${this.systemUrl}/scrape`, body, {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });
  }

  
  /**
   * Adds a card to the user's collection with the specified quantity.
   */
  async addCardToCollection(cardId: number, quantity: number): Promise<void> {
    await axios.post(`${this.systemUrl}/cards`, { cardId, quantity })
  }
}
