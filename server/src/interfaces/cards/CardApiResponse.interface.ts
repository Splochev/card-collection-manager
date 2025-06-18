export interface CardApiResponse {
  data: ICard[];
  [key: string]: unknown;
}

export interface ICard {
  id: number;
  [key: string]: unknown;
}
