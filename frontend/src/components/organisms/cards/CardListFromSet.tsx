import type { ICard } from "../../../interfaces/card.interface";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Chips from "../../molecules/Chips";
import Paper from "@mui/material/Paper";
import CardWrapper from "../../atoms/CardWrapper";
import {
  IconButton,
  useMediaQuery,
  TextField,
  InputAdornment,
} from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";
import { useState, useMemo, useEffect, memo } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../../stores/store";
import { BREAKPOINTS, ELEMENT_IDS } from "../../../constants";

const CardListFromSet = () => {
  const cardsList = useSelector((state: RootState) => state.cards.cardsList);
  const selectedCardNumber = useSelector(
    (state: RootState) => state.cards.selectedCardNumber
  );

  const isWideScreen = useMediaQuery(BREAKPOINTS.WIDE_SCREEN);
  const [inputValue, setInputValue] = useState<string>("");
  const [filterText, setFilterText] = useState<string>("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setFilterText(inputValue);
    }, 200);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue]);

  const excludedCardSet = useMemo(() => {
    const set = new Set<string>();
    if (selectedCardNumber) {
      set.add(selectedCardNumber.toUpperCase());
    }
    return set;
  }, [selectedCardNumber]);

  const eligibleCards = useMemo(() => {
    const seen = new Set<string>();
    return cardsList.filter((card) => {
      // Filter out null/undefined cards or cards without cardNumber
      if (!card || !card.cardNumber) {
        return false;
      }
      const cardNumber = card.cardNumber.toUpperCase();
      if (excludedCardSet.has(cardNumber) || seen.has(cardNumber)) {
        return false;
      }
      seen.add(cardNumber);
      return true;
    });
  }, [cardsList, excludedCardSet]);

  const displayedCards = useMemo(() => {
    const trimmedSearch = filterText.trim();
    if (!trimmedSearch) {
      return eligibleCards;
    }

    const search = trimmedSearch.toLowerCase();
    return eligibleCards.filter(
      (card) =>
        (card.name?.toLowerCase() || "").includes(search) ||
        (card.cardNumber?.toLowerCase() || "").includes(search) ||
        (card.rarities || []).some((rarity) =>
          (rarity || "").toLowerCase().includes(search)
        )
    );
  }, [eligibleCards, filterText]);

  return (
    <Grid
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxWidth: "35rem",
        minWidth: "21rem",
        paddingBottom: 2,
        flex: { xs: "1 1 100%", md: "0 0 35rem" },
        width: { xs: "100%", md: "35rem" },
      }}
    >
      <Typography variant="h6">Other Cards from set</Typography>
      <TextField
        label="Find cards"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        size="small"
        id={ELEMENT_IDS.CARD_FILTER_INPUT}
        fullWidth
        margin="dense"
      />
      <Grid
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          width: "100%",
          padding: 2,
          ...(isWideScreen && {
            overflowY: "auto",
            maxHeight: "calc(100vh - 220px)",
          }),
        }}
      >
        {displayedCards.length === 0 && filterText.trim() !== "" ? (
          <Typography variant="body1" sx={{ textAlign: "center", padding: 2 }}>
            No cards found matching your search.
          </Typography>
        ) : (
          displayedCards.map((card) => (
            <CardItem key={card.cardNumber} card={card} />
          ))
        )}
      </Grid>
    </Grid>
  );
};

const CardItem = memo(({ card }: { card: ICard }) => {
  const navigate = useNavigate();

  const handleNavigate = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/cards/${card.cardNumber}`);
  };

  return (
    <Paper
      elevation={6}
      sx={{
        width: "100%",
        padding: 2,
        borderRadius: 3,
        gap: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Grid
        sx={{
          width: "100%",
          borderRadius: 3,
          gap: 2,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <CardWrapper
          url={card?.imageUrl || undefined}
          name={card?.name || undefined}
          width={"6rem"}
        />
        <Grid sx={{ width: "100%", height: "100%" }}>
          <Grid
            sx={{
              width: "100%",
              justifyContent: "flex-end",
              display: "flex",
              alignItems: "baseline",
            }}
          >
            <IconButton
              onClick={handleNavigate}
              sx={{ marginTop: "-10px", marginRight: "-10px" }}
            >
              <LaunchIcon />
            </IconButton>
          </Grid>
          <Grid
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "baseline",
              gap: 2,
            }}
          >
            <Typography variant="body2" component="p">
              Name:
            </Typography>
            <Typography
              variant="body1"
              component="p"
              fontWeight="bold"
              marginBottom={2}
              sx={{ textWrap: "wrap", maxWidth: "12rem", textAlign: "right" }}
            >
              {card?.name}
            </Typography>
          </Grid>
          <Grid
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "baseline",
            }}
          >
            <Typography variant="body2" component="p">
              Set Code:
            </Typography>
            <Typography
              variant="body1"
              component="p"
              fontWeight="bold"
              marginBottom={2}
            >
              {card?.cardNumber}
            </Typography>
          </Grid>
          <Grid
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "baseline",
            }}
          >
            <Typography variant="body2" component="p">
              Quantity:
            </Typography>
            <Typography
              variant="body1"
              component="p"
              fontWeight="bold"
              marginBottom={2}
            >
              {card?.count}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid sx={{ width: "100%", height: "100%" }}>
        <Chips labels={card?.rarities || []} width={"100%"} />
      </Grid>
    </Paper>
  );
});

export default CardListFromSet;
