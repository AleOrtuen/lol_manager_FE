import { configureStore, combineReducers } from "@reduxjs/toolkit";
// import storage from "redux-persist/lib/storage";
import storage from 'redux-persist/es/storage'; // ✅ versione compatibile con Vite
import { userSlice } from "./slice/userSlice";
import { teamSlice } from "./slice/teamSlice";
import { gameSlice } from "./slice/gameSlice";
import { loadingSlice } from "./slice/loadingSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';


// Combinazione dei reducer
const rootReducer = combineReducers({
  user: userSlice.reducer,
  team: teamSlice.reducer,
  game: gameSlice.reducer,
  loading: loadingSlice.reducer,
});

// Config persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "team", "game", "loading"], // solo questi slice verranno salvati
};

// Reducer persistente
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store Redux
export const store = configureStore({
  reducer: persistedReducer,
  devTools: import.meta.env.VITE_REDUX_DEVTOOLS === "true",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignora le action non serializzabili di redux-persist
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Persistor per il gate
export const persistor = persistStore(store);



