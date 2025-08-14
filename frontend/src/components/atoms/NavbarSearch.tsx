import { useState, useRef } from "react";
import Fade from "@mui/material/Fade";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import Grid from "@mui/material/Grid";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(TextField)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
  },
}));

export function NavbarSearch({
  alwaysExpanded = false,
  value = "",
  onInputChange = () => {},
}: {
  alwaysExpanded?: boolean;
  value?: string;
  onInputChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const isMobileWidth = useMediaQuery("(max-width:900px)");
  const isMdDown = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const isMobile = isMobileWidth || isMdDown;
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleExpand = () => {
    setExpanded(true);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const handleBlur = () => {
    setExpanded(false);
  };

  if (alwaysExpanded) {
    return (
      <Grid
        style={{
          display: "flex",
          alignItems: "center",
          height: 40,
          width: "100%",
          position: "relative",
        }}
      >
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ "aria-label": "search" }}
            inputRef={inputRef}
            onBlur={handleBlur}
            value={value}
            onChange={onInputChange}
          />
        </Search>
      </Grid>
    );
  }

  return (
    <Grid
      style={{
        display: "flex",
        alignItems: "center",
        height: 40,
        minWidth: 40,
        position: "relative",
      }}
    >
      <Fade in={isMobile && !expanded} timeout={500} unmountOnExit>
        <Grid
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
          }}
        >
          <IconButton aria-label="search" onClick={handleExpand}>
            <SearchIcon />
          </IconButton>
        </Grid>
      </Fade>
      <Fade in={!isMobile || expanded} timeout={500} unmountOnExit>
        <Grid style={{ width: "100%" }}>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputRef={inputRef}
              onBlur={isMobile ? handleBlur : undefined}
              value={value}
              onChange={onInputChange}
            />
          </Search>
        </Grid>
      </Fade>
    </Grid>
  );
}
