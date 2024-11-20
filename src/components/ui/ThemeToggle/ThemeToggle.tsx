import * as Switch from '@radix-ui/react-switch';
import { useState, useEffect} from 'react';
import ThemeIcon from '../../../assets/icons/dark_theame.svg?react';


const ThemeToggle = () => {

  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(window.Telegram?.WebApp?.colorScheme || 'light'); ///тема из телеграма
console.log(window.Telegram?.WebApp?.colorScheme, "Theme toggle")
  useEffect(() => {
  let color = window.Telegram?.WebApp?.colorScheme || 'light';
  setColorScheme(color);
},[])

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
    localStorage.setItem('dariEduColorTheme', theme)
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="flex items-center space-x-4 ">
      <div className="flex items-center ">
        <ThemeIcon className='w-[42px] h-[42px] dark:fill-light-gray-1 rounded-full dark:bg-light-gray-6 bg-light-gray-1 fill-light-gray-black ' />
        {/* <img src={themeIcon} alt="themeIcon" className="mr-[14px]" /> */}
        <label
          className="text-left font-gerbera-h3 text-light-gray-black dark:text-light-gray-1 w-[211px] ml-[14px]"
          htmlFor="theme-switch"
        >
          {theme === 'light' ? 'Светлая тема' : 'Тёмная тема'}
        </label>
      </div>
      <Switch.Root
        id="theme-switch"
        className="w-10 h-6 bg-light-brand-green rounded-full relative shadow-inner "
        checked={theme === 'dark'}
        onCheckedChange={toggleTheme}
      >
        <Switch.Thumb className="block w-4 h-4 bg-white dark:bg-light-gray-7-logo rounded-full shadow transition-transform transform translate-x-1 dark:translate-x-5" />
      </Switch.Root>
    </div>
  );
};

export default ThemeToggle;
