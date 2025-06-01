import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { completeReadingSession } from '../store/slices/readingSlice';
import { Bell, Coffee } from 'lucide-react';

const ReadingReminder: React.FC = () => {
  const dispatch = useDispatch();
  const { currentSession, settings } = useSelector((state: RootState) => state.reading);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isBreak, setIsBreak] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (!currentSession) {
      setTimeLeft(0);
      setIsBreak(false);
      return;
    }

    const startTime = new Date(currentSession.startTime).getTime();
    const sessionDuration = currentSession.duration * 60 * 1000; // Convert to milliseconds
    const breakInterval = settings.breakInterval * 60 * 1000;
    
    const timer = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTime;
      const remaining = sessionDuration - elapsed;

      if (remaining <= 0) {
        clearInterval(timer);
        setTimeLeft(0);
        dispatch(completeReadingSession({ pagesRead: 0 }));
        return;
      }

      setTimeLeft(Math.floor(remaining / 1000));

      // Check if it's time for a break
      if (settings.autoStartBreaks && elapsed % breakInterval < 1000) {
        setIsBreak(true);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 5000);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentSession, settings, dispatch]);

  if (!currentSession || !showNotification) return null;

  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
      isBreak ? 'bg-secondary' : 'bg-primary'
    } text-white max-w-sm animate-slide-in`}>
      <div className="flex items-center space-x-3">
        {isBreak ? (
          <Coffee className="w-6 h-6" />
        ) : (
          <Bell className="w-6 h-6" />
        )}
        <div>
          <h3 className="font-semibold">
            {isBreak ? 'Time for a Break!' : 'Reading Session'}
          </h3>
          <p className="text-sm">
            {isBreak
              ? `Take a ${settings.breakDuration} minute break to rest your eyes`
              : `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')} remaining`}
          </p>
        </div>
      </div>
      <button
        onClick={() => setShowNotification(false)}
        className="absolute top-2 right-2 text-white/80 hover:text-white"
      >
        ×
      </button>
    </div>
  );
};

export default ReadingReminder; 