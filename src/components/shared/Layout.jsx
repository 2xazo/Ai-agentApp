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
      <div className={`fixed inset-0 z-40 lg:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-72 flex-col bg-white dark:bg-gray-800">
          <div className="flex h-20 items-center justify-between px-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AZO AI Agent</h1>
            <button onClick={() => setIsSidebarOpen(false)}>
              <XMarkIcon className="h-7 w-7 text-gray-500" />
            </button>
          </div>
          <nav className="flex-1 space-y-2 px-4 py-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-4 py-3 text-base font-medium rounded-md ${
                  location.pathname === item.href
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <item.icon className="mr-4 h-6 w-6" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="flex h-20 items-center px-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AZO AI Agent</h1>
          </div>
          <nav className="flex-1 space-y-2 px-4 py-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-4 py-3 text-base font-medium rounded-md ${
                  location.pathname === item.href
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <item.icon className="mr-4 h-6 w-6" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-72 w-full">
        {/* Header bar */}
        <div className="flex items-center justify-end h-20 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8">
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center rounded-full bg-white dark:bg-gray-700 w-14 h-14 text-gray-600 dark:text-gray-300 shadow hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 mr-6"
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
            className="rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors duration-200"
          >
            Logout
          </button>
        </div>

        <main className="flex-1 bg-gray-50 dark:bg-gray-900 w-full h-full relative overflow-hidden">
          <div className="absolute inset-0 px-8 py-6 flex flex-col">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
