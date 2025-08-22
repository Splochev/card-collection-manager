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
import type { ICard } from "../../../interfaces/card.interface";

const TopNavigation = ({
  value,
  handleChange,
  isSmDown,
}: {
  value: number;
  handleChange: (event: React.SyntheticEvent, newValue: number) => void;
  isSmDown: boolean;
}) => {
  const sdk = SDK.getInstance("http://localhost:3000"); // TODO replace with .env variable
  const location = useLocation();
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState(window.location.pathname.split("/").pop() || "");

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

        if(storedCards && storedCards.length && storedCards.some(c => c.cardNumber === cardSetCode)) {
          cards = storedCards;
          setSearchValue(cardSetCode);
        } else {
          cards = await sdk.cardsManager.getCardsBySetCode(cardSetCode);
          if (cards && cards.length > 0) {
            navigate(`/cards/${cards[0].cardNumber}`);
          }
        }

        store.dispatch(setCards(cards));
      } catch (error) {
        console.error("Error fetching cards:", error);
        store.dispatch(setCards([]));
      }
    },
    [sdk, navigate]
  );

  const label = location.pathname.includes(ROUTES_MAP.CARDS)
    ? "Find cards by set code"
    : "Find cards in collection by card name, set code or set name";

  const debouncedSearchCards = React.useMemo(
    () => debounce(searchCards, 400),
    [searchCards]
  );

  React.useEffect(() => {
    const cardSetCode = window.location.pathname.split("/").pop() || "";
    if (cardSetCode) debouncedSearchCards(cardSetCode);
  }, [debouncedSearchCards]);

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
            state={[
              searchValue,
              (e: React.ChangeEvent<HTMLInputElement>) => {
                setSearchValue(e.target.value);
                debouncedSearchCards(e.target.value);
              },
            ]}
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
            state={[
              searchValue,
              (e: React.ChangeEvent<HTMLInputElement>) => {
                setSearchValue(e.target.value);
                debouncedSearchCards(e.target.value);
              },
            ]}
            startIcon={<SearchIcon />}
          />
        </Grid>
      )}
    </Paper>
  );
};

export default TopNavigation;
