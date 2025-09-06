// App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "./stores/store";
import { setUser, setAccessToken } from "./stores/userSlice";
import { lightTheme, darkTheme } from "./themes";
import PageLayout from "./components/layouts/PageLayout";
import ScrollbarStyles from "./components/atoms/ScrollbarStyles";
import ConfirmDialog from "./components/organisms/layout/ConfirmDialog";
import {
  LogtoProvider,
  type LogtoConfig,
  useLogto,
  useHandleSignInCallback,
} from "@logto/react";

// ---- Logto Config ----
const config: LogtoConfig = {
  endpoint: "http://localhost:3001/",
  appId: "nxbvkezf2ydmgzwrph7at",
  resources: ["https://03f80a3a0207.ngrok-free.app"],
};

function App() {
  return (
    <LogtoProvider config={config}>
      <BrowserRouter>
        <Routes>
          <Route path="/callback" element={<CallbackPage />} />
          <Route path="/*" element={<ProtectedApp />} />
        </Routes>
      </BrowserRouter>
    </LogtoProvider>
  );
}

// ---- Callback page to complete login ----
function CallbackPage() {
  const { isLoading } = useHandleSignInCallback(() => {
    // After processing, go back home
    window.location.replace("/");
  });

  if (isLoading) return <div>Redirecting...</div>;
  return null;
}

// ---- Protected app ----
function ProtectedApp() {
  const theme = useSelector((state: RootState) =>
    state.theme.mode === "light" ? lightTheme : darkTheme
  );
  const dispatch = useDispatch();
  const { signIn, isAuthenticated, isLoading, fetchUserInfo, getAccessToken } =
    useLogto();

  // auto-login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      signIn("http://localhost:5173/callback");
    }
  }, [isLoading, isAuthenticated, signIn]);

  // fetch user + token when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      (async () => {
        try {
          const user = await fetchUserInfo();
          dispatch(setUser(user));

          const token = await getAccessToken(
            "https://03f80a3a0207.ngrok-free.app"
          );
          dispatch(setAccessToken(token));
        } catch (err) {
          console.error("Failed to fetch user or token", err);
        }
      })();
    }
  }, [isAuthenticated, fetchUserInfo, getAccessToken, dispatch]);

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) return <div>Redirecting to login...</div>;

  return (
    <ThemeProvider theme={theme}>
      <ScrollbarStyles />
      <PageLayout />
      <ConfirmDialog />
      <ToastContainer />
    </ThemeProvider>
  );
}

export default App;
