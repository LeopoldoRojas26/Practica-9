import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type AppContextType = {
  // Timer State
  timerTimeLeft: number;
  isTimerActive: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  addTimerTime: (seconds: number) => void;
  setTimerTime: (seconds: number) => void;

  // Workout State
  isWorkoutActive: boolean;
  workoutStartTime: Date | null;
  workoutName: string;
  startWorkout: (name: string) => void;
  endWorkout: () => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Timer State
  const [timerTimeLeft, setTimerTimeLeft] = useState(90);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Workout State
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [workoutStartTime, setWorkoutStartTime] = useState<Date | null>(null);
  const [workoutName, setWorkoutName] = useState('Día de Entrenamiento');

  // Timer Effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerActive && timerTimeLeft > 0) {
      interval = setInterval(() => {
        setTimerTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timerTimeLeft === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timerTimeLeft]);

  // Timer Actions
  const startTimer = () => setIsTimerActive(true);
  const pauseTimer = () => setIsTimerActive(false);
  const resetTimer = () => {
    setIsTimerActive(false);
    setTimerTimeLeft(90);
  };
  const addTimerTime = (seconds: number) => setTimerTimeLeft((t) => t + seconds);
  const setTimerTime = (seconds: number) => {
    setTimerTimeLeft(seconds);
    setIsTimerActive(false);
  };

  // Workout Actions
  const startWorkout = (name: string) => {
    setIsWorkoutActive(true);
    setWorkoutStartTime(new Date());
    setWorkoutName(name);
  };
  const endWorkout = () => {
    setIsWorkoutActive(false);
    setWorkoutStartTime(null);
  };

  return (
    <AppContext.Provider
      value={{
        timerTimeLeft,
        isTimerActive,
        startTimer,
        pauseTimer,
        resetTimer,
        addTimerTime,
        setTimerTime,
        isWorkoutActive,
        workoutStartTime,
        workoutName,
        startWorkout,
        endWorkout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
