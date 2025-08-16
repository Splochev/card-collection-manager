import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Paper from "@mui/material/Paper";
import {
  Route,
  Routes,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import ThemeSwitch from "../atoms/ThemeSwitch";
import { useState } from "react";
import Logo from "../atoms/Logo";
import Grid from "@mui/material/Grid";
import CoreInput from "../atoms/CoreInput";
import Container from "@mui/material/Container";
import useMediaQuery from "@mui/material/useMediaQuery";
import CardSearchIcon from "../atoms/CardSearchIcon";
import CollectionIcon from "../atoms/CollectionIcon";
import SearchIcon from "@mui/icons-material/Search";
import SDK from "../../sdk/SDK";
import debounce from "lodash/debounce";

function a11yProps(index: number) {
  return {
    id: `navigation-tab-${index}`,
    "aria-controls": `navigation-tabpanel-${index}`,
  };
}

const ROUTES_MAP = {
  CARDS: "/cards",
  COLLECTION: "/collection",
};

const PAGES = [
  { label: "Cards", index: 0, route: ROUTES_MAP.CARDS, icon: CardSearchIcon },
  {
    label: "Collection",
    index: 1,
    route: ROUTES_MAP.COLLECTION,
    icon: CollectionIcon,
  },
];

const CARD_SET_CODE_REGEX = /^[A-Z0-9]{3,6}-[A-Z0-9]{3,6}$/i;

export default function PageLayout() {
  const sdk = SDK.getInstance("http://localhost:3000"); // TODO replace with .env variable
  const navigate = useNavigate();
  const location = useLocation();
  const isSmDown = useMediaQuery("(max-width:720px)");
  const [value, setValue] = useState(
    PAGES.find((page) => location.pathname.includes(page.route))?.index || 0
  );
  const [searchValue, setSearchValue] = useState("");

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    const page = PAGES[newValue];
    if (page) {
      setValue(newValue);
      navigate(page.route);
    }
  };

  const searchCards = async (cardSetCode: string) => {
    try {
      cardSetCode = cardSetCode.trim().toUpperCase();
      console.log("Searching for cards with set code:", cardSetCode);
      const valid = CARD_SET_CODE_REGEX.test(cardSetCode);
      if (!valid) return;

      const cards = await sdk.cardsManager.getCardsBySetCode(cardSetCode);
      console.log(cards);
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  };

  const debouncedSearchCards = React.useMemo(
    () => debounce(searchCards, 400),
    []
  );

  const isValidRoute = PAGES.some((page) =>
    location.pathname.includes(page.route)
  );

  const label = location.pathname.includes(ROUTES_MAP.CARDS)
    ? "Find cards by set code"
    : "Find cards in collection by card name, set code or set name";

  return (
    <Paper
      className="h-screen"
      sx={{
        borderRadius: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
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
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="navigation"
              >
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
                    {...a11yProps(page.index)}
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
      <Container sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {!isValidRoute && <Navigate to="/cards" replace />}
        <Routes>
          <Route path="/cards" element={<div>cards</div>} />
          <Route path="/collection" element={<div>collection</div>} />
        </Routes>
      </Container>
      {isSmDown && (
        <Paper
          sx={{
            borderRadius: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingX: 1,
          }}
          elevation={3}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="navigation"
            sx={{
              width: "100%",
              "& .MuiTabs-list": {
                justifyContent: "space-around",
              },
            }}
          >
            {PAGES.map((page) => (
              <Tab
                key={page.index}
                label={
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    {page.icon && <page.icon size="small" />}
                    {page.label}
                  </div>
                }
                {...a11yProps(page.index)}
              />
            ))}
          </Tabs>
        </Paper>
      )}
    </Paper>
  );
}
// https://6d8n7x-8080.csb.app/?theme=light
