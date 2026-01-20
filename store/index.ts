// store/index.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // uses localStorage
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import userReducer from "@/store/userSlice"; // your user slice

// 1️⃣ Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  // add more slices here if needed
});

// 2️⃣ Configure redux-persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"], // persist only the user slice
};

// 3️⃣ Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4️⃣ Create Redux store
export const store = configureStore({
  reducer: persistedReducer,
});

// 5️⃣ Create persistor
export const persistor = persistStore(store);

// 6️⃣ TypeScript types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 7️⃣ Typed hooks for convenience
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
