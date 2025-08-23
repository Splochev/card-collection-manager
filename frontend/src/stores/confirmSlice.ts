import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type ConfirmVariant = "warning" | "success" | "error" | "info";

export interface ConfirmState {
  open: boolean;
  id: string | null;
  title: string | null;
  message: string | null;
  variant: ConfirmVariant;
  confirmText: string;
  cancelText: string | null;
  dismissible: boolean;
  // store only a serializable key that references custom content kept outside the store
  customKey: string | null;
}

const initialState: ConfirmState = {
  open: false,
  id: null,
  title: null,
  message: null,
  variant: "warning",
  confirmText: "OK",
  cancelText: "Cancel",
  dismissible: true,
  customKey: null,
};

const confirmSlice = createSlice({
  name: "confirm",
  initialState,
  reducers: {
    showConfirm: (
      state,
      action: PayloadAction<Partial<ConfirmState> & { id: string }>
    ) => {
      const payload = action.payload;
      state.open = true;
      state.id = payload.id;
      state.title = payload.title ?? null;
      state.message = payload.message ?? null;
      state.variant = payload.variant ?? "warning";
      state.confirmText = payload.confirmText ?? "OK";
      state.cancelText = payload.cancelText ?? "Cancel";
      state.dismissible = payload.dismissible ?? true;
      state.customKey = payload.customKey ?? null; // Update to use customKey
      // defensive: remove any leftover non-serializable `custom` field if present
      try {
        if ((state as any).custom) delete (state as any).custom;
      } catch (e) {
        void e;
      }
    },
    closeConfirm: (state) => {
      state.open = false;
      state.id = null;
      state.title = null;
      state.message = null;
      state.customKey = null; // Update to reset customKey
      // also defensively remove leftover custom
      try {
        if ((state as any).custom) delete (state as any).custom;
      } catch (e) {
        void e;
      }
    },
  },
});

export const { showConfirm, closeConfirm } = confirmSlice.actions;
export default confirmSlice.reducer;
