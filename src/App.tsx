import { useState } from 'react';
import reactLogo from './assets/react.svg';
import RouteMap from './components/RouteMap/RouteMap';
import { YMaps } from '@pbe/react-yandex-maps'; // Импорт компонента YMaps
import viteLogo from '/vite.svg';
import './App.css';
import ThemeToggle from './components/ui/ThemeToggle/ThemeToggle';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <YMaps>
        <RouteMap />
      </YMaps>
      <h1>Vite + React</h1>
      <div className="bg-light-gray-white p-4 text-light-gray-5 dark:bg-dark-gray-white dark:text-dark-gray-5 ">
        Привет, Tailwind CSS!
      </div>
      <div className="card">
        <button onClick={() => setCount(count => count + 1)}>
          count is {count}
        </button>
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
}

export default App;
