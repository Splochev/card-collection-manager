import type { ICard } from "../interfaces/card.interface";
import axios from "axios";

/**
 * CardsManager - A class to handle card-related operations.
 */
export default class CardsManager {
  private systemUrl: string;

  constructor(systemUrl: string) {
    this.systemUrl = systemUrl;
  }

  /**
   * Retrieves cards by card set code.
   */
  async getCardsBySetCode(cardSetCode: string): Promise<ICard[]> {
    const { data } = await axios.get<ICard[]>(
      `${this.systemUrl}/cards/${cardSetCode}`
    );
    return data;
  }

  /**
   * Scrapes card sets by name.
   */
  async findCardSets(cardSetNames: string[], socketId?: string): Promise<void> {
    const password = import.meta.env.VITE_REACT_APP_PASSWORD;
    if (!password) {
      throw new Error("VITE_REACT_APP_PASSWORD is not defined");
    }

    const headers: Record<string, string> = { password };
    if (socketId) headers["x-socket-id"] = socketId;

    await axios.post<void>(`${this.systemUrl}/scrape`, cardSetNames, {
      headers,
    });
  }
}
