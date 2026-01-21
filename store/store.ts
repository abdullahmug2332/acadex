// store/store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // uses localStorage
import userReducer from "./userSlice";
import toggleReducer from "./toggleSlice";

// Persist config: persist only the "user" slice
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"], // only user slice will persist
};

const rootReducer = combineReducers({
  user: userReducer,
  toggle: toggleReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export persistor to use in _app or layout
export const persistor = persistStore(store);
