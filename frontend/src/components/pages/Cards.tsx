import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { store } from "../../stores/store";
import EmptyState from "../organisms/EmptyState";
import type { ICard } from "../../interfaces/card.interface";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Chips from "../atoms/Chips";
import CardImageAndQuantity from "../organisms/CardImageAndQuantity";
import CardSetInfo from "../organisms/CardSetInfo";
import CardStats from "../organisms/CardStats";
import Paper from "@mui/material/Paper";
import CardWrapper from "../atoms/CardWrapper";
import { setSelectedCardId } from "../../stores/cardSlice";

const Cards = () => {
  const { cardId } = useParams();
  const navigate = useNavigate();
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

  function handleCardClick(card: ICard) {
    navigate(`/cards/${card.cardNumber}`);
  }

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
    <Grid sx={{ display: "flex", flexDirection: "row", justifyContent: "space-around", width: "100%" }}>
      <CardImageAndQuantity card={searchedCard} quantity={quantity} setQuantity={setQuantity} />
      <Grid sx={{ display: "flex", flexDirection: "column", gap: 4, height: "100%", maxWidth: "35rem" }}>
        <Grid>
          <Typography variant="h5" sx={{ textWrap: "wrap", marginBottom: 1 }}>
            {searchedCard?.name}
          </Typography>
          <Chips labels={searchedCard?.rarities || []} />
        </Grid>
        <CardSetInfo card={searchedCard} />
        <CardStats card={searchedCard} />
      </Grid>
      {cardsList.length > 0 && (
        <Grid sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: '35rem', width: '100%', }}>
          <Typography variant="h6">Other Cards from set</Typography>
          <Grid sx={{ display: "flex", flexDirection: "column", gap: 4, width: '100%', overflowY: 'auto', paddingRight: 2 }}>
            {cardsList.map((card) => {
              if(card.cardNumber === searchedCard?.cardNumber) return null;

              return (
                <Paper 
                  key={card.cardNumber} 
                  elevation={6} 
                  onClick={() => handleCardClick(card)}
                  sx={{width: '100%', padding: 2, borderRadius: 3, gap: 2, display: "flex", flexDirection: "row", justifyContent: "space-between", cursor: 'pointer' }}
                >
                  <CardWrapper url={card?.cards?.imageUrl || undefined} name={card?.name || undefined} width={'6rem'}/>
                  <Grid sx={{width: '100%', height: '100%'}}>
                    <Grid sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%", alignItems: "baseline", gap: 2 }}>
                      <Typography variant="body2" component="p">Name:</Typography>
                      <Typography variant="body1" component="p" fontWeight="bold" marginBottom={2} sx={{textWrap:'wrap', maxWidth: '12rem', textAlign: 'right'}}>{card?.name}</Typography>
                    </Grid>
                    <Grid sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                      <Typography variant="body2" component="p">Set Code:</Typography>
                      <Typography variant="body1" component="p" fontWeight="bold"  marginBottom={2}>{card?.cardNumber}</Typography>
                    </Grid>
                    <Chips labels={card?.rarities || []} width={'100%'} />
                  </Grid>
                </Paper>
              );
            })}
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default Cards;
