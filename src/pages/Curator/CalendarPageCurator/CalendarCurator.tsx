import React, { useContext, useState, useEffect } from 'react';
import Calendar from '../../../components/Calendar/Calendar';
import Search from '../../../components/Search/Search';
import DeliveryType from '../../../components/ui/Hr/DeliveryType';
import DeliveryInfo from '../../../components/ui/Hr/DeliveryInfo';
import RouteSheets from '../../../components/RouteSheets/RouteSheets';
import { UserContext } from '../../../core/UserContext';
import { DeliveryContext } from '../../../core/DeliveryContext'; // Импортируем DeliveryContext
import { IUser } from '../../../core/types';

interface RouteSheet {
  id: number;
  title: string;
  // Дополнительные поля, если необходимо
}

const CalendarCurator: React.FC = () => {
  const {
    currentUser,
    isLoading: isUserLoading,
    error: userError,
  } = useContext(UserContext);
  const {
    deliveries,
    isLoading: deliveriesLoading,
    error: deliveriesError,
  } = useContext(DeliveryContext); // Данные о доставках из DeliveryContext

  const [deliveryStatus, setDeliveryStatus] = useState<
    'Активная' | 'Ближайшая' | 'Завершена'
  >('Активная');

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [points, setPoints] = useState<number>(0);

  const [currentDelivery, setCurrentDelivery] = useState<any>(null); // Для хранения текущей доставки

  const [isRouteSheetsOpen, setIsRouteSheetsOpen] = useState(false);

  // Данные маршрутных листов
  const routeSheetsData: RouteSheet[] = [
    { id: 1, title: 'Маршрутный лист 1' },
    { id: 2, title: 'Маршрутный лист 2' },
    { id: 3, title: 'Маршрутный лист 3' },
    { id: 4, title: 'Маршрутный лист 4' },
  ];

  // Состояние завершения маршрутных листов
  const [completedRouteSheets, setCompletedRouteSheets] = useState<boolean[]>(
    Array(routeSheetsData.length).fill(false),
  );

  // Обновляем очки при изменении currentUser
  useEffect(() => {
    setPoints(currentUser?.point ?? 0);
  }, [currentUser]);

  // Следим за изменениями в completedRouteSheets и обновляем deliveryStatus
  useEffect(() => {
    if (completedRouteSheets.every(completed => completed)) {
      setDeliveryStatus('Завершена');
    } else {
      setDeliveryStatus('Активная');
    }
  }, [completedRouteSheets]);

  // Поиск ближайшей доставки из списка
  const getNearestDelivery = (deliveries: any[]) => {
    const today = new Date();

    const upcomingDeliveries = deliveries
      .filter(d => d.date && new Date(d.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return upcomingDeliveries.length > 0 ? upcomingDeliveries[0] : null;
  };

  // Обновляем текущую доставку при изменении списка доставок
  useEffect(() => {
    if (!deliveriesLoading && deliveries && deliveries.length > 0) {
      const nearestDelivery = getNearestDelivery(deliveries); // Ищем ближайшую доставку
      setCurrentDelivery(nearestDelivery); // Устанавливаем текущую доставку
    } else {
      setCurrentDelivery(null); // Если доставок нет, сбрасываем текущую доставку
    }
  }, [deliveriesLoading, deliveries]);

  const handleUserClick = (user: IUser) => {
    console.log('Clicked on user:', user);
  };

  const handleOpenRouteSheets = () => {
    setIsRouteSheetsOpen(true);
  };

  const handleCloseRouteSheets = () => {
    setIsRouteSheetsOpen(false);
  };

  // Обработка состояний загрузки и ошибок
  if (isUserLoading || deliveriesLoading) {
    return <div>Загрузка данных...</div>;
  }

  if (userError) {
    return <div>Ошибка загрузки данных пользователя: {userError}</div>;
  }

  if (deliveriesError) {
    return <div>Ошибка загрузки доставок: {deliveriesError}</div>;
  }

  if (!currentUser) {
    return <div>Пользователь не найден</div>;
  }

  // Получаем данные о станции и адресе
  const station = currentDelivery?.location?.subway || 'Станция не указана';
  const address = currentDelivery?.location?.address || 'Адрес не указан';

  return (
    <div className="flex-col min-h-[672px] bg-light-gray-1">
      <div className="flex-col rounded-[16px] bg-light-gray-white mt-2 mb-2">
        <Search
          showInfoSection={true}
          showSearchInput={true}
          users={[currentUser]}
          onUserClick={handleUserClick}
          station={station} // Передаем станцию метро
          address={address} // Передаем адрес доставки
        />
        <Calendar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>

      <DeliveryType
        status={deliveryStatus}
        points={points}
        onDeliveryClick={handleOpenRouteSheets}
      />

      {deliveryStatus === 'Ближайшая' && (
        <div>
          <DeliveryInfo />
        </div>
      )}

      {/* Отображение RouteSheets при открытии */}
      {isRouteSheetsOpen && (
        <RouteSheets
          status={deliveryStatus}
          routeSheetsData={routeSheetsData}
          onClose={handleCloseRouteSheets}
          completedRouteSheets={completedRouteSheets}
          setCompletedRouteSheets={setCompletedRouteSheets}
          onStatusChange={function (): void {
            throw new Error('Function not implemented.');
          }}
        />
      )}
    </div>
  );
};

export default CalendarCurator;
