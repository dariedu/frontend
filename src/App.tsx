import { useEffect, useState } from 'react';
import RouteMap from './components/RouteMap/RouteMap';
import { YMaps } from '@pbe/react-yandex-maps';
import './App.css';
import ConfirmModal from './components/ui/ConfirmModal/ConfirmModal';
import History from './components/History/History';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { AddressCard } from './components/AddressCard/AddressCard';
import { VolunteerData } from './components/ui/VolunteerData/VolunreerData';
import RegistrationForm from './components/registrationForm/RegistrationForm.tsx';
import TabBar from './components/TabBar/TabBar.tsx';
import NextTask from './components/NextTask/NextTask.tsx';
import NavigationBar from './components/NavigationBar/NavigationBar.tsx';
import avatar from './assets/avatar.svg';
import Search from './components/Search/Search.tsx';

import Calendar from './components/Calendar/Calendar.tsx';
import Notification from './components/ui/Notification/Notification.tsx';
import DeliveryType from './components/ui/Hr/DeliveryType.tsx';
import DeliveryInfo from './components/ui/Hr/DeliveryInfo.tsx';
import ActionsVolunteer from './components/ActionsVolunteer/ActionsVolunteer.tsx';
import Points from './components/ui/Points/Points.tsx';
import Functions from './components/ui/Functions/Functions.tsx';
import ListOfVolunteers from './components/ListOfVolunteers/ListOfVolunteers.tsx';
import CardTask from './components/ui/Cards/CardTask/CardTask.tsx';
import SliderCardsPromotions from './components/ui/Cards/CardPromotion/SliderCardsPromotions.tsx';
import MyPoints from './components/MyPoints/MyPoints.tsx';
import DetailedInfo from './components/DetailedInfo/DetailedInfo';
import RouteSheets from './components/RouteSheets/RouteSheets.tsx';

declare global {
  interface Window {
    Telegram: any;
  }
}

const mockPromotions = [
  {
    image: 'https://via.placeholder.com/300',
    points: '2 балла',
    date: '2.10',
    title: 'Концерт в Филармонии',
    address: 'Мск, ул. Бобруйская д.6 к.2',
  },
  {
    image: 'https://via.placeholder.com/300',
    points: '5 баллов',
    date: '10.10',
    title: 'Встреча в парке',
    address: 'Спб, ул. Ленина д.14 к.3',
  },
];

// const defaultEvent: IPromotion = {
//   id: 11,
//   volunteers_count: 5,
//   category: 'Театр',
//   name: 'Концерт в Филармонии',
//   price: 5,
//   description:
//     '12 Международный фестиваль  Будущее джаза Концерт в Москве Концертный зал им Чайковского. Программа – блестящая! Виолончельный концерт Дворжака и пьесы для виолончели с оркестром Чайковского и Сен-Санса, «Испанское каприччио» Римского-Корсакова',
//   start_date: new Date('2024-10-23T03:01:38Z'),
//   quantity: 10,
//   available_quantity: 10,
//   for_curators_only: false,
//   is_active: true,
//   file: '',
//   is_permanent: false,
//   end_date: new Date('2024-10-23T03:01:38Z'),
//   city: 'Москва',
//   users: [0],
//   //picture: ""
// };

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
      <RegistrationForm />
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
      <VolunteerData
        geo="Москва"
        email="email"
        birthday="09.09.1955"
        phone="89998889988"
        telegram="@telegram"
      />
      <TabBar />
      <NextTask
        taskName="Написать текст"
        taskType="Онлайн"
        taskDate="3 окт"
        taskPoints={8}
      />
      <NavigationBar variant="volunteerForm" title="Анкета волонтера" />
      <NavigationBar variant="mainScreen" avatarUrl={avatar} />
      <Search />
      <Calendar headerName="Другие добрые дела" />
      <Notification message="Подтвердите  участие в доставке сегодня" />
      <DeliveryType />
      <DeliveryInfo />
      <ActionsVolunteer
        visibleActions={['Пригласить друга', 'Помочь деньгами']}
        showThemeToggle={false}
      />
      <Points points={2} />
      <Functions />
      <ListOfVolunteers />

      <CardTask
        title="Ст. Молодежная"
        subtitle="Мск, ул. Бобруйская д.6 к.2"
        timeOrPeriod="15:00"
        points="+2 балла"
        type="time-based"
      />

      <CardTask
        title="Написать текст"
        subtitle="Онлайн"
        timeOrPeriod="За две недели"
        points="+14 баллов"
        type="period-based"
      />

      <CardTask
        title="Уборка территории"
        subtitle="Мск, ул. Бобруйская д.6 к.2"
        timeOrPeriod="15:00"
        additionalTime="25.08" // Это поле не обязательно
        points="+2 балла"
        type="time-based"
      />
      {/* <InputDate /> */}
      {/* <CardPromotion promotions={mockPromotions} /> */}
      <SliderCardsPromotions />
      <MyPoints />
      <DetailedInfo />
      <RouteSheets title="Маршрутный лист 1" selected="Не выбран" />
    </>
  );
};

export default App;
