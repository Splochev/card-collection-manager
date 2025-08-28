import CardImageAndQuantity from "../organisms/cards/CardImageAndQuantity";
import CardFullInfo from "../organisms/cards/CardFullInfo";
import CardListFromSet from "../organisms/cards/CardListFromSet";
import EmptyState from "../organisms/shared/EmptyState";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { io, type Socket } from "socket.io-client";
import { toast } from "react-toastify";
import { Button } from "@mui/material";
import type { ICard } from "../../interfaces/card.interface";
import SDK from "../../sdk/SDK";
import { CARD_SET_CODE_REGEX } from "../../constants";
import { store } from "../../stores/store";
import CoreInput from "../molecules/CoreInput";
import CardsLoadingScreen from "../organisms/cards/CardsLoadingScreen";

const VITE_REACT_LOCAL_BACKEND_URL = import.meta.env.VITE_REACT_LOCAL_BACKEND_URL;
if (!VITE_REACT_LOCAL_BACKEND_URL) throw new Error("VITE_REACT_LOCAL_BACKEND_URL is not defined");

const Cards = () => {
  const sdk = SDK.getInstance(VITE_REACT_LOCAL_BACKEND_URL);
  const navigate = useNavigate();
  const [searchedCard, setSearchedCard] = useState<ICard | null>(null);
  const [cardsList, setCardsList] = useState<ICard[]>([]);
  const [quantity, setQuantity] = useState<number | "">(1);
  const [cardSetName, setCardSetName] = useState<string>("");
  const [showCardSetFetch, setShowCardSetFetch] = useState<boolean>(false);
  const [selectedCardNumber, setSelectedCardNumber] = useState<string>(null);
  const selectedCardNumberRef = React.useRef<string>("");
  const socketIdRef = React.useRef<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const fetchCardSet = React.useCallback(
    async (cardSetNameValue: string) => {
      try {
        const socketId = socketIdRef.current || undefined;
        await sdk.cardsManager.findCardSets([cardSetNameValue], socketId);
        toast.success("Started search — you will be notified when it finishes.");
      } catch (error) {
        console.error("Error fetching card set:", error);
        toast.error("Failed to start search. Please try again.");
      }
    },
    [sdk.cardsManager]
  );

  const searchCards = React.useCallback(
    async (cardSetCode: string) => {
      try {
        if (!cardSetCode) {
          setCardsList([]);
          navigate("/cards");
          setShowCardSetFetch(false);
          return;
        }
        cardSetCode = cardSetCode.trim().toUpperCase();
        const valid = CARD_SET_CODE_REGEX.test(cardSetCode);
        if (!valid) return;

        let cards: ICard[] | undefined;
        const cardInList = (cardsList || []).find((c) => c.cardNumber.toUpperCase() === cardSetCode)

        if (cardInList) {
          cards = cardsList;
          setSearchedCard(cardInList);
        } else {
          setIsLoading(true);
          cards = await sdk.cardsManager.getCardsBySetCode(cardSetCode);
          setSearchedCard(cards[0]);
        }
        setCardsList(cards);
        setShowCardSetFetch(false);
      } catch (error: any) {
        if (
          error?.response?.data?.statusCode === 404 &&
          error?.response?.data?.message.toLowerCase().includes("not found")
        ) {
          setShowCardSetFetch(true);
        } else {
          console.error("Error fetching cards:", error);
          toast.error("Error fetching cards.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sdk, navigate]
  );

  React.useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const selectedCardNumber = store.getState().cards.selectedCardNumber;
      searchCards(selectedCardNumber || "");
      setSelectedCardNumber(selectedCardNumber || "");
      selectedCardNumberRef.current = selectedCardNumber || "";

      console.log(store.getState().user.accessToken)
      console.log(store.getState().user.user)
    });
    return () => unsubscribe();
  }, [searchCards]);

  React.useEffect(() => {
    const socket: Socket = io(`${VITE_REACT_LOCAL_BACKEND_URL}/card-manager`);
    socket.on(
      "searchCardSetFinished",
      async (payload: { collectionName: string }) => {
        toast.success(
          <Grid
            sx={{ display: "flex", gap: 1, alignItems: "start", marginTop: 1 }}
          >
            <Typography variant="body2">
              Finished search for "{payload.collectionName}".
            </Typography>
            <Button
              variant="text"
              href={`/cards/${selectedCardNumberRef.current}`}
              sx={{ width: 80 }}
            >
              View
            </Button>
          </Grid>,
          { autoClose: 8000 }
        );
      }
    );
    socket.on("connect", () => socketIdRef.current = socket.id);

    return () => {
      socket.disconnect();
    };
  }, []);

  if(isLoading) return <CardsLoadingScreen />


  if (showCardSetFetch) {
    return (
      <EmptyState
        title="Find Card Set"
        description={`We couldn't find the card set you're looking for. Would you like to\n\rprovide the card set name for the card with set code: ${selectedCardNumber}?`}
        callback={() => {
          const searchBar = document.getElementById("Find cards by set code");
          searchBar?.focus();
        }}
        custom={() => (
          <Grid sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 2, width: '100%', maxWidth: '500px'}}>
            <CoreInput
              label="Card Set Name (e.g. Metal Raiders, Alliance Insight, etc...)"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCardSetName(e.target.value)
              }
              value={cardSetName}
            />
            <Button
              variant="contained"
              sx={{ width: '100%' }}
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
    );
  }
  
  if (!cardsList.length) {
    return (
      <EmptyState
        title="Search for Yu-Gi-Oh! Cards"
        description={`Use the search bar above to find cards and add them to your collection.\n\rExplore thousands of cards from different sets and rarities.`}
        callback={() => {
          const searchBar = document.getElementById("Find cards by set code");
          searchBar?.focus();
        }}
      />
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
      <CardImageAndQuantity card={searchedCard} quantity={quantity} setQuantity={setQuantity} />
      <CardFullInfo card={searchedCard} />
      <CardListFromSet cardsList={cardsList} excludedCards={[searchedCard]} />
    </Grid>
  );
};

export default Cards;
