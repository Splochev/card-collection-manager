import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { store } from "../../stores/store";
import type { ICard } from "../../interfaces/card.interface";
import Grid from "@mui/material/Grid";
import CardImageAndQuantity from "../organisms/cards/CardImageAndQuantity";
import { setSelectedCardId } from "../../stores/cardSlice";
import CardFullInfo from "../organisms/cards/CardFullInfo";
import CardListFromSet from "../organisms/cards/CardListFromSet";
import EmptyState from "../organisms/shared/EmptyState";

const Cards = () => {
  const { cardId } = useParams();
  const [searchedCard, setSearchedCard] = useState<ICard | null>(null);
  const [cardsList, setCardsList] = useState<ICard[]>([]);
  const [quantity, setQuantity] = useState<number | "">(1);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const cards = store.getState().cards.cards;
      let selected = null;
      if (cardId) {
        selected = cards.find((card) => card.cardNumber === cardId) || null;
      } else {
        selected = cards[0] || null;
      }
      setSearchedCard(selected);
      setCardsList(cards.filter((card) => card.cardNumber !== selected?.cardNumber));
      const selectedId = typeof selected?.id === 'string' ? selected.id : (typeof selected?.id === 'number' ? String(selected.id) : null);
      const currentSelectedId = store.getState().cards.selectedCardId;
      if (currentSelectedId !== selectedId) {
        store.dispatch(setSelectedCardId(selectedId));
      }
    });
    return () => unsubscribe();
  }, [cardId]);



  if (!store.getState().cards.cards.length) {
    return (
      <EmptyState
        title="Search for Yu-Gi-Oh! Cards"
        description="Use the search bar above to find cards and add them to your collection. Explore thousands of cards from different sets and rarities."
        callback={() => {
          const searchBar = document.getElementById("Find cards by set code");
          searchBar?.focus();
        }}
      />
    );
  }

  return (
    <Grid sx={{ display: "flex", flexDirection: "row", justifyContent: "space-around", width: "100%", gap: 4}}>
      <CardImageAndQuantity card={searchedCard} quantity={quantity} setQuantity={setQuantity} />
      <CardFullInfo card={searchedCard} />
      <CardListFromSet cardsList={cardsList} excludedCards={[searchedCard]} />
    </Grid>
  );
};

export default Cards;
