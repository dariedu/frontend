import React, { createContext, useState, useEffect, useContext } from 'react';

interface IThemeContextProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<IThemeContextProps>({
  theme: 'light',
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {

  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light'); ///тема из телеграма

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

  const [theme, setTheme] = useState<'light' | 'dark'>(colorTheme); ///устанавливаем тему в приложении
  
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};

 export const useTheme = () => useContext(ThemeContext);
