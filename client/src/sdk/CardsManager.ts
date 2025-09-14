import type { ICard, ICardQuery } from '@/interfaces/card.interface'
import axios from 'axios'

/**
 * CardsManager - A class to handle card-related operations.
 */
export default class CardsManager {
  constructor(private systemUrl: string) {}

  /**
   * Retrieves cards by their queries.
   */
  async getCardsByQueries(cardQueries: ICardQuery[]): Promise<Array<ICard | null>> {
    const response = await axios.post(`${this.systemUrl}/cards/multiple`, cardQueries)
    return response.data
  }

  /**
   * Retrieves a card by its query.
   */
  async getCardByQuery(cardQuery: ICardQuery): Promise<ICard | null> {
    const response = await axios.post(`${this.systemUrl}/cards/single`, cardQuery)
    return response.data
  }

  /**
   * Retrieves cards by card set name.
   */
  async getCardsBySet(cardSetName: string): Promise<ICard[]> {
    const response = await axios.get(`${this.systemUrl}/cards/set/${cardSetName}`)
    return response.data
  }

  /**
   * Adds a card to the user's collection with the specified quantity.
   */
  async addCardToCollection(cardId: number, quantity: number): Promise<ICard[]> {
    const response = await axios.post(`${this.systemUrl}/cards`, { cardId, quantity })
    return response.data
  }
}
