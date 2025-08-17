import CardSearchIcon from "./components/icons/CardSearchIcon";
import CollectionIcon from "./components/icons/CollectionIcon";

const ROUTES_MAP = {
  CARDS: "/cards",
  COLLECTION: "/collection",
};

const PAGES = [
  { label: "Cards", index: 0, route: ROUTES_MAP.CARDS, icon: CardSearchIcon },
  {
    label: "Collection",
    index: 1,
    route: ROUTES_MAP.COLLECTION,
    icon: CollectionIcon,
  },
];

const CARD_SET_CODE_REGEX = /^[A-Z0-9]{3,6}-[A-Z0-9]{3,6}$/i;

export { ROUTES_MAP, PAGES, CARD_SET_CODE_REGEX };
