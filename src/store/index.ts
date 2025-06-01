import { configureStore } from '@reduxjs/toolkit';
import flightReducer from './slices/flightSlice';
import wellnessReducer from './slices/wellnessSlice';
import entertainmentReducer from './slices/entertainmentSlice';
import productivityReducer from './slices/productivitySlice';
import readingReducer from './slices/readingSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    flight: flightReducer,
    wellness: wellnessReducer,
    entertainment: entertainmentReducer,
    productivity: productivityReducer,
    reading: readingReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;