import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./themeSlice";
import cardsReducer from "./cardSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    cards: cardsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
