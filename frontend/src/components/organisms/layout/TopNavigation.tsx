import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Paper from "@mui/material/Paper";
import ThemeSwitch from "../../atoms/ThemeSwitch";
import Logo from "../../icons/Logo";
import Grid from "@mui/material/Grid";
import CoreInput from "../../molecules/CoreInput";
import { setSelectedCardNumber } from "../../../stores/cardSlice";
import SearchIcon from "@mui/icons-material/Search";
import debounce from "lodash/debounce";
import { PAGES, ROUTES_MAP } from "../../../constants";
import { getTabProps } from "../../../utils";
import { store } from "../../../stores/store";
import { useLocation } from "react-router-dom";

const TopNavigation = ({
  value,
  handleChange,
  isSmDown,
}: {
  value: number;
  handleChange: (event: React.SyntheticEvent, newValue: number) => void;
  isSmDown: boolean;
}) => {
  const location = useLocation();
  const [searchValue, setSearchValue] = React.useState("");

  const searchCards = React.useCallback((cardNumber: string) => {
    store.dispatch(setSelectedCardNumber(cardNumber));
  }, []);

  const debouncedSearchCards = React.useMemo(
    () => debounce(searchCards, 400),
    [searchCards]
  );

  React.useEffect(() => {
    const cardSetCode = location.pathname.split("/cards/")[1];
    setSearchValue(cardSetCode || "");
    debouncedSearchCards(cardSetCode || "");
  }, [debouncedSearchCards, location.pathname]);

  const label = location.pathname.includes(ROUTES_MAP.CARDS)
    ? "Find cards by set number"
    : "Find cards in collection by card name, set number or set name";

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
