import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Book {
  id: string;
  title: string;
  author: string;
  format: 'epub' | 'pdf' | 'article';
  totalPages: number;
  currentPage: number;
  isLocal: boolean;
  language: string;
  coverUrl?: string;
  description?: string;
  lastRead?: Date;
  readingTime: number; // in minutes
  bookmarkedPages: number[];
  notes: Array<{
    id: string;
    page: number;
    content: string;
    createdAt: Date;
  }>;
}

interface ReadingSession {
  id: string;
  bookId: string;
  startTime: Date;
  endTime?: Date;
  pagesRead: number;
  duration: number; // in minutes
  completed: boolean;
}

interface ReadingGoal {
  id: string;
  type: 'pages' | 'books' | 'time';
  target: number;
  current: number;
  deadline: Date;
  completed: boolean;
}

interface ReadingState {
  library: Book[];
  localRecommendations: Book[];
  currentSession: ReadingSession | null;
  goals: ReadingGoal[];
  settings: {
    defaultSessionDuration: number; // in minutes
    breakInterval: number; // in minutes
    breakDuration: number; // in minutes
    autoStartBreaks: boolean;
    notificationsEnabled: boolean;
  };
}

const initialState: ReadingState = {
  library: [
    {
      id: '1',
      title: 'Kintu',
      author: 'Jennifer Nansubuga Makumbi',
      format: 'epub',
      totalPages: 446,
      currentPage: 0,
      isLocal: true,
      language: 'English',
      description: 'A modern classic of Ugandan literature that weaves together the threads of ancient history and modern life.',
      readingTime: 0,
      bookmarkedPages: [],
      notes: [],
    },
    {
      id: '2',
      title: 'Tropical Fish: Tales from Entebbe',
      author: 'Doreen Baingana',
      format: 'pdf',
      totalPages: 128,
      currentPage: 0,
      isLocal: true,
      language: 'English',
      description: 'A collection of linked short stories that explore the coming of age of three African sisters.',
      readingTime: 0,
      bookmarkedPages: [],
      notes: [],
    },
  ],
  localRecommendations: [
    {
      id: '3',
      title: 'The First Woman',
      author: 'Jennifer Nansubuga Makumbi',
      format: 'epub',
      totalPages: 420,
      currentPage: 0,
      isLocal: true,
      language: 'English',
      description: 'A powerful feminist rendition of Ugandan origin tales, The First Woman tells the story of Kirabo.',
      readingTime: 0,
      bookmarkedPages: [],
      notes: [],
    },
  ],
  currentSession: null,
  goals: [],
  settings: {
    defaultSessionDuration: 30,
    breakInterval: 25,
    breakDuration: 5,
    autoStartBreaks: true,
    notificationsEnabled: true,
  },
};

const readingSlice = createSlice({
  name: 'reading',
  initialState,
  reducers: {
    addBook: (state, action: PayloadAction<Book>) => {
      state.library.push(action.payload);
    },
    removeBook: (state, action: PayloadAction<string>) => {
      state.library = state.library.filter(book => book.id !== action.payload);
    },
    updateReadingProgress: (state, action: PayloadAction<{ bookId: string; page: number }>) => {
      const book = state.library.find(b => b.id === action.payload.bookId);
      if (book) {
        book.currentPage = Math.min(Math.max(0, action.payload.page), book.totalPages);
        book.lastRead = new Date();
      }
    },
    startReadingSession: (state, action: PayloadAction<{ bookId: string; duration: number }>) => {
      state.currentSession = {
        id: Date.now().toString(),
        bookId: action.payload.bookId,
        startTime: new Date(),
        duration: action.payload.duration,
        pagesRead: 0,
        completed: false,
      };
    },
    completeReadingSession: (state, action: PayloadAction<{ pagesRead: number }>) => {
      if (state.currentSession) {
        state.currentSession.completed = true;
        state.currentSession.endTime = new Date();
        state.currentSession.pagesRead = action.payload.pagesRead;
        
        const book = state.library.find(b => b.id === state.currentSession?.bookId);
        if (book) {
          book.readingTime += state.currentSession.duration;
        }
      }
    },
    cancelReadingSession: (state) => {
      state.currentSession = null;
    },
    addBookmark: (state, action: PayloadAction<{ bookId: string; page: number }>) => {
      const book = state.library.find(b => b.id === action.payload.bookId);
      if (book && !book.bookmarkedPages.includes(action.payload.page)) {
        book.bookmarkedPages.push(action.payload.page);
      }
    },
    removeBookmark: (state, action: PayloadAction<{ bookId: string; page: number }>) => {
      const book = state.library.find(b => b.id === action.payload.bookId);
      if (book) {
        book.bookmarkedPages = book.bookmarkedPages.filter(p => p !== action.payload.page);
      }
    },
    addNote: (state, action: PayloadAction<{ bookId: string; page: number; content: string }>) => {
      const book = state.library.find(b => b.id === action.payload.bookId);
      if (book) {
        book.notes.push({
          id: Date.now().toString(),
          page: action.payload.page,
          content: action.payload.content,
          createdAt: new Date(),
        });
      }
    },
    removeNote: (state, action: PayloadAction<{ bookId: string; noteId: string }>) => {
      const book = state.library.find(b => b.id === action.payload.bookId);
      if (book) {
        book.notes = book.notes.filter(note => note.id !== action.payload.noteId);
      }
    },
    addGoal: (state, action: PayloadAction<{ type: 'pages' | 'books' | 'time'; target: number; deadline: Date }>) => {
      state.goals.push({
        id: Date.now().toString(),
        ...action.payload,
        current: 0,
        completed: false,
      });
    },
    updateGoalProgress: (state, action: PayloadAction<{ goalId: string; progress: number }>) => {
      const goal = state.goals.find(g => g.id === action.payload.goalId);
      if (goal) {
        goal.current = action.payload.progress;
        goal.completed = goal.current >= goal.target;
      }
    },
    removeGoal: (state, action: PayloadAction<string>) => {
      state.goals = state.goals.filter(goal => goal.id !== action.payload);
    },
    updateSettings: (state, action: PayloadAction<Partial<ReadingState['settings']>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
  },
});

export const {
  addBook,
  removeBook,
  updateReadingProgress,
  startReadingSession,
  completeReadingSession,
  cancelReadingSession,
  addBookmark,
  removeBookmark,
  addNote,
  removeNote,
  addGoal,
  updateGoalProgress,
  removeGoal,
  updateSettings,
} = readingSlice.actions;

export default readingSlice.reducer; 