import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./slice/userSlice";

export const store = configureStore({
  reducer: {
    user: userSlice.reducer
  },
  devTools: process.env.NODE_ENV !== 'production',  // Assicurati che sia abilitato durante lo sviluppo
});
