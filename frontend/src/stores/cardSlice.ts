import { createSlice } from "@reduxjs/toolkit";

const cardsSlice = createSlice({
  name: "cards",
  initialState: { selectedCardNumber: null as string | null },
  reducers: {
    setSelectedCardNumber: (state, action) => {
      // Only allow string or null, never an object or array
      if (typeof action.payload === 'string' || action.payload === null) {
        state.selectedCardNumber = action.payload;
      } else if (typeof action.payload === 'number') {
        state.selectedCardNumber = String(action.payload);
      } else {
        state.selectedCardNumber = null;
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

export const { setSelectedCardNumber } = cardsSlice.actions;
export default cardsSlice.reducer;
