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
}
