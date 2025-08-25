import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./themeSlice";
import cardsReducer from "./cardSlice";
import confirmReducer from "./confirmSlice";
import userSlice from "./userSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    cards: cardsReducer,
    confirm: confirmReducer,
    user: userSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
