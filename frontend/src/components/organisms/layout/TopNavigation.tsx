import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Paper from "@mui/material/Paper";
import Logo from "../../icons/Logo";
import Grid from "@mui/material/Grid";
import CoreInput from "../../molecules/CoreInput";
import { setSelectedCardNumber } from "../../../stores/cardSlice";
import SearchIcon from "@mui/icons-material/Search";
import debounce from "lodash/debounce";
import { PAGES, ROUTES_MAP } from "../../../constants";
import { getTabProps } from "../../../utils";
import { store } from "../../../stores/store";
import { useLocation, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import UserMenu from "./UserMenu";

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
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = React.useState("");
  const isVeryNarrow = useMediaQuery("(max-width:500px)");

  const searchCards = React.useCallback(
    (cardNumber: string) => {
      const upperCaseCardNumber = cardNumber.toUpperCase();
      store.dispatch(setSelectedCardNumber(upperCaseCardNumber));

      if (location.pathname.includes(ROUTES_MAP.CARDS)) {
        const newPath = upperCaseCardNumber
          ? `/cards/${upperCaseCardNumber}`
          : "/cards";
        navigate(newPath, { replace: true });
      }
    },
    [location.pathname, navigate]
  );

  const debouncedSearchCards = React.useMemo(
    () => debounce(searchCards, 400),
    [searchCards]
  );

  React.useEffect(() => {
    const cardSetCode = location.pathname.split("/cards/")[1];
    const upperCaseCardSetCode = cardSetCode ? cardSetCode.toUpperCase() : "";
    setSearchValue(upperCaseCardSetCode);
    debouncedSearchCards(upperCaseCardSetCode);
  }, [debouncedSearchCards, location.pathname]);

  const label =
    PAGES.find((page) => location.pathname.includes(page.route))?.searchLabel ||
    "Search";

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
                  component="a"
                  href={page.route}
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    if (e.button === 0 && !e.ctrlKey && !e.metaKey) {
                      e.preventDefault();
                    }
                  }}
                  {...getTabProps(page.index)}
                />
              ))}
            </Tabs>
          </Grid>
          <CoreInput
            label={label}
            value={searchValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const upperValue = e.target.value.toUpperCase();
              setSearchValue(upperValue);
              debouncedSearchCards(upperValue);
            }}
            startIcon={<SearchIcon />}
            responsive
          />
          <UserMenu />
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
            paddingX: isVeryNarrow ? 1 : 3,
            gap: isVeryNarrow ? 0.5 : 1.5,
          }}
        >
          <Box sx={{ minWidth: isVeryNarrow ? 28 : 35 }}>
            <Logo />
          </Box>
          <CoreInput
            label={label}
            value={searchValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const upperValue = e.target.value.toUpperCase();
              setSearchValue(upperValue);
              debouncedSearchCards(upperValue);
            }}
            startIcon={<SearchIcon />}
          />
          <UserMenu />
          {/* <ThemeSwitch /> */}
        </Grid>
      )}
    </Paper>
  );
};

export default TopNavigation;
