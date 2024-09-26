import { useEffect, useState } from 'react';
import RouteMap from './components/RouteMap/RouteMap';
import { YMaps } from '@pbe/react-yandex-maps';
import './App.css';
import ThemeToggle from './components/ui/ThemeToggle/ThemeToggle';
import ConfirmModal from './components/ui/ConfirmModal/ConfirmModal';
import History from './components/History/History';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { AddressCard } from './components/AddressCard/AddressCard';
import { VolunteerData } from './components/ui/VolunteerData/VolunreerData';

declare global {
  interface Window {
    Telegram: any;
  }
}

const App: React.FC = () => {
  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [isThirdModalOpen, setIsThirdModalOpen] = useState(false);
  // const [click, setClick] = useState(false);

  // const [isModalOpen, setIsModalOpen] = useState(false);

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

      <div className="card">
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
      <ThemeToggle />
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

      <div className="flex justify-center items-center min-h-screen bg-light-gray-1 dark:bg-dark-gray-1">
        <History
          points={2}
          eventName="Мероприятие"
          eventDate="12 сентября"
          eventTime="15:00"
          description="Экскурсия в замке 18 века"
        />
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
      <VolunteerData geo='Москва' email="email"  birthday='09.09.1955' phone= "89998889988" telegram="@telegram"/>
    </>
  );
};

export default App;
