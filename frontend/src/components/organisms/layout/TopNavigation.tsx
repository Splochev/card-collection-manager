import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Paper from "@mui/material/Paper";
import { useLocation, useNavigate } from "react-router-dom";
import ThemeSwitch from "../../atoms/ThemeSwitch";
import { useState } from "react";
import Logo from "../../icons/Logo";
import Grid from "@mui/material/Grid";
import CoreInput from "../../molecules/CoreInput";
import { setCards } from "../../../stores/cardSlice";
import SearchIcon from "@mui/icons-material/Search";
import SDK from "../../../sdk/SDK";
import debounce from "lodash/debounce";
import { CARD_SET_CODE_REGEX, PAGES, ROUTES_MAP } from "../../../constants";
import { getTabProps } from "../../../utils";
import { store } from "../../../stores/store";
import useConfirm from "../../../hooks/useConfirm";
import type { ICard } from "../../../interfaces/card.interface";
import Typography from "@mui/material/Typography";
import { io, type Socket } from "socket.io-client";
import { toast } from "react-toastify";
import { Button } from "@mui/material";

const HOST = import.meta.env.VITE_REACT_APP_HOST;
if (!HOST) {
  throw new Error("VITE_REACT_APP_HOST is not defined");
}

const TopNavigation = ({
  value,
  handleChange,
  isSmDown,
}: {
  value: number;
  handleChange: (event: React.SyntheticEvent, newValue: number) => void;
  isSmDown: boolean;
}) => {
  const sdk = SDK.getInstance(HOST);
  const location = useLocation();
  const param = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const { confirm } = useConfirm();
  const [searchValue, setSearchValue] = useState(param.get("cardId") || "");
  const searchValueRef = React.useRef(searchValue);
  const socketIdRef = React.useRef<string>('');

  const searchCards = React.useCallback(
    async (cardSetCode: string) => {
      try {
        if (!cardSetCode) {
          store.dispatch(setCards([]));
          navigate("/cards");
          return;
        }
        cardSetCode = cardSetCode.trim().toUpperCase();
        const valid = CARD_SET_CODE_REGEX.test(cardSetCode);
        if (!valid) return;

        const storedCards = store.getState().cards.cards;
        let cards: ICard[] | undefined;

        if (
          storedCards &&
          storedCards.length &&
          storedCards.some((c) => c.cardNumber === cardSetCode)
        ) {
          cards = storedCards;
          setSearchValue(cardSetCode);
        } else {
          cards = await sdk.cardsManager.getCardsBySetCode(cardSetCode);
          if (cards && cards.length > 0) {
            navigate(`/cards/${cards[0].cardNumber}`);
          }
        }

        store.dispatch(setCards(cards));
      } catch (error: any) {
        if (
          error?.response?.data?.statusCode === 404 &&
          error?.response?.data?.message.toLowerCase().includes("not found")
        ) {
          try {
            let cardSetNameValue = "";
            const confirmed = await confirm({
              title: "Card set not found",
              message: "",
              custom: () => (
                <Grid sx={{ flexDirection: "column", display: "flex", gap: 2 }}>
                  <Typography
                    sx={{ marginLeft: 1 }}
                    variant="body2"
                    component="p"
                  >
                    We couldn't find the card set you're looking for. Would you
                    like to provide the card set name for the card with set
                    code: {searchValue}?
                  </Typography>
                  <CoreInput
                    label="Card Set Name (e.g. Metal Raiders, Alliance Insight, etc...)"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      (cardSetNameValue = e.target.value)
                    }
                  />
                </Grid>
              ),
              variant: "info",
              confirmText: "Confirm",
              cancelText: "Cancel",
              dismissible: true,
            });

            if (confirmed && cardSetNameValue) {
              fetchCardSet(cardSetNameValue);
            } else {
              store.dispatch(setCards([]));
            }
          } catch (e) {
            console.error("Error fetching cards:", e);
            store.dispatch(setCards([]));
          }
        } else {
          console.error("Error fetching cards:", error);
          store.dispatch(setCards([]));
          toast.error("Error fetching cards.");
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sdk, navigate]
  );

  const debouncedSearchCards = React.useMemo(
    () => debounce(searchCards, 400),
    [searchCards]
  );

  React.useEffect(() => {
    searchValueRef.current = searchValue;
  }, [searchValue]);

  React.useEffect(() => {
      const socket: Socket = io(`${HOST}/scrape`);
    socket.on(
      "scrapeFinished",
      async (payload: {
        collectionName: string;
        count?: number;
        cardNumber?: string;
      }) => {
        const { collectionName, cardNumber } = payload || {};
        const target = cardNumber || searchValueRef.current || "";
        toast.success(
          <Grid
            sx={{ display: "flex", gap: 1, alignItems: "start", marginTop: 1 }}
          >
            <Typography variant="body2">
              Finished scraping "{collectionName}".
            </Typography>
            <Button
              variant="text"
              href={target ? `/cards/${target}` : "/cards"}
              sx={{ width: 80 }}
            >
              View
            </Button>
          </Grid>,
          { autoClose: 8000 }
        );
      }
    );
      socket.on('connect', () => {
        // capture socket id for POST requests
        socketIdRef.current = socket.id;
      });

    return () => {
      socket.disconnect();
    };
  }, []);

  React.useEffect(() => {
    const cardSetCode = window.location.pathname.split("/").pop() || "";
    if (cardSetCode) debouncedSearchCards(cardSetCode);
  }, [debouncedSearchCards]);

  const fetchCardSet = React.useCallback(
    async (cardSetNameValue: string) => {
      try {
          // pass socket id header so server can reply only to this client
          const socketId = socketIdRef.current || undefined;
          await sdk.cardsManager.findCardSets([cardSetNameValue], socketId);
        toast.success(
          "Scrape job started — you will be notified when it finishes."
        );
      } catch (error) {
        console.error("Error fetching card set:", error);
        toast.error("Failed to start scrape job. Please try again.");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchValue]
  );

  const label = location.pathname.includes(ROUTES_MAP.CARDS)
    ? "Find cards by set code"
    : "Find cards in collection by card name, set code or set name";

  return (
    <Paper
      sx={{
        borderRadius: 0,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingX: 1,
        height: 60,
      }}
      elevation={3}
    >
      {!isSmDown ? (
        <>
          <Grid container spacing={2} alignItems="center">
            <Logo />
            <Tabs value={value} onChange={handleChange} aria-label="navigation">
              {PAGES.map((page) => (
                <Tab
                  key={page.index}
                  label={
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      {page.icon && <page.icon size="small" />}
                      {page.label}
                    </div>
                  }
                  {...getTabProps(page.index)}
                />
              ))}
            </Tabs>
          </Grid>
          <CoreInput
            label={label}
            value={searchValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearchValue(e.target.value);
              debouncedSearchCards(e.target.value);
            }}
            startIcon={<SearchIcon />}
            responsive
          />
          <ThemeSwitch />
        </>
      ) : (
        <Grid
          container
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
            flexWrap: "nowrap",
            paddingX: 3,
            gap: 3,
          }}
        >
          <Logo />
          <CoreInput
            label={label}
            value={searchValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearchValue(e.target.value);
              debouncedSearchCards(e.target.value);
            }}
            startIcon={<SearchIcon />}
          />
        </Grid>
      )}
    </Paper>
  );
};

export default TopNavigation;
