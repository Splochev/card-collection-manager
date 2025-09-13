import Paper from "@mui/material/Paper";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { PAGES } from "../../constants";
import BottomNavigation from "../organisms/layout/BottomNavigation";
import TopNavigation from "../organisms/layout/TopNavigation";
import React, { useState } from "react";
import Cards from "../pages/Cards";
import Collection from "../pages/Collection";
import Grid from "@mui/material/Grid";
import { io, type Socket } from "socket.io-client";
import { toast } from "react-toastify";
import { Button, Typography } from "@mui/material";

const VITE_REACT_LOCAL_BACKEND_URL = import.meta.env
  .VITE_REACT_LOCAL_BACKEND_URL;
if (!VITE_REACT_LOCAL_BACKEND_URL)
  throw new Error("VITE_REACT_LOCAL_BACKEND_URL is not defined");

export default function PageLayout() {
  const isSmDown = useMediaQuery("(max-width:720px)");
  const navigate = useNavigate();
  const socketIdRef = React.useRef<string>("");

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

  React.useEffect(() => {
    const socket: Socket = io(`${VITE_REACT_LOCAL_BACKEND_URL}/card-manager`);
    socket.on(
      "searchCardSetFinished",
      async (payload: { collectionName: string; cardSetCode: string }) => {
        toast.success(
          <Grid
            sx={{ display: "flex", gap: 1, alignItems: "start", marginTop: 1 }}
          >
            <Typography variant="body2">
              Finished search for "{payload.collectionName}".
            </Typography>
            <Button
              variant="text"
              href={`/cards/${payload.cardSetCode}`}
              sx={{ width: 80 }}
            >
              View
            </Button>
          </Grid>,
          { autoClose: 8000 }
        );
      }
    );
    socket.on("connect", () => (socketIdRef.current = socket.id));

    return () => {
      socket.disconnect();
    };
  }, []);

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
          <Route path="/cards/:cardNumber?" element={<Cards socketId={socketIdRef.current} />} />
          <Route path="/collection" element={<Collection />} />
        </Routes>
      </Grid>
      {isSmDown && (
        <BottomNavigation value={value} handleChange={handleChange} />
      )}
    </Paper>
  );
}
