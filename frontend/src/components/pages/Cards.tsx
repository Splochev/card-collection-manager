import { useEffect, useState } from "react";
import { store } from "../../stores/store";
import EmptyState from "../organisms/EmptyState";
import type { ICard } from "../../interfaces/card.interface";
import Grid from "@mui/material/Grid";
import CardWrapper from "../atoms/CardWrapper";

const Cards = () => {
  const [searchedCard, setSearchedCard] = useState<ICard | null>(null);
  const [cards, setCards] = useState<ICard[]>([]);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const cards = store.getState().cards.cards;
      setSearchedCard(cards[0]);
      setCards(cards.filter((card) => card.id !== cards[0]?.id));
    });
    return () => {
      unsubscribe();
    };
  }, []);

  if (!cards || !cards.length) {
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
    <Grid>
      <CardWrapper
        url={searchedCard?.cards?.imageUrl || undefined}
        name={searchedCard?.name || undefined}
      />
    </Grid>
  );
};

export default Cards;
