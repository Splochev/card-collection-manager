import { useSelector } from "react-redux";
import { type RootState } from "./stores/store";
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme, darkTheme } from "./themes";
import { BrowserRouter } from "react-router-dom";
import PageLayout from "./components/layouts/PageLayout";
// import { store } from "./stores/store";
// import { toggleTheme } from "./stores/themeSlice";
// store.dispatch(toggleTheme());

function App() {
  const theme = useSelector((state: RootState) =>
    state.theme.mode === "light" ? lightTheme : darkTheme
  );

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <PageLayout />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
