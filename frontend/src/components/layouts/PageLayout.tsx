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
import { NavbarSearch } from "../atoms/NavbarSearch";
import Container from "@mui/material/Container";
import useMediaQuery from "@mui/material/useMediaQuery";

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
  { label: "Cards", index: 0, route: ROUTES_MAP.CARDS },
  { label: "Collection", index: 1, route: ROUTES_MAP.COLLECTION },
];

const VALID_ROUTES = {
  [ROUTES_MAP.CARDS]: 0,
  [ROUTES_MAP.COLLECTION]: 1,
};

export default function PageLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(VALID_ROUTES[location.pathname] || 0);
  const isSmDown = useMediaQuery("(max-width:650px)");
  const [searchValue, setSearchValue] = useState("");

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    const page = PAGES[newValue];
    if (page) {
      setValue(newValue);
      navigate(page.route);
    }
  };

  const isValidRoute = VALID_ROUTES[location.pathname] >= 0;

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
          height: 50,
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
                    label={page.label}
                    {...a11yProps(page.index)}
                  />
                ))}
              </Tabs>
            </Grid>

            <NavbarSearch
              value={searchValue}
              onInputChange={(e) => setSearchValue(e.target.value)}
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
            <NavbarSearch
              alwaysExpanded
              value={searchValue}
              onInputChange={(e) => setSearchValue(e.target.value)}
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
          <Grid container spacing={2} alignItems="center">
            <Tabs value={value} onChange={handleChange} aria-label="navigation">
              {PAGES.map((page) => (
                <Tab
                  key={page.index}
                  label={page.label}
                  {...a11yProps(page.index)}
                />
              ))}
            </Tabs>
          </Grid>
        </Paper>
      )}
    </Paper>
  );
}
