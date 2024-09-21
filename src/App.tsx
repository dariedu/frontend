import { useEffect, useState } from 'react';
import RouteMap from './components/RouteMap/RouteMap';
import { YMaps } from '@pbe/react-yandex-maps';
import './App.css';
import ThemeToggle from './components/ui/ThemeToggle/ThemeToggle';
import ConfirmModal from './components/ui/ConfirmModal/ConfirmModal';
import History from './components/history/History';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { AddressCard } from './components/ui/AddressCard/AddressCard';

declare global {
  interface Window {
    Telegram: any;
  }
}

const App: React.FC = () => {
  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [isThirdModalOpen, setIsThirdModalOpen] = useState(false);

  const handleConfirm = () => {
    console.log('Доставка подтверждена!');
    setIsFirstModalOpen(false);
    setIsSecondModalOpen(false);
    setIsThirdModalOpen(false);
  };

  const handleCancel = () => {
    setIsFirstModalOpen(false);
    setIsSecondModalOpen(false);
    setIsThirdModalOpen(false);
  };

  const handleCommentClick = () => {
    console.log('Добавить комментарий');
  };

  const handleSubmitClick = () => {
    console.log('Отправить');
  };

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready();
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

      <AddressCard
        address="Ул. Бобруйская д. 4 кв. 12"
        additionalInfo="3 подъезд 10 этаж кв 143 код #3214"
        personName="Петрова Галина Сергеевна"
        personImageUrl="https://via.placeholder.com/150"
        onCommentClick={handleCommentClick}
        onSubmitClick={handleSubmitClick}
      />
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
        <button
          className={`${click ? 'btn-M-GreenClicked' : 'btn-M-GreenDefault'}`}
          onClick={() => {
            click == true ? setClick(false) : setClick(true);
          }}
        >
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

      <div className="p-4">
        {/* Три кнопки для открытия соответствующих модальных окон */}
        <div className="space-y-4">
          <button
            onClick={() => setIsFirstModalOpen(true)}
            className="bg-light-brand-green text-white px-4 py-2 rounded-full"
          >
            Открыть модальное окно 1
          </button>

          <button
            onClick={() => setIsSecondModalOpen(true)}
            className="bg-light-brand-green text-white px-4 py-2 rounded-full"
          >
            Открыть модальное окно 2
          </button>

          <button
            onClick={() => setIsThirdModalOpen(true)}
            className="bg-light-brand-green text-white px-4 py-2 rounded-full"
          >
            Открыть модальное окно 3
          </button>
        </div>
      </div>

      {/* Первое модальное окно */}
      <ConfirmModal
        isOpen={isFirstModalOpen}
        onOpenChange={setIsFirstModalOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        title="Доставка еды в календаре!"
        description=""
        confirmText="Ок"
        isSingleButton={true}
      />

      {/* Второе модальное окно */}
      <ConfirmModal
        isOpen={isSecondModalOpen}
        onOpenChange={setIsSecondModalOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        title="Вы подтверждаете доставку?"
        description="17 сентября"
        confirmText="Подтвердить"
        cancelText="Отменить"
      />

      {/* Третье модальное окно */}
      <ConfirmModal
        isOpen={isThirdModalOpen}
        onOpenChange={setIsThirdModalOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        title="Вы уверены что хотите отменить доставку?"
        description="17 сентября"
        confirmText="Подтвердить"
        cancelText="Закрыть"
      />
    </>
  );
};

export default App;
