import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PomodoroSession {
  duration: number; // in minutes
  breakDuration: number; // in minutes
  sessionsCompleted: number;
  isBreak: boolean;
  startTime: Date | null;
  endTime: Date | null;
}

export interface TimeBlock {
  id: string;
  title: string;
  startTime: Date;
  duration: number; // in minutes
  category: 'work' | 'reading' | 'entertainment' | 'wellness';
  completed: boolean;
}

interface FocusSession {
  id: string;
  type: 'reading' | 'work';
  startTime: Date;
  duration: number; // in minutes
  distractionCount: number;
  completed: boolean;
}

interface ProductivityGoal {
  id: string;
  title: string;
  type: 'pages' | 'books' | 'time';
  targetValue: number;
  currentValue: number;
  deadline: Date;
  completed: boolean;
  unit: string;
}

interface ProductivityState {
  pomodoroPreferences: {
    defaultDuration: number;
    defaultBreakDuration: number;
    longBreakDuration: number;
    sessionsBeforeLongBreak: number;
  };
  currentSession: PomodoroSession | null;
  timeBlocks: TimeBlock[];
  focusSessions: FocusSession[];
  goals: ProductivityGoal[];
  totalFocusTime: number;
  isActive: boolean;
}

const initialState: ProductivityState = {
  pomodoroPreferences: {
    defaultDuration: 25,
    defaultBreakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4,
  },
  currentSession: null,
  timeBlocks: [],
  focusSessions: [],
  goals: [],
  totalFocusTime: 0,
  isActive: false,
};

const productivitySlice = createSlice({
  name: 'productivity',
  initialState,
  reducers: {
    // Pomodoro Actions
    updatePomodoroPreferences: (state, action: PayloadAction<Partial<ProductivityState['pomodoroPreferences']>>) => {
      state.pomodoroPreferences = {
        ...state.pomodoroPreferences,
        ...action.payload,
      };
    },
    startPomodoroSession: (state) => {
      const { defaultDuration, defaultBreakDuration } = state.pomodoroPreferences;
      state.currentSession = {
        duration: defaultDuration,
        breakDuration: defaultBreakDuration,
        sessionsCompleted: 0,
        isBreak: false,
        startTime: new Date(),
        endTime: new Date(Date.now() + defaultDuration * 60 * 1000),
      };
      state.isActive = true;
    },
    completePomodoroSession: (state) => {
      if (state.currentSession) {
        const sessionsCompleted = state.currentSession.sessionsCompleted + 1;
        const { sessionsBeforeLongBreak, longBreakDuration, defaultBreakDuration } = state.pomodoroPreferences;
        
        state.currentSession.sessionsCompleted = sessionsCompleted;
        state.currentSession.isBreak = true;
        state.currentSession.startTime = new Date();
        
        // Determine if it's time for a long break
        const breakDuration = sessionsCompleted % sessionsBeforeLongBreak === 0 
          ? longBreakDuration 
          : defaultBreakDuration;
        
        state.currentSession.breakDuration = breakDuration;
        state.currentSession.endTime = new Date(Date.now() + breakDuration * 60 * 1000);
        state.totalFocusTime += state.currentSession.duration;
      }
    },
    
    // Time Blocking Actions
    addTimeBlock: (state, action: PayloadAction<Omit<TimeBlock, 'id' | 'completed'>>) => {
      const id = Date.now().toString();
      state.timeBlocks.push({
        ...action.payload,
        id,
        completed: false,
      });
    },
    updateTimeBlock: (state, action: PayloadAction<{ id: string; updates: Partial<TimeBlock> }>) => {
      const block = state.timeBlocks.find(b => b.id === action.payload.id);
      if (block) {
        Object.assign(block, action.payload.updates);
      }
    },
    removeTimeBlock: (state, action: PayloadAction<string>) => {
      state.timeBlocks = state.timeBlocks.filter(block => block.id !== action.payload);
    },
    
    // Focus Session Actions
    startFocusSession: (state, action: PayloadAction<{ type: FocusSession['type']; duration: number }>) => {
      const id = Date.now().toString();
      state.focusSessions.push({
        id,
        type: action.payload.type,
        startTime: new Date(),
        duration: action.payload.duration,
        distractionCount: 0,
        completed: false,
      });
    },
    recordDistraction: (state, action: PayloadAction<string>) => {
      const session = state.focusSessions.find(s => s.id === action.payload);
      if (session) {
        session.distractionCount += 1;
      }
    },
    completeFocusSession: (state, action: PayloadAction<string>) => {
      const session = state.focusSessions.find(s => s.id === action.payload);
      if (session) {
        session.completed = true;
        state.totalFocusTime += session.duration;
      }
    },
    
    // Goal Actions
    addGoal: (state, action: PayloadAction<Omit<ProductivityGoal, 'id' | 'completed' | 'currentValue'>>) => {
      const newGoal: ProductivityGoal = {
        ...action.payload,
        id: Math.random().toString(36).substr(2, 9),
        completed: false,
        currentValue: 0,
      };
      state.goals.push(newGoal);
    },
    updateGoalProgress: (state, action: PayloadAction<{ id: string; value: number }>) => {
      const goal = state.goals.find(g => g.id === action.payload.id);
      if (goal) {
        goal.currentValue = action.payload.value;
        goal.completed = goal.currentValue >= goal.targetValue;
      }
    },
    removeGoal: (state, action: PayloadAction<string>) => {
      state.goals = state.goals.filter(goal => goal.id !== action.payload);
    },
    
    // General Actions
    pauseSession: (state) => {
      state.isActive = false;
    },
    resumeSession: (state) => {
      state.isActive = true;
    },
    resetProductivity: (state) => {
      state.goals = [];
      state.focusSessions = [];
      state.timeBlocks = [];
    },
  },
});

export const {
  updatePomodoroPreferences,
  startPomodoroSession,
  completePomodoroSession,
  addTimeBlock,
  updateTimeBlock,
  removeTimeBlock,
  startFocusSession,
  recordDistraction,
  completeFocusSession,
  addGoal,
  updateGoalProgress,
  removeGoal,
  pauseSession,
  resumeSession,
  resetProductivity,
} = productivitySlice.actions;

export default productivitySlice.reducer; 