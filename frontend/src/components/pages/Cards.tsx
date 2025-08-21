import { useEffect, useState } from "react";
import { store } from "../../stores/store";
import EmptyState from "../organisms/EmptyState";
import type { ICard } from "../../interfaces/card.interface";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Chips from "../atoms/Chips";
import CardImageAndQuantity from "../organisms/CardImageAndQuantity";
import CardSetInfo from "../organisms/CardSetInfo";
import CardStats from "../organisms/CardStats";


const Cards = () => {
  const [searchedCard, setSearchedCard] = useState<ICard | null>(null);
  const [cards, setCards] = useState<ICard[]>([]);
  const [quantity, setQuantity] = useState<number | "">(1);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const cards = store.getState().cards.cards;
      setSearchedCard(cards[0]);
      setCards(cards.filter((card) => card.id !== cards[0]?.id));
    });
    return () => unsubscribe();
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
    <Grid sx={{ display: "flex", flexDirection: "row", justifyContent: "space-around", width: "100%" }}>
      <CardImageAndQuantity card={searchedCard} quantity={quantity} setQuantity={setQuantity} />
      <Grid sx={{ display: "flex", flexDirection: "column", gap: 4, height: "100%", maxWidth: "30rem" }}>
        <Grid>
          <Typography variant="h5" sx={{ textWrap: "wrap", marginBottom: 1 }}>
            {searchedCard?.name}
          </Typography>
          <Chips labels={searchedCard?.rarities || []} />
        </Grid>
        <CardSetInfo card={searchedCard} />
        <CardStats card={searchedCard} />
      </Grid>
    </Grid>
  );
};

export default Cards;
