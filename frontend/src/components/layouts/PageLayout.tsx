import Paper from "@mui/material/Paper";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { PAGES } from "../../constants";
import BottomNavigation from "../organisms/BottomNavigation";
import TopNavigation from "../organisms/TopNavigation";
import { useState } from "react";
import Cards from "../pages/Cards";
import Collection from "../pages/Collection";
import Grid from "@mui/material/Grid";

export default function PageLayout() {
  const isSmDown = useMediaQuery("(max-width:720px)");
  const navigate = useNavigate();

  const [value, setValue] = useState(
    PAGES.find((page) => location.pathname.includes(page.route))?.index || 0
  );

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    const page = PAGES[newValue];
    if (page) {
      setValue(newValue);
      navigate(page.route);
    }
  };

  const isValidRoute = PAGES.some((page) =>
    location.pathname.includes(page.route)
  );

  return (
    <Paper
      sx={{
        height: "100vh",
        width: "100vw",
        borderRadius: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <TopNavigation
        isSmDown={isSmDown}
        value={value}
        handleChange={handleChange}
      />
      <Grid
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "center",
          alignItems: "top",
          gap: 2,
          padding: 2,
          height: `calc(100vh - ${isSmDown ? "120px" : "60px"})`,
          overflowY: "auto",
        }}
      >
        {!isValidRoute && <Navigate to="/cards" replace />}
        <Routes>
          <Route path="/cards/:cardId?" element={<Cards />} />
          <Route path="/collection" element={<Collection />} />
        </Routes>
      </Grid>
      {isSmDown && (
        <BottomNavigation value={value} handleChange={handleChange} />
      )}
    </Paper>
  );
}
