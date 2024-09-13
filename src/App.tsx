import { useEffect } from 'react';
// import reactLogo from './assets/react.svg';
// import RouteMap from './components/RouteMap/RouteMap';
// import { YMaps } from '@pbe/react-yandex-maps'; // Импорт компонента YMaps
// import viteLogo from '/vite.svg';
import './App.css';
import ThemeToggle from './components/ui/ThemeToggle/ThemeToggle';

declare global {
  interface Window {
    Telegram: any;
  }
}

const App: React.FC = () => {
  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready(); // Сообщаем Telegram, что приложение готово
  }, []);

  return (
    <>
      <div>
        <h1>Добро пожаловать в мой Telegram Mini App!</h1>
        <button onClick={() => window.Telegram.WebApp.close()}>Закрыть</button>
      </div>
      {/* <YMaps>
        <RouteMap />
      </YMaps> */}
      <h1>Vite + React</h1>
      <div className="bg-light-gray-white p-4 text-light-gray-5 dark:bg-dark-gray-white dark:text-dark-gray-5 ">
        Привет, Tailwind CSS!
      </div>
      <div className="card">
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
        <p className="font-gerberaLight text-Gray/3 text-H1">Gerbera-Light</p>
        <p className="font-gerberaMedium text-Gray/4 text-H2">Gerbera-Medium</p>
        <p className="font-gerbera text-Gray/5 text-Subtitle2">Gerbera</p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <ThemeToggle />
    </>
  );
};

export default App;
