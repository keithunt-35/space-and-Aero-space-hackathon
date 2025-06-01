import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type FlightPhase = 'not_started' | 'takeoff' | 'cruise' | 'landing' | 'completed';

export interface FlightRoute {
  id: string;
  name: string;
  from: string;
  to: string;
  duration: number; // in minutes
  description?: string;
}

interface FlightState {
  duration: number; // in minutes
  phase: FlightPhase;
  startTime: Date | null;
  endTime: Date | null;
  currentTimezone: string;
  destinationTimezone: string;
  selectedRoute: FlightRoute | null;
  availableRoutes: FlightRoute[];
}

const initialState: FlightState = {
  duration: 0,
  phase: 'not_started',
  startTime: null,
  endTime: null,
  currentTimezone: 'UTC',
  destinationTimezone: 'UTC',
  selectedRoute: null,
  availableRoutes: [
    {
      id: 'entebbe-nairobi',
      name: 'Entebbe to Nairobi',
      from: 'Entebbe International Airport',
      to: 'Jomo Kenyatta International Airport',
      duration: 60,
      description: 'Short regional flight with beautiful views of Lake Victoria',
    },
    {
      id: 'entebbe-dubai',
      name: 'Entebbe to Dubai',
      from: 'Entebbe International Airport',
      to: 'Dubai International Airport',
      duration: 300,
      description: 'Medium-haul flight over diverse landscapes',
    },
    {
      id: 'entebbe-london',
      name: 'Entebbe to London',
      from: 'Entebbe International Airport',
      to: 'London Heathrow Airport',
      duration: 480,
      description: 'Long-haul flight crossing multiple time zones',
    },
    {
      id: 'entebbe-johannesburg',
      name: 'Entebbe to Johannesburg',
      from: 'Entebbe International Airport',
      to: 'O.R. Tambo International Airport',
      duration: 240,
      description: 'Scenic flight over East and Southern Africa',
    },
  ],
};

const flightSlice = createSlice({
  name: 'flight',
  initialState,
  reducers: {
    setFlightDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    selectFlightRoute: (state, action: PayloadAction<string>) => {
      const route = state.availableRoutes.find(r => r.id === action.payload);
      if (route) {
        state.selectedRoute = route;
        state.duration = route.duration;
      }
    },
    setFlightPhase: (state, action: PayloadAction<FlightPhase>) => {
      state.phase = action.payload;
      if (action.payload === 'takeoff') {
        state.startTime = new Date();
        state.endTime = new Date(Date.now() + state.duration * 60 * 1000);
      } else if (action.payload === 'completed') {
        state.endTime = new Date();
      }
    },
    setTimezones: (state, action: PayloadAction<{ current: string; destination: string }>) => {
      state.currentTimezone = action.payload.current;
      state.destinationTimezone = action.payload.destination;
    },
    resetFlight: (state) => {
      return {
        ...initialState,
        availableRoutes: state.availableRoutes,
      };
    },
  },
});

export const {
  setFlightDuration,
  selectFlightRoute,
  setFlightPhase,
  setTimezones,
  resetFlight,
} = flightSlice.actions;

export default flightSlice.reducer;