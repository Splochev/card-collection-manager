import Paper from "@mui/material/Paper";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import useMediaQuery from "@mui/material/useMediaQuery";
import { PAGES } from "../../constants";
import BottomNavigation from "../organisms/BottomNavigation";
import TopNavigation from "../organisms/TopNavigation";
import { useState } from "react";
import Cards from "../pages/Cards";
import Collection from "../pages/Collection";

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
      className="h-screen"
      sx={{
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
      <Container
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {!isValidRoute && <Navigate to="/cards" replace />}
        <Routes>
          <Route path="/cards" element={<Cards />} />
          <Route path="/collection" element={<Collection />} />
        </Routes>
      </Container>
      {isSmDown && (
        <BottomNavigation value={value} handleChange={handleChange} />
      )}
    </Paper>
  );
}
