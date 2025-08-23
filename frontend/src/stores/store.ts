import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./themeSlice";
import cardsReducer from "./cardSlice";
import confirmReducer from "./confirmSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    cards: cardsReducer,
    confirm: confirmReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
