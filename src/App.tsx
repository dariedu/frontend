import { useEffect, useState } from 'react';
import RouteMap from './components/RouteMap/RouteMap';
import { YMaps } from '@pbe/react-yandex-maps';
import './App.css';
import ThemeToggle from './components/ui/ThemeToggle/ThemeToggle';
import ConfirmModal from './components/ui/ConfirmModal/ConfirmModal';
import History from './components/history/History';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

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
