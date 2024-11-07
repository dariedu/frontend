import React, { useState, useContext } from 'react';
import SliderStories from '../../../components/SliderStories/SliderStories';
import Calendar from '../../../components/Calendar/Calendar';
import SliderCards from '../../../components/SliderCards/SliderCards';
import DeliveryType from '../../../components/ui/Hr/DeliveryType';
import DeliveryInfo from '../../../components/ui/Hr/DeliveryInfo';
// import RouteSheets from '../../../components/RouteSheets/RouteSheets';
import Search from '../../../components/Search/Search';
import { IUser } from '../../../core/types';
import avatar1 from '../../../assets/avatar.svg';
import { DeliveryContext } from '../../../core/DeliveryContext';

const users: IUser[] = [
  {
    id: 1,
    tg_id: 1,
    name: 'Василий',
    last_name: 'Петров',
    is_adult: true,
    avatar: avatar1,
    is_staff: true,
    rating: {
      id: 0,
      level: '',
      hours_needed: 0,
    },
    point: 0,
    volunteer_hour: 0,
  },
  {
    id: 2,
    tg_id: 2,
    name: 'Анна',
    last_name: 'Иванова',
    is_adult: true,
    avatar: avatar1,
    is_staff: true,
    rating: {
      id: 0,
      level: '',
      hours_needed: 0,
    },
    point: 0,
    volunteer_hour: 0,
  },
];

// interface RouteSheet {
//   id: number;
//   title: string;
// }

const MainPageCurator: React.FC = () => {
  const { nearestDelivery, isLoading, error } = useContext(DeliveryContext);
  const [isRouteSheetsOpen, setIsRouteSheetsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const points = 5;

  // Данные маршрутных листов
  // const routeSheetsData: RouteSheet[] = [
  //   { id: 1, title: 'Маршрутный лист 1' },
  //   { id: 2, title: 'Маршрутный лист 2' },
  //   { id: 3, title: 'Маршрутный лист 3' },
  //   { id: 4, title: 'Маршрутный лист 4' },
  // ];

  // Состояние завершенных маршрутных листов
  //  const [completedRouteSheets, setCompletedRouteSheets] = useState<boolean[]>(
  //     Array(routeSheetsData.length).fill(false),
  //   );

  // Обработчик для открытия маршрутных листов
  const openRouteSheets = () => {
    setIsRouteSheetsOpen(true);
  };

  // const closeRouteSheets = () => {
  //   setIsRouteSheetsOpen(false);
  // };

  const handleUserClick = (user: IUser) => {
    console.log('Selected user:', user);
  };

  // Определяем статус доставки на основе ближайшей доставки
  const deliveryStatus = nearestDelivery
    ? nearestDelivery.is_completed
      ? 'Завершена'
      : nearestDelivery.is_active
        ? 'Активная'
        : 'Ближайшая'
    : 'Нет доставок';

  const station = nearestDelivery?.location?.subway || 'Станция не указана';
  const address = nearestDelivery?.location?.address || 'Адрес не указан';

  return (
    <div className="flex-col bg-light-gray-1 min-h-[80vh]">
      <SliderStories />
      <div className="flex-col bg-light-gray-white rounded-[16px]">
        {/* Проверяем состояние загрузки */}
        {isLoading ? (
          <div>Загрузка доставок...</div>
        ) : error ? (
          <div>{error}</div>
        ) : nearestDelivery ? (
          // Отображаем ближайшую доставку
          <DeliveryType
            status={deliveryStatus}
            points={points}
            onDeliveryClick={openRouteSheets} // Открытие маршрутных листов
          />
        ) : (
          <div>Доставок в ближайшее время нет</div>
        )}

        <Search
          showSearchInput={false}
          showInfoSection={true}
          users={users}
          onUserClick={handleUserClick}
          station={station} // Передача станции метро в Search
          address={address} // Передача адреса в Search
        />

        {deliveryStatus === 'Ближайшая' && (
          <div>
            <DeliveryInfo />
          </div>
        )}

        {!isRouteSheetsOpen && (
          <Calendar
            headerName="Расписание доставок"
            showHeader={true}
            showFilterButton={false}
            showDatePickerButton={false}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        )}
      </div>
      {!isRouteSheetsOpen && (
        <>
          <SliderCards showTitle={false} switchTab={() => {}} />
          <SliderCards showTitle={true} switchTab={() => {}} />
        </>
      )}
      {/* {isRouteSheetsOpen && (
        <RouteSheets
          status={deliveryStatus}
          onClose={closeRouteSheets} // Закрытие маршрутных листов
          routeSheetsData={routeSheetsData} // Передача данных о маршрутных листах
          completedRouteSheets={completedRouteSheets} // Состояние завершенных маршрутов
          setCompletedRouteSheets={setCompletedRouteSheets} // Функция для обновления завершенных маршрутов
          onStatusChange={() => {}}
        />
      )} */}
    </div>
  );
};

export default MainPageCurator;
