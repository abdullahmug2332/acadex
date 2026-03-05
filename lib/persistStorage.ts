// lib/persistStorage.ts
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

// Check if running on server
const isServer = typeof window === 'undefined';

export const persistStorage = isServer
  ? {
      getItem: async () => null,
      setItem: async () => {},
      removeItem: async () => {},
    }
  : storage;