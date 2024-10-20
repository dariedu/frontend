import React, { useState, useEffect, useContext } from 'react';
import { isSameDay, parseISO, isAfter } from 'date-fns';
import SliderStories from '../../../components/SliderStories/SliderStories';
import Calendar from '../../../components/Calendar/Calendar';
import SliderCards from '../../../components/SliderCards/SliderCards';
import DeliveryType from '../../../components/ui/Hr/DeliveryType';
import DeliveryInfo from '../../../components/ui/Hr/DeliveryInfo';
import RouteSheets from '../../../components/RouteSheets/RouteSheets';
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

interface RouteSheet {
  id: number;
  title: string;
}

const MainPageCurator: React.FC = () => {
  const { deliveries, isLoading, error } = useContext(DeliveryContext);
  const [currentDelivery, setCurrentDelivery] = useState<any>(null);
  const [deliveryStatus, setDeliveryStatus] = useState<
    'Активная' | 'Ближайшая' | 'Завершена' | 'Нет доставок'
  >('Нет доставок');
  const [isRouteSheetsOpen, setIsRouteSheetsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const points = 5;

  // Данные маршрутных листов
  const routeSheetsData: RouteSheet[] = [
    { id: 1, title: 'Маршрутный лист 1' },
    { id: 2, title: 'Маршрутный лист 2' },
    { id: 3, title: 'Маршрутный лист 3' },
    { id: 4, title: 'Маршрутный лист 4' },
  ];

  // Состояние завершенных маршрутных листов
  const [completedRouteSheets, setCompletedRouteSheets] = useState<boolean[]>(
    Array(routeSheetsData.length).fill(false),
  );

  // Обработчик для открытия маршрутных листов
  const openRouteSheets = () => {
    setIsRouteSheetsOpen(true);
  };

  const closeRouteSheets = () => {
    setIsRouteSheetsOpen(false);
  };

  const handleUserClick = (user: IUser) => {
    console.log('Selected user:', user);
  };

  // Вычисление статуса доставки на основе данных из API
  const computeStatus = (delivery: any) => {
    if (!delivery || !delivery.date) return 'Нет доставок';

    const today = new Date();
    const deliveryDate = parseISO(delivery.date);

    if (delivery.is_completed) {
      return 'Завершена';
    } else if (isSameDay(deliveryDate, today)) {
      return 'Активная';
    } else if (isAfter(deliveryDate, today)) {
      return 'Ближайшая';
    } else {
      return 'Нет доставок';
    }
  };

  // Функция для поиска ближайшей доставки
  const getNearestDelivery = (deliveries: any[]) => {
    const today = new Date();

    const upcomingDeliveries = deliveries
      .filter(d => {
        const deliveryDate = parseISO(d.date);
        return isAfter(deliveryDate, today) || isSameDay(deliveryDate, today);
      })
      .sort((a, b) => {
        const dateA = parseISO(a.date);
        const dateB = parseISO(b.date);
        return dateA.getTime() - dateB.getTime();
      });

    return upcomingDeliveries.length > 0 ? upcomingDeliveries[0] : null;
  };

  useEffect(() => {
    if (!isLoading && deliveries.length > 0) {
      const nearestDelivery = getNearestDelivery(deliveries);
      setCurrentDelivery(nearestDelivery);
      setDeliveryStatus(computeStatus(nearestDelivery));
    } else if (!isLoading && deliveries.length === 0) {
      setDeliveryStatus('Нет доставок');
    }
  }, [isLoading, deliveries]);

  const station = currentDelivery?.location?.subway || 'Станция не указана';
  const address = currentDelivery?.location?.address || 'Адрес не указан';

  return (
    <div className="flex-col bg-light-gray-1 min-h-[746px]">
      <SliderStories />
      <div className="flex-col bg-light-gray-white rounded-[16px]">
        {/* Проверяем состояние загрузки */}
        {isLoading ? (
          <div>Загрузка доставок...</div>
        ) : error ? (
          <div>{error}</div>
        ) : deliveries.length === 0 ? (
          <div>Доставок в ближайшее время нет</div>
        ) : (
          // Отображаем доставки
          <DeliveryType
            status={deliveryStatus}
            points={points}
            onDeliveryClick={openRouteSheets} // Открытие маршрутных листов
          />
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
          <SliderCards showTitle={false} />
          <SliderCards showTitle={true} />
        </>
      )}
      {isRouteSheetsOpen && (
        <RouteSheets
          status={deliveryStatus}
          onClose={closeRouteSheets} // Закрытие маршрутных листов
          routeSheetsData={routeSheetsData} // Передача данных о маршрутных листах
          completedRouteSheets={completedRouteSheets} // Состояние завершенных маршрутов
          setCompletedRouteSheets={setCompletedRouteSheets} // Функция для обновления завершенных маршрутов
          onStatusChange={function (): void {
            throw new Error('Function not implemented.');
          }}
        />
      )}
    </div>
  );
};

export default MainPageCurator;
