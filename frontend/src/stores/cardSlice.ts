import { createSlice } from "@reduxjs/toolkit";
import type { ICard } from "../interfaces/card.interface";

const cardsSlice = createSlice({
  name: "cards",
  initialState: { cards: [] as ICard[], selectedCardId: null as string | null },
  reducers: {
    setCards: (state, action) => {
      state.cards = action.payload;
    },
    setSelectedCardId: (state, action) => {
      // Only allow string or null, never an object or array
      if (typeof action.payload === 'string' || action.payload === null) {
        state.selectedCardId = action.payload;
      } else if (typeof action.payload === 'number') {
        state.selectedCardId = String(action.payload);
      } else {
        state.selectedCardId = null;
        // In dev, log invalid payloads to help debugging
        try {
          console.error('Invalid selectedCardId dispatched:', action.payload);
        } catch (e) {
          void e;
        }
      }
    },
  },
});

export const { setCards, setSelectedCardId } = cardsSlice.actions;
export default cardsSlice.reducer;
