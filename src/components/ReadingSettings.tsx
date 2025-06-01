import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateReadingSettings } from '../store/slices/settingsSlice';
import { Clock, Bell, Book } from 'lucide-react';

const ReadingSettings: React.FC = () => {
  const dispatch = useDispatch();
  const readingSettings = useSelector((state: RootState) => state.settings.reading);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Book className="w-5 h-5 mr-2 text-primary" />
          Reading Settings
        </h2>

        <div className="space-y-4">
          {/* Session Duration */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Clock className="w-4 h-4 mr-2" />
              Default Session Duration (minutes)
            </label>
            <input
              type="number"
              min={5}
              max={120}
              value={readingSettings.defaultSessionDuration}
              onChange={(e) => dispatch(updateReadingSettings({
                defaultSessionDuration: parseInt(e.target.value),
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>

          {/* Break Interval */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Clock className="w-4 h-4 mr-2" />
              Break Interval (minutes)
            </label>
            <input
              type="number"
              min={5}
              max={60}
              value={readingSettings.breakInterval}
              onChange={(e) => dispatch(updateReadingSettings({
                breakInterval: parseInt(e.target.value),
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>

          {/* Break Duration */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Clock className="w-4 h-4 mr-2" />
              Break Duration (minutes)
            </label>
            <input
              type="number"
              min={1}
              max={30}
              value={readingSettings.breakDuration}
              onChange={(e) => dispatch(updateReadingSettings({
                breakDuration: parseInt(e.target.value),
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>

          {/* Auto Start Breaks */}
          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Bell className="w-4 h-4 mr-2" />
              Auto Start Breaks
            </label>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                checked={readingSettings.autoStartBreaks}
                onChange={(e) => dispatch(updateReadingSettings({
                  autoStartBreaks: e.target.checked,
                }))}
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
            </div>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Bell className="w-4 h-4 mr-2" />
              Enable Notifications
            </label>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                checked={readingSettings.notificationsEnabled}
                onChange={(e) => dispatch(updateReadingSettings({
                  notificationsEnabled: e.target.checked,
                }))}
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
            </div>
          </div>

          {/* Preferred Format */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Book className="w-4 h-4 mr-2" />
              Preferred Format
            </label>
            <select
              value={readingSettings.preferredFormat || ''}
              onChange={(e) => dispatch(updateReadingSettings({
                preferredFormat: e.target.value === '' ? null : e.target.value as any,
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            >
              <option value="">No Preference</option>
              <option value="epub">EPUB</option>
              <option value="pdf">PDF</option>
              <option value="article">Article</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingSettings; 