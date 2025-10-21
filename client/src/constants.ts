const ROUTES_MAP = {
  CARDS: "/cards",
  COLLECTION: "/collection",
};

const PAGES = [
  {
    label: "Cards",
    index: 0,
    route: ROUTES_MAP.CARDS,
    searchLabel: "Find cards by set number",
  },
  {
    label: "Collection",
    index: 1,
    route: ROUTES_MAP.COLLECTION,
    searchLabel:
      "Find cards in collection by card name, set number or set name",
  },
  {
    label: "Wishlist",
    index: 2,
    route: "/wishlist",
    searchLabel: "Find cards in wishlist by card name, set number or set name",
  },
];

export { ROUTES_MAP, PAGES };