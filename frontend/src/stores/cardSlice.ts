import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ICard } from "../interfaces/card.interface";

interface CardsState {
  selectedCardNumber: string | null;
  cardSetPrefix: string | null;
  cardsList: ICard[];
}

const initialState: CardsState = {
  selectedCardNumber: null,
  cardSetPrefix: null,
  cardsList: [],
};

const cardsSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
    setSelectedCardNumber: (state, action: PayloadAction<string | null>) => {
      state.selectedCardNumber = action.payload;
    },
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
  },
});

export const { setSelectedCardNumber, setCardsData, clearCardsData } =
  cardsSlice.actions;
export default cardsSlice.reducer;
