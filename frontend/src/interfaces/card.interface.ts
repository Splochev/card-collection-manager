export interface ICard {
  id?: number | string;
  cardNumber: string;
  cardSetName: string;
  name: string;
  rarities: string[];
  cardId: number | string;
  cards: {
    id: number | string;
    name: string;
    cardSetNames: string[];
    type: string;
    desc: string;
    race: string;
    cardId: number | string;
    imageUrl: string | null;
    typeline: string[];
    atk: number | null;
    def: number | null;
    level: number | null;
    attribute: string | null;
    linkval: number | null;
    linkmarkers: string[] | null;
    pend_desc: string | null;
    monster_desc: string | null;
    scale: number | null;
    humanReadableCardType: string;
    frameType: string;
    archetype: string;
  };
}
