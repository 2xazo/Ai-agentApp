// src/components/shared/Layout.jsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { 
  ChatBubbleLeftIcon, 
  MicrophoneIcon, 
  UserCircleIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export default function Layout({ theme, setTheme, children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);
  const { currentUser, logout } = useAuth();
  const { state, dispatch } = useApp();
  const location = useLocation();

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const navigation = [
    { name: 'Chat', href: '/chat', icon: ChatBubbleLeftIcon },
    { name: 'Transcribe', href: '/transcribe', icon: MicrophoneIcon },
    { name: 'Profile', href: '/profile', icon: UserCircleIcon },
  ];

  return (
    <div className="flex h-screen w-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ease-in-out ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 backdrop-blur-sm transition-all duration-500 ease-in-out ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsSidebarOpen(false)} />
        <div className={`fixed inset-y-0 left-0 flex w-72 flex-col bg-white dark:bg-gray-800 transform transition-all duration-500 ease-in-out ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
          <div className="flex h-20 items-center justify-between px-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white animate-pulse">AZO AI Agent</h1>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="transform hover:rotate-90 transition-transform duration-300"
            >
              <XMarkIcon className="h-7 w-7 text-gray-500 hover:text-red-500 transition-colors duration-300" />
            </button>
          </div>
          <nav className="flex-1 space-y-2 px-4 py-6 overflow-y-auto">
            {navigation.map((item, index) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`group flex items-center px-4 py-3 text-base font-medium rounded-md transform transition-all duration-300 hover:translate-x-2 ${
                  location.pathname === item.href
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 scale-105 shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <item.icon className="mr-4 h-6 w-6 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col transition-all duration-500 ease-in-out ${isDesktopSidebarCollapsed ? 'lg:w-20' : 'lg:w-72'}`}>
        <div className="flex min-h-0 flex-1 flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-all duration-500 ease-in-out hover:shadow-xl">
          <div className="flex h-20 items-center px-6 justify-between">
            <h1 className={`text-2xl font-bold text-gray-900 dark:text-white transition-all duration-500 ${isDesktopSidebarCollapsed ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}>AZO AI Agent</h1>
            <button
              onClick={() => setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-110 hover:rotate-180"
            >
              {isDesktopSidebarCollapsed ? (
                <Bars3Icon className="h-6 w-6 text-gray-500" />
              ) : (
                <XMarkIcon className="h-6 w-6 text-gray-500" />
              )}
            </button>
          </div>
          <nav className="flex-1 space-y-2 px-4 py-6 overflow-y-auto">
            {navigation.map((item, index) => (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-4 py-3 text-base font-medium rounded-md transition-all duration-300 transform hover:translate-x-2 ${
                  location.pathname === item.href
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 scale-105 shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <item.icon className={`h-6 w-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 ${isDesktopSidebarCollapsed ? '' : 'mr-4'}`} />
                <span className={`transition-all duration-300 ${isDesktopSidebarCollapsed ? 'opacity-0 w-0 scale-0' : 'opacity-100 scale-100'}`}>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className={`flex flex-1 flex-col transition-all duration-500 ease-in-out ${isDesktopSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'} w-full`}>
        {/* Header bar */}
        <div className="flex items-center justify-end h-20 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8">
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center rounded-full bg-white dark:bg-gray-700 w-14 h-14 text-gray-600 dark:text-gray-300 shadow hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-110 hover:rotate-180 mr-6"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? (
              <SunIcon className="h-8 w-8" />
            ) : (
              <MoonIcon className="h-8 w-8" />
            )}
          </button>
          <button
            onClick={logout}
            className="rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-300 transform hover:scale-105 hover:translate-y-[-2px]"
          >
            Logout
          </button>
        </div>

        <main className="flex-1 bg-gray-50 dark:bg-gray-900 w-full h-full relative overflow-y-auto">
          <div className="absolute inset-0 px-8 py-6 flex flex-col overflow-y-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
