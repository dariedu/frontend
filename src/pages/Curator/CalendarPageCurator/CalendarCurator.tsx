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
  const { currentUser, loading } = useContext(UserContext);
  const {
    deliveries,
    isLoading: deliveriesLoading,
    fetchDeliveries,
  } = useContext(DeliveryContext); // Данные о доставках из DeliveryContext
  const [deliveryStatus, setDeliveryStatus] = useState<
    'Активная' | 'Ближайшая' | 'Завершена'
  >('Активная');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [points] = useState<number>(currentUser?.point ?? 0);

  const [currentDelivery, setCurrentDelivery] = useState<any>(null); // Для хранения текущей доставки

  // Данные маршрутных листов
  const routeSheetsData: RouteSheet[] = [
    { id: 1, title: 'Маршрутный лист 1' },
    { id: 2, title: 'Маршрутный лист 2' },
    { id: 3, title: 'Маршрутный лист 3' },
    { id: 4, title: 'Маршрутный лист 4' },
  ];

  const [isRouteSheetsOpen, setIsRouteSheetsOpen] = useState(false);

  // Состояние завершения маршрутных листов
  const [completedRouteSheets, setCompletedRouteSheets] = useState<boolean[]>(
    Array(routeSheetsData.length).fill(false),
  );

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

  useEffect(() => {
    fetchDeliveries(); // Загружаем доставки при монтировании компонента
  }, [fetchDeliveries]);

  useEffect(() => {
    if (!deliveriesLoading && deliveries.length > 0) {
      const nearestDelivery = getNearestDelivery(deliveries); // Ищем ближайшую доставку
      setCurrentDelivery(nearestDelivery); // Устанавливаем текущую доставку
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

  if (loading || deliveriesLoading) {
    return <div>Загрузка...</div>;
  }

  if (!currentUser || !currentDelivery) {
    return <div>Пользователь или доставка не найдены</div>;
  }

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
        />
      )}
    </div>
  );
};

export default CalendarCurator;
