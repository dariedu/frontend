import * as Switch from '@radix-ui/react-switch';
import { useState, useEffect } from 'react';

const ThemeToggle = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="flex items-center space-x-2">
      <label
        className="text-sm font-medium text-gray-900 dark:text-gray-300"
        htmlFor="theme-switch"
      >
        {theme === 'light' ? 'Светлая тема' : 'Тёмная тема'}
      </label>
      <Switch.Root
        id="theme-switch"
        className="w-10 h-6 bg-gray-200 rounded-full relative shadow-inner dark:bg-gray-700"
        checked={theme === 'dark'}
        onCheckedChange={toggleTheme}
      >
        <Switch.Thumb className="block w-4 h-4 bg-white rounded-full shadow transition-transform transform translate-x-1 dark:translate-x-5" />
      </Switch.Root>
    </div>
  );
};

export default ThemeToggle;
