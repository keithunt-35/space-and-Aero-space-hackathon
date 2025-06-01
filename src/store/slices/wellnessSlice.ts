import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WellnessState {
  waterIntake: number; // in ml
  lastWaterIntake: string | null;
  movementStreak: number;
  lastMovement: string | null;
  screenTime: number; // in minutes
  lastBreak: string | null;
  exercisesCompleted: string[];
}

const initialState: WellnessState = {
  waterIntake: 0,
  lastWaterIntake: null,
  movementStreak: 0,
  lastMovement: null,
  screenTime: 0,
  lastBreak: null,
  exercisesCompleted: [],
};

const wellnessSlice = createSlice({
  name: 'wellness',
  initialState,
  reducers: {
    addWaterIntake: (state, action: PayloadAction<number>) => {
      state.waterIntake += action.payload;
      state.lastWaterIntake = new Date().toISOString();
    },
    recordMovement: (state) => {
      state.movementStreak += 1;
      state.lastMovement = new Date().toISOString();
    },
    addScreenTime: (state, action: PayloadAction<number>) => {
      state.screenTime += action.payload;
    },
    takeBreak: (state) => {
      state.lastBreak = new Date().toISOString();
    },
    completeExercise: (state, action: PayloadAction<string>) => {
      if (!state.exercisesCompleted.includes(action.payload)) {
        state.exercisesCompleted.push(action.payload);
      }
    },
    resetWellnessMetrics: (state) => {
      return initialState;
    },
  },
});

export const {
  addWaterIntake,
  recordMovement,
  addScreenTime,
  takeBreak,
  completeExercise,
  resetWellnessMetrics,
} = wellnessSlice.actions;

export default wellnessSlice.reducer; 