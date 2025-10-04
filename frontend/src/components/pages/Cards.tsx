import CardImageAndQuantity from "../organisms/cards/CardImageAndQuantity";
import CardFullInfo from "../organisms/cards/CardFullInfo";
import CardListFromSet from "../organisms/cards/CardListFromSet";
import EmptyState from "../organisms/shared/EmptyState";
import { useParams } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { toast } from "react-toastify";
import { Button } from "@mui/material";
import type { ICard } from "../../interfaces/card.interface";
import SDK from "../../sdk/SDK";
import { CARD_SET_CODE_REGEX, ELEMENT_IDS } from "../../constants";
import {
  setCardsData,
  clearCardsData,
  setSelectedCardNumber as setSelectedCardNumberAction,
} from "../../stores/cardSlice";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../stores/store";
import CoreInput from "../molecules/CoreInput";
import CardsLoadingScreen from "../organisms/cards/CardsLoadingScreen";

const VITE_REACT_LOCAL_BACKEND_URL = import.meta.env
  .VITE_REACT_LOCAL_BACKEND_URL;
if (!VITE_REACT_LOCAL_BACKEND_URL)
  throw new Error("VITE_REACT_LOCAL_BACKEND_URL is not defined");

interface CardsProps {
  socketId: string;
}

const Cards = ({ socketId }: CardsProps) => {
  const sdk = SDK.getInstance(VITE_REACT_LOCAL_BACKEND_URL);
  const dispatch = useDispatch();
  const { cardNumber: urlCardNumber } = useParams<{ cardNumber?: string }>();

  const cardsList = useSelector((state: RootState) => state.cards.cardsList);
  const cardSetPrefixInStore = useSelector(
    (state: RootState) => state.cards.cardSetPrefix
  );
  const selectedCardNumber = useSelector(
    (state: RootState) => state.cards.selectedCardNumber
  );

  const [searchedCard, setSearchedCard] = useState<ICard | null>(null);
  const [quantity, setQuantity] = useState<number | "">(1);
  const [cardSetName, setCardSetName] = useState<string>("");
  const [showCardSetFetch, setShowCardSetFetch] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (urlCardNumber) {
      dispatch(setSelectedCardNumberAction(urlCardNumber));
    }
  }, [urlCardNumber, dispatch]);

  const fetchCardSet = useCallback(
    async (cardSetNameValue: string) => {
      try {
        await sdk.cardsManager.findCardSets(
          {
            cardSetNames: [cardSetNameValue],
            cardSetCode: selectedCardNumber || "",
          },
          socketId
        );
        toast.success(
          "Started search — you will be notified when it finishes."
        );
      } catch (error) {
        console.error("Error fetching card set:", error);
        toast.error("Failed to start search. Please try again.");
      }
    },
    [sdk.cardsManager, socketId, selectedCardNumber]
  );

  useEffect(() => {
    const executeSearch = async () => {
      try {
        const cardSetCode = selectedCardNumber || urlCardNumber;
        if (!cardSetCode) {
          dispatch(clearCardsData());
          setShowCardSetFetch(false);
          setIsLoading(false);
          return;
        }
        
        const normalizedCode = cardSetCode.trim().toUpperCase();
        const valid = CARD_SET_CODE_REGEX.test(normalizedCode);
        if (!valid) {
          setIsLoading(false);
          return;
        }

        const setCodePrefix = normalizedCode.split("-")[0];

        if (cardSetPrefixInStore === setCodePrefix && cardsList.length > 0) {
          setIsLoading(false);
          const cardInList = cardsList.find(
            (c) => c.cardNumber.toUpperCase() === normalizedCode
          );
          if (cardInList) {
            setSearchedCard(cardInList);
            setQuantity(cardInList.count || 1);
            setShowCardSetFetch(false);
          } else {
            setSearchedCard(null);
            setShowCardSetFetch(true);
          }
          return;
        }

        setIsLoading(true);
        const cards = await sdk.cardsManager.getCardsBySetCode(normalizedCode);

        dispatch(
          setCardsData({ cardSetPrefix: setCodePrefix, cardsList: cards })
        );
        const searchedCard = cards.find(
          (c) => c.cardNumber.toUpperCase() === normalizedCode
        );
        if (!searchedCard) {
          toast.error("Card not found in the fetched set.");
          setSearchedCard(null);
          setShowCardSetFetch(false);
          return;
        }

        setSearchedCard(searchedCard);
        setQuantity(searchedCard.count || 1);
        setShowCardSetFetch(false);
      } catch (error) {
        const err = error as { response?: { data?: { statusCode?: number; message?: string } } };
        if (
          err?.response?.data?.statusCode === 404 &&
          err?.response?.data?.message?.toLowerCase().includes("not found")
        ) {
          setShowCardSetFetch(true);
        } else {
          console.error("Error fetching cards:", error);
          toast.error("Error fetching cards.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    executeSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCardNumber, urlCardNumber]);

  const onSubmit = async () => {
    if (!searchedCard) return;
    try {
      await sdk.cardsManager.addCardToCollection(
        searchedCard.id,
        Number(quantity)
      );
      toast.success(
        `Added ${quantity} x ${searchedCard.name} to your collection!`
      );
    } catch (error) {
      console.error("Error adding card to collection:", error);
      toast.error("Failed to add card to collection. Please try again.");
    }
  };

  if (isLoading) return <CardsLoadingScreen />;

  if (showCardSetFetch) {
    return (
      <Grid
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          width: "100%",
          alignItems: "center",
        }}
      >
        <EmptyState
          title="Find Card Set"
          description={`We couldn't find the card set you're looking for. Would you like to\n\rprovide the card set name for the card with set code: ${selectedCardNumber}?`}
          callback={() => {
            const searchBar = document.getElementById(ELEMENT_IDS.CARD_SET_NAME_INPUT);
            searchBar?.focus();
          }}
          custom={() => (
            <Grid
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 2,
                width: "100%",
                maxWidth: "500px",
              }}
            >
              <CoreInput
                label={ELEMENT_IDS.CARD_SET_NAME_INPUT}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCardSetName(e.target.value)
                }
                value={cardSetName}
              />
              <Button
                variant="contained"
                sx={{ width: "100%" }}
                onClick={async () => {
                  if (!cardSetName) return;
                  await fetchCardSet(cardSetName);
                }}
              >
                Search
              </Button>
            </Grid>
          )}
        />
      </Grid>
    );
  }

  if (!cardsList.length) {
    return (
      <Grid
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          width: "100%",
          alignItems: "center",
        }}
      >
        <EmptyState
          title="Search for Yu-Gi-Oh! Cards"
          description={`Use the search bar above to find cards and add them to your collection.\n\rExplore thousands of cards from different sets and rarities.`}
          callback={() => {
            const searchBar = document.getElementById(ELEMENT_IDS.CARD_SEARCH_INPUT);
            searchBar?.focus();
          }}
        />
      </Grid>
    );
  }

  return (
    <Grid
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        gap: 4,
        flexWrap: "wrap",
        alignItems: "flex-start",
      }}
    >
      <CardImageAndQuantity
        card={searchedCard}
        quantity={quantity}
        setQuantity={setQuantity}
        onSubmit={onSubmit}
      />
      <CardFullInfo card={searchedCard} />
      <CardListFromSet />
    </Grid>
  );
};

export default Cards;
