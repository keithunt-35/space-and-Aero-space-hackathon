import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import { useSelector, useDispatch } from 'react-redux';
import { store } from './store';
import type { RootState } from './store';
import { setFlightDuration, setFlightPhase, selectFlightRoute, resetFlight } from './store/slices/flightSlice';
import { Plane, Film, Heart, Timer, Book, Settings as SettingsIcon, Target, X, Upload } from 'lucide-react';
import {
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
} from './store/slices/readingSlice';
import ReadingReminder from './components/ReadingReminder';
import FileUpload from './components/FileUpload';
import ReadingSettings from './components/ReadingSettings';
import { setPlatformPreference, Platform } from './store/slices/entertainmentSlice';
import { startWatching, pauseContent, resumeContent, completeContent } from './store/slices/entertainmentSlice';
import { addToWatchlist } from './store/slices/entertainmentSlice';
import { addWaterIntake, recordMovement, takeBreak } from './store/slices/wellnessSlice';
import { completeExercise } from './store/slices/wellnessSlice';
import { addTimeBlock, updateTimeBlock, removeTimeBlock, TimeBlock } from './store/slices/productivitySlice';
import { startPomodoroSession, pauseSession, completePomodoroSession } from './store/slices/productivitySlice';
import { recordDistraction } from './store/slices/productivitySlice';
import { NetflixLogo, AppleTVLogo, YouTubeLogo, LocalContentLogo } from './assets/logos';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-dark">
    <nav className="bg-dark-card border-b border-dark-border">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-white">Flight Wellness Companion</h1>
        <div className="flex space-x-4">
          <Link to="/" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
            <Plane size={20} />
            <span>Dashboard</span>
          </Link>
          <Link to="/entertainment" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
            <Film size={20} />
            <span>Entertainment</span>
          </Link>
          <Link to="/wellness" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
            <Heart size={20} />
            <span>Wellness</span>
          </Link>
          <Link to="/productivity" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
            <Timer size={20} />
            <span>Productivity</span>
          </Link>
          <Link to="/reading" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
            <Book size={20} />
            <span>Reading</span>
          </Link>
          <Link to="/settings" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
            <SettingsIcon size={20} />
            <span>Settings</span>
          </Link>
        </div>
      </div>
    </nav>
    <div className="bg-sky-pattern">
      <img src="/images/clouds.svg" className="absolute w-32 h-32 animate-float-clouds opacity-20" style={{ top: '15%', left: '10%' }} />
      <img src="/images/clouds.svg" className="absolute w-24 h-24 animate-float-clouds opacity-20" style={{ top: '35%', right: '15%', animationDelay: '1s' }} />
      <img src="/images/clouds.svg" className="absolute w-28 h-28 animate-float-clouds opacity-20" style={{ top: '55%', left: '30%', animationDelay: '2s' }} />
      <img src="/images/airplane1.svg" className="absolute w-40 h-40 animate-float-plane1 opacity-30" style={{ top: '25%', left: '20%' }} />
      <img src="/images/airplane2.svg" className="absolute w-36 h-36 animate-float-plane2 opacity-30" style={{ top: '45%', right: '25%', animationDelay: '1.5s' }} />
    </div>
    <main className="container mx-auto p-4 relative z-10">
      {children}
    </main>
    <ReadingReminder />
  </div>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { duration, phase, selectedRoute, availableRoutes } = useSelector((state: RootState) => state.flight);
  const [showRouteDetails, setShowRouteDetails] = React.useState<string | null>(null);

  const startFlight = () => {
    if (selectedRoute) {
      dispatch(setFlightPhase('takeoff'));
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Flight Status</h2>
      
      {/* Flight Routes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {availableRoutes.map((route) => (
          <div
            key={route.id}
            className={`bg-dark-card p-6 rounded-lg shadow-lg border-2 transition-all cursor-pointer ${
              selectedRoute?.id === route.id
                ? 'border-primary'
                : 'border-dark-border hover:border-primary/50'
            }`}
            onClick={() => {
              dispatch(selectFlightRoute(route.id));
              setShowRouteDetails(route.id);
            }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-white">{route.name}</h3>
                <p className="text-gray-400 mt-1">{formatDuration(route.duration)}</p>
              </div>
              <div className="flex items-center space-x-2">
                {selectedRoute?.id === route.id && phase === 'not_started' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startFlight();
                    }}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Start Flight
                  </button>
                )}
              </div>
            </div>

            {showRouteDetails === route.id && (
              <div className="mt-4 space-y-3 animate-slide-in">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <p className="text-gray-300">{route.from}</p>
                </div>
                <div className="border-l-2 border-dark-border h-6 ml-1.5"></div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <p className="text-gray-300">{route.to}</p>
                </div>
                {route.description && (
                  <p className="text-gray-400 mt-2 text-sm">{route.description}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Active Flight Status */}
      {phase !== 'not_started' && selectedRoute && (
        <div className="bg-dark-card p-6 rounded-lg shadow-lg border border-dark-border">
          <h3 className="text-xl font-semibold text-white mb-4">Active Flight Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-400">Route</p>
              <p className="text-white font-medium">{selectedRoute.name}</p>
            </div>
            <div>
              <p className="text-gray-400">Phase</p>
              <p className="text-white font-medium capitalize">{phase}</p>
            </div>
            <div>
              <p className="text-gray-400">Time Remaining</p>
              <p className="text-white font-medium">{formatDuration(duration)}</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="h-2 bg-dark-border rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{
                  width: `${Math.round(
                    ((selectedRoute.duration - duration) / selectedRoute.duration) * 100
                  )}%`,
                }}
              ></div>
            </div>
          </div>

          {phase !== 'completed' && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => dispatch(resetFlight())}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Cancel Flight
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Entertainment = () => {
  const dispatch = useDispatch();
  const entertainment = useSelector((state: RootState) => state.entertainment);
  const [selectedContent, setSelectedContent] = React.useState<string | null>(null);

  const getPlatformLogo = (platform: Platform) => {
    switch (platform) {
      case 'netflix':
        return <NetflixLogo />;
      case 'appletv':
        return <AppleTVLogo />;
      case 'youtube':
        return <YouTubeLogo />;
      case 'local':
        return <LocalContentLogo />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Entertainment Hub</h2>
        <div className="flex space-x-4">
          {Object.entries(entertainment.platformPreferences).map(([platform, prefs]) => (
            <button
              key={platform}
              onClick={() => dispatch(setPlatformPreference({ platform: platform as Platform, enabled: !prefs.enabled }))}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                prefs.enabled ? 'bg-dark-card text-white' : 'bg-dark-lighter text-gray-400'
              } hover:bg-dark-card transition-colors`}
            >
              {getPlatformLogo(platform as Platform)}
            </button>
          ))}
        </div>
      </div>

      {/* Watchlist */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">My Watchlist</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {entertainment.watchlist.map((content) => (
            <div
              key={content.id}
              className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow ${
                selectedContent === content.id ? 'border-primary' : 'border-gray-200'
              }`}
              onClick={() => setSelectedContent(content.id)}
            >
              {content.thumbnail && (
                <img
                  src={content.thumbnail}
                  alt={content.title}
                  className="w-full h-40 object-cover rounded mb-3"
                />
              )}
              <h4 className="font-medium">{content.title}</h4>
              <p className="text-sm text-gray-600">{content.platform}</p>
              <p className="text-sm text-gray-500 mt-1">{content.description}</p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-sm">{content.duration} min</span>
                {content.completed ? (
                  <span className="text-green-500">Completed</span>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(startWatching(content.id));
                    }}
                    className="px-3 py-1 bg-primary text-white rounded hover:bg-primary-dark"
                  >
                    Watch
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Currently Watching */}
      {entertainment.currentlyWatching && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Now Playing</h3>
          <div className="flex items-start space-x-4">
            {entertainment.currentlyWatching.thumbnail && (
              <img
                src={entertainment.currentlyWatching.thumbnail}
                alt={entertainment.currentlyWatching.title}
                className="w-48 h-32 object-cover rounded"
              />
            )}
            <div className="flex-1">
              <h4 className="font-medium">{entertainment.currentlyWatching.title}</h4>
              <p className="text-sm text-gray-600">{entertainment.currentlyWatching.platform}</p>
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={() => dispatch(pauseContent())}
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Pause
                </button>
                <button
                  onClick={() => dispatch(resumeContent())}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Resume
                </button>
                <button
                  onClick={() => dispatch(completeContent(entertainment.currentlyWatching!.id))}
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
                >
                  Complete
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Next Break:</p>
              <p className="text-sm text-gray-600">
                {entertainment.nextBreakTime
                  ? new Date(entertainment.nextBreakTime).toLocaleTimeString()
                  : 'Not set'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Recommended for You</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {entertainment.recommendations.map((content) => (
            <div key={content.id} className="p-4 rounded-lg border hover:shadow-md transition-shadow">
              {content.thumbnail && (
                <img
                  src={content.thumbnail}
                  alt={content.title}
                  className="w-full h-40 object-cover rounded mb-3"
                />
              )}
              <h4 className="font-medium">{content.title}</h4>
              <p className="text-sm text-gray-600">{content.platform}</p>
              <p className="text-sm text-gray-500 mt-1">{content.description}</p>
              <button
                onClick={() => dispatch(addToWatchlist(content))}
                className="mt-3 px-3 py-1 bg-primary text-white rounded hover:bg-primary-dark w-full"
              >
                Add to Watchlist
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Watch History */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Watch History</h3>
        <div className="space-y-3">
          {entertainment.watchHistory.map((session) => {
            const content = [...entertainment.watchlist, ...entertainment.recommendations].find(
              (c) => c.id === session.contentId
            );
            if (!content) return null;

            return (
              <div key={session.startTime} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <h4 className="font-medium">{content.title}</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(session.startTime).toLocaleDateString()} -{' '}
                    {session.endTime ? new Date(session.endTime).toLocaleTimeString() : 'In Progress'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{session.duration} minutes</p>
                  <p className="text-sm text-gray-600">{session.breaks.length} breaks taken</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Wellness = () => {
  const dispatch = useDispatch();
  const wellness = useSelector((state: RootState) => state.wellness);
  const [showAddWater, setShowAddWater] = React.useState(false);
  const [waterAmount, setWaterAmount] = React.useState(250); // Default 250ml

  const formatTime = (isoString: string | null) => {
    if (!isoString) return 'Never';
    return new Date(isoString).toLocaleTimeString();
  };

  const exercises = [
    { id: 'stretch', name: 'Stretching', duration: '5 min' },
    { id: 'walk', name: 'Walk Around', duration: '2 min' },
    { id: 'eyes', name: 'Eye Exercise', duration: '1 min' },
    { id: 'neck', name: 'Neck Rotation', duration: '2 min' },
    { id: 'shoulders', name: 'Shoulder Rolls', duration: '2 min' },
    { id: 'breathing', name: 'Deep Breathing', duration: '3 min' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Wellness Center</h2>

      {/* Water Intake Tracking */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Water Intake</h3>
          <button
            onClick={() => setShowAddWater(!showAddWater)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            Add Water
          </button>
        </div>

        {showAddWater && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <input
                type="number"
                value={waterAmount}
                onChange={(e) => setWaterAmount(parseInt(e.target.value))}
                className="px-3 py-2 border rounded-lg w-24"
                min={50}
                step={50}
              />
              <span className="text-gray-600">ml</span>
              <button
                onClick={() => {
                  dispatch(addWaterIntake(waterAmount));
                  setShowAddWater(false);
                }}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
              >
                Add
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span>Total Today:</span>
            <span className="font-medium">{wellness.waterIntake} ml</span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Last Intake:</span>
            <span>{formatTime(wellness.lastWaterIntake)}</span>
          </div>
        </div>
      </div>

      {/* Movement Tracking */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Movement</h3>
          <button
            onClick={() => dispatch(recordMovement())}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            Record Movement
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span>Movement Streak:</span>
            <span className="font-medium">{wellness.movementStreak} times</span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Last Movement:</span>
            <span>{formatTime(wellness.lastMovement)}</span>
          </div>
        </div>
      </div>

      {/* Screen Time & Breaks */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Screen Time</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span>Total Screen Time:</span>
            <span className="font-medium">{Math.round(wellness.screenTime / 60)} hours</span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Last Break:</span>
            <span>{formatTime(wellness.lastBreak)}</span>
          </div>
          <button
            onClick={() => dispatch(takeBreak())}
            className="w-full mt-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            Take a Break
          </button>
        </div>
      </div>

      {/* Exercises */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Flight Exercises</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exercises.map((exercise) => {
            const isCompleted = wellness.exercisesCompleted.includes(exercise.id);
            return (
              <div
                key={exercise.id}
                className={`p-4 rounded-lg border ${
                  isCompleted ? 'bg-green-50 border-green-200' : 'border-gray-200'
                }`}
              >
                <h4 className="font-medium">{exercise.name}</h4>
                <p className="text-sm text-gray-600">{exercise.duration}</p>
                <button
                  onClick={() => dispatch(completeExercise(exercise.id))}
                  className={`mt-3 px-3 py-1 rounded w-full ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-primary text-white hover:bg-primary-dark'
                  }`}
                  disabled={isCompleted}
                >
                  {isCompleted ? 'Completed' : 'Start Exercise'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Productivity = () => {
  const dispatch = useDispatch();
  const productivity = useSelector((state: RootState) => state.productivity);
  const [showAddTimeBlock, setShowAddTimeBlock] = React.useState(false);
  const [newTimeBlock, setNewTimeBlock] = React.useState({
    title: '',
    duration: 30,
    category: 'work' as TimeBlock['category'],
  });

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Productivity Zone</h2>

      {/* Pomodoro Timer */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Pomodoro Timer</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Current Session</p>
              <p className="font-medium">
                {productivity.currentSession
                  ? `${productivity.currentSession.isBreak ? 'Break' : 'Focus'} - ${formatDuration(
                      productivity.currentSession.duration
                    )}`
                  : 'No active session'}
              </p>
            </div>
            <div className="flex space-x-3">
              {productivity.isActive ? (
                <>
                  <button
                    onClick={() => dispatch(pauseSession())}
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Pause
                  </button>
                  <button
                    onClick={() => dispatch(completePomodoroSession())}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Complete
                  </button>
                </>
              ) : (
                <button
                  onClick={() => dispatch(startPomodoroSession())}
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
                >
                  Start Session
                </button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Sessions Completed</p>
              <p className="text-xl font-medium">
                {productivity.currentSession?.sessionsCompleted || 0}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Total Focus Time</p>
              <p className="text-xl font-medium">{formatDuration(productivity.totalFocusTime)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Time Blocking */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Time Blocks</h3>
          <button
            onClick={() => setShowAddTimeBlock(!showAddTimeBlock)}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
          >
            Add Block
          </button>
        </div>

        {showAddTimeBlock && (
          <div className="mb-4 p-4 bg-gray-50 rounded">
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Block Title"
                value={newTimeBlock.title}
                onChange={(e) => setNewTimeBlock({ ...newTimeBlock, title: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              />
              <div className="flex space-x-3">
                <input
                  type="number"
                  value={newTimeBlock.duration}
                  onChange={(e) =>
                    setNewTimeBlock({ ...newTimeBlock, duration: parseInt(e.target.value) })
                  }
                  className="w-24 px-3 py-2 border rounded"
                  min={5}
                  step={5}
                />
                <select
                  value={newTimeBlock.category}
                  onChange={(e) =>
                    setNewTimeBlock({
                      ...newTimeBlock,
                      category: e.target.value as TimeBlock['category'],
                    })
                  }
                  className="flex-1 px-3 py-2 border rounded"
                >
                  <option value="work">Work</option>
                  <option value="reading">Reading</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="wellness">Wellness</option>
                </select>
              </div>
              <button
                onClick={() => {
                  if (newTimeBlock.title) {
                    dispatch(
                      addTimeBlock({
                        title: newTimeBlock.title,
                        duration: newTimeBlock.duration,
                        category: newTimeBlock.category,
                        startTime: new Date(),
                      })
                    );
                    setShowAddTimeBlock(false);
                    setNewTimeBlock({
                      title: '',
                      duration: 30,
                      category: 'work',
                    });
                  }
                }}
                className="w-full px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
              >
                Add Block
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {productivity.timeBlocks.map((block) => (
            <div
              key={block.id}
              className={`p-4 rounded border-l-4 ${
                block.completed
                  ? 'bg-green-50 border-green-500'
                  : 'bg-gray-50 border-primary'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{block.title}</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(block.startTime).toLocaleTimeString()} -{' '}
                    {formatDuration(block.duration)}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      dispatch(
                        updateTimeBlock({
                          id: block.id,
                          updates: { completed: !block.completed },
                        })
                      )
                    }
                    className={`px-3 py-1 rounded ${
                      block.completed
                        ? 'bg-green-500 text-white'
                        : 'bg-primary text-white hover:bg-primary-dark'
                    }`}
                  >
                    {block.completed ? 'Completed' : 'Complete'}
                  </button>
                  <button
                    onClick={() => dispatch(removeTimeBlock(block.id))}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Focus Sessions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Focus Sessions</h3>
        <div className="space-y-3">
          {productivity.focusSessions.map((session) => (
            <div
              key={session.id}
              className={`p-4 rounded ${
                session.completed ? 'bg-green-50' : 'bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium capitalize">{session.type} Session</p>
                  <p className="text-sm text-gray-600">
                    {new Date(session.startTime).toLocaleString()} -{' '}
                    {formatDuration(session.duration)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    Distractions: {session.distractionCount}
                  </p>
                  {!session.completed && (
                    <button
                      onClick={() => dispatch(recordDistraction(session.id))}
                      className="text-sm text-primary hover:text-primary-dark"
                    >
                      Record Distraction
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Goals */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Productivity Goals</h3>
        <div className="space-y-3">
          {productivity.goals.map((goal) => (
            <div
              key={goal.id}
              className={`p-4 rounded ${
                goal.completed ? 'bg-green-50' : 'bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{goal.title}</h4>
                  <p className="text-sm text-gray-600">
                    Due: {new Date(goal.deadline).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {goal.currentValue} / {goal.targetValue} {goal.unit}
                  </p>
                  <button
                    onClick={() => dispatch(removeGoal(goal.id))}
                    className="text-sm text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{
                    width: `${Math.min(
                      (goal.currentValue / goal.targetValue) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Reading = () => {
  const dispatch = useDispatch();
  const reading = useSelector((state: RootState) => state.reading);
  const [selectedBook, setSelectedBook] = React.useState<string | null>(null);
  const [noteContent, setNoteContent] = React.useState('');
  const [newGoal, setNewGoal] = React.useState({
    type: 'pages' as const,
    target: 0,
    deadline: new Date(),
  });
  const [showUpload, setShowUpload] = React.useState(false);

  const allBooks = [...reading.library, ...reading.localRecommendations];
  const selectedBookData = allBooks.find(book => book.id === selectedBook);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-UG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Library Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-accent">Digital Library</h2>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark flex items-center space-x-2"
        >
          <Upload className="w-4 h-4" />
          <span>Add Book</span>
        </button>
      </div>

      {/* File Upload */}
      {showUpload && (
        <div className="bg-white rounded-lg shadow p-6">
          <FileUpload />
        </div>
      )}

      {/* Library Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Library */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">My Library</h3>
          <div className="space-y-4">
            {reading.library.map((book) => (
              <div
                key={book.id}
                className={`p-4 rounded-lg border-l-4 border-primary cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedBook === book.id ? 'bg-primary/5' : ''
                }`}
                onClick={() => setSelectedBook(book.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{book.title}</h4>
                    <p className="text-sm text-gray-600">{book.author}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                        {book.format.toUpperCase()}
                      </span>
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                        {book.language}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {Math.round((book.currentPage / book.totalPages) * 100)}%
                    </p>
                    <p className="text-xs text-gray-600">
                      {book.currentPage} / {book.totalPages} pages
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Local Recommendations */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Local Literature</h3>
          <div className="space-y-4">
            {reading.localRecommendations.map((book) => (
              <div
                key={book.id}
                className={`p-4 rounded-lg border-l-4 border-secondary cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedBook === book.id ? 'bg-secondary/5' : ''
                }`}
                onClick={() => setSelectedBook(book.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{book.title}</h4>
                    <p className="text-sm text-gray-600">{book.author}</p>
                    <p className="text-sm text-gray-500 mt-1">{book.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs bg-secondary text-white px-2 py-1 rounded">
                        Local Author
                      </span>
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                        {book.format.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Book Details */}
      {selectedBookData && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold">{selectedBookData.title}</h2>
              <p className="text-gray-600">{selectedBookData.author}</p>
              {selectedBookData.description && (
                <p className="text-gray-500 mt-2">{selectedBookData.description}</p>
              )}
            </div>
            {reading.currentSession?.bookId === selectedBookData.id ? (
              <div className="flex space-x-2">
                <button
                  onClick={() => dispatch(completeReadingSession({ pagesRead: 5 }))}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Complete Session
                </button>
                <button
                  onClick={() => dispatch(cancelReadingSession())}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => dispatch(startReadingSession({
                  bookId: selectedBookData.id,
                  duration: reading.settings.defaultSessionDuration,
                }))}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
              >
                Start Reading Session
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Progress Section */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Reading Progress</h3>
              <div className="space-y-4">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{
                      width: `${Math.round((selectedBookData.currentPage / selectedBookData.totalPages) * 100)}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Page {selectedBookData.currentPage}</span>
                  <span>{selectedBookData.totalPages - selectedBookData.currentPage} pages left</span>
                </div>
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => dispatch(addBookmark({
                      bookId: selectedBookData.id,
                      page: selectedBookData.currentPage,
                    }))}
                    className="text-sm text-primary hover:text-primary-dark"
                  >
                    Add Bookmark
                  </button>
                  <input
                    type="number"
                    min={0}
                    max={selectedBookData.totalPages}
                    value={selectedBookData.currentPage}
                    onChange={(e) => dispatch(updateReadingProgress({
                      bookId: selectedBookData.id,
                      page: parseInt(e.target.value),
                    }))}
                    className="w-20 px-2 py-1 border rounded"
                  />
                </div>
              </div>

              {/* Bookmarks */}
              <div className="mt-4">
                <h4 className="font-medium mb-2">Bookmarks</h4>
                <div className="space-y-2">
                  {selectedBookData.bookmarkedPages.map((page) => (
                    <div key={page} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                      <span>Page {page}</span>
                      <button
                        onClick={() => dispatch(removeBookmark({
                          bookId: selectedBookData.id,
                          page,
                        }))}
                        className="text-red-500 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Notes</h3>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Add a note..."
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg"
                  />
                  <button
                    onClick={() => {
                      if (noteContent.trim()) {
                        dispatch(addNote({
                          bookId: selectedBookData.id,
                          page: selectedBookData.currentPage,
                          content: noteContent,
                        }));
                        setNoteContent('');
                      }
                    }}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                  >
                    Add Note
                  </button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {selectedBookData.notes.map((note) => (
                    <div key={note.id} className="bg-gray-50 p-3 rounded">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm">{note.content}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Page {note.page} • {formatDate(note.createdAt)}
                          </p>
                        </div>
                        <button
                          onClick={() => dispatch(removeNote({
                            bookId: selectedBookData.id,
                            noteId: note.id,
                          }))}
                          className="text-red-500 hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reading Goals */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-primary" />
          Reading Goals
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Add New Goal</h3>
            <div className="space-y-3">
              <select
                value={newGoal.type}
                onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value as any })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="pages">Pages</option>
                <option value="books">Books</option>
                <option value="time">Reading Time</option>
              </select>
              <input
                type="number"
                placeholder="Target value"
                value={newGoal.target}
                onChange={(e) => setNewGoal({ ...newGoal, target: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="date"
                value={newGoal.deadline.toISOString().split('T')[0]}
                onChange={(e) => setNewGoal({ ...newGoal, deadline: new Date(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <button
                onClick={() => {
                  if (newGoal.target > 0) {
                    dispatch(addGoal(newGoal));
                    setNewGoal({
                      type: 'pages',
                      target: 0,
                      deadline: new Date(),
                    });
                  }
                }}
                className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark"
              >
                Add Goal
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Active Goals</h3>
            <div className="space-y-3">
              {reading.goals.map((goal) => (
                <div
                  key={goal.id}
                  className={`p-3 rounded-lg bg-gray-50 border-l-4 ${
                    goal.completed ? 'border-green-500' : 'border-yellow-500'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {goal.target} {goal.type}
                      </p>
                      <p className="text-sm text-gray-600">
                        Due {formatDate(goal.deadline)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">
                        {goal.current} / {goal.target}
                      </span>
                      <button
                        onClick={() => dispatch(removeGoal(goal.id))}
                        className="text-red-500 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all"
                      style={{
                        width: `${Math.min((goal.current / goal.target) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Settings = () => {
  const [activeTab, setActiveTab] = React.useState('reading');

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>

      {/* Settings Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('reading')}
            className={`${
              activeTab === 'reading'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium`}
          >
            Reading
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`${
              activeTab === 'notifications'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium`}
          >
            Notifications
          </button>
          <button
            onClick={() => setActiveTab('accessibility')}
            className={`${
              activeTab === 'accessibility'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium`}
          >
            Accessibility
          </button>
        </nav>
      </div>

      {/* Settings Content */}
      <div className="mt-6">
        {activeTab === 'reading' && <ReadingSettings />}
        {activeTab === 'notifications' && (
          <div className="text-gray-500">Notification settings coming soon...</div>
        )}
        {activeTab === 'accessibility' && (
          <div className="text-gray-500">Accessibility settings coming soon...</div>
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/entertainment" element={<Entertainment />} />
            <Route path="/wellness" element={<Wellness />} />
            <Route path="/productivity" element={<Productivity />} />
            <Route path="/reading" element={<Reading />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
}

export default App; 