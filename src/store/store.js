import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./slice/userSlice";
import { teamSlice } from "./slice/teamSlice";

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    team: teamSlice.reducer
  },
  devTools: process.env.NODE_ENV !== 'production',  // Assicurati che sia abilitato durante lo sviluppo
});


