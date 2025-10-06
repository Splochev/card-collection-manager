import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ICard } from "../interfaces/card.interface";

interface CardsState {
  cardSetPrefix: string | null;
  cardsList: ICard[];
}

const initialState: CardsState = {
  cardSetPrefix: null,
  cardsList: [],
};

const cardsSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
    setCardsData: (
      state,
      action: PayloadAction<{ cardSetPrefix: string; cardsList: ICard[] }>
    ) => {
      state.cardSetPrefix = action.payload.cardSetPrefix;
      state.cardsList = action.payload.cardsList;
    },
    clearCardsData: (state) => {
      state.cardSetPrefix = null;
      state.cardsList = [];
    },
    updateCardCount: (
      state,
      action: PayloadAction<{ cardId: number; count: number }>
    ) => {
      const card = state.cardsList.find((c) => c.id === action.payload.cardId);
      if (card) {
        card.count = action.payload.count;
      }
    },
  },
});

export const { setCardsData, clearCardsData, updateCardCount } =
  cardsSlice.actions;
export default cardsSlice.reducer;
