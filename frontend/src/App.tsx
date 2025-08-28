import { useSelector } from "react-redux";
import { type RootState } from "./stores/store";
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme, darkTheme } from "./themes";
import { BrowserRouter } from "react-router-dom";
import PageLayout from "./components/layouts/PageLayout";
import ScrollbarStyles from "./components/atoms/ScrollbarStyles";
import ConfirmDialog from "./components/organisms/layout/ConfirmDialog";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { store } from "./stores/store";
// import { toggleTheme } from "./stores/themeSlice";
// store.dispatch(toggleTheme());
import {
  LogtoProvider,
  type LogtoConfig,
  useHandleSignInCallback,
  useLogto,
} from "@logto/react";
import { useEffect } from "react";

const config: LogtoConfig = {
  endpoint: "http://localhost:3001/",
  appId: "nxbvkezf2ydmgzwrph7at",
};

function SignInCallback() {
  const { isLoading, error } = useHandleSignInCallback();

  if (isLoading) {
    return <div>Redirecting...</div>;
  }

  if (error) {
    return <div>Sign-in failed: {error.message}</div>;
  }

  return <AppWrapper />;
}

function App() {
  return (
    <LogtoProvider config={config}>
      <BrowserRouter>
        <SignInCallback />
      </BrowserRouter>
    </LogtoProvider>
  );
}

function AppWrapper() {
  const theme = useSelector((state: RootState) =>
    state.theme.mode === "light" ? lightTheme : darkTheme
  );
  const { signIn, isAuthenticated, fetchUserInfo, isLoading } = useLogto();

  useEffect(() => {
    if (isAuthenticated) {
      (async () => {
        try {
          const user = await fetchUserInfo();
          console.log({ claims: user });
        } catch (error) {
          console.error("Failed to fetch user info:", error);
        }
      })();
    }
  }, [isAuthenticated, fetchUserInfo]);

  const handleLogin = () => {
    signIn("http://localhost:5173");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <button onClick={handleLogin}>Sign In</button>
      </div>
    );
  }

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
