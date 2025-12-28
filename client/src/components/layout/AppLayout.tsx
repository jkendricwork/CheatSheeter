import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useUIStore } from '../../stores/uiStore';

export const AppLayout: React.FC = () => {
  const { isSidebarOpen } = useUIStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} />
        <main
          className="flex-1 p-6 transition-all duration-200"
          style={{
            marginLeft: isSidebarOpen ? '200px' : '0',
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};
