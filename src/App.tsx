import { useEffect, useState } from 'react';
// import reactLogo from './assets/react.svg';
import RouteMap from './components/RouteMap/RouteMap';
import { YMaps } from '@pbe/react-yandex-maps'; // Импорт компонента YMaps
// import viteLogo from '/vite.svg';
import './App.css';
import ThemeToggle from './components/ui/ThemeToggle/ThemeToggle';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

declare global {
  interface Window {
    Telegram: any;
  }
}


const App: React.FC = () => {
  const [click, setClick] = useState(false);
  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready(); // Сообщаем Telegram, что приложение готово
  }, []);

  return (
    <>
      <div>
        <h1 className="font-gerbera-h1">
          Добро пожаловать в мой Telegram Mini App!
        </h1>
        <button onClick={() => window.Telegram.WebApp.close()}>Закрыть</button>
      </div>
      <YMaps>
        <RouteMap />
      </YMaps>
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

        <p className="font-gerbera-h1">Gerbera H1</p>
        <p className="font-gerbera-h2">Gerbera H2</p>
        <p className="font-gerbera-h3">Gerbera H3</p>
        <p className="font-gerbera-sub1">Gerbera subtitle1</p>
        <p className="font-gerbera-sub2">Gerbera subtitle2</p>
        <p className="font-gerbera-sub3">Gerbera subtitle3</p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <ThemeToggle />
      <div className="p-4 border-2 border-dashed border-purple-400 bg-light-gray-bluer bg-opacity-47 rounded-lg space-y-4">
        {/* Первая кнопка +14 баллов */}
        <button className="bg-light-brand-green text-white text-sm px-4 py-2 rounded-full">
          +14 баллов
        </button>
        <button className={`${click ? 'btn-M-GreenClicked':'btn-M-GreenDefault'}`} onClick={() => { click==true ? setClick(false) : setClick(true) }}>
        btn-M-GreenDefault/Clicked
        </button>

        {/* Текст под кнопкой */}
        <p className="text-sm text-black">За две недели</p>

        {/* Кнопка Завершить */}
        <button className="bg-light-brand-green text-white text-lg px-6 py-3 rounded-full">
          Завершить
        </button>

        {/* Кнопка Отмена */}
        <button className="bg-light-gray-1 text-black text-md px-4 py-2 rounded-full">
          Отмена
        </button>

        {/* Кнопка Начать */}
        <button className="bg-light-brand-green text-white text-md px-4 py-2 rounded-full">
          Начать
        </button>

        {/* Кнопка Написать сотруднику */}
        <button className="bg-light-brand-green text-white text-md px-4 py-2 rounded-full">
          Написать сотруднику
        </button>
      </div>
      <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-72">
        {/* Иконка поиска */}
        <MagnifyingGlassIcon className="text-gray-400 w-5 h-5 mr-2" />

        {/* Поле ввода */}
        <input
          type="text"
          placeholder="Поиск по ФИО"
          className="bg-transparent outline-none placeholder-gray-400 text-gray-600 w-full"
        />
      </div>
    </>
  );
};

export default App;
