import React from 'react';
import { useUIStore } from '../../stores/uiStore';

export const Header: React.FC = () => {
  const { isEditMode, toggleEditMode, toggleSidebar } = useUIStore();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="text-gray-600 hover:text-gray-900 text-xl"
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <h1 className="text-xl font-bold text-gray-800">CheatSheeter</h1>
        </div>

        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search... (Cmd+K)"
            className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />

          <button
            onClick={toggleEditMode}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isEditMode
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {isEditMode ? 'View Mode' : 'Edit Mode'}
          </button>
        </div>
      </div>
    </header>
  );
};
