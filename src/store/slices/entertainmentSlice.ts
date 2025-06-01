import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Platform = 'netflix' | 'youtube' | 'appletv' | 'local';

interface ContentItem {
  id: string;
  title: string;
  platform: Platform;
  duration: number; // in minutes
  completed: boolean;
  thumbnail?: string;
  description?: string;
  genre?: string;
  language?: string;
  isLocal?: boolean;
}

interface ViewingSession {
  contentId: string;
  startTime: string;
  endTime: string | null;
  duration: number;
  breaks: string[];
}

interface EntertainmentState {
  watchlist: ContentItem[];
  currentlyWatching: ContentItem | null;
  watchHistory: ViewingSession[];
  totalWatchTime: number; // in minutes
  lastBreak: string | null;
  nextBreakTime: string | null;
  platformPreferences: {
    [key in Platform]: {
      enabled: boolean;
      lastSync: string | null;
    };
  };
  recommendations: ContentItem[];
}

const initialState: EntertainmentState = {
  watchlist: [],
  currentlyWatching: null,
  watchHistory: [],
  totalWatchTime: 0,
  lastBreak: null,
  nextBreakTime: null,
  platformPreferences: {
    netflix: { enabled: false, lastSync: null },
    youtube: { enabled: false, lastSync: null },
    appletv: { enabled: false, lastSync: null },
    local: { enabled: true, lastSync: null },
  },
  recommendations: [],
};

const entertainmentSlice = createSlice({
  name: 'entertainment',
  initialState,
  reducers: {
    addToWatchlist: (state, action: PayloadAction<ContentItem>) => {
      if (!state.watchlist.some(item => item.id === action.payload.id)) {
        state.watchlist.push(action.payload);
      }
    },
    removeFromWatchlist: (state, action: PayloadAction<string>) => {
      state.watchlist = state.watchlist.filter(item => item.id !== action.payload);
    },
    startWatching: (state, action: PayloadAction<string>) => {
      const content = state.watchlist.find(item => item.id === action.payload);
      if (content) {
        state.currentlyWatching = content;
        state.nextBreakTime = new Date(Date.now() + 45 * 60 * 1000).toISOString(); // 45 minutes from now
        state.watchHistory.push({
          contentId: content.id,
          startTime: new Date().toISOString(),
          endTime: null,
          duration: 0,
          breaks: [],
        });
      }
    },
    pauseContent: (state) => {
      if (state.currentlyWatching) {
        const session = state.watchHistory.find(
          s => s.contentId === state.currentlyWatching?.id && !s.endTime
        );
        if (session) {
          session.breaks.push(new Date().toISOString());
        }
      }
    },
    resumeContent: (state) => {
      state.nextBreakTime = new Date(Date.now() + 45 * 60 * 1000).toISOString();
    },
    completeContent: (state, action: PayloadAction<string>) => {
      const session = state.watchHistory.find(
        s => s.contentId === action.payload && !s.endTime
      );
      if (session) {
        session.endTime = new Date().toISOString();
        session.duration = Math.floor(
          (new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 60000
        );
        state.totalWatchTime += session.duration;
      }
      state.watchlist = state.watchlist.map(item =>
        item.id === action.payload ? { ...item, completed: true } : item
      );
      if (state.currentlyWatching?.id === action.payload) {
        state.currentlyWatching = null;
      }
    },
    setPlatformPreference: (
      state,
      action: PayloadAction<{ platform: Platform; enabled: boolean }>
    ) => {
      state.platformPreferences[action.payload.platform] = {
        enabled: action.payload.enabled,
        lastSync: action.payload.enabled ? new Date().toISOString() : null,
      };
    },
    addRecommendations: (state, action: PayloadAction<ContentItem[]>) => {
      state.recommendations = [
        ...state.recommendations,
        ...action.payload.filter(
          item => !state.recommendations.some(rec => rec.id === item.id)
        ),
      ];
    },
    clearRecommendations: (state) => {
      state.recommendations = [];
    },
    reorderWatchlist: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const [removed] = state.watchlist.splice(fromIndex, 1);
      state.watchlist.splice(toIndex, 0, removed);
    },
  },
});

export const {
  addToWatchlist,
  removeFromWatchlist,
  startWatching,
  pauseContent,
  resumeContent,
  completeContent,
  setPlatformPreference,
  addRecommendations,
  clearRecommendations,
  reorderWatchlist,
} = entertainmentSlice.actions;

export default entertainmentSlice.reducer; 