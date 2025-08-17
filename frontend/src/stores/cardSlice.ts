import { createSlice } from "@reduxjs/toolkit";
import type { ICard } from "../interfaces/card.interface";

const cardsSlice = createSlice({
  name: "cards",
  initialState: { cards: [] as ICard[] },
  reducers: {
    setCards: (state, action) => {
      state.cards = action.payload;
    },
  },
});

export const { setCards } = cardsSlice.actions;
export default cardsSlice.reducer;
