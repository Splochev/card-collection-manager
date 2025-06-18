interface CardApiResponse {
  name: string;
  cardType: string;
  effect: string;
  artwork: string;
  cardSetCode: string;
  [key: string]: unknown;
}
