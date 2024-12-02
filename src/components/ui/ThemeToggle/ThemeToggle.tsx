import * as Switch from '@radix-ui/react-switch';
import { useState, useEffect} from 'react';
import ThemeIcon from '../../../assets/icons/dark_theame.svg?react';


const ThemeToggle = () => {

  //const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(window.Telegram?.WebApp?.colorScheme); ///тема из телеграма
  const colorScheme = window.Telegram?.WebApp?.colorScheme || 'light'; ///тема из телеграма


  let colorTheme: 'light' | 'dark';
  if (localStorage.getItem('dariEduColorTheme') != undefined) {
  colorTheme = localStorage.getItem('dariEduColorTheme') as 'dark'|'light'; 
    } else {
  colorTheme = colorScheme
    }

  const [theme, setTheme] = useState<'light' | 'dark'>(colorTheme);


  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    theme === 'light' ?
    localStorage.setItem('dariEduColorTheme', 'dark') 
    : localStorage.setItem('dariEduColorTheme', 'light') 
  };

  const setSystemTheme = () => {
    setTheme(window.Telegram?.WebApp?.colorScheme);
  };

  return (
    <div className="flex items-center space-x-4 justify-between w-full max-w-[350px]">
      <div className="flex items-center ">
        <ThemeIcon className='w-[42px] h-[42px] min-w-[42px] min-h-[42px] dark:fill-light-gray-1 rounded-full dark:bg-light-gray-6 bg-light-gray-1 fill-light-gray-black ' />
        <label
          className="text-left font-gerbera-h3 text-light-gray-black dark:text-light-gray-1 w-[211px] ml-[14px]"
          htmlFor="theme-switch"
        >
          {theme === 'light' ? 'Светлая тема' : 'Тёмная тема'}
        </label>
        <button onClick={() => { localStorage.removeItem('dariEduColorTheme'); setSystemTheme()}} className='h-6 rounded-full bg-light-brand-green w-16 font-gerbera-sub1 absolute ml-48 text-light-gray-white'>
          Системная
        </button>
      </div>
      <Switch.Root
        id="theme-switch"
        className="w-10 h-6 bg-light-brand-green rounded-full relative shadow-inner"
        checked={theme === 'dark'}
        onCheckedChange={toggleTheme}
      >
        <Switch.Thumb className="block w-4 h-4 bg-white dark:bg-light-gray-7-logo rounded-full shadow transition-transform transform translate-x-1 dark:translate-x-5" />
      </Switch.Root>
    </div>
  );
};

export default ThemeToggle;
