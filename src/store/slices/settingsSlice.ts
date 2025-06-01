import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'lg'; // English or Luganda
  notifications: {
    enabled: boolean;
    sound: boolean;
    vibration: boolean;
  };
  accessibility: {
    fontSize: number;
    highContrast: boolean;
    reducedMotion: boolean;
  };
  reading: {
    defaultSessionDuration: number; // in minutes
    breakInterval: number; // in minutes
    breakDuration: number; // in minutes
    autoStartBreaks: boolean;
    notificationsEnabled: boolean;
    preferredFormat: 'epub' | 'pdf' | 'article' | null;
  };
}

const initialState: SettingsState = {
  theme: 'system',
  language: 'en',
  notifications: {
    enabled: true,
    sound: true,
    vibration: true,
  },
  accessibility: {
    fontSize: 16,
    highContrast: false,
    reducedMotion: false,
  },
  reading: {
    defaultSessionDuration: 30,
    breakInterval: 25,
    breakDuration: 5,
    autoStartBreaks: true,
    notificationsEnabled: true,
    preferredFormat: null,
  },
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<SettingsState['theme']>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<SettingsState['language']>) => {
      state.language = action.payload;
    },
    updateNotifications: (state, action: PayloadAction<Partial<SettingsState['notifications']>>) => {
      state.notifications = { ...state.notifications, ...action.payload };
    },
    updateAccessibility: (state, action: PayloadAction<Partial<SettingsState['accessibility']>>) => {
      state.accessibility = { ...state.accessibility, ...action.payload };
    },
    updateReadingSettings: (state, action: PayloadAction<Partial<SettingsState['reading']>>) => {
      state.reading = { ...state.reading, ...action.payload };
    },
  },
});

export const {
  setTheme,
  setLanguage,
  updateNotifications,
  updateAccessibility,
  updateReadingSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer; 