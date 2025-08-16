export interface ICard {
  id?: number | string
  cardSet: string
  cardId: string
  imageUrl: string | null
  [key: string]: unknown
}